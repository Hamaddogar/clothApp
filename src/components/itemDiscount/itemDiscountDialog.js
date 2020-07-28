import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';


class ItemDiscountDialog extends React.Component {
  state = {
    open: false,
    number:0
  };
  componentDidMount() {
    this.handleClickOpen();
  }
  handleClickOpen = () => {
    this.setState({
      open: true
    });
  };

  handleClose = () => {
    this.setState({
      open: false
    })
    this.props.getDiscountValue(this.state.number)
  };
  render() {

    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
            Special Discount
          </DialogTitle>
          <DialogContent>
          <form   noValidate autoComplete="off">
            <TextField
              id="outlined-number"
              label="Persentage"
              autoF
              value={this.state.number}
              onChange={e => this.setState({number:e.target.value}) }
              
              style = {{margin:10}}
              type="number"
            
              variant="outlined"
            />
            </form>
          </DialogContent>
          <DialogActions>
           
            <Button onClick={this.handleClose} color="primary">
              Discount
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}


export default ItemDiscountDialog;
