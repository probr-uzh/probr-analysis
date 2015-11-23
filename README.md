# probr-analysis: analysis webapp for probr

This is the analysis application for the [probr WiFi tracking system](https://github.com/probr)

It is a master student research project at the [Communication Systems Group](http://www.csg.uzh.ch) of the  [Department of Informatics](http://www.ifi.uzh.ch), at the [University of Zurich](http://www.uzh.ch), Switzerland.



## probr-analysis

The probr-analysis web application allows its users to inspect and analyze the data collected by the [probr-core](https://github.com/probr/probr-core) sniffing component. It connects to the MongoDB being fed by probr-core. Probr-analysis not only displays the data in a dashboard-like fashion, but also aggregates and computes interesting analytic results through techniques such as MapReduce.


### Technology

To build and run the application you will need:

* [NodeJS version 0.10](https://nodejs.org/en/)
* [NPM](https://www.npmjs.com/)
* [Bower](http://bower.io/)
* [MongoDB](https://www.mongodb.org/)
* [Redis](http://redis.io/)

Also, to have the best user experience, including live modes and analysis, you should have a running set-up of probr-core, as described [here](https://github.com/probr/probr-core).



## Getting started
Make sure probr-core runs and collects data.


Make sure your mongo deamon runs:

```
mongod &
```

Also, start your redis server:

```
redis-server &
```

After cloning the repo and going into the `probr-analysis` directory:

```
npm install
```

After the installation of the npm dependencies has finished, install the bower dependencies:

```
bower install
```

These steps will also install [Grunt](http://gruntjs.com/). Our project comes with preconfigured grunt tasks, so you can run:

```
grunt build
```

To start the application, run:

```
grunt serve
```

The application should now be reachable under [http://localhost:9000](http://localhost:9000).
