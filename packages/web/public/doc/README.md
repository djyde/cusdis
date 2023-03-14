# Cusdis

Open-source, lightweight (~5kb gzipped), privacy-friendly alternative to Disqus.


## Features

- Universal embed code
  - You can embed Cusdis on every website.
- Light-weight sdk
  - The SDK that embed to your website is only 5kb (gzipped). Compared to Disqus (which is 24kb gzipped), it's very light-weight.
- Email notification
- One-click import data from Disqus
- Moderation dashboard
  - Since we don't require user sign in to comment, all comments are NOT displayed by default, until the moderator approve it. We provide a moderation dashboard for it.

There are two ways to use Cusdis:

## Self host

_Pros: You own your data_

You can install Cusdis on your own server, just follow this [installation guide](/self-host/vercel.md)

## Hosted service

_Pros: Easy to use_

You can also use our [hosted service](https://cusdis.com/dashboard). We host our service on [Vercel](https://vercel.com), the data is stored on a PostgreSQL database.

## Compared to Disqus

Cusdis is not designed for a FULLY alternative to Disqus, it's aim to implement a minimist embed comment tool for small sites (like your static blog). 

Below are the pros and cons of Cusdis:

### Pros

- Cusdis is open-source and self-hostable, you own your data.
- The SDK is lightweight (~5kb gzipped)
- Cusdis doesn't required commenter to sign in. We don't use cookies at all.

### Cons

- Cusdis is on early development stage
- You have to manually moderate comments which are not display by default until you approve it, since we dont't have a spam filter.
- Disqus is a company, we aren't.
