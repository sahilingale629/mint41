import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

function OrderModal({ isOpen, onClose, symbol, price, orderType }) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="order-dialog-title"
    >
      <DialogTitle id="order-dialog-title">Order Details</DialogTitle>
      <DialogContent>
        <p>Symbol: {symbol}</p>
        <p>Price: {price}</p>
        <p>Order Type: {orderType}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OrderModal;
