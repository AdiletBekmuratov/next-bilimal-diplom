import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";

const AlertDialog = ({ open, handleClose, title, description, onAgree }) => {
  const handleAgree = () => {
    onAgree();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" variant="outlined" onClick={handleClose}>
          Отмена
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={handleAgree}
          autoFocus
        >
          Подтвердить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
