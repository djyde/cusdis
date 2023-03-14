# Manual Install

Make sure you have Node.js and yarn installed on your system, and clone the repository

```bash
$ git clone https://github.com/djyde/cusdis.git
$ cd cusdis
$ yarn install
```
Put a `.env` file under the project root with the environment variable settings, here is an example:

```
USERNAME=admin
PASSWORD=password
JWT_SECRET=ofcourseistillloveyou
NEXTAUTH_URL=http://IP_ADDRESS_OR_DOMAIN
HOST=http://IP_ADDRESS_OR_DOMAIN
DB_TYPE=sqlite
DB_URL=file:./data.db
```

Then build the application and run:

```bash
$ yarn run build:without-migrate
$ yarn run start:with-migrate
```

Now the application should be running on `3000` port, you can visit it via `http://localhost:3000`. You may need Nginx to serve the application, here is an example of Nginx config:

```nginx
...
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_pass_header Authorization;
    proxy_pass_header WWW-Authenticate;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
...
```
