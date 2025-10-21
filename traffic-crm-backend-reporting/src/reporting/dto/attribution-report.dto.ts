export class AttributionRowDto {
  groupingKey!: string;
  totalSpend!: number;
  totalLeads!: number;
  costPerLead!: number;
  totalDealsWon!: number;
  costPerAcquisition!: number;
  conversionRate!: number;
  grossRevenue!: number;
  directCost!: number;
  netProfit!: number;
  returnOnAdSpend!: number;
}

export class AttributionReportDto {
  summary!: {
    totalSpend: number;
    totalLeads: number;
    avgCPL: number;
    totalDealsWon: number;
    avgCPA: number;
    totalRevenue: number;
    totalNetProfit: number;
    totalROAS: number;
  };
  bySource!: AttributionRowDto[];
  byAd!: AttributionRowDto[];
}
