import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class GoldskyWebhookGuard implements CanActivate {
  private readonly GOLDSKY_WEBHOOK_SECRET = process.env.GOLDSKY_WEBHOOK_SECRET;

  canActivate(context: ExecutionContext): boolean {
    if (!this.GOLDSKY_WEBHOOK_SECRET) {
      throw new UnauthorizedException('Goldsky webhook secret not configured');
    }

    const request = context.switchToHttp().getRequest<Request>();
    const providedSecret = request.headers['goldsky-webhook-secret'];

    if (!providedSecret || providedSecret !== this.GOLDSKY_WEBHOOK_SECRET) {
      throw new UnauthorizedException('Invalid webhook secret');
    }

    return true;
  }
}