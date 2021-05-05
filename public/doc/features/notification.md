# Notification

## Hosted Service

Our [hosted service](https://cusdis.com/dashboard) comes with Email notification:

![](../images/email.png ':size=600')

As you can see in the mail content, you can even approve the comment without login.

### Disable notificaton by project

You can disable notification for specific project in `Webistes` -> `Project` -> `Settings`:

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