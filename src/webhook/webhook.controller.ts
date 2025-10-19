import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { WebhookService } from './webhook.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@ApiTags('webhook')
@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('subscription')
  @ApiOperation({ 
    summary: 'Create a new subscription',
    description: 'Creates a new subscription record with transaction hash, user, and amount'
  })
  @ApiBody({ type: CreateSubscriptionDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Subscription created successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clm1234567890' },
            txHash: { type: 'string', example: '0x1234567890abcdef' },
            user: { type: 'string', example: 'user123' },
            amount: { type: 'string', example: '10.50' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - validation error',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: 'Validation failed' }
      }
    }
  })
  async handleSubscriptionWebhook(@Body() data: CreateSubscriptionDto) {
    try {
      const subscription = await this.webhookService.createSubscription(data);
      return {
        success: true,
        data: subscription,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('subscriptions')
  @ApiOperation({ 
    summary: 'Get all subscriptions',
    description: 'Retrieves a list of all subscription records'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved subscriptions',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'clm1234567890' },
              txHash: { type: 'string', example: '0x1234567890abcdef' },
              user: { type: 'string', example: 'user123' },
              amount: { type: 'string', example: '10.50' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  })
  async getSubscriptions() {
    try {
      const subscriptions = await this.webhookService.getSubscriptions();
      return {
        success: true,
        data: subscriptions,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}