import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import savingGif from '../../saving-gif.gif';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
import AddIcon from "@material-ui/icons/Add";
import Print from '@material-ui/icons/Print';
import Close from '@material-ui/icons/Close';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import store from '../../store/store';
import closeDialogAction from '../../store/actions/closeCustomAction/closeCustomAction';
import printCustomAction from '../../store/actions/printCustomAction/printCustomAction';
import saveCustomData from '../../store/actions/saveCustomDataAction/saveCustomDataAction';
import { connect } from 'react-redux';
import Recipt from '../reciept/reciept';
import './styles/style.css';

class ResponsiveDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: '',
      price: '',
      quantity: '',
      order: [],
      totalBill: 0,
    };
  }
  componentWillMount = () => {
    if (this.props.saveCustomReducer.flag) {
      let totalBill = 0;

      this.props.saveCustomReducer.openCustom.order.forEach(function(item){

        totalBill += (item.quantity * item.singlePrice);
      });

      this.setState({        
        ...this.props.saveCustomReducer.openCustom,
        totalBill:totalBill
      });

    }
  }
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    if (this.state.order.length) {
      store.dispatch(saveCustomData(this.state));
    }
    else {
      store.dispatch(closeDialogAction());
    }
  }
  onPriceKeyDown = (evt) => {
    if (evt.keyCode == 13) {
      this.addOrder();
    }
  }

  handleChangeInput = name => event => {
    this.setState({ [name]: event.target.value });
  };

  addOrder = event => {
    debugger;
    let order = {
      dishName: this.state.item,
      quantity: this.state.quantity,
      price: this.state.price * this.state.quantity,
      singlePrice: this.state.price,
      date: (new Date).toDateString()
    }
    let orderArray = this.state.order;
    orderArray.push(order);
    this.setState({
      item: '',
      quantity: '',
      price: '',
      order: orderArray,
      totalBill: this.state.totalBill + (this.state.quantity * this.state.price)
    });

    this.savetoLS();

  }
  savetoLS = () => {

    let cOrders = JSON.parse(localStorage.getItem('cOrders') || '{}');

    if (!Object.keys(cOrders).length) {
      cOrders = {
        date: (new Date()).toDateString(),
        data: this.state
      };
    }

    cOrders.data = this.state;

    localStorage.setItem('cOrders', JSON.stringify(cOrders));

  }
  closeDialog = () => {
    // store.dispatch(closeDialogAction());
    this.handleClose();
  }
  printBill = () => {

    this.setState({
      estimation: false,
      hideReceipt: true
    });

    store.dispatch(printCustomAction({
      totalBill: this.state.totalBill,
      order: this.state.order
    }));
  }
  deleteItem = (item, getindex) => {
    let order = this.state.order;


    let getFiltered = order.filter((dish, index) => {
      return getindex !== index;
    });

    let totalBill = 0;
    getFiltered.forEach(function (item) {
      totalBill += item.price;
    });

    this.setState({
      // totalBill: this.state.totalBill - (item.price*item.quantity),
      totalBill: totalBill,
      order: getFiltered
    });

    setTimeout(() => {
      this.savetoLS();
    }, 200);
  }
  render() {
    const { fullScreen } = this.props;
    return (
      <div className="printable">
        <div hidden={!this.props.openCustom.inProcess} className="inProcessContainer"></div>
        <img hidden={!this.props.openCustom.inProcess} className="loadingGIF" src={savingGif} />
        <Dialog
          fullWidth={true}
          maxWidth="lg"
          fullScreen={true}
          open={this.props.openCustom.flag}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            <Paper className="paper-heading" elevation={1}>
              <Grid container>
                <Grid item xs={4}>
                  <Typography color="inherit" align="left" variant="body2">
                    {new Date().getMonth() + 1}/{new Date().getDate()}/{new Date().getFullYear()}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography color="error" align="center" variant="h5" component="h3">
                    The Fine Club
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography color="inherit" align="right" variant="body2">
                    Daily Purchasing
                    </Typography>
                </Grid>
              </Grid>
            </Paper>
          </DialogTitle>
          <DialogContent className='table-dialogContent'>
            <DialogContentText>
              <div className="select-inputs">
                <TextField
                  id="standard-Item"
                  label="Item"
                  value={this.state.item}
                  onChange={this.handleChangeInput('item')}
                  margin="normal"
                />

              </div>


              <div className="select-inputs">
                <TextField
                  id="standard-Quantity"
                  label="Quantity"
                  value={this.state.quantity}
                  onChange={this.handleChangeInput('quantity')}
                  type="number"
                  margin="normal"
                />

              </div>
              <div className="select-inputs">
                <TextField
                  id="standard-Price"
                  label="Price"
                  value={this.state.price}
                  onChange={this.handleChangeInput('price')}
                  onKeyDown={this.onPriceKeyDown}
                  type="number"
                  margin="normal"
                />

              </div>

              <div className="select-add">
                {this.state.item && this.state.price && this.state.quantity ? <Fab onClick={this.addOrder.bind(this)} size="medium" color="secondary" aria-label="Add">
                  <AddIcon />
                </Fab> : null
                }
              </div>

              {this.state.order.length ? <div className="ordered-table">
                <Paper>
                  <Table>
                    <TableRow>
                      <TableCell align="left"><Typography className='typo-heading-table' variant='BUTTON'><b>Item Name</b></Typography></TableCell>
                      <TableCell align="left"><Typography className='typo-heading-table' variant='BUTTON'><b>Quantity</b></Typography></TableCell>
                      <TableCell align="left"><Typography className='typo-heading-table' variant='BUTTON'><b>Price</b></Typography></TableCell>
                    </TableRow>
                    <TableBody>
                      {this.state.order.map((item, index) => (
                        <TableRow key={item.item + index}>
                          <TableCell component="th" scope="row">
                            {item.dishName}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {item.quantity}
                            <div className="delete-button-div">
                              <IconButton onClick={this.deleteItem.bind(this, item, index)} aria-label="Delete">
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </div>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {item.price}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell rowSpan={3} />
                        <TableCell className="amount-section">Total</TableCell>
                        <TableCell align="left" className="amount-section">{this.state.totalBill}</TableCell>
                      </TableRow>

                    </TableBody>
                  </Table>
                </Paper>
              </div> : <div><center>No items</center></div>
              }
              <Recipt hideReceipt={true} data={this.state} />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <div className="action-button">
              {this.state.order.length ? <Button className="mr-10" onClick={this.printBill.bind(this)} variant="contained" color="secondary">
                Save and Print
                <Print />
              </Button> : null
              }
              <Button className="mr-10" onClick={this.closeDialog.bind(this)} variant="contained" color="secondary">
                Close
                <Close />
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ResponsiveDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
};

const mapDispatchToProps = (state) => {
  return {
    openCustom: state.openCustomReducer,
    saveCustomReducer: state.closeCustomButSaveReducer
  }
}

const newResponsiveDialog = withMobileDialog()(ResponsiveDialog);
const dialogBox = connect(mapDispatchToProps)(newResponsiveDialog);
export default dialogBox;