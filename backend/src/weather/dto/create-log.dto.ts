import { IsString, IsNumber } from 'class-validator';

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
  timestamp: number;
}
