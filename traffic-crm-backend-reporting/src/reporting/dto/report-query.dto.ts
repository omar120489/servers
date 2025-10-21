import { IsDateString, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class ReportQueryDto {
  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @IsDateString()
  @IsNotEmpty()
  endDate!: string;

  @IsString()
  @IsOptional()
  utmSource?: string;

  @IsString()
  @IsOptional()
  adId?: string;
}
