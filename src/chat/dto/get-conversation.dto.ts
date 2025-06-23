import { IsOptional, IsNumberString, IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetChatsDto {
  @ApiProperty({ description: 'User id to filter chats', example: '1234567890abcdef12345678' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Page number (starting from 0)', required: false, default: 0 })
  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseInt(value) || 0)
  page?: number = 0;

  @ApiProperty({ description: 'Number of chats per page', required: false, default: 20 })
  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseInt(value) || 20)
  limit?: number = 20;

  @ApiProperty({ description: 'Status of chats to filter', required: false })
  @IsOptional()
  @IsString()
  status?: 'active' | 'archived' | 'deleted';
}