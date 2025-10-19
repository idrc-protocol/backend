import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsObject,
  ValidateNested,
  IsOptional,
  IsAny,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

// Flexible entity data that can accept any structure
class EntityData {
  @ApiProperty({
    description: 'Transaction hash from blockchain',
    example: '0x654379fadc44cc655c70998dce912b01050ddc7c863ccd6b0b3f81005577359b',
  })
  @IsOptional()
  @IsString()
  transaction_hash?: string;

  @ApiProperty({
    description: 'User wallet address',
    example: '0xdd80522dc76eb92e549545563c4247d6976078ed',
  })
  @IsOptional()
  @IsString()
  user?: string;

  @ApiProperty({
    description: 'Amount value',
    example: '10000000',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'number') {
      return BigInt(value).toString();
    }
    return value?.toString();
  })
  amount?: string;

  // Allow any other properties
  [key: string]: any;
}

class FlexibleWebhookData {
  @ApiProperty({
    description: 'New entity data',
    type: EntityData,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => EntityData)
  new?: EntityData;

  @ApiProperty({
    description: 'Old entity data (null for INSERT)',
    example: null,
  })
  @IsOptional()
  old?: any;
}

export class GoldskyWebhookDto {
  @ApiProperty({
    description: 'Operation type',
    example: 'INSERT',
  })
  @IsString()
  @IsNotEmpty()
  op: string;

  @ApiProperty({
    description: 'Webhook data containing entity information',
    type: FlexibleWebhookData,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => FlexibleWebhookData)
  data: FlexibleWebhookData;

  @ApiProperty({
    description: 'Data source identifier',
    example: 'idrc-indexer/1.0.1',
  })
  @IsOptional()
  @IsString()
  data_source?: string;

  @ApiProperty({
    description: 'Entity type',
    example: 'requested_subscription',
  })
  @IsOptional()
  @IsString()
  entity?: string;

  // Allow any additional properties that Goldsky might send
  @IsOptional()
  webhook_name?: string;

  @IsOptional()
  webhook_id?: string;

  @IsOptional()
  id?: string;

  @IsOptional()
  delivery_info?: any;

  // Catch-all for any other properties
  [key: string]: any;
}