// server.js
const express = require("express");
const cors = require("cors");
const { login } = require("./logic"); // Import the login function from logic.js
const { connectAliceBlue } = require("./aliceBlueConnector");
const path = require("path"); // Import the path module
const Papa = require("papaparse");
const fs = require("fs"); // Import the fs module
const { SmartAPI, WebSocketV2 } = require("smartapi-javascript");
const WebSocket = require("ws");
const axios = require("axios");
const csvParser = require("csv-parser");
const crypto = require("crypto");
const csv = require("csv-parser"); // Example for csv-parser

const app = express();
const port = 5007;

const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log("WebSocket server running on ws://localhost:8080");
});

// CORS configuration to allow specific origins
app.use(cors());
app.use(express.json());

function logPayloadWithTypes(payload) {
  console.log("Logging Payload with Data Types:");

  // If payload is an object
  if (typeof payload === "object" && !Array.isArray(payload)) {
    for (const [key, value] of Object.entries(payload)) {
      console.log(`${key}: ${value} (type: ${typeof value})`);
    }
  }

  // If payload is an array
  else if (Array.isArray(payload)) {
    payload.forEach((item, index) => {
      console.log(`Item ${index}:`);
      logPayloadWithTypes(item); // Recursive logging for nested objects
    });
  }

  // If payload is a primitive value
  else {
    console.log(`Payload: ${payload} (type: ${typeof payload})`);
  }
}

function broadcastToClients(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
// Handle WebSocket connections
wss.on("connection", (ws) => {
  console.log("Frontend connected via WebSocket");

  ws.on("close", () => {
    console.log("Frontend WebSocket connection closed");
  });
});

app.get("/download/merged_output", (req, res) => {
  const filePath = path.resolve(__dirname, "merged_output.csv");

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    console.error("File not found:", filePath);
    return res.status(404).send("File not found.");
  }

  // Download the file
  res.download(filePath, "merged_output", (err) => {
    if (err) {
      console.error("Error sending the file:", err);
      res.status(500).send("Error downloading the file.");
    }
  });
});

const headers = {
  "request-info":
    '{"rit":"123","cver":"1.0v","ch":"WEB","info":{},"reqts":"12345678","payload":[]}',
  "x-api-key": "E6J9HA1BA31EJK90IK12KL80BBRRN590",
  "Content-Type": "application/json",
};

const placeOrder = async (ex, seg, tk, sId, dpAccNo, buySell, qty, price, type, tPrice, pId, userId, decryptedAccessToken, target, stopLoss, trailingStopLoss, activeTab) => {
  try {
    console.log("Placing Order...");
    console.log("Placing Order...");
    console.log('ex ->', ex);
    console.log('seg ->', seg);
    console.log('sId->', sId);
    console.log('tk->', tk);
    console.log('dpAccNo->', dpAccNo);
    console.log('BuySell->', buySell);
    console.log('qty->', qty);
    console.log('price->', price);
    console.log('type->', type);
    console.log('triggerPrice->', tPrice);
    console.log('Pid->', pId);
    console.log('userId->', userId);
    console.log('decryptedAccessToken->', decryptedAccessToken);
    console.log('target', target);
    console.log('stopLoss', stopLoss);
    console.log('Trailing StopLoss', trailingStopLoss);
    console.log('ActiveTab ->', activeTab);
    // Example order payload. You can replace with dynamic data based on Step 5 response.
    let orderPayload = null;
    if (activeTab === 'Regular') {
      if (type === 'MKT') {
        price = "0.00";
        console.log('price , type ->', price, type);

      }
      orderPayload = {
        payload: [
          {
            requestStatus: "New",
            ex: ex,
            seg: seg,
            sId: sId,
            tk: tk,
            dpAccNo: dpAccNo,
            buySell: buySell, // Buy or Sell - Modify as needed
            qty: qty,
            price: price, // Market price
            type: type, // Market Order
            disQty: 0,
            tPrice: "0.00",
            val: "GFD", // Good For Day
            pId: pId,
            goalId: "",
            orderId: "",
            valDate: 0,
            userId: "",
            productName: ""


          },
        ],

        // payload: [
        //   {
        //     requestStatus: "New",
        //     ex: "NCM",
        //     seg: "EQ",
        //     tk: "7",
        //     sId: "39422",
        //     dpAccNo: "1207020000576586",
        //     buySell: "B", // Buy or Sell - Modify as needed
        //     qty: 1,
        //     price: "0.00", // Market price
        //     type: "MKT", // Market Order
        //     disQty: 0,
        //     tPrice: "0.00",
        //     val: "GFD", // Good For Day
        //     pId: "Delivery",
        //     goalId: "",
        //     orderId: "",
        //     valDate: 0,
        //     userId: "",
        //     productName: "",
        //   },
        // ],
      };
    }
    else if (activeTab === 'Bracket') {

      orderPayload = {
        payload: [
          {
            requestStatus: "New",
            ex: ex,
            seg: seg,
            sId: sId,
            tk: tk,
            dpAccNo: dpAccNo,
            buySell: buySell, // Buy or Sell - Modify as needed
            qty: qty,
            price: price, // Market price
            type: type, // Market Order
            disQty: 0,
            tPrice: tPrice,
            val: "GFD", // Good For Day
            pId: pId,
            goalId: "",
            orderId: "",
            valDate: 0,
            userId: "",
            productName: "",
            triggerOrderPrice: stopLoss,
            targetPrice: target


          },
        ],
      };
    }
    else {

      orderPayload = {

        payload: [
          {
            requestStatus: "New",
            ex: ex,
            seg: seg,
            sId: sId,
            tk: tk,
            dpAccNo: dpAccNo,
            buySell: buySell, // Buy or Sell - Modify as needed
            qty: qty,
            price: price, // Market price
            type: type, // Market Order
            disQty: 0,
            tPrice: tPrice,
            val: "GFD", // Good For Day
            pId: pId,
            goalId: "",
            orderId: "",
            valDate: 0,
            userId: "",
            productName: "",

          },
        ],
      };
    }
    //headers["Authorization"] = "Bearer 1fda53d0-8e62-48c6-a544-f59f717d5d58"
    headers['Authorization'] = `Bearer ${decryptedAccessToken}`
    console.log('headers --> ', headers);
    console.log('order payload --> ', orderPayload);
    logPayloadWithTypes(orderPayload);

    const orderResponse = await axios.post(
      "https://uat-api-algo.tradebulls.in/ms-order-placement/push", // Update with actual order placement endpoint
      orderPayload,
      { headers }
    );

    if (orderResponse.status === 200) {
      console.log("Order placed successfully:", orderResponse.data);

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



app.post("/api/order", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from the 'Bearer' header

  if (!token) {
    console.log("No token received");
    return res.status(400).json({ message: "Token is required" });
  }

  console.log("Received token:", token);

  const {
    orderType,
    productId,
    price,
    triggerPrice,
    quantity,
    buyOrSell,
    selectedClient,
    target,
    stopLoss,
    trailingStopLoss,
    activeTab
  } = req.body;

  console.log("Order details:", {
    orderType,
    productId,
    price,
    triggerPrice,
    quantity,
    buyOrSell,
    selectedClient,
    target,
    trailingStopLoss,
    activeTab
  });

  let ex, segment, Sid, isMTFApproved, isBKTAllowed;
  let dematAcc, decryptedAccessToken;

  // Search for the token in the CSV file
  const searchTokenInCSV = () =>
    new Promise((resolve, reject) => {
      let found = false;
      fs.createReadStream("merged_output.csv")
        .pipe(csv())
        .on("data", (row) => {
          if (row.token.toString() === token) {
            found = true;
            ex = row.shortCode || "NSE";
            segment = row.segment || "Equity";
            Sid = row.scripId || "12345";
            isMTFApproved = row.isMTFApproved;
            isBKTAllowed = row.isBKTAllowed;
            resolve();
          }
        })
        .on("end", () => {
          if (!found) reject(new Error("Token not found in merged_output.csv"));
        })
        .on("error", (error) => reject(error));
    });

  // Function to search for dematAcc and decryptedAccessToken in `dematAccounts.csv`
  const searchClientDetailsInCSV = () =>
    new Promise((resolve, reject) => {
      let found = false;
      fs.createReadStream("dematAccounts.csv")
        .pipe(csv())
        .on("data", (row) => {
          if (row.username && row.username.toString() === selectedClient) {
            found = true;
            dematAcc = row.dematAcc || "N/A";
            decryptedAccessToken = row.decryptedAccessToken || "N/A";
            resolve();
          }
        })
        .on("end", () => {
          if (!found) reject(new Error("Client not found in dematAccounts.csv"));
        })
        .on("error", (error) => reject(error));
    });

  try {
    // Search for the token in `merged_output.csv`
    await searchTokenInCSV();

    // Search for client details in `dematAccounts.csv`
    await searchClientDetailsInCSV();

    console.log("Order details after CSV search:", {
      orderType,
      productId,
      price,
      triggerPrice,
      quantity,
      buyOrSell,
      selectedClient,
      dematAcc,
      decryptedAccessToken,
      ex,
      segment,
      Sid,
      isMTFApproved,
      isBKTAllowed,
    });

    // Call placeOrder and fetchOrderReport
    await placeOrder(ex, segment, token, Sid, dematAcc, buyOrSell, quantity, price, orderType, triggerPrice, productId, selectedClient, decryptedAccessToken, target, stopLoss, trailingStopLoss, activeTab);
    await fetchOrderReport();

    // Send response back to the frontend
    res.status(200).json({
      message: "Order processed successfully",
      ex,
      segment,
      Sid,
      isMTFApproved,
      isBKTAllowed,
      dematAcc,
      decryptedAccessToken,
    });
  } catch (error) {
    console.error("Error processing the order:", error.message);
    res.status(500).json({ message: "Failed to process order", error: error.message });
  }
});

// POST route to handle login data
app.post("/api/data", async (req, res) => {
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    console.log("Received data from frontend:", { username, password });

    // Call the login function from logic.js and pass username & password
    const loginResponse = await login(username, password);

    // Check if login was successful
    if (loginResponse.status === "success") {
      // Send success response with the login data
      res.status(200).json({
        message: "Login successful",
        data: loginResponse.data,
      });
    } else {
      // Send unsuccessful login response
      res.status(401).json({
        message: loginResponse.message || "Login unsuccessful",
      });
    }
  } catch (error) {
    // Handle errors from login process
    res.status(500).json({
      message: "An error occurred during login",
      error: error.message,
    });
  }
});

app.post("/api/intlogin", (req, res) => {
  const { username, password } = req.body;

  // Check the credentials
  if (username === "mint" && password === "123") {
    return res.status(200).json({ message: "Login successful" });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

app.get("/save-csv", async (req, res) => {
  const url =
    "https://margincalculator.angelone.in/OpenAPI_File/files/OpenAPIScripMaster.json";
  const filePath = path.join(__dirname, "OpenAPIScripMaster.csv");

  try {
    console.log("Fetching JSON data...");
    const response = await axios.get(url);

    // Ensure the response contains valid data
    if (!response.data || typeof response.data !== "object") {
      throw new Error("Invalid JSON data fetched from the URL.");
    }

    console.log("Converting JSON to CSV...");
    // Convert JSON to CSV
    const csv = Papa.unparse(response.data);

    // Save the CSV file
    fs.writeFileSync(filePath, csv, "utf8");
    console.log(`CSV saved successfully at: ${filePath}`);

    res.status(200).send("CSV saved successfully in proper format!");
  } catch (error) {
    console.error("Error fetching or saving the CSV:", error.message);
    res.status(500).send("Failed to save CSV file.");
  }
});



const csvWriter = require("csv-write-stream");

// Encryption/Decryption Utility
class TBSAlgoEncryptDecrypt {
  static ALGORITHM = "aes-256-gcm";
  static GCM_IV_LENGTH = 12;
  static GCM_TAG_LENGTH = 16;

  static gcmDecrypt(encryptedData, secretKey) {
    const encryptedBuffer = Buffer.from(encryptedData, "base64");
    const iv = encryptedBuffer.slice(0, this.GCM_IV_LENGTH);
    const ciphertext = encryptedBuffer.slice(
      this.GCM_IV_LENGTH,
      encryptedBuffer.length - this.GCM_TAG_LENGTH
    );
    const authTag = encryptedBuffer.slice(
      encryptedBuffer.length - this.GCM_TAG_LENGTH
    );
    const decipher = crypto.createDecipheriv(
      this.ALGORITHM,
      Buffer.from(secretKey, "base64"),
      iv
    );
    decipher.setAuthTag(authTag);

    try {
      let decrypted = decipher.update(ciphertext, null, "utf8");
      decrypted += decipher.final("utf8");
      return decrypted;
    } catch (error) {
      console.error("Decryption failed:", error.message);
      throw error;
    }
  }
}

// URLs and Configuration
const urls = {
  login: "https://uat-api-algo.tradebulls.in/ms-algo-trading-authservice/login",
  sendOtp:
    "https://uat-api-algo.tradebulls.in/ms-algo-trading-authservice/sendOtp",
  verifyTotp:
    "https://uat-api-algo.tradebulls.in/ms-algo-trading-authservice/login2faTotp",
  customerProfile:
    "https://uat-api-algo.tradebulls.in/ms-trading-customer-profile/loggedinuser/profiledetails",
};

const getHeaders = () => ({
  "request-info":
    '{"rit":"123","cver":"1.0v","ch":"WEB","info":{},"reqts":"12345678","payload":[]}',
  "x-api-key": "E6J9HA1BA31EJK90IK12KL80BBRRN590",
  "Content-Type": "application/json",
});

const secretKey = "id+qipZHEPff/jNJPlyjKObYKcM+JWqzYFGGGzJh+mc=";

// CSV Reader Function
const readClientsFromCSV = async (filePath) => {
  return new Promise((resolve, reject) => {
    const clients = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        if (row.username && row.password) {
          clients.push(row);
        } else {
          console.warn(`Skipping invalid row: ${JSON.stringify(row)}`);
        }
      })
      .on("end", () => resolve(clients))
      .on("error", (err) => reject(err));
  });
};

const writeDematToCSV = (results) => {
  const writer = csvWriter({ headers: ["username", "dematAcc", "decryptedAccessToken"] });
  writer.pipe(fs.createWriteStream("dematAccounts.csv"));

  results.forEach((result) => {
    if (result.status === "Success") {
      writer.write([result.username, result.dematAcc, result.decryptedAccessToken]);
    }
  });

  writer.end();
};

// Client Processing Function
const processClient = async (client) => {
  const { username, password } = client;
  console.log(`Processing client: ${username}`);

  let loginToken = null;
  let otpToken = null;
  const headers = getHeaders();
  let dematAcc = null;
  let decryptedAccessToken = null;

  try {
    const loginResponse = await axios.post(
      urls.login,
      {
        username,
        password,
        clientId: "tbsenterpriseweb",
        appId: "1",
        vendorName: "MintMaster",
        state: "Mint",
      },
      { headers }
    );

    loginToken = loginResponse.data?.data?.success?.logintoken;
    if (!loginToken) throw new Error("Login token not found.");

    console.log(`Login Token for ${username}: ${loginToken}`);

    const otpResponse = await axios.post(
      urls.sendOtp,
      { payload: [{ logintoken: loginToken, product: "OTP2FA" }] },
      { headers }
    );

    otpToken = otpResponse.data?.data?.success?.otpToken;
    if (!otpToken) throw new Error("OTP token not found.");

    console.log(`OTP Token for ${username}: ${otpToken}`);

    const otpCode = 123456; // You may want to dynamically handle this
    console.log(`Using OTP Code for ${username}: ${otpCode}`);

    const totpResponse = await axios.post(
      urls.verifyTotp,
      { payload: [{ logintoken: loginToken, otp: otpCode, authFlag: "0" }] },
      { headers }
    );

    const encryptedAccessToken = totpResponse.data?.data?.success?.access_token;
    if (!encryptedAccessToken)
      throw new Error("Encrypted access token not found.");

    console.log(
      `Encrypted Access Token for ${username}: ${encryptedAccessToken}`
    );

    decryptedAccessToken = TBSAlgoEncryptDecrypt.gcmDecrypt(
      encryptedAccessToken,
      secretKey
    );

    headers.Authorization = `Bearer ${decryptedAccessToken}`;
    const profileResponse = await axios.get(urls.customerProfile, { headers });

    const customerProfile = profileResponse.data?.data?.success;
    if (!customerProfile) throw new Error("Customer profile not found.");

    console.log(`Customer Profile for ${username}:`, customerProfile);

    // Assuming dematAcc is part of the customer profile data
    dematAcc = customerProfile?.dematAcc;

    return {
      username,
      status: "Success",
      dematAcc, // Return dematAcc
      decryptedAccessToken, // Return decrypted access token
    };
  } catch (error) {
    console.error(`Error processing client ${username}: ${error.message}`);
    return {
      username,
      status: "Error",
      message: error.message,
    };
  }
};


// Login-All-Clients Route
app.post("/login-all-clients", async (req, res) => {
  try {
    const clients = await readClientsFromCSV("clients.csv");
    console.log("Finished reading clients.csv");

    const results = [];
    for (const client of clients) {
      const result = await processClient(client);
      results.push(result);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
    }

    writeDematToCSV(results); // Save results to CSV

    res.status(200).json({ success: true, results });
  } catch (error) {
    console.error("An error occurred:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to process clients." });
  }
});

const filePath = path.join(__dirname, "dematAccounts.csv"); // Adjust the filename if necessary

// Endpoint to check if the file is ready

// Endpoint to fetch demat account data (username should be included)
app.get("/api/demat-accounts", (req, res) => {
  const clients = [];

  fs.createReadStream(filePath) // Use the filePath from current directory
    .pipe(csv())
    .on("data", (row) => {
      // Assuming the CSV has a column 'username'
      clients.push({ username: row.username, dematAcc: row.dematAcc }); // Add the username to the array
    })
    .on("end", () => {
      console.log(clients); // Print the clients array
      res.json(clients); // Return the client data as JSON
    })
    .on("error", (error) => {
      console.error(error);
      res.status(500).send("Error reading CSV file");
    });
});





// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
