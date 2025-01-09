import { useEffect, useState } from "react";
import axios from "axios";
import {
  getExchangeType,
  getLastTradedPrice,
  getToken,
} from "../utils/payloadParser";
import StockUI from "./StockUI";
import Modal from "react-modal";
import StockUISell from "./StockUISell";
import { saveAs } from "file-saver"; // Install this library with `npm install file-saver`

export default function Instrument({ instrument, payload }) {
  const [lastTradePrice, setLastTradePrice] = useState(0);

  const [orderType, setOrderType] = useState(""); // To store the current order type (Buy/Sell)
  const [modalData, setModalData] = useState({ symbol: "", price: 0 });
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modal2IsOpen, setmodal2IsOpen] = useState(false);
  const [staticLastTradePrice, setStaticLastTradePrice] = useState(0);

  const symbol = instrument?.symbol;
  const token = instrument?.token;
  // console.log(`token passed from Instrument.jsx :- ${token}`);

  // Set last traded price when payload changes
  useEffect(() => {
    if (
      payload &&
      getExchangeType(payload) === instrument.exchangeType &&
      getToken(payload) === instrument.token
    ) {
      setLastTradePrice(getLastTradedPrice(payload));
    }
  }, [payload]);

  // Headers for API requests
  const headers = {
    "request-info":
      '{"rit":"123","cver":"1.0v","ch":"WEB","info":{},"reqts":"12345678","payload":[]}',
    "x-api-key": "E6J9HA1BA31EJK90IK12KL80BBRRN590",
    "Content-Type": "application/json",
  };

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

  function closeModal2() {
    setmodal2IsOpen(false);
  }

  // Handle Buy button click
  const handleBuy = (symbol, ltp) => {
    console.log(`Buy clicked for ${symbol} at price ${ltp}`);
    setOrderType("Buy");
    setStaticLastTradePrice(ltp); // Store the static lastTradePrice
    setModalData({ symbol, price: lastTradePrice });
    setIsOpen(true); // Open the modal for the order details
  };

  // Handle Sell button click
  const handleSell = (symbol, ltp) => {
    console.log(`Sell clicked for ${symbol} at price ${ltp}`);
    setOrderType("Sell");
    setStaticLastTradePrice(ltp); // Store the static lastTradePrice
    setModalData({ symbol, price: lastTradePrice });
    setmodal2IsOpen(true); // Open the modal for the order details

    // Commented out sell logic for now
    /*
    console.log(`Exchange Type - ${instrument.exchangeType}`);
    console.log(`Token - ${instrument.token}`);
    */
  };

  return (
    <>
      <tr>
        <td>{symbol}</td>
        <td>{lastTradePrice}</td>
        <td>
          {/* Add Buy and Sell buttons for each row */}
          <button
            className="buy-button"
            onClick={() => handleBuy(symbol, lastTradePrice)}
          >
            Buy
          </button>
          <button
            className="sell-button"
            onClick={() => handleSell(symbol, lastTradePrice)}
          >
            Sell
          </button>
        </td>
      </tr>

      {/* Modal Component */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}  >
        <StockUI
          symbol={symbol}
          lastTradePrice={staticLastTradePrice}
          token={token}
          closeModal={closeModal}
        />
      </Modal>
      <Modal isOpen={modal2IsOpen} onRequestClose={closeModal2} >
        <StockUISell
          symbol={symbol}
          lastTradePrice={staticLastTradePrice}
          token={token}
          closeModal2={closeModal2}
        />
      </Modal>
    </>
  );
}
