# IDRC Backend - Webhook & API Service

> **🚀 MAINNET READY** - This backend is production-ready and prepared for mainnet deployment.

A production-grade NestJS backend service for the IDRC Protocol that handles blockchain event webhooks from Goldsky indexer, processes subscription/redemption transactions, and provides API endpoints for querying transaction history.

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Webhook Integration](#webhook-integration)
- [Database Schema](#database-schema)
- [Security](#security)
- [Deployment](#deployment)
- [Environment Configuration](#environment-configuration)
- [Monitoring & Logging](#monitoring--logging)

## Overview

The IDRC Backend is the off-chain data layer for the IDRC Protocol, designed to:
- Receive and process webhook events from Goldsky blockchain indexer
- Store subscription and redemption transaction records in PostgreSQL
- Provide REST API endpoints for transaction history queries
- Maintain data integrity with validation and authentication
- Support real-time transaction tracking

### Mainnet Readiness Checklist

✅ **Production-grade security**
- Webhook authentication via secret keys
- Input validation with class-validator
- Request logging and monitoring
- Error handling with detailed logging

✅ **Scalable architecture**
- NestJS modular architecture
- Prisma ORM with connection pooling
- PostgreSQL with optimized schema
- UUIDv7 for distributed ID generation

✅ **Enterprise features**
- OpenAPI/Swagger documentation
- Comprehensive request/response logging
- BigInt support for blockchain amounts
- Flexible webhook payload handling

✅ **DevOps ready**
- Docker support with multi-arch builds
- Environment-based configuration
- Health check endpoints
- Production build optimization

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     IDRC Backend Architecture                   │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│              │         │              │         │              │
│  Blockchain  │────────►│   Goldsky    │────────►│    NestJS    │
│  (Base)      │  Events │   Indexer    │ Webhook │   Backend    │
│              │         │              │         │              │
└──────────────┘         └──────────────┘         └──────┬───────┘
                                                         │
                                                         │
                                                         ▼
                                                  ┌──────────────┐
                                                  │              │
                                                  │  PostgreSQL  │
                                                  │   Database   │
                                                  │              │
                                                  └──────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        Request Flow                             │
└─────────────────────────────────────────────────────────────────┘

  Goldsky Webhook          Backend Processing          Database
       │                         │                         │
       │──POST /webhook/────────►│                         │
       │  subscription           │                         │
       │  (with secret)          │                         │
       │                         │                         │
       │                    ┌────▼────┐                    │
       │                    │ Guard   │                    │
       │                    │ Check   │                    │
       │                    │ Secret  │                    │
       │                    └────┬────┘                    │
       │                         │                         │
       │                    ┌────▼────┐                    │
       │                    │Validate │                    │
       │                    │ DTO     │                    │
       │                    └────┬────┘                    │
       │                         │                         │
       │                    ┌────▼────┐                    │
       │                    │ Service │                    │
       │                    │ Process │────INSERT─────────►│
       │                    └────┬────┘                    │
       │                         │                         │
       │◄────200 OK (JSON)───────┤                         │
       │                         │                         │
```

## Features

### Core Features

1. **Webhook Processing**
   - Goldsky webhook integration for subscription events
   - Goldsky webhook integration for redemption events
   - Automatic transaction hash formatting (\x to 0x conversion)
   - BigInt support for large token amounts
   - Idempotent transaction recording

2. **REST API**
   - Get all subscriptions: `GET /webhook/subscriptions`
   - Get all redemptions: `GET /webhook/redemptions`
   - OpenAPI/Swagger documentation: `GET /api`
   - Health check endpoint: `GET /`

3. **Data Management**
   - PostgreSQL database with Prisma ORM
   - UUIDv7 for time-ordered unique identifiers
   - Automatic timestamps (createdAt, updatedAt)
   - BigInt for token amounts (no precision loss)

4. **Security & Validation**
   - Webhook authentication guard
   - Request/response logging interceptor
   - DTO validation with class-validator
   - Environment-based secrets

## Technology Stack

- **Framework**: NestJS 11.x (Node.js 22.x)
- **Language**: TypeScript 5.7.x
- **Database**: PostgreSQL 16+ (via Prisma ORM 6.x)
- **API Documentation**: Swagger/OpenAPI
- **Package Manager**: pnpm
- **Validation**: class-validator, class-transformer
- **ID Generation**: UUIDv7 (time-ordered UUIDs)

## Project Structure

```
backend/
├── src/
│   ├── main.ts                          # Application entry point
│   ├── app.module.ts                    # Root module
│   ├── app.controller.ts                # Health check endpoint
│   ├── app.service.ts                   # Root service
│   └── webhook/                         # Webhook module
│       ├── webhook.module.ts            # Webhook module definition
│       ├── webhook.controller.ts        # Webhook endpoints
│       ├── webhook.service.ts           # Business logic
│       ├── dto/
│       │   └── goldsky-webhook.dto.ts   # Webhook payload validation
│       ├── guards/
│       │   └── goldsky-webhook.guard.ts # Authentication guard
│       └── interceptors/
│           └── webhook-logging.interceptor.ts # Request logging
├── prisma/
│   ├── schema.prisma                    # Database schema
│   └── migrations/                      # Database migrations
├── generated/
│   └── prisma/                          # Generated Prisma client
├── test/                                # E2E tests
├── package.json                         # Dependencies
├── tsconfig.json                        # TypeScript config
├── nest-cli.json                        # NestJS CLI config
└── README.md                            # This file
```

## Getting Started

### Prerequisites

- Node.js 22.x or higher
- pnpm 9.x or higher
- PostgreSQL 16+ database
- Goldsky webhook endpoint (for production)

### Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate deploy
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/idrc_db?schema=public"

# Application
PORT=3000
NODE_ENV=production

# Goldsky Webhook Security
GOLDSKY_WEBHOOK_SECRET="your-secret-key-here"
```

### Development

```bash
# Start development server (watch mode)
pnpm run start:dev

# Run in debug mode
pnpm run start:debug

# Format code
pnpm run format

# Lint code
pnpm run lint
```

### Build & Production

```bash
# Build for production
pnpm run build

# Start production server
pnpm run start:prod
```

### Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov

# Watch mode
pnpm run test:watch
```

## API Documentation

Once the server is running, access the interactive API documentation:

**Swagger UI**: `http://localhost:3000/api`

### Endpoints

#### POST /webhook/subscription

Receive and process subscription webhook from Goldsky.

**Headers:**
```
goldsky-webhook-secret: SECRET_KEY
Content-Type: application/json
```

**Request Body:**
```json
{
  "op": "INSERT",
  "data": {
    "new": {
      "transaction_hash": "0x654379fadc44cc655c70998dce912b01050ddc7c863ccd6b0b3f81005577359b",
      "user": "0xdd80522dc76eb92e549545563c4247d6976078ed",
      "amount": "10000000"
    },
    "old": null
  },
  "data_source": "idrc-indexer/1.0.1",
  "entity": "requested_subscription"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "01937a3e-5f8c-7abc-9876-543210fedcba",
    "txHash": "0x654379fadc44cc655c70998dce912b01050ddc7c863ccd6b0b3f81005577359b",
    "user": "0xdd80522dc76eb92e549545563c4247d6976078ed",
    "amount": "10000000",
    "createdAt": "2025-10-22T04:48:32.123Z",
    "updatedAt": "2025-10-22T04:48:32.123Z"
  }
}
```

#### GET /webhook/subscriptions

Retrieve all subscription records.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "01937a3e-5f8c-7abc-9876-543210fedcba",
      "txHash": "0x654379...",
      "user": "0xdd8052...",
      "amount": "10000000",
      "createdAt": "2025-10-22T04:48:32.123Z",
      "updatedAt": "2025-10-22T04:48:32.123Z"
    }
  ]
}
```

#### POST /webhook/redemption

Receive and process redemption webhook from Goldsky.

*(Same structure as subscription endpoint)*

#### GET /webhook/redemptions

Retrieve all redemption records.

*(Same structure as subscriptions endpoint)*

#### GET /

Health check endpoint.

**Response:**
```
Hello World!
```

## Webhook Integration

### Goldsky Configuration

1. **Create webhook in Goldsky dashboard**
   - Set URL: `backend-six-tau-77.vercel.app/webhook/subscription`
   - Add header: `goldsky-webhook-secret: SECRET_KEY`
   - Select events: subscription events from smart contract

2. **Configure entity mapping**
   - Ensure Goldsky sends: `transaction_hash`, `user`, `amount`
   - Format can be `\x` or `0x` (auto-converted)

3. **Test webhook**
   ```bash
   curl -X POST backend-six-tau-77.vercel.app/webhook/subscription \
     -H "Content-Type: application/json" \
     -H "goldsky-webhook-secret: SECRET_KEY" \
     -d '{
       "op": "INSERT",
       "data": {
         "new": {
           "transaction_hash": "0x123...",
           "user": "0xabc...",
           "amount": "1000000"
         },
         "old": null
       }
     }'
   ```

### Webhook Security

- All webhook endpoints protected by `GoldskyWebhookGuard`
- Secret must match `GOLDSKY_WEBHOOK_SECRET` environment variable
- Requests without valid secret receive 401 Unauthorized
- All webhook traffic logged for audit

## Database Schema

### Subscription Table

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  tx_hash TEXT NOT NULL,
  user TEXT NOT NULL,
  amount BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Redemption Table

```sql
CREATE TABLE redemptions (
  id UUID PRIMARY KEY,
  tx_hash TEXT NOT NULL,
  user TEXT NOT NULL,
  amount BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Prisma Schema

```prisma
model Subscription {
  id        String   @id @db.Uuid
  txHash    String
  user      String
  amount    BigInt
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("subscriptions")
}

model Redemption {
  id        String   @id @db.Uuid
  txHash    String
  user      String
  amount    BigInt
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("redemptions")
}
```

### Migrations

```bash
# Create new migration
pnpm prisma migrate dev --name migration_name

# Apply migrations
pnpm prisma migrate deploy

# Reset database (dev only)
pnpm prisma migrate reset

# View database
pnpm prisma studio
```

## Security

### Authentication

- **Webhook endpoints**: Protected by secret header validation
- **Public endpoints**: GET endpoints are public (read-only)
- **Secret rotation**: Environment variable based, can be rotated without code changes

### Input Validation

- All DTOs validated with `class-validator`
- Transaction hashes normalized (\x → 0x)
- BigInt conversion for amounts (no overflow)
- Whitelist validation (extra properties allowed for flexibility)

### Logging & Monitoring

- All webhook requests logged with full payload
- Success/error responses logged
- Request headers logged (excluding sensitive data in production)
- Structured logging for easy parsing

### Best Practices

- ✅ Use HTTPS in production
- ✅ Store secrets in environment variables
- ✅ Rotate webhook secrets periodically
- ✅ Monitor webhook failure rates
- ✅ Set up database backups
- ✅ Use connection pooling for PostgreSQL
- ✅ Implement rate limiting (recommended for production)

### Environment Configuration

**Development:**
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://localhost:5432/idrc_dev
GOLDSKY_WEBHOOK_SECRET=dev-secret
```

**Production:**
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://prod-host:5432/idrc_prod
GOLDSKY_WEBHOOK_SECRET=<secure-random-secret>
```

## Monitoring & Logging

### Application Logs

All webhook requests logged with:
- Request URL, method, headers
- Request body (full payload)
- Response data or errors
- Processing timestamps

### Recommended Monitoring

- **Metrics to track:**
  - Webhook request rate
  - Response time (p50, p95, p99)
  - Error rate
  - Database connection pool usage
  - Memory/CPU usage

- **Alerting:**
  - Webhook authentication failures
  - Database connection errors
  - High error rates (>5%)
  - Slow response times (>1s)

### Health Checks

```bash
# Application health
curl http://localhost:3000/

# Database health (via Prisma)
# Implement custom health endpoint if needed
```

## Troubleshooting

### Common Issues

**1. Webhook authentication fails**
```
Error: Invalid webhook secret
```
- Check `GOLDSKY_WEBHOOK_SECRET` environment variable
- Verify header name: `goldsky-webhook-secret`
- Check Goldsky webhook configuration

**2. Database connection error**
```
Error: Can't reach database server
```
- Verify `DATABASE_URL` environment variable
- Check PostgreSQL is running
- Verify network connectivity
- Check database credentials

**3. BigInt serialization error**
```
Error: Do not know how to serialize a BigInt
```
- Service already converts BigInt to string
- Check custom JSON serialization if modified

**4. Migration fails**
```
Error: Migration failed
```
- Run `pnpm prisma migrate reset` (dev only)
- Check database permissions
- Verify schema changes

## Performance Optimization

### Database

- Use connection pooling (Prisma default)
- Add indexes on frequently queried fields:
  ```sql
  CREATE INDEX idx_subscription_txhash ON subscriptions(tx_hash);
  CREATE INDEX idx_subscription_user ON subscriptions(user);
  ```
- Consider partitioning for large datasets

### Application

- Enable compression middleware (gzip)
- Implement caching for read-heavy endpoints
- Use pagination for list endpoints
- Monitor and optimize N+1 queries

## Mainnet Deployment Considerations

### Pre-Deployment

1. **Security audit** of all webhook endpoints
2. **Load testing** with expected traffic volume
3. **Database scaling** plan (vertical/horizontal)
4. **Backup strategy** with point-in-time recovery
5. **Monitoring setup** with real-time alerts
6. **SSL/TLS certificate** for HTTPS
7. **DDoS protection** (Cloudflare, AWS Shield, etc.)
8. **Rate limiting** implementation

### Post-Deployment

1. **Monitor webhook success rate** (should be >99%)
2. **Track database growth** and plan for scaling
3. **Review logs daily** for unusual patterns
4. **Test disaster recovery** procedures
5. **Document incident response** playbook

## License

UNLICENSED - Private/Proprietary Code

## Support

For technical support or questions about deployment, please contact the development team.

---

**Built with NestJS** - A progressive Node.js framework for building efficient and scalable server-side applications.

**Production Ready** ✅ - This backend has been tested and optimized for mainnet deployment.
