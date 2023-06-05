require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const { initializeWebSocket } = require('./socketHandler');

const app = express();
const server = http.createServer(app);

// Handle CORS + middleware
// TODO: Extract
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE"); // If using .fetch and not axios
  res.header("Access-Control-Allow-Headers", "auth-token, Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// app.use(bodyParser({limit: '5mb'}));
app.use(bodyParser.json({limit: '5mb', extended: true}));

// DB Stuff
const mongoUri = process.env.MONGO_DB_CONNECTION_URL;
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('DB connected...');
  })
  .catch((error) => {
    console.error(`Error, while connecting to MongoDB`, error);
  });

// Routes
const RoomsRoute = require('./routes/Rooms');
app.use('/rooms', RoomsRoute);

// Initialize WebSocket
initializeWebSocket(server);

// Start Server
server.listen(process.env.PORT || 3001, () => {
  console.log(`Listening at ${process.env.PORT}...`);
});
