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
  const [exTokenData, setExTokenData] = useState(null);
  const [ex, setEx] = useState(null);
  const [segment, setSegment] = useState(null);
  const [Sid, setSid] = useState(null);
  const [activeTab, setActiveTab] = useState("Regular"); // New state for active tab
  const [isTriggerDisabled, setIsTriggerDisabled] = useState(false);
  const [isPriceDisabled, setIsPriceDisabled] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5007/api/demat-accounts")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched clients data:", data);
        setClients(data);
      })
      .catch((error) => console.error("Error fetching clients:", error));
  }, []);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    console.log("Active Tab:", activeTab);
    console.log("Product ID:", productId);
    console.log("Order Type:", orderType);



    if (activeTab === "Regular" && productId === "Intraday" && orderType === "LIMIT") {
      setIsTriggerDisabled(true);
      setIsPriceDisabled(false);
    }
    if (activeTab === "Regular" && productId === "Intraday" && orderType === "MKT") {
      setIsTriggerDisabled(true);
      setIsPriceDisabled(true);
    }

    if (activeTab === "Regular" && productId === "Intraday" && orderType === "SL") {
      setIsTriggerDisabled(false);
      setIsPriceDisabled(false);
    }

    if (activeTab === "Regular" && productId === "Delivery" && orderType === "LIMIT") {
      setIsTriggerDisabled(true);
      setIsPriceDisabled(false);
    }

    if (activeTab === "Regular" && productId === "Delivery" && orderType === "MKT") {
      setIsTriggerDisabled(true);
      setIsPriceDisabled(true);
    }

    if (activeTab === "Regular" && productId === "Delivery" && orderType === "SL") {
      setIsTriggerDisabled(false);
      setIsPriceDisabled(false);
    }


    if (activeTab === "Regular" && productId === "MTF" && orderType === "LIMIT") {
      setIsTriggerDisabled(true);
      setIsPriceDisabled(false);
    }

    if (activeTab === "Regular" && productId === "MTF" && orderType === "MKT") {
      setIsTriggerDisabled(true);
      setIsPriceDisabled(true);
    }

    if (activeTab === "Regular" && productId === "MTF" && orderType === "SL") {
      setIsTriggerDisabled(false);
      setIsPriceDisabled(false);
    }



  }, [activeTab, productId, orderType]);






  // Handler to log the required values
  const handleBuy = () => {
    // Prepare the requestData, including the token and other necessary fields
    const requestData = {
      token: token, // Send the token
      orderType: orderType,
      productId: productId,
      price: price,
      triggerPrice: triggerPrice,
      quantity: quantity,
      buyOrSell: buy,
      selectedClient: selectedClient,
    };

    console.log("Sending data to backend:", requestData);

    // Send the entire requestData to the backend using fetch
    fetch("http://localhost:5007/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Optionally, you can send the token in the header if needed for authorization
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestData), // Send requestData as JSON
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from server:", data);

        // Assuming the server returns ex, segment, and Sid
        const { ex, segment, Sid, isMTFApproved, isBKTAllowed } = data;

        // Now, you can use these values in the frontend
        console.log("Exchange:", ex);
        console.log("Segment:", segment);
        console.log("Sid:", Sid);
        console.log('isMTFApproved:', isMTFApproved);
        console.log('isBKTAllowed:', isBKTAllowed);

        // Optionally, set them in the state if you want to display or use them later
        setEx(ex);
        setSegment(segment);
        setSid(Sid);
      })
      .catch((error) => {
        console.error("Error sending data to backend:", error);
      });



  };

  return (
    <div className="stock-ui">
      <div className="header">
        <h1>{symbol}</h1>
        <div className="exchange-toggle"></div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "Regular" ? "active-tab" : ""}
          onClick={() => handleTabChange("Regular")}
        >
          Regular
        </button>
        <button
          className={activeTab === "Bracket" ? "active-tab" : ""}
          onClick={() => handleTabChange("Bracket")}
        >
          Bracket
        </button>
        <button
          className={activeTab === "AMO" ? "active-tab" : ""}
          onClick={() => handleTabChange("AMO")}
        >
          AMO
        </button>
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
          <label>Price</label>
          <input
            type="number"
            value={price}




            onChange={(e) => {
              if (!isPriceDisabled) {
                setPrice(e.target.value);
              }
            }}
            disabled={isPriceDisabled}
          />
        </div>

        <div className="input-group">
          <label>Trigger Price</label>
          <input
            type="number"
            value={triggerPrice}
            onChange={(e) => {
              if (!isTriggerDisabled) {
                setTriggerPrice(e.target.value);
              }
            }}
            disabled={isTriggerDisabled}
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
