import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'Transaction hash from blockchain',
    example: '0x1234567890abcdef1234567890abcdef12345678',
  })
  @IsString()
  @IsNotEmpty()
  txHash: string;

  @ApiProperty({
    description: 'User identifier or wallet address',
    example: 'user123',
  })
  @IsString()
  @IsNotEmpty()
  user: string;

  @ApiProperty({
    description: 'Subscription amount as a decimal string',
    example: '10.50',
  })
  @IsNumberString()
  @IsNotEmpty()
  amount: string;
}