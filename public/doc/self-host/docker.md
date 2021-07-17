# Docker

```bash
docker run \
  -d \
  -e USERNAME=admin \
  -e PASSWORD=password \
  -e JWT_SECRET=ofcourseistillloveyou \
  -e DB_URL=file:/data/db.sqlite \
  -e NEXTAUTH_URL=http://IP_ADDRESS_OR_DOMAIN \
  -p 3000:3000 \
  -v /data:/data \
  djyde/cusdis
```

> Remember to change the `http://IP_ADDRESS_OR_DOMAIN` to your machine host or domain

Then visit `http://IP_ADDRESS_OR_DOMAIN`

## Env

- `USERNAME` (required) username to login
- `PASSWORD` (required) password to login
- `DB_URL` (required) where to store your data
  - If you use SQLite, must have a `file:` prefix, like `file:/data/db.sqlite`
  - If you use pgsql, set it to your pgsql connection url
- `NEXTAUTH_URL` (required) your machine host (IP address or domain like `https://foo.com`)
- `HOST` your machine host (IP address or domain like `https://foo.com`), default will be `https://cusdis.com`. It affects the redirect address of the approval link.
- `JWT_SECRET` jwt secret
- `DB_TYPE`
  - `sqlite` (default)
  - `pgsql`

### PostgreSQL (optional)

You can connect Cusdis to an exist pgsql instead of SQLite:

```bash
docker run \
  -d \
  -e USERNAME=djyde \
  -e PASSWORD=password \
  -e JWT_SECRET=ofcourseistillloveyou \
  -e DB_TYPE=pgsql
  -e DB_URL=YOUR_PGSQL_URL \
  -e NEXTAUTH_URL=http://IP_ADDRESS_OR_DOMAIN \
  -p 3000:3000 \
  djyde/cusdis
```

Or you can use `docker compose` to use a new pgsql.

Create a `docker-compose.yaml`:

```yml
version: "3.9"
services:
  cusdis:
    image: "djyde/cusdis"
    ports:
      - "3000:3000"
    environment:
      - USERNAME=admin
      - PASSWORD=password
      - JWT_SECRET=ofcourseistillloveyou
      - NEXTAUTH_URL=http://IP_ADDRESS_OR_DOMAIN
      - DB_TYPE=pgsql
      - DB_URL=postgresql://cusdis:password@pgsql:5432/cusdis
  pgsql:
    image: "postgres:13"
    volumes:
      - "./data:/var/lib/postgresql/data"
    environment:
      - POSTGRES_USER=cusdis
      - POSTGRES_DB=cusdis
      - POSTGRES_PASSWORD=password
```

> Remember to change the `http://IP_ADDRESS_OR_DOMAIN` to your machine host or domain

Then run `docker-compose up`

