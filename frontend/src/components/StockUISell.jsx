import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./StockUISell.css";

// Set the root element for the modal (important for accessibility)
Modal.setAppElement("#root");

export default function StockUISell({
  symbol,
  lastTradePrice,
  token,
  closeModal2,
}) {
  const [clients, setClients] = useState([]);
  const [exchange, setExchange] = useState("NSE");
  const [orderType, setOrderType] = useState("MKT");
  const [productId, setProductId] = useState("Intraday");
  const [price, setPrice] = useState({ lastTradePrice });
  const [triggerPrice, setTriggerPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedClient, setSelectedClient] = useState(""); // State for selected client
  const [sell, setSell] = useState("S");

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    fetch("http://localhost:5007/api/demat-accounts")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched clients data:", data);
        setClients(data);
      })
      .catch((error) => console.error("Error fetching clients:", error));
  }, []);
  const handleSell = () => {
    console.log("Token:", token);
    console.log("Order Type:", orderType);
    console.log("Product ID:", productId);
    console.log("Price:", price);
    console.log("Trigger Price:", triggerPrice);
    console.log("Quantity:", quantity);
    console.log("BUY or Sell :", sell);
    console.log("Selected Client:", selectedClient || "No client selected");
  };

  return (
    <div className="stockUISell">
      <div className="sellHeader">
        <h1>{symbol}</h1>
        <div className="exchange-toggle"></div>
      </div>

      <div className="sellTabs">
        <button className="active-tab">Regular</button>
        <button>Bracket</button>
        <button>AMO</button>
      </div>

      <div className="sellProductId-OrderType-Container">
        <div className="productId">
          <button
            className={productId === "Intraday" ? "active" : ""}
            onClick={() => setProductId("Intraday")}
          >
            Intraday
          </button>
          <button
            className={productId === "Delivery" ? "active" : ""}
            onClick={() => setProductId("Delivery")}
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

        <div className="sellOrderType">
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

        <button className="sell" onClick={handleSell}>
          Sell
        </button>
        <button className="cancel" onClick={closeModal2}>
          Cancel
        </button>
      </div>
    </div>
  );
}
