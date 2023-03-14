# Railway

Railway offers a one-click deploy for Cusdis which uses a PostgreSQL database that is automagically provisioned for you.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https%3A%2F%2Fgithub.com%2Frailwayapp-starters%2Fcusdis&plugins=postgresql&envs=JWT_SECRET%2CUSERNAME%2CPASSWORD%2CNEXTAUTH_URL%2CPORT&USERNAMEDesc=Username+for+Cusdis+dashboard&PASSWORDDesc=Password+for+Cusdis+dashboard&NEXTAUTH_URLDesc=The+domain+for+your+Cusdis+app.+You+can+set+this+after+the+initial+deployment.&PORTDesc=The+default+PORT.+Do+not+change+this.&NEXTAUTH_URLDefault=http%3A%2F%2Flocalhost%3A3000%2F&PORTDefault=3000)

After the initial deployment succeeds, your project will get a domain that you can use as your `NEXTAUTH_URL` environment variable. Railway will then automatically re-deploy your project and you should then be able to use your Cusdis instance.

## Environment variables reference

- **JWT_SECRET**: Secret key to sign JWT tokens.
- **USERNAME**: Username for Cusdis dashboard
- **PASSWORD**: Password for Cusdis dashboard
- **NEXTAUTH_URL**: Initially set to `http://localhost:3000/` as a placeholder but should be updated after initial deployment.
- **PORT**: Already set to `3000`. **Do not change this**.
