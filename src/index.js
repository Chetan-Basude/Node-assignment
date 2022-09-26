const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();

const port = process.env.PORT || 5000;
const mongo_url = process.env.MONGODB_URL;
let server;
mongoose
  .connect(mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to mongoDB');
    server = app.listen(port, () => {
      console.log(`Listening to port ${port}`);
    });
  });
