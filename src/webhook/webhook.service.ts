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

    return this.prisma.subscription.create({
      data: {
        id : uuidv7(),
        txHash: transaction_hash,
        user: user,
        amount: amount,
      },
    });
  }

  async getSubscriptions() {
    return this.prisma.subscription.findMany();
  }

  async getSubscriptionByTxHash(txHash: string) {
    return this.prisma.subscription.findFirst({
      where: { txHash },
    });
  }

  async createRedemption(data: WebhookPayloadDto) {
    // Extract the required fields from the webhook payload
    const { amount, transaction_hash, user } = data.data.new;

    return this.prisma.redemption.create({
      data: {
        id : uuidv7(),
        txHash: transaction_hash,
        user: user,
        amount: amount,
      },
    });
  }

  async getRedemptions() {
    return this.prisma.redemption.findMany();
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
