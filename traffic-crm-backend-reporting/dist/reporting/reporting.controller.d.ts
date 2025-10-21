import { ReportingService } from './reporting.service';
import { ReportQueryDto, AttributionReportDto } from './dto';
export declare class ReportingController {
    private readonly reportingService;
    constructor(reportingService: ReportingService);
    getAttributionReport(query: ReportQueryDto): Promise<AttributionReportDto>;
}
