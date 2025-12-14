# Kexra Registry Backend

This is the backend API for the Kexra package registry, built with Node.js, Fastify, and MongoDB.

## Architecture

```
Clients (CLI / Web UI)
        ↓
Fastify API Server
        ↓
MongoDB (packages, versions collections)
```

## Tech Stack

- **Runtime**: Node.js LTS
- **Framework**: Fastify
- **Database**: MongoDB with Mongoose
- **Config**: Environment variables

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `REGISTRY_PUBLISH_TOKEN`: Secret token for publishing
- `NODE_ENV`: production/development
- `PORT`: Server port (default 3000)

## Database Schema

### packages collection

```json
{
  "name": "math-extra",
  "description": "Extra math utilities",
  "author": "manjunathh-xyz",
  "license": "MIT",
  "createdAt": "2025-12-14T00:00:00.000Z",
  "updatedAt": "2025-12-14T00:00:00.000Z"
}
```

### versions collection

```json
{
  "package": "math-extra",
  "version": "0.1.0",
  "dependencies": {},
  "dist": {
    "tarballUrl": "https://registry.kexra.dev/packages/math-extra/-/math-extra-0.1.0.tgz"
  },
  "publishedAt": "2025-12-14T00:00:00.000Z"
}
```

## API Endpoints

### Health

- `GET /health` - Health check

### Packages

- `GET /packages/:name` - Get package info
- `GET /packages/:name/versions` - Get package versions
- `GET /search?q=query` - Search packages
- `GET /packages/:name/-/:name-:version.tgz` - Download tarball

### Publishing

- `POST /publish` - Publish a package (requires token)

## Running Locally

1. Install dependencies: `npm install`
2. Set environment variables
3. Start MongoDB
4. Run: `npm run dev`

## Deployment on Katabump

1. Build: `npm run build`
2. Deploy with Katabump CLI
3. Set environment secrets

## Security

- Publish endpoint requires Bearer token
- Rate limiting on publish
- Input validation and sanitization
- Immutable versions (no overwrites)
