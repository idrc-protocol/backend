import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsObject,
  ValidateNested,
  IsOptional,
  IsInt,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Type } from 'class-transformer';

class WebhookDataNew {
  @ApiProperty({
    description: 'Subscription amount',
    example: '10000000',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === 'number') {
      return BigInt(value).toString();
    }
    return value;
  })
  amount: string;

  @ApiProperty({
    description: 'Block number',
    example: '32561425',
  })
  @IsString()
  @IsNotEmpty()
  block_number: string;

  @ApiProperty({
    description: 'Block timestamp',
    example: '1760891138',
  })
  @IsString()
  @IsNotEmpty()
  block_timestamp: string;

  @ApiProperty({
    description: 'Transaction ID',
    example:
      '\\x654379fadc44cc655c70998dce912b01050ddc7c863ccd6b0b3f81005577359b43000000',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Shares amount',
    example: '10000000',
  })
  @IsString()
  @IsNotEmpty()
  shares: string;

  @ApiProperty({
    description: 'Transaction hash from blockchain',
    example:
      '0xx654379fadc44cc655c70998dce912b01050ddc7c863ccd6b0b3f81005577359b',
  })
  @IsString()
  @IsNotEmpty()
  transaction_hash: string;

  @ApiProperty({
    description: 'User wallet address',
    example: '0xxdd80522dc76eb92e549545563c4247d6976078ed',
  })
  @IsString()
  @IsNotEmpty()
  user: string;

  @ApiProperty({
    description: 'Video ID',
    example: '139850255486156903',
  })
  @IsString()
  @IsNotEmpty()
  vid: string;

  @ApiProperty({
    description: 'Block number (numeric)',
    example: 32561425,
  })
  @IsInt()
  'block$': number;

  // Make other fields optional since Goldsky structure varies
  @ApiProperty({
    description: 'Log index',
    example: 268,
    required: false,
  })
  @IsOptional()
  @IsInt()
  log_index?: number;

  @ApiProperty({
    description: 'Timestamp',
    example: '1672705139',
    required: false,
  })
  @IsOptional()
  @IsString()
  timestamp?: string;

  @ApiProperty({
    description: 'Block range',
    example: '[16322627,)',
    required: false,
  })
  @IsOptional()
  @IsString()
  block_range?: string;
}

class WebhookData {
  @ApiProperty({
    description: 'New subscription data',
    type: WebhookDataNew,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => WebhookDataNew)
  new: WebhookDataNew;

  @ApiProperty({
    description: 'Old data (null for INSERT operations)',
    example: null,
  })
  @IsOptional()
  old: any;
}

export class WebhookPayloadDto {
  @ApiProperty({
    description: 'Operation type',
    example: 'INSERT',
  })
  @IsString()
  @IsNotEmpty()
  op: string;

  @ApiProperty({
    description: 'Webhook data containing subscription information',
    type: WebhookData,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => WebhookData)
  data: WebhookData;

  @ApiProperty({
    description: 'Data source identifier',
    example: 'idrc-indexer/1.0.1',
  })
  @IsString()
  @IsNotEmpty()
  data_source: string;

  @ApiProperty({
    description: 'Entity type',
    example: 'requested_subscription',
  })
  @IsString()
  @IsNotEmpty()
  entity: string;

  @ApiProperty({
    description: 'Webhook name',
    example: 'idrc-webhook',
  })
  @IsString()
  @IsNotEmpty()
  webhook_name: string;

  @ApiProperty({
    description: 'Webhook ID',
    example: 'webhook_clcfdc9gb00i50hyd43qeeidu',
  })
  @IsString()
  @IsNotEmpty()
  webhook_id: string;

  @ApiProperty({
    description: 'Unique event ID',
    example: '36a1a4a6-1411-4a13-939c-9dd6422b5674',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Delivery information',
    example: { max_retries: 10, current_retry: 0 },
  })
  @IsObject()
  delivery_info: {
    max_retries: number;
    current_retry: number;
  };
}
