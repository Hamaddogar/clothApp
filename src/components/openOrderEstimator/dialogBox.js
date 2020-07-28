import React from 'react';
import ReactDOM from 'react-dom';
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
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from "@material-ui/icons/Add";
import Print from '@material-ui/icons/Print';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import store from '../../store/store';
import closeDialogAction from '../../store/actions/closeDialogAction/closeDialogAction';
import printTableAction from '../../store/actions/printTableAction/printTableAction';
import {closeTableByStoringAction} from '../../store/actions/closeTableByStoringAction/closeTableByStoringAction';
import reciept from '../../services/reciept/reciept';
import { connect } from 'react-redux';
import dishes from '../../services/getDishes/getDishes';
import Recipt from '../reciept/reciept';
import './styles/style.css';
import AutoSugession from '../autoSugessionInput/autoSugessionInput';

class ResponsiveDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuData: '',
      name: '',
      dish: '',
      selectedCategory: '',
      selectedDish: '',
      quantity: '',
      order: [],
      totalBill: 0,
      grandTotal: 0,
      checked: false,
      taxAmount: 0,
      table: this.props.openTable.tableName,
      itemPrice: '',
      recieptNo: '',
      checkReciept: false,
      serviceChargesAMT:5,
      discountPercent:10
    };
  }

  componentDidMount = () => {
    dishes().then((resp) => {
      this.setState({
        menuData: resp
      });
    });
    let tableToOpen = this.props.openTable.tableName;
    let orderedTables = this.props.orderedTables.openTables;
    let tableExist = orderedTables.find((table) => {
      return tableToOpen == table.table
    });
    if (tableExist) {
      this.setState({
        ...tableExist
      });
    }
    else {
      let recieptNo = reciept.getReciept();
      recieptNo.then((resp) => {
        this.setState({
          recieptNo: resp
        });
      });
    }
  }
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    if (this.state.order.length) {
      if (this.state.checkReciept) {
        store.dispatch(closeTableByStoringAction(this.state));
      }
      else {
        this.setState({
          checkReciept: true
        }, () => {
          reciept.increaseReciept().then(() => {
            store.dispatch(closeTableByStoringAction(this.state));
          });
        });
      }
    }
    else {
      store.dispatch(closeDialogAction());
    }

  };

  handleCategory = event => {
    this.setState({
      dish: '',
      selectedDish: ''
    }, () => {
      let selectedItem = this.state.menuData.menuItems.find((item) => {
        return item.name == event.target.value
      })
      this.setState({
        name: event.target.value,
        selectedCategory: selectedItem
      });
    });

  };

  handleDish = event => {
    if (this.state.selectedCategory) {
      let selectedDish = this.state.selectedCategory.items.find((dish) => {
        return dish.name == event.target.value
      });
      this.setState({
        dish: event.target.value,
        selectedDish: selectedDish
      });
    }
  }

  handleDishQuantity = event => {
    if (this.state.dish && this.state.selectedDish) {
      console.log(` your dish is: ${this.state.dish} and price is: ${this.state.selectedDish.price * event.target.value}`);
      this.setState({ quantity: event.target.value });
    }
  }
  addOrder = event => {

    let order = this.state.order;

    let discountedBill = 0;

    if (this.state.dish == 'Buffet') {
      let selectedDish = this.state.selectedDish;
      selectedDish.price = this.state.itemPrice;
      this.setState({
        selectedDish: selectedDish
      });
      order.push({
        dishName: this.state.dish,
        price: this.state.selectedDish.price * this.state.quantity,
        quantity: this.state.quantity,
        singlePrice: this.state.selectedDish.price
      });
    }
    else {
      order.push({
        dishName: this.state.dish,
       // price: this.state.selectedDish.price * this.state.quantity,
        price: this.calculatePrice(this.state.quantity.toString(), {price:this.state.selectedDish.price}),
        quantity: this.state.quantity,
        singlePrice: this.state.selectedDish.price
      });
    }

    let tax = 0;

    let totalBill = this.state.totalBill + this.state.selectedDish.price * this.state.quantity;

    if (this.state.discountMode) {
      discountedBill = Math.round(totalBill - totalBill * this.state.discountPercent);
    }

    if (this.state.checked) {

      tax = Math.round(0.16 * (this.state.totalBill + this.state.selectedDish.price * this.state.quantity));

      let grandTotal = this.state.totalBill + (this.state.selectedDish.price * this.state.quantity) + tax - discountedBill;
      this.setState({
        order: order,
        totalBill: this.state.totalBill + this.state.selectedDish.price * this.state.quantity,
        grandTotal: grandTotal - discountedBill,
        taxAmount: tax
      });
    }
    else {
      this.setState({
        order: order,
        totalBill: this.state.totalBill + this.state.selectedDish.price * this.state.quantity,
        grandTotal: this.state.totalBill + this.state.selectedDish.price * this.state.quantity
      });
    }

    this.updateBill({
      discountMode:this.state.discountMode,
      serviceCharges:this.state.serviceCharges,
      taxIncluded: this.state.checked,
      discount: this.state.discountPercent
    });
  }
  updateBill = (args) => {

    let orderedDishes = [];
    orderedDishes.push.apply(orderedDishes, document.querySelectorAll('.ordered-data tbody tr'))

    let lTotal = 0;
    let discountedBill = 0;

    
    (args.order || this.state.order).forEach((item) => {
      lTotal += item.price;
      // lTotal += this.calculatePrice(item.quantity.toString(), {price:item.singlePrice})
      // lTotal += this.calculatePrice(item.quantity.toString(), {price:item.singlePrice})
      //lTotal += item.singlePrice;
    });
    var stotalBill = lTotal;

    if (args.discountMode) {
      discountedBill = Math.round(stotalBill * (args.discount ? args.discount / 100 : 0));
    }

    let tax = 1;
    let serviceCharges = 1;

    if (args.taxIncluded) {

     // tax = Math.round(0.16 * (this.state.totalBill - discountedBill));
      tax = 1.16;
    }

    if(args.serviceCharges){

      let rank = parseFloat(args.serviceCharges).toString() != "NaN" ? args.serviceCharges : this.state.serviceChargesAMT;

      //serviceCharges = (lTotal - discountedBill) * (this.state.serviceChargesAMT ? this.state.serviceChargesAMT / 100: 0);
      serviceCharges = 1 + (rank ? rank / 100: 1);
    }

    this.setState({
      grossTotal: lTotal,
      totalBill: lTotal,
      grandTotal:Math.round((lTotal - discountedBill) * tax * serviceCharges),
      taxAmount: Math.round((lTotal - discountedBill) * tax - (lTotal - discountedBill)),
      serviceChargesCAL:serviceCharges
    });


  }
  handleDiscount = (event) => {
    console.log(event.target.checked);

    this.setState({ discountMode: event.target.checked })

    this.updateBill({
      discount:this.state.discountPercent || 0,
      discountMode:event.target.checked,
      taxIncluded: this.state.checked,
      serviceCharges:this.state.serviceCharges
    });

    //   if(event.target.checked){
    //     let discounted = Math.round(0.07*this.state.totalBill);
    //   this.setState({
    //     [name]: event.target.checked,
    //     grandTotal: this.state.totalBill+tax,
    //     discounted: tax
    //   });
    // }
    // else{
    //   this.setState({
    //     [name]: event.target.checked,
    //     grandTotal: this.state.totalBill,
    //     taxAmount: 0
    //   });
    // }
  };
  handleCheckboxTax = name => event => {

    this.setState({ [name]: event.target.checked });
    this.updateBill({
      discountMode:this.state.discountMode,
      serviceCharges:this.state.serviceCharges,
      taxIncluded: event.target.checked,
      discount: this.state.discountPercent || 0
    });

    // console.log(event.target.checked);
    // if (event.target.checked) {
    //   let tax = Math.round(0.16 * this.state.totalBill);
    //   this.setState({
    //     [name]: event.target.checked,
    //     grandTotal: this.state.totalBill + tax,
    //     taxAmount: tax
    //   });
    // }
    // else {
    //   this.setState({
    //     [name]: event.target.checked,
    //     grandTotal: this.state.totalBill,
    //     taxAmount: 0
    //   });
    // }
  };
  printBill = () => {
    store.dispatch(printTableAction({
      tableName: this.props.openTable.tableName,
      hallName: this.props.openTable.hallName,
      grandTotal: this.state.grandTotal,
      order: this.state.order,
      totalBill: this.state.totalBill,
      taxAmount: this.state.taxAmount,
      recieptNo: this.state.recieptNo
    }));
  }

  deleteItem = (item, getIndex, evt) => {
    let order = this.state.order;
    let getFiltered = order.filter((order, index) => {
      return getIndex !== index;
    });
    if (this.state.checked) {
      this.setState({
        totalBill: this.state.totalBill - item.price,
        taxAmount: this.state.taxAmount - (Math.round(0.07 * item.price)),
        grandTotal: this.state.grandTotal - (Math.round(0.07 * item.price) + item.price),
        order: getFiltered
      });
    }
    else {
      this.setState({
        totalBill: this.state.totalBill - item.price,
        grandTotal: this.state.grandTotal - item.price,
        order: getFiltered
      });
    }
    this.updateBill({
      order:getFiltered,
      serviceCharges:this.state.serviceCharges,
      taxIncluded: this.state.checked,
      discount: this.state.discountPercent || 0
    });
  }
  closeDialog = () => {


  }
  selectDish = (dishName) => {
    this.state.menuData.menuItems.forEach((mainItem) => {
      let category = mainItem.name;
      mainItem.items.forEach((item) => {
        if (item.name == dishName) {
          this.setState({
            name: category,
            dish: item.name,
            selectedCategory: mainItem,
            selectedDish: item,
          });
          return;
        }
      });
    });
  }
  updateDiscount = (evt) => {

    this.setState({
      discountPercent: evt.target.value,
      //grandTotal: evt.target.value ? Math.round(this.state.totalBill - (this.state.totalBill * (evt.target.value / 100))) : this.state.totalBill
    })

    this.updateBill({
      serviceCharges:this.state.serviceCharges,
      taxIncluded: this.state.checked,
      discount: evt.target.value || 0
    });
  }
  handleChangeInput = (evt) => {
    this.setState({
      itemPrice: evt.target.value
    });
  }
  
  calculatePrice(unit, args) {

    let price = 0;

    let uniDiv = unit.split('.');

    price += uniDiv[0] * args.price;

    if (uniDiv[1]) {
      price += args.price * 0.6;
    }

    return price;

  }
  customizeDishPrice(item, evt) {

    //item.price = this.calculatePrice(evt.target.value, {price:item.singlePrice});
    item.singlePrice = evt.target.value;

    this.updateBill({
      discountMode:this.state.discountMode,
      serviceCharges:this.state.serviceCharges,
      taxIncluded: this.state.checked,
      discount: this.state.discountPercent
    })

  }
  handleServiceCharges(evt){ 
    this.updateBill({
      discountMode:this.state.discountMode,
      taxIncluded:this.state.checked,
      discount: this.state.discountPercent,
      serviceCharges:evt.target.checked ? this.state.serviceChargesAMT : 0
    });
    this.setState({
      serviceCharges:evt.target.checked
    });
  }
  updateServiceCharges(evt){
    evt.target.value && this.setState({
      serviceChargesAMT:+evt.target.value
    });
    this.updateBill({
      discountMode:this.state.discountMode,
      taxIncluded:this.state.checked,
      discount: this.state.discountPercent,
      serviceCharges:evt.target.value
    });
  }
  render() {
    const { fullScreen } = this.props;
    return (
      <div>
        {
          this.state.recieptNo && this.state.menuData ?
            <div className="printable">
              <Dialog
                className="Dialog"
                fullWidth={true}
                maxWidth="lg"
                fullScreen={true}
                open={this.props.openTable.flag}
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
                          Recipt No:{this.state.recieptNo}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </DialogTitle>
                <DialogContent className="table-dialogContent">
                  <DialogContentText>
                    <div className="auto-sugession">
                      <AutoSugession menuData={this.state.menuData} selectDishFun={this.selectDish.bind(this)} />
                    </div>
                    <div className="select-option">
                      <FormControl className="formControl">
                        <InputLabel htmlFor="category-simple">Category</InputLabel>
                        <Select

                          value={this.state.name}
                          onChange={this.handleCategory}
                          inputProps={{
                            name: 'name',
                            id: 'category-simple',
                          }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {
                            this.state.menuData.menuItems.map((item, index) => {
                              return <MenuItem key={item.name + index} value={item.name}>{item.name}</MenuItem>
                            })
                          }
                        </Select>
                      </FormControl>
                    </div>

                    <div className="select-option">
                      <FormControl className="formControl">
                        <InputLabel htmlFor="dish-simple">Dishes</InputLabel>
                        <Select
                          value={this.state.dish}
                          onChange={this.handleDish}
                          inputProps={{
                            name: 'dish',
                            id: 'dish-simple',
                          }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {
                            this.state.selectedCategory ? this.state.selectedCategory.items.map((item, index) => {
                              return <MenuItem key={item.name + index} value={item.name}>{item.name}</MenuItem>
                            }) : null
                          }
                        </Select>
                      </FormControl>
                    </div>
                    <div className="select-option">
                      <FormControl className="formControl-quantity">
                        <InputLabel htmlFor="quantity-simple">Select</InputLabel>
                        <Select
                          value={this.state.quantity}
                          onChange={this.handleDishQuantity}
                          inputProps={{
                            name: 'quantity',
                            id: 'quantity-simple',
                          }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {
                            this.state.selectedDish ? this.state.menuData.quantity.map((item, index) => {
                              return <MenuItem key={item + index} value={item}>{item}</MenuItem>
                            }) : null
                          }
                        </Select>
                      </FormControl>
                    </div>
                    {this.state.dish != 'Buffet' ?
                      <div className="select-option">
                        {this.state.dish && this.state.selectedDish && this.state.quantity ? <Fab onClick={this.addOrder.bind(this)} size="medium" color="secondary" aria-label="Add">
                          <AddIcon />
                        </Fab> : null
                        }
                      </div> : null
                    }
                    {
                      this.state.dish == 'Buffet' && this.state.itemPrice ? <div className="select-option">
                        {this.state.dish && this.state.selectedDish && this.state.quantity ? <Fab onClick={this.addOrder.bind(this)} size="medium" color="secondary" aria-label="Add">
                          <AddIcon />
                        </Fab> : null
                        }
                      </div> : null
                    }

                    {this.state.dish == 'Buffet' ?
                      <div className="select-inputs-tableOrder">
                        <div>
                          <TextField
                            id="standard-price"
                            label="price"
                            value={this.state.itemPrice}
                            type='number'
                            onChange={this.handleChangeInput.bind(this)}
                            margin="normal"
                          />
                        </div>

                      </div> : null
                    }

                    {this.state.order.length ? <div className="ordered-data">
                      <Paper>
                        <Table>
                          <TableRow>
                            <TableCell align="left"><Typography className='typo-heading-table' variant='BUTTON'><b>Dish Name</b></Typography></TableCell>
                            <TableCell align="left"><Typography className='typo-heading-table' variant='BUTTON'><b>Order</b></Typography></TableCell>
                            <TableCell align="left"><Typography className='typo-heading-table' variant='BUTTON'><b>Price</b></Typography></TableCell>
                          </TableRow>
                          <TableBody>
                            {this.state.order.map((item, index) => (
                              <TableRow key={index}>
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
                                  <TextField
                                    id="standard-price"
                                    label="price"
                                    defaultValue={item.price}
                                    type='number'
                                    onChange={this.customizeDishPrice.bind(this, item)}
                                    margin="normal"
                                    style={{ "width": 70 }}
                                  />
                                  {/* {item.price} */}
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell rowSpan={3} />
                              <TableCell className="amount-section">Sub Total</TableCell>
                              <TableCell align="left" className="amount-section">{this.state.grossTotal}</TableCell>
                            </TableRow>

                            {this.state.taxAmount ? <TableRow>
                              <TableCell className="amount-section">
                                Sales Tax
                      </TableCell>
                              <TableCell align="left" className="amount-section">{this.state.taxAmount ? this.state.taxAmount : ''}</TableCell>
                            </TableRow> : null
                            }


                            {this.state.discountMode ? <TableRow>
                              <TableCell className="amount-section">
                                Discount
                      </TableCell>
                              <TableCell align="left" className="amount-section">
                                <TextField
                                  id="discount-percent"
                                  label="Discount"
                                  value={this.state.discountPercent}
                                  type='number'
                                  onChange={this.updateDiscount.bind(this)}
                                  margin="normal"
                                  style={{ "width": 70 }}
                                />
                              </TableCell>
                            </TableRow> : null
                            }
                            {this.state.serviceCharges ? <TableRow>
                              <TableCell className="amount-section">
                                Service Charges
                      </TableCell>
                              <TableCell align="left" className="amount-section">
                                <TextField
                                  id="discount-percent"
                                  label="Service Charges%"
                                  value={this.state.serviceChargesAMT}
                                  type='number'
                                  onChange={this.updateServiceCharges.bind(this)}
                                  margin="normal"
                                  style={{ "width": 70 }}                                  
                                />
                              </TableCell>
                            </TableRow> : null
                            }

                            <TableRow>
                              <TableCell className="amount-section">
                                Grand Total
                      </TableCell>
                              <TableCell align="left" className="amount-section">{this.state.grandTotal}</TableCell>
                            </TableRow>

                          </TableBody>
                        </Table>
                      </Paper>
                    </div> : null
                    }
                    <Recipt data={this.state} />

                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <div className="action-button">
                    {this.state.order.length ? <FormControlLabel
                      control={
                        <div>
                          GST
                  <Checkbox
                            checked={this.state.checked}
                            onChange={this.handleCheckboxTax('checked')}
                            value="checked"
                          />
                        </div>
                      }

                    /> : null
                    }
                    {this.state.order.length ? <FormControlLabel
                      control={
                        <div>
                          Discount
                  <Checkbox
                            checked={this.state.discountMode}
                            onChange={this.handleDiscount.bind(this)}
                            value="checked"
                          />
                        </div>
                      }

                    /> : null
                    }
                     {this.state.order.length ? <FormControlLabel
                      control={
                        <div>
                          Service Charges
                  <Checkbox
                            checked={this.state.serviceCharges}
                            onChange={this.handleServiceCharges.bind(this)}
                            value="checked"
                          />
                        </div>
                      }

                    /> : null
                    }
                    {this.state.order.length ? <Button onClick={this.printBill.bind(this)} variant="contained" color="secondary">
                      Save and Print
                <Print />
                    </Button> : null
                    }

                  </div>
                </DialogActions>
              </Dialog>
            </div> : null
        }
      </div>
    );
  }
}

ResponsiveDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
};

const mapDispatchToProps = (state) => {
  return {
    openTable: state.openTableReducer,
    orderedTables: state.closeTableButSaveReducer
  }
}

const newResponsiveDialog = withMobileDialog()(ResponsiveDialog);
const dialogBox = connect(mapDispatchToProps)(newResponsiveDialog);
export default dialogBox;