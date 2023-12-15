/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useEffect } from "react";
import { ORDERS } from "../constants/ApiEndPoints";
import { useGetOrders } from "../hooks/hooks";
import { Bar } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "./HomeDashboard.css";

Chart.register(CategoryScale);

const today = new Date();
const oneYearAgo = new Date(today);
oneYearAgo.setFullYear(today.getFullYear() - 1);
const baseFilter = { startDate: oneYearAgo, endDate: today };

const HomeDashboard = () => {
  const [filter, setFilter] = useState(baseFilter);
  const {
    data: orders,
    error: orderError,
    loading: orderFetching,
    fetchData: getOrders,
  } = useGetOrders();

  const fetchAllOrdrs = async (url) => {
    await getOrders(url);
  };

  const ordersWithitemType = (itemType) => {
    return orders?.filter((order) => order?.itemType === itemType);
  };

  const ordersWithOrderStatus = (orderStatus) => {
    return orders?.filter((order) => order?.orderState === orderStatus);
  };

  const barDataAccToItem = () => {
    const data = [
      ordersWithitemType("CAKE")?.length,
      ordersWithitemType("COOKIES")?.length,
      ordersWithitemType("MUFFINS")?.length,
    ];
    return data;
  };

  const barDataAccToOrderStatus = () => {
    const data = [
      ordersWithOrderStatus("CREATED")?.length,
      ordersWithOrderStatus("SHIPPED")?.length,
      ordersWithOrderStatus("DELIVERED")?.length,
      ordersWithOrderStatus("CANCELLED")?.length,
    ];
    return data;
  };

  const setParamsInUrl = () => {
    let baseUrl = ORDERS.GET_ALL_ORDERS;
    if (filter?.startDate) {
      baseUrl = `${baseUrl}?startDate=${new Date(
        filter.startDate
      ).toLocaleDateString()}`;
    }
    if (filter?.endDate) {
      baseUrl = `${baseUrl}&endDate=${new Date(
        filter.endDate
      ).toLocaleDateString()}`;
    }
    return baseUrl;
  };

  useEffect(() => {
    const url = setParamsInUrl();
    fetchAllOrdrs(url);
  }, [filter]);

  return (
    <div>
      <div>
        Start Date :
        <DatePicker
          selected={filter.startDate}
          onChange={(date) => {
            setFilter({ ...filter, startDate: date });
          }}
          className="dateField"
        />
        End Date:
        <DatePicker
          selected={filter.endDate}
          onChange={(date) => {
            setFilter({ ...filter, endDate: date });
          }}
        />
      </div>
      {orderFetching ? (
        <h3 className="loadingTextStyle">Loading ....</h3>
      ) : orderError ? (
        <h3 className="loadingTextStyle">Something Went Wrong !!!</h3>
      ) : (
        <div className="barsContainer">
          <div className="barContainer">
            <Bar
              data={{
                labels: ["Cake", "Cookies", "Muffins"],
                datasets: [
                  {
                    label: "Orders by item-type",
                    data: barDataAccToItem(),
                    backgroundColor: [
                      "rgba(255, 99, 132, 0.2)",
                      "rgba(255, 159, 64, 0.2)",
                      "rgba(255, 205, 86, 0.2)",
                    ],
                  },
                ],
              }}
            />
          </div>
          <div className="barContainer">
            <Bar
              data={{
                labels: ["Created", "Shipped", "Delivered", "Cancelled"],
                datasets: [
                  {
                    label: "Orders by order-state",
                    data: barDataAccToOrderStatus(),
                    backgroundColor: [
                      "rgba(75, 192, 192, 0.2)",
                      "rgba(54, 162, 235, 0.2)",
                      "rgba(153, 102, 255, 0.2)",
                      "rgba(201, 203, 207, 0.2)",
                    ],
                  },
                ],
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeDashboard;
