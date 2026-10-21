# Media API

A backend REST API built with **Node.js, Express.js, MongoDB, and Redis** for product management, authentication, media uploads, caching, and asynchronous processing.

## Features

- **Authentication and Authorization** — JWT-based authentication and role-based access control.
- **Product Management** — CRUD operations, filtering, sorting, and pagination.
- **Request Validation** — Validation of product data and query parameters.
- **Media Uploads** — Image upload handling with file type and size restrictions.
- **Caching** — Redis-based caching to reduce repeated database queries.
- **Centralized Error Handling** — Consistent error responses and HTTP status codes.
- **Security** — Helmet, CORS configuration, rate limiting, and protected routes.
- **Database Operations** — MongoDB with Mongoose schemas and validation.
- **Webhooks** — Signature verification and duplicate-event handling.
- **Background Jobs** — BullMQ-based asynchronous job processing.
- **Testing** — Automated tests using Vitest.
- **Containerization** — Docker Compose configuration for local infrastructure.

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| MongoDB | Persistent database |
| Mongoose | Database modeling |
| Redis | Caching and queue infrastructure |
| JWT | Authentication |
| Multer | File upload middleware |
| BullMQ | Background job processing |
| Vitest | Automated testing |
| Docker | Containerized development environment |

## Project Structure

```text
media-api/
├── config/          # Environment, database and service configuration
├── controllers/     # Request handlers
├── jobs/            # Background job processing
├── middleware/      # Authentication, validation and error handling
├── models/          # Mongoose models
├── repositories/    # Database access layer
├── routes/          # API route definitions
├── services/        # Business logic
├── tests/           # Automated tests
├── utils/            # Shared utilities
├── uploads/          # Local upload directory, if used
├── app.js            # Express application configuration
├── server.js         # Application startup
├── compose.yaml      # Docker Compose configuration
└── package.json      # Dependencies and scripts
```

## Prerequisites

- Node.js compatible with the project configuration
- npm
- MongoDB connection
- Redis
- Docker and Docker Compose, if using the provided container setup

## Getting Started

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd media-api
```

Replace `<YOUR_REPOSITORY_URL>` with your actual Git repository URL.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local `.env` file using `.env.example` as a reference.

Configure the required variables:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
MONGO_TEST_URI=your_test_database_connection_string
JWT_SECRET=your_development_jwt_secret
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
REDIS_URL=redis://localhost:6379
```

Use your actual local configuration values in `.env`. Never commit real credentials, API keys, or secrets.

### 4. Start required services

If your Redis service is already configured in Docker, start it using your Docker Compose setup or the appropriate container command.

Ensure MongoDB and Redis are reachable before starting the API.

### 5. Start the development server

```bash
npm run dev
```

The default port is `3000`, unless overridden by the environment configuration.

## Testing

Run the automated test suite:

```bash
npx vitest run
```

Use a separate test database when running integration tests. Avoid running destructive tests against production data.

## API Overview

The API currently includes route groups for:

| Route | Purpose |
|---|---|
| `/api/v1/auth` | Authentication |
| `/api/v1/users` | User-related operations |
| `/api/v1/products` | Product management |
| `/webhooks` | Webhook endpoints |
| `/health` | Basic health check |

Authentication requirements and request formats depend on the individual endpoint.

## Security Notes

- Keep `.env` out of version control.
- Use strong secrets and configure production environment variables securely.
- Validate incoming request data.
- Protect private routes with authentication and authorization.
- Restrict CORS to trusted frontend origins.
- Configure rate limits appropriate to each endpoint.
- Review dependency vulnerabilities regularly.

## Development Status

This project is being developed as a backend portfolio project. Features, tests, and deployment configuration should be verified against the current implementation before being considered production-ready.

## License

Add a license before distributing or reusing this project publicly.
