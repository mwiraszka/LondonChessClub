# Deployment

## Frontend (Vercel)

The Angular app in `frontend/` deploys to Vercel:

- **Production** — `frontend-production.yaml` runs on push to `main`, builds with
  `pnpm build:prod`, and deploys to the production Vercel project. It also tags the
  release and creates a GitHub release from the top `CHANGELOG.md` entry.
- **Preview** — `frontend-preview.yaml` runs on pull requests, builds with
  `pnpm build:preview`, and deploys a Vercel preview URL.

Both workflows are gated on the repository variable `ENABLE_VERCEL` so they stay
green (skipped) until Vercel is configured.

### One-time setup

1. **Create the Vercel project** (Vercel dashboard → Add New → Project → import
   `mwiraszka/london-chess-club`):
   - Root Directory: `frontend`
   - Framework Preset: `Angular`
   - Build Command: `pnpm build:prod`
   - Output Directory: `dist`
   - Install Command: `pnpm install --frozen-lockfile`
   - (If client-side routing 404s on deep links, add `frontend/vercel.json` with a
     rewrite of `/(.*)` → `/index.html`.)
2. **Get the IDs/token**: from the project's `.vercel/project.json` (after a local
   `vercel link`) grab the org id and project id; create a token at
   Vercel → Account Settings → Tokens.
3. **Add GitHub repository secrets** (Settings → Secrets and variables → Actions):
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_FRONTEND_PROJECT_ID`
4. **Add the GitHub repository variable** `ENABLE_VERCEL` = `true` to turn the
   deploy jobs on.

### Production cutover (near-zero downtime)

The site currently serves from S3 + CloudFront at `londonchess.ca`. The MongoDB
database and the API (`api.londonchess.ca`, still on EC2 until the backend moves
to Vercel) are unaffected by this step.

1. Merge to `main` (or run the workflow manually) and confirm the Vercel
   production deployment is healthy at its `*.vercel.app` URL.
2. In Vercel, add `londonchess.ca` (and `www`) as production domains; Vercel shows
   the exact A/CNAME records to set.
3. At the DNS registrar, point `londonchess.ca` at Vercel. Both the old
   CloudFront and the new Vercel deployment serve during propagation, so there is
   no downtime.
4. Verify `londonchess.ca` is served by Vercel.
5. Retire the old path: delete the `lcc-website-production` / `lcc-website-preview`
   S3 buckets and the CloudFront distribution, and remove the now-unused
   `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_DISTRIBUTION_ID` GitHub
   secrets.

> The S3 deploy workflows were removed when the Vercel workflows were added. The
> existing S3 site keeps serving its last deploy until the DNS cutover, so it is
> safe to take these steps in order.

## Backend (Vercel)

The Express API in `backend/` runs as a single Vercel serverless function:
`backend/api/index.ts` re-exports the Express `app` (built in `backend/src/app.ts`),
and `backend/vercel.json` rewrites every path to it so Express does the routing.
Mongo uses a cached connection (`src/services/mongo-db.service.ts`) reused across
warm invocations.

- **Production** — `backend-production.yaml` deploys on push to `main` that touches
  `backend/**`.
- **Preview** — `backend-preview.yaml` deploys on PRs that touch `backend/**`.

Both are gated on the same `ENABLE_VERCEL` repository variable.

### One-time setup

1. **Create the Vercel project** (import the same repo again):
   - Root Directory: `backend`
   - Framework Preset: `Other` (Vercel builds the `api/` function automatically; no
     build command or output directory)
2. **Add the project's environment variables** (Vercel → Project → Settings →
   Environment Variables), for both Production and Preview:
   `MONGODB_URI`, `MONGODB_DATABASE`, `NODE_ENVIRONMENT`, `SENTRY_DSN`,
   `AWS_ACCESS_KEY_ID`, `AWS_USER_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET_NAME`,
   `AWS_S3_BUCKET_REGION`, `AWS_COGNITO_REGION`, `AWS_COGNITO_USER_POOL_ID`,
   `AWS_COGNITO_USER_POOL_CLIENT_ID`.
   (No `PORT` — that is only used by the local `pnpm start` server.) Use the
   freshly-rotated AWS / Mongo values.
3. **Add the GitHub repository secret** `VERCEL_BACKEND_PROJECT_ID` (the org id and
   token from the frontend setup are reused).

### Cutover

1. Deploy and confirm the API is healthy at its `*.vercel.app` URL (e.g.
   `GET /v1/version`, `GET /v1/test`).
2. In Vercel, add `api.londonchess.ca` as a production domain.
3. Point `api.londonchess.ca` DNS at Vercel. EC2 keeps serving until propagation,
   so no downtime; the database is shared, so there is no data migration.
4. Verify, then **decommission EC2** (stop the `main` systemd service and the
   instance) and remove the EC2 SSH secrets.
5. Replace the EC2 `mongodump` cron backups with **MongoDB Atlas automated backups**
   (Atlas → cluster → Backup). The `backend/scripts/` backup tooling can stay for
   manual/local use.

> Image uploads: Vercel serverless caps a request body at ~4.5 MB, so album uploads
> are sent one file per request (each <= 2.5 MB) with bounded client concurrency,
> rather than one large multi-file request.
