import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout, retry } from 'rxjs';
import { ReportQueryDto, AttributionReportDto, AttributionRowDto } from './dto';

// Type-safe filters interface
type Filters = Pick<ReportQueryDto, 'startDate' | 'endDate' | 'utmSource' | 'adId'>;

interface LeadRecord {
  id: string;
  utmSource?: string;
  adId?: string;
  createdAt: string;
}

interface DealRecord {
  id: string;
  leadId?: string;
  revenue?: number; // closed won revenue
  status?: 'WON' | 'LOST' | 'OPEN';
  directCost?: number;
  closedAt?: string;
}

interface CostRecord {
  adId?: string;
  utmSource?: string;
  spend: number;
  date: string; // YYYY-MM-DD
}

@Injectable()
export class ReportingService {
  private readonly logger = new Logger(ReportingService.name);

  constructor(
    @Inject('SALES_SERVICE') private readonly salesClient: ClientProxy,
    @Inject('COST_IMPORTER_SERVICE') private readonly costClient: ClientProxy,
  ) {}

  async generateAttributionReport(query: ReportQueryDto): Promise<AttributionReportDto> {
    const { startDate, endDate, utmSource, adId } = query;

    // Fetch data from microservices
    const [leads, deals, costs] = await Promise.all([
      this.fetchLeads({ startDate, endDate, utmSource, adId }),
      this.fetchDeals({ startDate, endDate, utmSource, adId }),
      this.fetchCosts({ startDate, endDate, utmSource, adId }),
    ]);

    // Aggregate by Source and by Ad
    const bySource = this.aggregateAttribution(leads, deals, costs, 'utmSource');
    const byAd = this.aggregateAttribution(leads, deals, costs, 'adId');

    // Compute summary from raw data sources (not aggregated rows) to avoid double-counting
    const summary = this.computeSummary(leads, deals, costs);

    return {
      summary,
      bySource,
      byAd,
    };
  }

  // --- Microservice calls ---
  private async fetchLeads(filters: Filters): Promise<LeadRecord[]> {
    try {
      const observable = this.salesClient
        .send<LeadRecord[]>({ cmd: 'leads.find' }, filters)
        .pipe(
          timeout(8000),
          retry({ count: 2, delay: 300 })
        );
      return await firstValueFrom(observable);
    } catch (err) {
      this.logger.warn(`Leads service unavailable, proceeding with empty list. Error: ${this.errMsg(err)}`);
      return [];
    }
  }

  private async fetchDeals(filters: Filters): Promise<DealRecord[]> {
    try {
      const observable = this.salesClient
        .send<DealRecord[]>({ cmd: 'deals.find' }, filters)
        .pipe(
          timeout(8000),
          retry({ count: 2, delay: 300 })
        );
      return await firstValueFrom(observable);
    } catch (err) {
      this.logger.warn(`Deals service unavailable, proceeding with empty list. Error: ${this.errMsg(err)}`);
      return [];
    }
  }

  private async fetchCosts(filters: Filters): Promise<CostRecord[]> {
    try {
      const observable = this.costClient
        .send<CostRecord[]>({ cmd: 'costs.find' }, filters)
        .pipe(
          timeout(8000),
          retry({ count: 2, delay: 300 })
        );
      return await firstValueFrom(observable);
    } catch (err) {
      this.logger.warn(`Cost importer unavailable, proceeding with empty list. Error: ${this.errMsg(err)}`);
      return [];
    }
  }

  // --- Aggregation logic ---
  private aggregateAttribution(
    leads: LeadRecord[],
    deals: DealRecord[],
    costs: CostRecord[],
    groupBy: 'utmSource' | 'adId',
  ): AttributionRowDto[] {
    const groups = new Map<string, AttributionRowDto & { _leadIds: Set<string> }>();

    // Build lead-to-group index for O(1) lookups (Performance improvement)
    const leadIdToGroup = new Map<string, string>();
    
    // Initialize groups from leads and build index
    for (const lead of leads) {
      const key = (lead[groupBy] || 'unknown') as string;
      if (!groups.has(key)) {
        groups.set(key, this.initGroup(key));
      }
      const g = groups.get(key)!;
      g.totalLeads += 1;
      if (lead.id) {
        g._leadIds.add(lead.id);
        leadIdToGroup.set(lead.id, key); // Index for fast lookup
      }
    }

    // Accumulate costs
    for (const c of costs) {
      const key = (c[groupBy] || 'unknown') as string;
      if (!groups.has(key)) {
        groups.set(key, this.initGroup(key));
      }
      const g = groups.get(key)!;
      g.totalSpend += c.spend || 0;
    }

    // Accumulate deals (won) - using O(1) index lookup instead of O(N×G) scan
    for (const d of deals) {
      if (d.status !== 'WON') continue;
      
      // Use index for O(1) lookup instead of scanning all groups
      let key: string | undefined;
      if (d.leadId) {
        key = leadIdToGroup.get(d.leadId);
      }
      
      // Fallback to deal attribute if lead not found
      if (!key) {
        const attr = (d as any)[groupBy];
        key = (attr || 'unknown') as string;
      }
      
      if (!groups.has(key)) {
        groups.set(key, this.initGroup(key));
      }
      const g = groups.get(key)!;
      g.totalDealsWon += 1;
      g.grossRevenue += d.revenue || 0;
      g.directCost += d.directCost || 0;
    }

    // Finalize KPIs
    const rows: AttributionRowDto[] = [];
    for (const g of groups.values()) {
      const CPL = g.totalLeads > 0 ? g.totalSpend / g.totalLeads : 0;
      const CPA = g.totalDealsWon > 0 ? g.totalSpend / g.totalDealsWon : 0;
      const convRate = g.totalLeads > 0 ? (g.totalDealsWon / g.totalLeads) * 100 : 0;
      const netProfit = g.grossRevenue - g.directCost - g.totalSpend;
      const roas = g.totalSpend > 0 ? g.grossRevenue / g.totalSpend : 0;

      rows.push({
        groupingKey: g.groupingKey,
        totalSpend: round2(g.totalSpend),
        totalLeads: g.totalLeads,
        costPerLead: round2(CPL),
        totalDealsWon: g.totalDealsWon,
        costPerAcquisition: round2(CPA),
        conversionRate: round2(convRate),
        grossRevenue: round2(g.grossRevenue),
        directCost: round2(g.directCost),
        netProfit: round2(netProfit),
        returnOnAdSpend: round2(roas),
      });
    }

    // sort by revenue desc for determinism
    rows.sort((a, b) => b.grossRevenue - a.grossRevenue);
    return rows;
  }

  /**
   * Compute summary from raw data sources to avoid double-counting
   * (Critical fix: prevents counting leads/deals multiple times when they belong to multiple groups)
   */
  private computeSummary(
    leads: LeadRecord[],
    deals: DealRecord[],
    costs: CostRecord[]
  ) {
    // Compute from raw sources, not aggregated rows
    const totalSpend = round2(costs.reduce((sum, c) => sum + (c.spend || 0), 0));
    const totalLeads = leads.length;
    
    // Filter won deals only
    const wonDeals = deals.filter(d => d.status === 'WON');
    const totalDealsWon = wonDeals.length;
    
    // Sum revenue and costs from won deals
    const totalRevenue = round2(wonDeals.reduce((sum, d) => sum + Number(d.revenue || 0), 0));
    const totalDirectCost = round2(wonDeals.reduce((sum, d) => sum + Number(d.directCost || 0), 0));

    // Calculate derived metrics with division-by-zero protection
    const avgCPL = totalLeads > 0 ? round2(totalSpend / totalLeads) : 0;
    const avgCPA = totalDealsWon > 0 ? round2(totalSpend / totalDealsWon) : 0;
    const totalNetProfit = round2(totalRevenue - totalDirectCost - totalSpend);
    const totalROAS = totalSpend > 0 ? round2(totalRevenue / totalSpend) : 0;

    return {
      totalSpend,
      totalLeads,
      avgCPL,
      totalDealsWon,
      avgCPA,
      totalRevenue,
      totalNetProfit,
      totalROAS,
    };
  }

  /**
   * Helper to initialize a new group (DRY principle)
   */
  private initGroup(key: string): AttributionRowDto & { _leadIds: Set<string> } {
    return {
      groupingKey: key,
      totalSpend: 0,
      totalLeads: 0,
      costPerLead: 0,
      totalDealsWon: 0,
      costPerAcquisition: 0,
      conversionRate: 0,
      grossRevenue: 0,
      directCost: 0,
      netProfit: 0,
      returnOnAdSpend: 0,
      _leadIds: new Set<string>(),
    };
  }

  private errMsg(err: unknown) {
    return err instanceof Error ? err.message : String(err);
  }
}

function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
