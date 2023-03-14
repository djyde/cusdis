# Contributing to Cusdis

Thanks for taking time to contribute!

This guide help you know everything about how to run Cusdis on your local machine and start developing.

## Start dev server

Firstly, create a `.env` file:

```shell
DB_URL=file:./db.sqlite
USERNAME=admin
PASSWORD=password
JWT_SECRET=ofcourseistillloveyou
```

```bash
# install dependencies
$ yarn

# start dev server
$ yarn dev
```

Now open http://localhost:3000 and signin with `admin` and `password`

### Using PostgreSQL

`yarn dev` is using SQLite by default. If you want to develop with PostgreSQL, first change `DB_URL` in `.env` to your db connection url:

```shell
# .env
DB_URL=postgres://xxx
...
```

Then use `yarn dev:pg` to start the dev server.

## Developing widget

```bash
$ yarn widget
```

The widget demo will run on http://localhost:3001

Change the attributes of the widget in `widget/index.html` (Don't commit this file if you only modify something for testing).

## Modify schema

Database schema is defined in `prisma/$DB_TYPE/schema.prisma`.

### Generate database migrations

In general, you don't need to generate migration when contribute a new feature. Create a PR and the core team member will do this for you.

