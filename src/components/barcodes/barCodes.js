import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import store from "../../store/store";
import Barcode from 'react-barcode';




class ItemDiscountDialog extends React.Component {
  state = {
    open: false,
    statebarcodes:[]
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
    store.dispatch({
      type:'CLOSE_BARCODE'
    })
    // this.props.getDiscountValue(this.state.number)
  };
  genrateBarCode = () =>{
    let localArry = []
    let barcodes = this.props.data.openTable.brands
     barcodes.forEach((barcode)=>{
     return barcode.items.forEach((brand)=>{
       return localArry.push(brand)
     })
   })
   this.setState({
    statebarcodes:localArry
  })
  // console.log('bar', this.state.statebarcodes)
  console.log('bar', localArry)

 
  }
  printBar = () => {
    window.print()
  }
  render() {

    return (
      <div>
        <Dialog
         className="Dialog"
        //  scroll = 'enum'
         fullWidth={true}
         maxWidth="md"
         fullScreen={false}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
            Baecodes
          </DialogTitle>
          <DialogContent>
        {this.state.statebarcodes ? this.state.statebarcodes.map((barcode,index)=>{
          return <Barcode key = {index} value={barcode.brand + '_' + barcode.size + '_' + barcode.color.name+'_'}
            width={1}
            height={40}
            fontSize={8}
          />
          
        }):null}
          </DialogContent>
          <DialogActions>
           
          <Button onClick={this.printBar} color="primary">
              Print
            </Button>
            <Button onClick={this.genrateBarCode} color="primary">
              GenrateBarCode
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}


export default ItemDiscountDialog;
