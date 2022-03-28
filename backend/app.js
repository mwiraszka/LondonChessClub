const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const articlesRoutes = require('./routes/articles');
const membersRoutes = require('./routes/members');

const app = express();

mongoose
  .connect(
    'mongodb+srv://admin:ahDMMpoDjiMPUsF4@cluster0.vpasq.mongodb.net/lcc?retryWrites=true&w=majority'
  )
  .then(() => {
    console.log('[Backend App] Successfully connected to database');
  })
  .catch(() => {
    console.error('[Backend App] Connection to database failed');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/images', express.static(path.join('backend/images/')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});

app.use('/api/articles', articlesRoutes);
app.use('/api/members', membersRoutes);

module.exports = app;
