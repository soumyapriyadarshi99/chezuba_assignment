const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const dbConnection = require("./utils/dbConnection");
const orderController = require("./controllers/orderController");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(router);
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//to connect with db
dbConnection();

router.use("/api/orders", orderController);

//to check connection
app.get("/", (req, res) => res.status(200).send("Working fine"));

const PORT = 5000;
app.listen(PORT, () => console.log(`APP is running on port ${PORT}`));
