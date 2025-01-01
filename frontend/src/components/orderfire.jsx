const axios = require("axios");

const headers = {
  "request-info":
    '{"rit":"123","cver":"1.0v","ch":"WEB","info":{},"reqts":"12345678","payload":[]}',
  "x-api-key": "E6J9HA1BA31EJK90IK12KL80BBRRN590",
  "Content-Type": "application/json",
};

const placeOrder = async () => {
  try {
    console.log("Placing Order...");

    // Example order payload. You can replace with dynamic data based on Step 5 response.
    const orderPayload = {
      payload: [
        {
          requestStatus: "New",
          ex: "NCM",
          seg: "EQ",
          sId: "42187",
          dpAccNo: "1207020000015627",
          buySell: "B", // Buy or Sell - Modify as needed
          qty: 1,
          price: "0.00", // Market price
          type: "MKT", // Market Order
          disQty: 0,
          tPrice: "0.00",
          val: "GFD", // Good For Day
          pId: "Delivery",
          goalId: "",
          orderId: "",
          valDate: 0,
          userId: "",
          productName: "",
        },
      ],
    };

    const orderResponse = await axios.post(
      "https://uat-api-algo.tradebulls.in/ms-order-placement/push", // Update with actual order placement endpoint
      orderPayload,
      { headers }
    );

    if (orderResponse.status === 200) {
      //console.log("Order placed successfully:", orderResponse.data);

      await fetchOrderReport();
    } else {
      console.error(
        "Failed to place order. Status Code:",
        orderResponse.status
      );
    }
  } catch (error) {
    console.error("An error occurred while placing the order:", error.message);
  }
};

const fetchOrderReport = async () => {
  try {
    console.log("Fetching Order Report...");

    const response = await axios.get(
      "https://uat-api-algo.tradebulls.in/ms-order-report/order/ps",
      { headers }
    );

    if (response.status === 200) {
      const orderReportData = response.data?.data?.success;

      if (orderReportData) {
        console.log("Order Report Data:", orderReportData);
      } else {
        console.error("No data found in Order Report response.");
      }
    } else {
      console.error(
        "Failed to fetch Order Report. Status Code:",
        response.status
      );
    }
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      console.error("Status code:", error.response.status);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error:", error.message);
    }
  }
};
