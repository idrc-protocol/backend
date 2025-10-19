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
    console.log('Webhook guard activated');
    console.log('Environment has GOLDSKY_WEBHOOK_SECRET:', !!this.GOLDSKY_WEBHOOK_SECRET);
    
    if (!this.GOLDSKY_WEBHOOK_SECRET) {
      console.error('GOLDSKY_WEBHOOK_SECRET environment variable not configured');
      throw new UnauthorizedException('Goldsky webhook secret not configured');
    }

    const request = context.switchToHttp().getRequest<Request>();
    const providedSecret = request.headers['goldsky-webhook-secret'];
    
    console.log('Provided secret exists:', !!providedSecret);
    console.log('Request headers:', Object.keys(request.headers));
    
    if (!providedSecret || providedSecret !== this.GOLDSKY_WEBHOOK_SECRET) {
      console.error('Invalid webhook secret provided');
      throw new UnauthorizedException('Invalid webhook secret');
    }

    console.log('Webhook authentication successful');
    return true;
  }
}