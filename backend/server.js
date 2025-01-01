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

const app = express();
const port = 5007;

const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log("WebSocket server running on ws://localhost:8080");
});

// CORS configuration to allow specific origins
app.use(cors());
app.use(express.json());

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

app.post("/connect-aliceblue", async (req, res) => {
  try {
    // Replace these values with actual credentials
    const web_socket = new WebSocketV2({
      jwttoken:
        "eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlM0OTIzNzIiLCJyb2xlcyI6MCwidXNlcnR5cGUiOiJVU0VSIiwidG9rZW4iOiJleUpoYkdjaU9pSlNVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKMWMyVnlYM1I1Y0dVaU9pSmpiR2xsYm5RaUxDSjBiMnRsYmw5MGVYQmxJam9pZEhKaFpHVmZZV05qWlhOelgzUnZhMlZ1SWl3aVoyMWZhV1FpT2pZc0luTnZkWEpqWlNJNklqTWlMQ0prWlhacFkyVmZhV1FpT2lKa056UTNOekprWXkwNU9EWXlMVE5tTlRjdFlURXdOQzB4T1RRMFlXTmhNbUkzTnpZaUxDSnJhV1FpT2lKMGNtRmtaVjlyWlhsZmRqRWlMQ0p2Ylc1bGJXRnVZV2RsY21sa0lqbzJMQ0p3Y205a2RXTjBjeUk2ZXlKa1pXMWhkQ0k2ZXlKemRHRjBkWE1pT2lKaFkzUnBkbVVpZlgwc0ltbHpjeUk2SW5SeVlXUmxYMnh2WjJsdVgzTmxjblpwWTJVaUxDSnpkV0lpT2lKVE5Ea3lNemN5SWl3aVpYaHdJam94TnpNMU1UQTVNemcyTENKdVltWWlPakUzTXpVd01qSTRNRFlzSW1saGRDSTZNVGN6TlRBeU1qZ3dOaXdpYW5ScElqb2lOalJqWmpJeVlUWXRNbVl3WWkwMFlXVmxMVGd5TmpNdFlqRXhOVEUyTjJWaE4yVmpJaXdpVkc5clpXNGlPaUlpZlEuQm5pNXZ4ODhkRTNkcy1HeUdwMExSOEpRVEhtTm5QRGVGVy1WLV9sampaZnY4bjhZOE9yT3BYOWpvdzZrRzFxT2hrYjVlSVFSbnJZVnhsQW5OTG1mYUtlVXUxdTlJcFc2Nm5rUDlkbmxPNjlRbnhTcUdkN0VXRE40bHZ6LWNidXg3WExBYmo1MW9BX1d3UE5SeURkZEdUeV81M0ljU01xTEowQmY4VXlaSWpVIiwiQVBJLUtFWSI6IlRKS1QxdmVzIiwiaWF0IjoxNzM1MDIyOTg2LCJleHAiOjE3MzUxMDkzODZ9.ujaD7I7fWhlDM_43LPGDBCC2k_A6LDoOfUapf-jT43bmY9r6gDmU1dpOIiIiuvfuNwvi_O3DHV_L8M3ubbwiTQ",
      apikey: "x6CAIx2R",
      clientcode: "S492372",
      feedtype:
        "eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlM0OTIzNzIiLCJpYXQiOjE3MzUyMDA1MzEsImV4cCI6MTczNTI4NjkzMX0.P93SXCicD_fVpWflPYMe_-cgeZ44r3qRkBUGCuE9kGfbSd8io3S1mXdl9K_8XH8t8CyomlYRSyxTlnzPY8x96Q",
    });

    await web_socket.connect();
    console.log("Connected to AliceBlue WebSocket");

    const json_req = {
      correlationID: "correlation_id",
      action: 1,
      mode: 1,
      exchangeType: 1,
      tokens: ["17818"], // Token ID for fetching data
    };

    web_socket.fetchData(json_req);
    web_socket.on("tick", (data) => {
      if (data && data.last_traded_price) {
        data.last_traded_price = data.last_traded_price / 100;

        console.log("Last Traded Price:", data.last_traded_price);

        // Broadcast the price to all connected WebSocket clients
        broadcastToClients(
          JSON.stringify({ lastTradedPrice: data.last_traded_price })
        );
      }
    });

    res.status(200).json({ message: "Connected to AliceBlue WebSocket" });
  } catch (error) {
    console.error("Error connecting to AliceBlue WebSocket:", error.message);
    res.status(500).json({ error: "Failed to connect to AliceBlue WebSocket" });
  }
});

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

// Client Processing Function
const processClient = async (client) => {
  const { username, password } = client;
  console.log(`Processing client: ${username}`);

  let loginToken = null;
  let otpToken = null;
  const headers = getHeaders();

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

    const otpCode = 123456;
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

    const decryptedAccessToken = TBSAlgoEncryptDecrypt.gcmDecrypt(
      encryptedAccessToken,
      secretKey
    );

    headers.Authorization = `Bearer ${decryptedAccessToken}`;
    const profileResponse = await axios.get(urls.customerProfile, { headers });

    const customerProfile = profileResponse.data?.data?.success;
    if (!customerProfile) throw new Error("Customer profile not found.");

    console.log(`Customer Profile for ${username}:`, customerProfile);

    return {
      username,
      status: "Success",
      profile: customerProfile,
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

    res.status(200).json({ success: true, results });
  } catch (error) {
    console.error("An error occurred:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to process clients." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
