"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributionReportDto = exports.AttributionRowDto = void 0;
class AttributionRowDto {
    groupingKey;
    totalSpend;
    totalLeads;
    costPerLead;
    totalDealsWon;
    costPerAcquisition;
    conversionRate;
    grossRevenue;
    directCost;
    netProfit;
    returnOnAdSpend;
}
exports.AttributionRowDto = AttributionRowDto;
class AttributionReportDto {
    summary;
    bySource;
    byAd;
}
exports.AttributionReportDto = AttributionReportDto;
//# sourceMappingURL=attribution-report.dto.js.map