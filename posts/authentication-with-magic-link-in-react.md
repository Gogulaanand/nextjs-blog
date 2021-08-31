---
title: "Authentication with magic link in React"
date: "2021-08-14"
description: "Authenticating users via magic link is on the rise recently (for a good reason). Magic link is the way of sending users a unique link..."
---

Authenticating users via magic link is on the rise recently (for a good reason). Magic link is the way of sending users a unique link to their mail, using which they can signup / login. It removes the need for username, password, activation email, forgot password scenarios etc.

[magic.link](https://magic.link) offers an npm package which we can plug into our app and have an auth system setup in few minutes.

Lets begin :rocket:

## Installation:

```js
npm i magic-sdk
```

## Import and initialise magic

```js
import { Magic } from "magic-sdk";

const [user, setUser] = useState(null);

useEffect(() => {
  magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY);
}, []);
```

`NEXT_PUBLIC_MAGIC_API_KEY` is the api key provided by magic.link, stored in local environment.

### User login

```js
const loginUser = async (email) => {
  try {
    await magic.auth.loginWithMagicLink({ email });
    setUser(email);
    router.push("/");
  } catch (err) {
    setUser(null);
    throw new Error("Email login failed");
  }
};
```

### To verify user session:

Once a user has clicked the magic link received in his mail and completed the authentication, magic would automatically store the user meta data in your site's localstorage/cookies. We simply need to use the inbuilt function to fetch the stored session token and user's data which is email here.

```js
const checkUserLoggedIn = async () => {
  try {
    const isLoggedIn = await magic.user.isLoggedIn();
    if (isLoggedIn) {
      const { email } = await magic.user.getMetadata();
      setUser(email);
      getToken();
    }
  } catch (err) {
    throw new Error("User is not logged in");
  }
};

const getToken = async () => {
  try {
    return await magic.user.getIdToken();
  } catch (err) {
    throw new Error("Authenticate current session failed");
  }
};
```

Invoke `checkUserLoggedIn()` inside useEffect hook.

### User logout:

```js
const logoutUser = async () => {
  try {
    await magic.user.logout();
    setUser(null);
    router.push("/");
  } catch (err) {
    throw new Error("User logout failed");
  }
};
```

## Oauth login:

You can follow the quick setup [guide](https://magic.link/docs/social-login/google--gmail) for social login under your magic account. (Trust me, it is not a long guide. It just takes couple of minutes :smile:) Once done, we can setup oauth login in our app.

### Installation:

```js
npm i @magic-ext/oauth
```

A minor change to our magic initialisation to support oauth.

```js
import { OAuthExtension } from "@magic-ext/oauth";

useEffect(() => {
  magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY, {
    extensions: [new OAuthExtension()],
  });
}, []);
```

```js
const oauthLogin = async (e) => {
  e.preventDefault();

  // Start the Google OAuth 2.0 flow!
  await magic.oauth.loginWithRedirect({
    provider: "google",
    redirectURI: `${window.location.origin}/oauth`,
  });
};
```

Invoke above method when the user clicks on the 'Sign in with Google' button. Here, i have provided `redirectURI` as `/oauth`. Once the google login is complete, magic will redirect to this endpoint of our website. We can have a success page under that endpoint or just redirect to hompage simply using `/` instead `/oauth`

Some additional logic to add to our useEffect hook:

```js
useEffect(() => {
  magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY, {
    extensions: [new OAuthExtension()],
  });

  const render = async () => {
    if (window.location.pathname === "/oauth") {
      try {
        const result = await magic.oauth.getRedirectResult();
        const profile = JSON.stringify(result.oauth.userInfo, undefined, 2);
        if (profile.email) {
          setUser(profile.email);
          router.push("/");
        }
      } catch {
        window.location.href = window.location.origin;
        throw new Error("Oauth login failed");
      }
    }

    checkUserLoggedIn();
  };
  render();
}, []);
```

The only new thing here is the `render()` method inside useEffect. It checks if current url is `/oauth`, then fetches the user details obtained via oauth login. The `profile` varibable contains many details, but for simplicity, here we are using only the email.

And...
That's it. :tada:
We have an email and google login setup for our app/website.
Without the worries of the problems that passwords bring in. :relieved:

Credits: Cover Photo by <a href="https://unsplash.com/@franckinjapan?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Franck</a> on <a href="https://unsplash.com/s/photos/security?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

:pushpin: magic.link provides 10000 free logins currently which supports hobby/pet projects suffciently. If you are interested and want to checkout magic, [signup here](https://magic.link/invite/r/y23Yr92Fo9mq8joV) :wink:
