import { ClientProxy } from '@nestjs/microservices';
import { ReportQueryDto, AttributionReportDto } from './dto';
export declare class ReportingService {
    private readonly salesClient;
    private readonly costClient;
    private readonly logger;
    constructor(salesClient: ClientProxy, costClient: ClientProxy);
    generateAttributionReport(query: ReportQueryDto): Promise<AttributionReportDto>;
    private fetchLeads;
    private fetchDeals;
    private fetchCosts;
    private aggregateAttribution;
    private computeSummary;
    private initGroup;
    private errMsg;
}
