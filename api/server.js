const express = require("express");
const helmet = require("helmet");
const apiRouter = require("./api-router.js");
const configureMiddleware = require("./configure-middleware.js");

const server = express();
const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);

const sessionOptions = {
  name: "joe", 
  secret: "keep it  a secret",
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false, 
    httpOnly: true 
  },
  resave: false, 
  saveUninitialized: false, 

  store: new knexSessionStore({
    knex: require("../database/dbConfig"),
    tablename: "session",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};

configureMiddleware(server);

server.use(helmet());
server.use(express.json());
server.use(session(sessionOptions));



server.use("/api", apiRouter);

module.exports = server;
