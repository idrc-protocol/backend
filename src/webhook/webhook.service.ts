import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';
import { GoldskyWebhookDto } from './dto/goldsky-webhook.dto';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class WebhookService {
  private prisma = new PrismaClient();

  private formatHexString(hexString: string): string {
    if (!hexString) return hexString;
    
    // If it starts with \x, convert to 0x format
    if (hexString.startsWith('\\x')) {
      return '0x' + hexString.slice(2);
    }
    
    // If it already starts with 0x, return as is
    if (hexString.startsWith('0x')) {
      return hexString;
    }
    
    // If it's just hex without prefix, add 0x
    return '0x' + hexString;
  }

  async createSubscription(data: GoldskyWebhookDto) {
    // Extract the required fields from the webhook payload
    const entityData = data.data?.new;
    
    if (!entityData) {
      throw new Error('No entity data found in webhook payload');
    }

    const { amount, transaction_hash, user } = entityData;
    
    if (!transaction_hash || !user || !amount) {
      throw new Error('Missing required fields: transaction_hash, user, or amount');
    }

    const result = await this.prisma.subscription.create({
      data: {
        id : uuidv7(),
        txHash: this.formatHexString(transaction_hash),
        user: this.formatHexString(user),
        amount: BigInt(amount),
      },
    });

    // Convert BigInt to string for JSON serialization
    return {
      ...result,
      amount: result.amount.toString(),
    };
  }

  async getSubscriptions() {
    const results = await this.prisma.subscription.findMany();
    return results.map(result => ({
      ...result,
      amount: result.amount.toString(),
    }));
  }

  async getSubscriptionByTxHash(txHash: string) {
    return this.prisma.subscription.findFirst({
      where: { txHash },
    });
  }

  async createRedemption(data: GoldskyWebhookDto) {
    // Extract the required fields from the webhook payload
    const entityData = data.data?.new;
    
    if (!entityData) {
      throw new Error('No entity data found in webhook payload');
    }

    const { amount, transaction_hash, user } = entityData;
    
    if (!transaction_hash || !user || !amount) {
      throw new Error('Missing required fields: transaction_hash, user, or amount');
    }

    const result = await this.prisma.redemption.create({
      data: {
        id : uuidv7(),
        txHash: this.formatHexString(transaction_hash),
        user: this.formatHexString(user),
        amount: BigInt(amount),
      },
    });

    // Convert BigInt to string for JSON serialization
    return {
      ...result,
      amount: result.amount.toString(),
    };
  }

  async getRedemptions() {
    const results = await this.prisma.redemption.findMany();
    return results.map(result => ({
      ...result,
      amount: result.amount.toString(),
    }));
  }

  async getRedemptionByTxHash(txHash: string) {
    return this.prisma.redemption.findFirst({
      where: { txHash },
    });
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
