require('dotenv').config();
const express = require('express');
// const multer = require('multer');

const router = require ('./BACK/app/router');

const PORT = process.env.PORT || 5050;
const app = express();

//Middleware pour le req.body
app.use(express.urlencoded({extended: true}));

app.use(router);

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});