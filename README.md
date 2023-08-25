# 성균관대학교 슈퍼컴퓨팅센터 서버대여 서비스

## Prerequisites

- Node.js (v18 or above)
- pnpm
- docker
- `.env` files
  - `.env.local` for local development
  - `.env.development` for deployment testing
  - `.env.production` for production build

## Development

```bash
pnpm i
pnpm dotenv -e .env.local prisma generate
pnpm dev
```

## Deployment

```bash
# server up
pnpm run deploy
# server down
sudo docker compose -f docker/development/docker-compose.yml down
```
