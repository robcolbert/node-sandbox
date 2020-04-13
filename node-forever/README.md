# node-forever

Shows how to integrate [forever](https://www.npmjs.com/package/forever) into your project to help control your server during development (restart on file change) as well as in production (restart if it crashes).

## Getting started

In this directory, run:

```sh
yarn

yarn start
```

Your server will be started in the background. Open `https://localhost:3000/` in your browser to see it's one line of output text.

Change that line of text and save the file. Reload the page. Nothing happens because `forever` is not running in watch mode. `yarn start` is set up to call `forever start ./forever/webapp.json` which runs it more of a "production" mode.

```sh
yarn start develop
```

will start `forever ./forever/webapp.develop.json`. It will also keep the process in the foreground. Now, you save your file(s) and `forever` will restart your server.

Here is what's different between those two commands:

1. `forever start ...` will background your process and watch over it to restart it if it exits.
1. `forever ...` will run the process in the foreground until you press Ctrl+C to quit.
1. A different options file is started which contains extra options to configure watch mode.

## ./forever/webapp.json

```json
{
  "script": "index.js"
}
```

There are many other options available (read the `forever` docs). This simply sets the name of the script to run, and that is what forever does. It runs the script. Forever. Even if it exits, crashes, etc. It will re-start it...forever.

## ./forever/webapp.develop.json

```json
{
  "script": "index.js",
  "watch": true,
  "watchDirectory": "/home/rob/projects/sandbox/node-sandbox/node-forever",
  "sourceDir": "/home/rob/projects/sandbox/node-sandbox/node-forever"
}
```

This `forever` options file enables `watch` mode and points `forever` at correct directories on my machine. Your paths will likely need to be different unless you happen to be working in `/home/rob/projects/sandbox/node-sandbox/node-forever`. But, I won't blame or even yell at you if you don't. Freedom is good. Just edit the file(s) to point at where you're working and all should be fine.

Or, not.