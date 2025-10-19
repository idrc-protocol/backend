import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class WebhookService {
  private prisma = new PrismaClient();

  async createSubscription(data: CreateSubscriptionDto) {
    return this.prisma.subscription.create({
      data: {
        txHash: data.txHash,
        user: data.user,
        amount: data.amount,
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

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
