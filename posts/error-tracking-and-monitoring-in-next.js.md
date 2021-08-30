---
title: "Error tracking and monitoring in Next.js"
date: "2021-08-15"
---

Error tracking and performance monitoring is crucial to any application running in production. Simply because we cant expect the end user to report every issue they face and it is our responsibility to proactively check for errors and fix them for better user experience.

In Next.js, it is very easy to setup error tracking in couple of minutes with [Sentry](https://sentry.io)

Lets begin :rocket:

#### Setup

```js
// install sentry's nextjs sdk
npm install --save @sentry/nextjs

// run the setup wizard
// We need to have an account with sentry before running
// setup as it will open login window in browser
npx @sentry/wizard -i nextjs
```

We can allow sentry to capture errors in couple of ways.

1.Error object:

```js
try {
  aFunctionThatMightFail();
} catch (err) {
  throw new Error(err);
}
```

2.Use Sentry's methods to capture the error:

```js
import * as Sentry from "@sentry/nextjs";

try {
  aFunctionThatMightFail();
} catch (err) {
  Sentry.captureException(err);
}
```

Alternatively, we can use React's [Error boundary](https://reactjs.org/docs/error-boundaries.html) to log the error to Sentry

```js
import * as Sentry from "@sentry/nextjs";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // we can log error or errorInfo to Sentry here.
    // errorInfo will contain the details
    // and stack trace which is better for debugging

    Sentry.captureException(errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

And...
We are done. :tada:
Now the Sentry SDK will automatically capture unhandled errors and promise rejections, and monitor performance in the client.

---

##### Lets have a look at what Sentry offers:

<p></p>

<figure>
<img src="https://dev-to-uploads.s3.amazonaws.com/uploads/articles/59zeif11a7itanhevibk.png" alt="Main sentry dashboard">
<figcaption>Main dashboard</figcaption>
</figure>

---

<figure>
<img src="https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lxlhq9d3gobogo81egxp.png" alt="Issues dashboard of sentry">
<figcaption>Issues dashboard</figcaption>
</figure>

We get an overview of all the issues at one place. We can also view release wise report.

Once, while checking something in my local, some error flashed up during page transition for a second and then disappeared. I couldnt reproduce it again, log was not available in terminal or browser console but it was logged in sentry with full error trace :smile:

---

<figure>
<img src="https://dev-to-uploads.s3.amazonaws.com/uploads/articles/60l1pj293fxbex84z8ab.png" alt="Performance dashboard of sentry">
<figcaption>Performance dashboard (Similar to Chrome's Light House performance report)</figcaption>
</figure>

---

:pushpin: We get active support for sentry in next.js which is a good thing in the long run (eg: Recent update: [Next.js v11.1](https://nextjs.org/blog/next-11-1)). To explore more, checkout [Sentry's guide for nextjs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

Credits: Cover Photo by <a href="https://unsplash.com/@lukechesser?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Luke Chesser</a> on <a href="https://unsplash.com/s/photos/monitoring?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
