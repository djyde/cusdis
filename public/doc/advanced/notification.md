# Notification

> Origin dicussion about notification feature: https://github.com/djyde/cusdis/issues/9

Instead of checking new comments on dashboard, you may want to receive notification when a new comment comes in.

## API for fetching latest comments

This is a pull-based solution to receive latest comments, by calling an API. You can get this API on `Dashboard` -> `Notification` -> `Latest Comments API`:

![](../images/notification.png ':size=400')

This API fetches latest comments of the project. Once you call this API, the returned comments will be marked as read. They won't be returned in the next API call.

You can build a server, run a cron job to call this API every hour. When fetch new comments, do whatever you want (such as send a message to your bot) with the comments.

![](../images/pull-based-notification.png ':size=700')

### Response Reference

```ts
{
  comments: Array<{
    content: string,
    by_email: string,
    by_nickname: string,
    created_at: string
  }>
}
```

## Webhook

Comming soon...

## Email Notification (hosted service only)

Comming soon...