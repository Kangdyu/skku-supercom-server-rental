# 성균관대학교 슈퍼컴퓨팅센터 서버대여 서비스

## Prerequisites

- Node.js (v18 or above)
- pnpm
- docker
- `.env` files (@Kangdyu 에게 문의)
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
# == Development build
# server up
sudo docker compose -f docker/development/docker-compose.yml up -d --build
# server down
sudo docker compose -f docker/development/docker-compose.yml down

# == Production build
# server up
sudo docker compose -f docker/production/docker-compose.yml up -d --build
# server down
sudo docker compose -f docker/production/docker-compose.yml down
```
