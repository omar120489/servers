import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ReportingService } from './reporting.service';
import { ReportQueryDto, AttributionReportDto } from './dto';

@Controller('reporting')
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Get('attribution')
  async getAttributionReport(
    @Query() query: ReportQueryDto,
  ): Promise<AttributionReportDto> {
    // Validate date range
    if (new Date(query.startDate) > new Date(query.endDate)) {
      throw new BadRequestException('startDate must be before or equal to endDate');
    }
    
    return this.reportingService.generateAttributionReport(query);
  }
}
