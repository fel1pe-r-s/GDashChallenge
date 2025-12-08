import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateLogDto {
  @IsString()
  city: string;

  @IsNumber()
  temperature: number;

  @IsNumber()
  humidity: number;

  @IsNumber()
  windSpeed: number;

  @IsString()
  condition: string;

  @IsNumber()
  @IsOptional()
  timestamp: number;
}
