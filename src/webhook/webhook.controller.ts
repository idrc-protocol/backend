import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiHeader } from '@nestjs/swagger';
import { WebhookService } from './webhook.service';
import { WebhookPayloadDto } from './dto/webhook-payload.dto';
import { GoldskyWebhookGuard } from './guards/goldsky-webhook.guard';

@ApiTags('webhook')
@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('subscription')
  @UseGuards(GoldskyWebhookGuard)
  @ApiOperation({
    summary: 'Handle subscription webhook',
    description:
      'Processes webhook payload to create subscription record with transaction hash, user, and amount',
  })
  @ApiHeader({
    name: 'goldsky-webhook-secret',
    description: 'Goldsky webhook secret for authentication',
    required: true,
  })
  @ApiBody({ type: WebhookPayloadDto })
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
            amount: { type: 'string', example: '10000000' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: 'Validation failed' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid webhook secret',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid webhook secret' },
      },
    },
  })
  async handleSubscriptionWebhook(@Body() data: WebhookPayloadDto) {
    try {
      console.log('Received webhook payload:', JSON.stringify(data, null, 2));
      const subscription = await this.webhookService.createSubscription(data);
      console.log('Successfully created subscription:', subscription);
      return {
        success: true,
        data: subscription,
      };
    } catch (error) {
      console.error('Webhook error:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get('subscriptions')
  @ApiOperation({
    summary: 'Get all subscriptions',
    description: 'Retrieves a list of all subscription records',
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
              amount: { type: 'string', example: '10000000' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
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
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Post('redemption')
  @UseGuards(GoldskyWebhookGuard)
  @ApiOperation({
    summary: 'Handle redemption webhook',
    description:
      'Processes webhook payload to create redemption record with transaction hash, user, and amount',
  })
  @ApiHeader({
    name: 'goldsky-webhook-secret',
    description: 'Goldsky webhook secret for authentication',
    required: true,
  })
  @ApiBody({ type: WebhookPayloadDto })
  @ApiResponse({
    status: 201,
    description: 'Redemption created successfully',
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
            amount: { type: 'string', example: '10000000' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: 'Validation failed' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid webhook secret',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid webhook secret' },
      },
    },
  })
  async handleRedemptionWebhook(@Body() data: WebhookPayloadDto) {
    try {
      console.log('Received redemption webhook payload:', JSON.stringify(data, null, 2));
      const redemption = await this.webhookService.createRedemption(data);
      console.log('Successfully created redemption:', redemption);
      return {
        success: true,
        data: redemption,
      };
    } catch (error) {
      console.error('Redemption webhook error:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get('redemptions')
  @ApiOperation({
    summary: 'Get all redemptions',
    description: 'Retrieves a list of all redemption records',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved redemptions',
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
              amount: { type: 'string', example: '10000000' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  })
  async getRedemptions() {
    try {
      const redemptions = await this.webhookService.getRedemptions();
      return {
        success: true,
        data: redemptions,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
