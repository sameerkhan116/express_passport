# Express_Passport

![screenshot](https://preview.ibb.co/nPeCgn/Screen_Shot_2018_04_17_at_10_40_26_AM.png)

## Instructions:

1.  Install packages using `npm` or `yarn`.
2.  Set up a variables.env file in the root of this app and add these environment variables to it.
    For DB, I recomment mlabs. PORT can be anything, mine was 5000. Session secret can also be any string.
    For client ids, create new github, twitter and google apps.
    Callbacks urls are http://127.0.0.1/auth/callback/{google|github|twitter}

```
PORT=
DB=
SESSION_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=
TWITTER_CLIENT_ID=
TWITTER_CLIENT_SECRET=
TWITTER_CALLBACK_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
```

3.  `npm/yarn start`

For the report, I recommend writing about `bcrypt-nodejs` library, how salt works in it, `passport` library etc.
Also, explain how OAuth2.0 works which we are using for logging in using github, facebook and twitter.
You can also write about protected routes in the project that use passport provided methods on the request such as req.isAuthenticated(), req.logout() etc.
