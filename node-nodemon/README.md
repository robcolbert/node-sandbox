# node-nodemon

An extremely basic demonstration of using [nodemon](https://nodemon.io/) to monitor your project files for changes and re-load your Node.js server when they do.

This is very useful when working on your server scripts. As you save your files, your server will automatically restart for you.

## Getting started

In this directory, run the following commands:

```sh
yarn

yarn run develop
```

You should see the program text output with a prompt similar to:

```sh
[nodemon] clean exit - waiting for changes before restart
```

Go ahead and make a change to index.js and save the file. Nodemon will automatically kill Node.js if needed, then restart it to run your script.