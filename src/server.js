/* Imports */
const express = require('express');
const { urlencoded, json } = require('body-parser');
const cors = require('cors');
const { port } = require('./config');
const dbConnect = require('./util/db');
const { studentSignup, studentSignin, studentProtect } = require('./util/auth');
const {tnpSingin,tnpProtect}  = require('./util/tnp/tnp.auth');

const studentRouter = require('./resources/student/student.router');
const tnpRouter = require('./resources/tnp/tnp.router');

/* Initialise Express */
const app = express();

/* Mount Middleware */
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

/* Auth */
app.post('/api/signup/student', studentSignup);
app.post('/api/signin/student', studentSignin);
app.post('/api/tnp/signin',tnpSingin);

/* Routes */
app.use('/api/student', studentProtect, studentRouter);
app.use('/api/tnp', tnpProtect, tnpRouter);


/* Exports */
module.exports = async function () {
  app.listen(port, async function () {
    try {
      await dbConnect();
      console.log(`🚀 server on http://localhost:${port}`);
    } catch (e) {
      console.error(e);
    }
  });
};
