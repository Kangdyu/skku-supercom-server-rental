# 성균관대학교 슈퍼컴퓨팅센터 서버대여 서비스

## Prerequisites

- Node.js (v18 or above)
- pnpm
- docker
  - `postgresql`, `nginx` images
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
# 코드 수정 후 재배포 시에도 이 명령어를 사용
pnpm run deploy
# server down
# 재배포 시 사용하지 않아도 됨
sudo docker compose -f docker/development/docker-compose.yml down
```
