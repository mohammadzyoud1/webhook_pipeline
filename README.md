# Webhook Pipeline

A mini webhook processing pipeline service. Receives webhook events, processes them through configurable pipelines, and delivers results to subscribers.

## Architecture

- **API Server** — Express.js REST API for managing pipelines, subscribers, and receiving webhooks
- **Worker** — Background process that picks up queued jobs, runs actions, and delivers results to subscribers
- **PostgreSQL** — Stores pipelines, subscribers, jobs, and delivery attempts
- **Drizzle ORM** — Type-safe database queries

## How It Works

1. Create a pipeline with an action type
2. Add subscribers (URLs that will receive processed results)
3. External system sends a webhook to `/webhook/:source_path`
4. Worker picks up the job, runs the action on the payload
5. Worker delivers the result to all subscribers
6. Check job status at `/jobs/:id`

## Action Types

| Action               | Description                                            | Required Fields                           |
| -------------------- | ------------------------------------------------------ | ----------------------------------------- |
| `sentiment_analysis` | Analyzes message sentiment (positive/negative/neutral) | `message`                                 |
| `validate_email`     | Validates email format                                 | `email`                                   |
| `currency_converter` | Converts amount between currencies                     | `amount`, `from_currency` , `to_currency` |

### Available Currencies

| Code | Currency        |
| ---- | --------------- |
| USD  | US Dollar       |
| EUR  | Euro            |
| GBP  | British Pound   |
| JPY  | Japanese Yen    |
| JOD  | Jordanian Dinar |

## Setup

### Prerequisites

- Node.js 22+
- PostgreSQL
- Docker

### Without Docker

1. Clone the repo

```bash
git clone repo_URL
cd webhook_pipeline
```

2. Install dependencies

```bash
npm install
```

3. Create `.env` file

```
DB_URL=postgres://YOUR_DB_USER:YOUR_DB_PASSWORD@YOUR_DB_HOST:5432/YOUR_DB_NAME
JWT_SECRET=YOUR_JWT_SECRET_HERE
```

4. Run migrations

```bash
npx drizzle-kit migrate
```

5. Start the API

```bash
npm run dev
```

6. Start the worker (separate terminal)

```bash
npm run worker
```

### With Docker

1. Create `.env` file

```
JWT_SECRET=YOUR_JWT_SECRET_HERE
```

2. Run

```bash
docker compose up
```

## API Reference

### Auth

#### Register Admin

```
POST /auth/register
Body: { "email": "admin@test.com", "password": "123456" }
Response: { "message": "Admin created", "id": "uuid", "email": "admin@test.com" }
```

#### Login

```
POST /auth/login
Body: { "email": "admin@test.com", "password": "123456" }
Response: { "token": "eyJhbGci..." }
```

### Pipelines

#### Create Pipeline (admin only)

```
POST /createpipeline
Headers: Authorization: Bearer <token>
Body: { "name": "test", "source_path": "source1", "actionType": "sentiment_analysis" }
```

#### Get All Pipelines

```
GET /pipelines
```

#### Get Pipeline by Name

```
GET /pipelines/:name
```

#### Delete Pipeline (admin only)

```
DELETE /pipelines/:name
Headers: Authorization: Bearer <token>
```

### Subscribers

#### Add Subscriber (admin only)

```
POST /createSubscriber
Headers: Authorization: Bearer <token>
Body: { "name": "sub1", "pipeLineName": "test", "url": "https://your-url.com" }
```

#### Get All Subscribers

```
GET /subscribers
```

#### Get Subscriber by Name

```
GET /subscribers/:name
```

#### Delete Subscriber (admin only)

```
DELETE /subscribers/:name
Headers: Authorization: Bearer <token>
```

### Webhooks

#### Send Webhook

```
POST /webhook/:source_path
Body: { any JSON payload }
Response: { "message": "Webhook received", "job_id": "uuid" }
```

### Jobs

#### Get Job Status

```
GET /jobs/:id
Response: { job, delivery_attempts }
```

## Tech Stack

- TypeScript
- Express.js
- PostgreSQL
- Drizzle ORM
- JWT + Argon2 (auth)
- Docker
- GitHub Actions (CI)
