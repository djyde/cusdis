# Vercel

Since Cusdis itself is built with Next.js, you can deploy your own Cusdis on Vercel in just one click!

> Before deploying on Vercel, make sure you had have a connectable PostgreSQL connection url (like `postgresql://johndoe:randompassword@localhost:5432/mydb`)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fdjyde%2Fcusdis&env=USERNAME,PASSWORD,DB_URL,JWT_SECRET&envDescription=Environment%20variables%20reference&envLink=https%3A%2F%2Fcusdis.com%2Fdoc)

After the initial deploying success, get your production deployment domain (like `https://foo.vercel.app`), then set `NEXTAUTH_URL` environment variable to this domain:

![](../images/y3FkAY.png ':size=800')

Then redeploy the application:

![](../images/redeploy.png ':size=400')


> Remember when you change the domain, you need to change `NEXTAUTH_URL` too.

## Environment Variables reference

- `USERNAME` username to sign in
- `PASSWORD` password to sign in
- `DB_URL` valid postgresql connection url (like `postgresql://johndoe:randompassword@localhost:5432/mydb`)
- `JWT_SECRET` secret key to sign jwt token. Set whatever you want.