"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ReportingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportingService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
let ReportingService = ReportingService_1 = class ReportingService {
    salesClient;
    costClient;
    logger = new common_1.Logger(ReportingService_1.name);
    constructor(salesClient, costClient) {
        this.salesClient = salesClient;
        this.costClient = costClient;
    }
    async generateAttributionReport(query) {
        const { startDate, endDate, utmSource, adId } = query;
        const [leads, deals, costs] = await Promise.all([
            this.fetchLeads({ startDate, endDate, utmSource, adId }),
            this.fetchDeals({ startDate, endDate, utmSource, adId }),
            this.fetchCosts({ startDate, endDate, utmSource, adId }),
        ]);
        const bySource = this.aggregateAttribution(leads, deals, costs, 'utmSource');
        const byAd = this.aggregateAttribution(leads, deals, costs, 'adId');
        const summary = this.computeSummary(leads, deals, costs);
        return {
            summary,
            bySource,
            byAd,
        };
    }
    async fetchLeads(filters) {
        try {
            const observable = this.salesClient
                .send({ cmd: 'leads.find' }, filters)
                .pipe((0, rxjs_1.timeout)(8000), (0, rxjs_1.retry)({ count: 2, delay: 300 }));
            return await (0, rxjs_1.firstValueFrom)(observable);
        }
        catch (err) {
            this.logger.warn(`Leads service unavailable, proceeding with empty list. Error: ${this.errMsg(err)}`);
            return [];
        }
    }
    async fetchDeals(filters) {
        try {
            const observable = this.salesClient
                .send({ cmd: 'deals.find' }, filters)
                .pipe((0, rxjs_1.timeout)(8000), (0, rxjs_1.retry)({ count: 2, delay: 300 }));
            return await (0, rxjs_1.firstValueFrom)(observable);
        }
        catch (err) {
            this.logger.warn(`Deals service unavailable, proceeding with empty list. Error: ${this.errMsg(err)}`);
            return [];
        }
    }
    async fetchCosts(filters) {
        try {
            const observable = this.costClient
                .send({ cmd: 'costs.find' }, filters)
                .pipe((0, rxjs_1.timeout)(8000), (0, rxjs_1.retry)({ count: 2, delay: 300 }));
            return await (0, rxjs_1.firstValueFrom)(observable);
        }
        catch (err) {
            this.logger.warn(`Cost importer unavailable, proceeding with empty list. Error: ${this.errMsg(err)}`);
            return [];
        }
    }
    aggregateAttribution(leads, deals, costs, groupBy) {
        const groups = new Map();
        const leadIdToGroup = new Map();
        for (const lead of leads) {
            const key = (lead[groupBy] || 'unknown');
            if (!groups.has(key)) {
                groups.set(key, this.initGroup(key));
            }
            const g = groups.get(key);
            g.totalLeads += 1;
            if (lead.id) {
                g._leadIds.add(lead.id);
                leadIdToGroup.set(lead.id, key);
            }
        }
        for (const c of costs) {
            const key = (c[groupBy] || 'unknown');
            if (!groups.has(key)) {
                groups.set(key, this.initGroup(key));
            }
            const g = groups.get(key);
            g.totalSpend += c.spend || 0;
        }
        for (const d of deals) {
            if (d.status !== 'WON')
                continue;
            let key;
            if (d.leadId) {
                key = leadIdToGroup.get(d.leadId);
            }
            if (!key) {
                const attr = d[groupBy];
                key = (attr || 'unknown');
            }
            if (!groups.has(key)) {
                groups.set(key, this.initGroup(key));
            }
            const g = groups.get(key);
            g.totalDealsWon += 1;
            g.grossRevenue += d.revenue || 0;
            g.directCost += d.directCost || 0;
        }
        const rows = [];
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
        rows.sort((a, b) => b.grossRevenue - a.grossRevenue);
        return rows;
    }
    computeSummary(leads, deals, costs) {
        const totalSpend = round2(costs.reduce((sum, c) => sum + (c.spend || 0), 0));
        const totalLeads = leads.length;
        const wonDeals = deals.filter(d => d.status === 'WON');
        const totalDealsWon = wonDeals.length;
        const totalRevenue = round2(wonDeals.reduce((sum, d) => sum + Number(d.revenue || 0), 0));
        const totalDirectCost = round2(wonDeals.reduce((sum, d) => sum + Number(d.directCost || 0), 0));
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
    initGroup(key) {
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
            _leadIds: new Set(),
        };
    }
    errMsg(err) {
        return err instanceof Error ? err.message : String(err);
    }
};
exports.ReportingService = ReportingService;
exports.ReportingService = ReportingService = ReportingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('SALES_SERVICE')),
    __param(1, (0, common_1.Inject)('COST_IMPORTER_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy,
        microservices_1.ClientProxy])
], ReportingService);
function round2(n) {
    return Math.round((n + Number.EPSILON) * 100) / 100;
}
//# sourceMappingURL=reporting.service.js.map