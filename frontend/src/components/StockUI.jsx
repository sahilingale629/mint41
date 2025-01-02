import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./StockUI.css";

// Set the root element for the modal (important for accessibility)
Modal.setAppElement("#root");

export default function StockUI({ symbol, lastTradePrice, closeModal }) {
  const [clients, setClients] = useState([]);
  const [exchange, setExchange] = useState("NSE");
  const [orderType, setOrderType] = useState("Market");
  const [productId, setProductId] = useState("Intraday");
  const [price, setPrice] = useState({ lastTradePrice });
  const [triggerPrice, setTriggerPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedClient, setSelectedClient] = useState(""); // State for selected client

  useEffect(() => {
    fetch("http://localhost:5007/api/demat-accounts")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched clients data:", data);
        setClients(data);
      })
      .catch((error) => console.error("Error fetching clients:", error));
  }, []);

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
            className={productId === "Long Term" ? "active" : ""}
            onClick={() => setProductId("Long Term")}
          >
            Delivery
          </button>
          <button
            className={productId === "Pay Later" ? "active" : ""}
            onClick={() => setProductId("Pay Later")}
          >
            MTF
          </button>
        </div>

        <div className="orderType">
          <button
            className={orderType === "Market" ? "active" : ""}
            onClick={() => setOrderType("Market")}
          >
            Market
          </button>
          <button
            className={orderType === "Limit" ? "active" : ""}
            onClick={() => setOrderType("Limit")}
          >
            Limit
          </button>
          <button
            className={orderType === "Stop Loss" ? "active" : ""}
            onClick={() => setOrderType("Stop Loss")}
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
            value={lastTradePrice}
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

        <button className="buy">Buy</button>
        <button className="cancel" onClick={closeModal}>
          Cancel
        </button>
      </div>
    </div>
  );
}
