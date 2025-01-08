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
  const [triggerPrice, setTriggerPrice] = useState("0");
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
  const [isDeliveryDisabled, setIsDeliveryDisabled] = useState(false);
  const [isIntradayDisabled, setIsIntradayDisabled] = useState(false);
  const [isMktDisabled, setIsMktDisabled] = useState(false);
  const [isLimitDisabled, setIsLimitDisabled] = useState(false);
  const [isSlDisabled, setIsSlDisabled] = useState(false);
  const [isMtfDisabled, setIsMtfDisabled] = useState(false);



  // New states for Bracket Order
  const [target, setTarget] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [trailingStopLoss, setTrailingStopLoss] = useState("");

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
    // Reset state when activeTab changes
    if (activeTab === "Regular") {
      if (productId === 'Intraday') {
        if (orderType === 'MKT') {



          setIsTriggerDisabled(true);
          setIsPriceDisabled(true);
          setIsDeliveryDisabled(false);
          setIsIntradayDisabled(false);
          setIsMktDisabled(false);
          setIsLimitDisabled(false);
          setIsSlDisabled(false);
          setIsMtfDisabled(false);
        } else if (orderType === 'LIMIT') {
          setIsTriggerDisabled(true);
          setIsPriceDisabled(false);
          setIsDeliveryDisabled(false);
          setIsIntradayDisabled(false);
          setIsMktDisabled(false);
          setIsLimitDisabled(false);
          setIsSlDisabled(false);
          setIsMtfDisabled(false);

        } else if (orderType === 'SL') {
          setIsTriggerDisabled(false);
          setIsPriceDisabled(false);
          setIsDeliveryDisabled(false);
          setIsIntradayDisabled(false);
          setIsMktDisabled(false);
          setIsLimitDisabled(false);
          setIsSlDisabled(false);
          setIsMtfDisabled(false);

        }
      }
      else if (productId === 'Delivery') {
        if (orderType === 'MKT') {
          setIsTriggerDisabled(true);
          setIsPriceDisabled(true);
          setIsDeliveryDisabled(false);
          setIsIntradayDisabled(false);
          setIsMktDisabled(false);
          setIsLimitDisabled(false);
          setIsSlDisabled(false);
          setIsMtfDisabled(false);

        } else if (orderType === 'LIMIT') {
          setIsTriggerDisabled(true);
          setIsPriceDisabled(false);
          setIsDeliveryDisabled(false);
          setIsIntradayDisabled(false);
          setIsMktDisabled(false);
          setIsLimitDisabled(false);
          setIsSlDisabled(false);
          setIsMtfDisabled(false);

        } else if (orderType === 'SL') {
          setIsTriggerDisabled(false);
          setIsPriceDisabled(false);
          setIsDeliveryDisabled(false);
          setIsIntradayDisabled(false);
          setIsMktDisabled(false);
          setIsLimitDisabled(false);
          setIsSlDisabled(false);
          setIsMtfDisabled(false);

        }

      }
      else if (productId === 'MTF') {
        if (orderType === 'MKT') {
          setIsTriggerDisabled(true);
          setIsPriceDisabled(true);
          setIsDeliveryDisabled(false);
          setIsIntradayDisabled(false);
          setIsMktDisabled(false);
          setIsLimitDisabled(false);
          setIsSlDisabled(false);
          setIsMtfDisabled(false);

        } else if (orderType === 'LIMIT') {
          setIsTriggerDisabled(true);
          setIsPriceDisabled(false);
          setIsDeliveryDisabled(false);
          setIsIntradayDisabled(false);
          setIsMktDisabled(false);
          setIsLimitDisabled(false);
          setIsSlDisabled(false);
          setIsMtfDisabled(false);

        } else if (orderType === 'SL') {
          setIsTriggerDisabled(false);
          setIsPriceDisabled(false);
          setIsDeliveryDisabled(false);
          setIsIntradayDisabled(false);
          setIsMktDisabled(false);
          setIsLimitDisabled(false);
          setIsSlDisabled(false);
          setIsMtfDisabled(false);

        }
      }
    } else if (activeTab === "Bracket") {
      setIsDeliveryDisabled(true);
      setIsMtfDisabled(true);
      setIsMktDisabled(true);
      if (orderType === 'LIMIT') {
        setIsTriggerDisabled(true);
        setIsPriceDisabled(false);

      }
      else if (orderType === 'SL') {
        setIsTriggerDisabled(false);
        setIsPriceDisabled(false);

      }
    }



    else if (activeTab === "AMO") {
      setIsMktDisabled(true);
      setIsSlDisabled(true);
      setIsTriggerDisabled(true);
      setIsDeliveryDisabled(false);
      setIsMtfDisabled(false);



    }
  }, [activeTab, productId, orderType]);

  // Handler to log the required values
  const handleBuy = () => {
    const requestData = {
      token: token,
      orderType: orderType,
      productId: productId,
      price: price,
      triggerPrice: triggerPrice,
      quantity: quantity,
      buyOrSell: buy,
      selectedClient: selectedClient,
      target: target, // Include target, stopLoss, and trailingStopLoss
      stopLoss: stopLoss,
      trailingStopLoss: trailingStopLoss,
    };

    console.log("Sending data to backend:", requestData);

    fetch("http://localhost:5007/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from server:", data);
        const { ex, segment, Sid } = data;
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
            disabled={isIntradayDisabled}
          >
            Intraday
          </button>
          <button
            className={productId === "Delivery" ? "active" : ""}
            onClick={() => setProductId("Delivery")}
            disabled={isDeliveryDisabled}
          >
            Delivery
          </button>
          <button
            className={productId === "MTF" ? "active" : ""}
            onClick={() => setProductId("MTF")}
            disabled={isMtfDisabled}
          >
            MTF
          </button>
        </div>

        <div className="orderType">
          <button
            className={orderType === "MKT" ? "active" : ""}
            onClick={() => setOrderType("MKT")}
            disabled={isMktDisabled}
          >
            Market
          </button>
          <button
            className={orderType === "LIMIT" ? "active" : ""}
            onClick={() => setOrderType("LIMIT")}
            disabled={isLimitDisabled}



          >
            Limit
          </button>
          <button
            className={orderType === "SL" ? "active" : ""}
            onClick={() => setOrderType("SL")}
            disabled={isSlDisabled}
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
      {activeTab === "Bracket" && (
        <div className="target-stoploss-section">
          <div className="input-group">
            <label>Target</label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>StopLoss</label>
            <input
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Trailing StopLoss</label>
            <input
              type="number"
              value={trailingStopLoss}
              onChange={(e) => setTrailingStopLoss(e.target.value)}
            />
          </div>
        </div>
      )}

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
