# node-express-mongoose

This is a sample application showing the absolute basics of wiring up ExpressJS and MongoDB in Node.js to provide the absolute basics of a web application.

## Getting Started

Run `yarn` in the root directory of this project to install the Node.js dependency modules required for it's operation. This includes ExpressJS, the Mongoose library for connecting to MongoDB and defining models, and a few other useful libraries.

Next, run `yarn start` to start the web server. It will first connect to MongoDB, then it will bind a TCP socket and begin listening for HTTP requests.

Open your browser and go to `http://localhost:3000/`. You should see an extremely basic web page. The app is self-explanatory from there.

## Up next: git flow

We're going to learn how to create a feature branch and work on a new feature in that feature branch. When we are done with the feature, we will merge it into this `develop` branch.