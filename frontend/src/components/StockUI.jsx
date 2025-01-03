import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./StockUI.css";

// Set the root element for the modal (important for accessibility)
Modal.setAppElement("#root");

export default function StockUI({ symbol, lastTradePrice, token, closeModal }) {
  const [clients, setClients] = useState([]);
  const [exchange, setExchange] = useState("NSE");
  const [orderType, setOrderType] = useState("MKT");
  const [productId, setProductId] = useState("Intraday");
  const [price, setPrice] = useState(lastTradePrice);
  const [triggerPrice, setTriggerPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedClient, setSelectedClient] = useState(""); // State for selected client
  const [buy, setBuy] = useState("B");

  useEffect(() => {
    fetch("http://localhost:5007/api/demat-accounts")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched clients data:", data);
        setClients(data);
      })
      .catch((error) => console.error("Error fetching clients:", error));
  }, []);

  // Handler to log the required values
  const handleBuy = () => {
    console.log("Token:", token);
    console.log("Order Type:", orderType);
    console.log("Product ID:", productId);
    console.log("Price:", price);
    console.log("Trigger Price:", triggerPrice);
    console.log("Quantity:", quantity);
    console.log("BUY or Sell :", buy);
    console.log("Selected Client:", selectedClient || "No client selected");
    const selectedClientData = clients.find(
      (client) => client.username === selectedClient
    );

    // Check if the client is found and if dematAcc exists
    if (selectedClientData) {
      if (selectedClientData.dematAcc) {
        console.log(
          "Demat Account of selected client:",
          selectedClientData.dematAcc
        );
      } else {
        console.log("Demat Account not available for this client.");
      }
    } else {
      console.log("No valid client selected or client data not found.");
    }
  };

  return (
    <div className="stock-ui">
      <div className="header">
        <h1>{symbol}</h1>
        <div className="exchange-toggle"></div>
      </div>

      <div className="tabs">
        <button className="active-tab">Regular</button>
        <button>Bracket</button>
        <button>AMO</button>
      </div>
      <div className="productId-OrderType-Container">
        <div className="buyProductId">
          <button
            className={productId === "Intraday" ? "active" : ""}
            onClick={() => setProductId("Intraday")}
          >
            Intraday
          </button>
          <button
            className={productId === "DELIVERY" ? "active" : ""}
            onClick={() => setProductId("DELIVERY")}
          >
            Delivery
          </button>
          <button
            className={productId === "MTF" ? "active" : ""}
            onClick={() => setProductId("MTF")}
          >
            MTF
          </button>
        </div>

        <div className="orderType">
          <button
            className={orderType === "MKT" ? "active" : ""}
            onClick={() => setOrderType("MKT")}
          >
            Market
          </button>
          <button
            className={orderType === "LIMIT" ? "active" : ""}
            onClick={() => setOrderType("LIMIT")}
          >
            Limit
          </button>
          <button
            className={orderType === "SL" ? "active" : ""}
            onClick={() => setOrderType("SL")}
          >
            Stop Loss
          </button>
        </div>
      </div>

      <div className="price-section">
        <div className="input-group">
          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>LTP</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Trigger Price</label>
          <input
            type="number"
            value={triggerPrice}
            onChange={(e) => setTriggerPrice(e.target.value)}
          />
        </div>

        {/* Dropdown for Select Clients */}
        <div className="input-group">
          <label>Select Client</label>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            <option value="">Select a client</option>
            {clients.map((client, index) => (
              <option key={index} value={client.username}>
                {client.username}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="footer">
        <p>Required Margin: ₹1,177.20</p>
        <p>Charges: ₹3.78</p>

        <button className="buy" onClick={handleBuy}>
          Buy
        </button>
        <button className="cancel" onClick={closeModal}>
          Cancel
        </button>
      </div>
    </div>
  );
}
