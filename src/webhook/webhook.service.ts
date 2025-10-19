import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';
import { WebhookPayloadDto } from './dto/webhook-payload.dto';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class WebhookService {
  private prisma = new PrismaClient();

  async createSubscription(data: WebhookPayloadDto) {
    // Extract the required fields from the webhook payload
    const { amount, transaction_hash, user } = data.data.new;

    const result = await this.prisma.subscription.create({
      data: {
        id : uuidv7(),
        txHash: transaction_hash,
        user: user,
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

  async createRedemption(data: WebhookPayloadDto) {
    // Extract the required fields from the webhook payload
    const { amount, transaction_hash, user } = data.data.new;

    const result = await this.prisma.redemption.create({
      data: {
        id : uuidv7(),
        txHash: transaction_hash,
        user: user,
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
