const express = require("express");
const helmet = require("helmet");
const apiRouter = require("./api-router.js");
const configureMiddleware = require("./configure-middleware.js");

const server = express();
const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);

const sessionOptions = {
  name: "john", // default sid
  secret: "keep it  a secret",
  cookie: {
    maxAge: 1000 * 60 * 60, // How long the cookie is valid in ms
    secure: false, // HTTPS is necessary for secure cookies, True in production
    httpOnly: true // Cookie cannot be accessed in js
  },
  resave: false, // Forces the session to be saved back to the session store
  saveUninitialized: false, // Forces session that is uninitialized to be saved to the store

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
