# Notification

## Hosted Service

Our [hosted service](https://cusdis.com/dashboard) comes with Email notification:

![](../images/email.png ':size=600')

As you can see in the mail content, you can even approve the comment without login.

### Disable notification by project

You can disable notification for specific project in `Websites` -> `Project` -> `Settings`:

![](../images/disable-notification-in-project.png ':size=400')

### Notification Preferences

You can change notification preferences (such as changing notification email address) in `User` -> `Settings`:

![](../images/advance-notification-settings.png ':size=400')

## Self-host

To enable Email notification in self-host Cusdis, you need to set SMTP configuration in environment variables:

- `SMTP_HOST` **required** SMTP host
- `SMTP_USER` **required** SMTP username
- `SMTP_PASSWORD` **required** SMTP password
- `SMTP_SENDER` **required** sender email address
- `SMTP_PORT` default: 587 SMTP port
- `SMTP_SECURE` default: `true` enable SMTP secure

> Remember to set `HOST` to your own domain name, in order to get the correct approve link and unsubscribe link in the Email content

### SMTP Configuration Examples

#### Gmail

First, visit [Google Account Security](https://myaccount.google.com/security) and make sure you have enabled the Two-factor Authentication.
Then, go to [application passwords](https://myaccount.google.com/apppasswords) and create a new password for Cusdis. The configurations would be as following:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your gmail email
SMTP_PASSWORD=<app password>
SMTP_SENDER=your gmail email
```

> The sender email MUST be the same as login user, but you can give it a display name by `John Doe <john.doe@gmail.com>`, the same applies for other SMTP services.

#### QQ mail

Follow [the help page](http://service.mail.qq.com/cgi-bin/help?subtype=1&&id=28&&no=1001256) to generate an authorization code, also make sure you have enabled the IMAP/SMTP service. The configurations would be as following:

```
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your qq mail
SMTP_PASSWORD=<authorization code>
SMTP_SENDER=your qq mail
```

#### 163 mail

Similarly, you need an authorization code to use SMTP service, follow [this page](https://help.mail.163.com/faqDetail.do?code=d7a5dc8471cd0c0e8b4b8f4f8e49998b374173cfe9171305fa1ce630d7f67ac2cda80145a1742516) to create one. The configurations would be as following:

```
SMTP_HOST=smtp.163.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your 163 mail
SMTP_PASSWORD=<authorization code>
SMTP_SENDER=your 163 mail
```
