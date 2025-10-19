import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsObject,
  ValidateNested,
  IsOptional,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

class WebhookDataNew {
  @ApiProperty({
    description: 'Subscription amount',
    example: 10000000,
  })
  @IsInt()
  amount: number;

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
}
