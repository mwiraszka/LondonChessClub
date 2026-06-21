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

## Backend

Still deployed to EC2 from the `backend/` directory. Moves to Vercel serverless
in a later phase (see `CHANGELOG.md` / project notes).
