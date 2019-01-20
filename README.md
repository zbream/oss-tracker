# OSS Issue & Project Tracker

One-stop shop for tracking open-source software dependencies, for individuals or teams.
Entirely hosted in [Firebase](https://firebase.google.com/).

![Demo Image](https://raw.githubusercontent.com/zbream/oss-tracker/assets/demo.png)

## Features

* Add GitHub issue by URL.
  * Automatically fetch metadata and status.
  * Quick links to repo and issue.
* Add project by NPM project name.
  * Automatically fetch latest/next version.
  * Quick links to repo and changelog.
* Lists shared among all team members, with live updates.

## Setup

1. Create the project.

Create a new project at <https://firebase.google.com/>. 
This project requires the **Blaze** plan, to allow functions to make external HTTP calls.
Find the **web app** application configuration.

Run the following:

```
firebase use <projectId>
```

2. Configure the server.

Generate a [GitHub Personal Access Token](https://github.com/settings/tokens) for issue retrieval. As it's only accessing public information, no additional scopes are necessary.

Run the following:

```
firebase functions:config:set github.token="<token>"
```

3. Configure the client.

Open the `/src/environments/environment.prod.ts` file.
Paste in the Firebase configuration block.

4. Publish!

Simply run `npm run publish` to build and deploy.
