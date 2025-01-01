import React, { useState } from "react";
import Modal from "react-modal";
import "./StockUI.css";

// Set the root element for the modal (important for accessibility)
Modal.setAppElement("#root");

export default function StockUI({
  symbol,
  lastTradePrice,
  closeModal,
  clients,
}) {
  const [exchange, setExchange] = useState("NSE");
  const [orderType, setOrderType] = useState("Intraday");
  const [price, setPrice] = useState({ lastTradePrice });
  const [triggerPrice, setTriggerPrice] = useState(5752.35);
  const [quantity, setQuantity] = useState(1);
  const [selectedClient, setSelectedClient] = useState(""); // State for selected client

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

      <div className="order-type">
        <button
          className={orderType === "Intraday" ? "active" : ""}
          onClick={() => setOrderType("Intraday")}
        >
          Intraday MIS
        </button>
        <button
          className={orderType === "Long Term" ? "active" : ""}
          onClick={() => setOrderType("Long Term")}
        >
          Long Term CNC
        </button>
        <button
          className={orderType === "Pay Later" ? "active" : ""}
          onClick={() => setOrderType("Pay Later")}
        >
          Pay Later MTF
        </button>
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
              <option key={index} value={client.name}>
                {client.name}
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
