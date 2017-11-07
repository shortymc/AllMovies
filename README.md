# Angular QuickStart Source
[![Build Status][travis-badge]][travis-badge-url]

**This is not the perfect arrangement for your application. It is not designed for production.
It exists primarily to get you started quickly with learning and prototyping in Angular**

## Updating to a newer version of the Quickstart Repo

From time to time the QuickStart will be enhanced with support for new features or to reflect
changes to the [official Style Guide](https://angular.io/docs/ts/latest/guide/style-guide.html).

You can update your existing project to an up-to-date QuickStart by following these instructions:
- Create a new project using the [instructions below](#create-a-new-project-based-on-the-quickstart)
- Copy the code you have in your project's `main.ts` file onto `src/app/main.ts` in the new project
- Copy your old `app` folder into `src/app`
- Delete `src/app/main.ts` if you have one (we now use `src/main.ts` instead)
- Copy your old `index.html`, `styles.css` and `tsconfig.json` into `src/`
- Install all your third party dependencies
- Copy your old `e2e/` folder into `e2e/`
- Copy over any other files you added to your project
- Copy your old `.git` folder into your new project's root

Now you can continue working on the new project.

## Prerequisites

Node.js and npm are essential to Angular development. 
    
<a href="https://docs.npmjs.com/getting-started/installing-node" target="_blank" title="Installing Node.js and updating npm">
Get it now</a> if it's not already installed on your machine.
 
**Verify that you are running at least node `v4.x.x` and npm `3.x.x`**
by running `node -v` and `npm -v` in a terminal/console window.
Older versions produce errors.

We recommend [nvm](https://github.com/creationix/nvm) for managing multiple versions of node and npm.

## Create a new project based on the QuickStart

Clone this repo into new project folder (e.g., `my-proj`).
```shell
git clone https://github.com/angular/quickstart  my-proj
cd my-proj
```

[travis-badge]: https://travis-ci.org/angular/quickstart.svg?branch=master
[travis-badge-url]: https://travis-ci.org/angular/quickstart
