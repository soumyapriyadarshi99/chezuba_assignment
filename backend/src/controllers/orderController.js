const express = require("express");
const orderController = express.Router();
const Order = require("../models/orders");

//create an order
orderController.post("/", async (req, res) => {
  try {
    const body = req?.body;
    const newBody = { ...body, lastUpdatedTIme: new Date() };
    const order = new Order(newBody);
    const savedOrder = await order.save();
    res
      .status(201)
      .json({ success: true, message: "created", id: savedOrder?._id });
  } catch (err) {
    res.status(417).json({ success: false, error: err });
  }
});

//get orders by criteria
//if you want to want to get all orders dont pass any
orderController.get("/", async (req, res) => {
  try {
    const { itemType, orderState, region, startDate, endDate } = req?.query;
    let filter = {};
    if (itemType) {
      filter.itemType = itemType;
    }
    if (orderState) {
      filter.orderState = orderState;
    }
    if (region) {
      filter.branchId = region;
    }
    if (startDate) {
      if (!endDate) {
        endDate = new Date();
      }
      let localStartDate = new Date(startDate);
      let localEndDate = new Date(endDate);

      // Adjust for local time zone
      localStartDate.setHours(
        localStartDate.getHours() + 5,
        localStartDate.getMinutes() + 30,
        0,
        0
      );
      localEndDate.setHours(
        localEndDate.getHours() + 5,
        localEndDate.getMinutes() + 30,
        0,
        0
      );

      // Set the time to the beginning of the day for startDate to remove time
      localStartDate.setHours(0, 0, 0, 0);

      // Set the time to the end of the day for endDate to remove time
      localEndDate.setHours(23, 59, 59, 999);

      filter.lastUpdatedTIme = {
        $gte: new Date(localStartDate),
        $lte: new Date(localEndDate),
      };
    }
    const orders = await Order.find(filter);
    res.status(200).send(orders);
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

//get order details by id
orderController.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req?.params?.id);
    res.status(200).send(order);
  } catch (err) {
    res.status(404).json({ success: false, error: err });
  }
});

module.exports = orderController;
