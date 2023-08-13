require('dotenv').config()

const express = require('express')
const app = express()
const port = 3001
const errorHandler = require("./src/middlewares/errorhandler.js");
const router = require("./src/routes/index.js");
const cors = require('cors')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// ROUTER
app.use(router);
app.use(errorHandler)
app.use("/uploads", express.static("uploads"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})