# 성균관대학교 슈퍼컴퓨팅센터 서버대여 서비스

NOTE: 근로학생 기간 종료로 인해 다음 유지보수 담당자가 fork하여 진행 예정

해당 레포지토리에는 서버대여 서비스 + 테스트 서버 배포 세팅까지만 완료되어 있습니다.

## Prerequisites

- Node.js (v18 or above)
- pnpm
- docker
  - `postgresql`, `nginx` images
- `.env` files
  - `.env.local` for local development
  - `.env.development` for test server deployment
  - `.env.production` for production server deployment

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
