# Installation

## Docker

```bash
docker run \
  -d \
  -e USERNAME=djyde \
  -e PASSWORD=password \
  -e JWT_SECRET=ofcourseistillloveyou \
  -e DB_URL=file:/data/db.sqlite \
  -e NEXTAUTH_URL=http://104.236.216.173:3000 \
  -p 3000:3000 \
  -v /data:/data \
  djyde/cusdis
```

### Env

- `USERNAME` (required) username to login
- `PASSWORD` (required) password to login
- `DB_URL` (required) where to store your data
  - If you use SQLite, must have a `file:` prefix, like `file:/data/db.sqlite`
  - If you use pgsql, set it to your pgsql connection url
- `NEXTAUTH_URL` (required) your machine host (IP address or domain like `https://foo.com`)
- `JWT_SECRET` jwt secret
- `PG_TYPE`
  - `sqlite` (default)
  - `pgsql`

## Vercel