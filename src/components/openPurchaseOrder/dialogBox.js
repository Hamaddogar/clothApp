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
import Close from '@material-ui/icons/Close';
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
import { printTableAction, printEstimationAction, pre_printEstimationAction } from '../../store/actions/printTableAction/printTableAction';
import { closeTableByStoringAction, removeTableByStoringAction } from '../../store/actions/closeTableByStoringAction/closeTableByStoringAction';
import reciept from '../../services/reciept/reciept';
import getAllData from '../../store/actions/getaAllData/getAllData'
import { connect } from 'react-redux';
import { getDishes } from '../../services/getDishes/getDishes';
import Recipt from '../reciept/reciept';
import './styles/style.css';
import AutoSugession from '../autoSugessionInput/autoSugessionInput';
import Input from '@material-ui/core/Input';
import colorIcon from './color-icon.png';
import savingGif from '../../saving-gif.gif';
import { debug } from 'util';
import { ToastContainer, toast } from 'react-toastify';
import Barcode from 'react-barcode';
import uuid from 'uuid'
import 'react-toastify/dist/ReactToastify.css';
class ResponsiveDialog extends React.Component {
  constructor(props) {
    let updatedData = [];
    let colData = [];
    let cCounter = 0;
    var columns = 8;
    debugger;
    props.openTable.colors.forEach((item, index) => {
      if (cCounter == columns) {
        updatedData.push(colData.slice(0));
        colData.length = 0;
        cCounter = 0;
      }
      cCounter++;
      colData.push(item);
    });
    debugger
    let generatedItems = (columns * updatedData.length);
    if (props.openTable.colors.length > generatedItems) {
      updatedData.push(props.openTable.colors.slice(generatedItems));
    }
    super(props);
    this.inProcess = false;
    this.state = {
      open:this.props.open,
      selectedColor: {},
      updatedData: updatedData,
      sizes: ['XL', 'X', 'M', 'L'],
      color: ['BLUE', 'GREEN', 'RED', 'MAGENTA'],

      settings: {
        brands: this.props.openTable.brands || []
      },
      // menuData: '',
      menuData: {
        menuItems: []
      },
      barcode: '',
      completeBarcode:'',
      // quantity: '',
      name: '',
      dish: '',
      selectedCategory: '',
      selectedDish: '',
      quantity: '',
      price: 0,
      order: [],
      totalBill: 0,
      grandTotal: 0,
      checked: false,
      taxAmount: 0,
      table: this.props.openTable.tableName,
      itemPrice: '',
      recieptNo: '',
      newProducts:{},
      checkReciept: false,
      serviceChargesAMT: 5,
      emptProductObject:{},
      discountPercent: 10,
      specialDiscount: this.props.settingOffer.discount,
      specialDiscountMode: this.props.loginReducer.loggedIn.itemDiscount
    };
  }
  componentDidMount = () => {
    // this.handleClickOpen()
    toast.configure()
    let recieptNo = reciept.getReciept();
    recieptNo.then((resp) => {
      this.setState({
        recieptNo: resp
      });
    });
   
  }
  handleClickOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    debugger;
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
        store.dispatch({
          type: "CLOSE_PURCHASING_DIALOG"
        });
      }
    }
    else {
      store.dispatch(removeTableByStoringAction({ table: this.props.openTable.tableName }));
      // store.dispatch(closeDialogAction());
      store.dispatch({
        type:'CLOSE_PURCHASING_DIALOG'
      });
    }
   
   

  };
  handleCategory = event => {
    let selectedBrand = this.state.settings.brands.find((brand) => {
      return brand.name == event.target.value
    });
    this.setState({
      name: selectedBrand.name,
      selectedBrand: selectedBrand,
      selectedCategory: selectedBrand.types
    });
  };
  handleSize = event => {
    this.setState({
      size: event.target.value
    })
  }
  handleColor = event => {
    this.setState({
      color: event.target.value
    })
  }
  handleDish = event => {
    if (this.state.selectedCategory) {
      let selectedDish = this.state.selectedCategory.find((dish) => {
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
  addOrder =() => {
    let order = this.state.order;
    let discountedBill = 0;
    let newGrandTotle
    let fullBarCode = this.state.barcode;
    let filterProducts
    let splitBarcode = fullBarCode.split('_')
      filterProducts = this.props.openTable.brands.map((item) => {
        debugger;
        return   item.items.find((allitem) => {
          return allitem.brand === splitBarcode[0] && allitem.size === splitBarcode[1] && allitem.color.name === splitBarcode[2]
        })
      })
    
    filterProducts.pop()
    let newProducts = filterProducts[0]
    // if(!newProducts){
    //   toast.error('No product Found',{
    //     autoClose:3000
    //   })
    //   return
    // }
    if(newProducts.quantity < 1){
      toast.warn('This Product Out of Stock',{
        autoClose:3000
      })
      return
    }
   console.log(filterProducts)
  if (this.state.specialDiscountMode) {
      console.log(this.state.quantity)
      this.state.barcode && newProducts  ?
      order.push({
        name: newProducts.brand,
        date: (new Date).toDateString(),
        dishName: newProducts.dishName,
        quantity: newProducts.quantity -= 1,
        size: newProducts.size,
        type: newProducts.dishName,
        color: newProducts.color.name,
        price: newProducts.price,
        singlePrice: Math.round(newProducts.singlePrice - (newProducts.singlePrice * this.state.specialDiscount / 100))
      }): this.setState({
        order:[]
      })
console.log(this.state.order)


    } else {
      console.log(this.state.quantity)
      this.state.barcode && newProducts  ?
      order.push({
        name: newProducts.brand,
        date: (new Date).toDateString(),
        dishName: newProducts.dishName,
        quantity: newProducts.quantity -= 1,
        size: newProducts.size,
        type: newProducts.dishName,
        color: newProducts.color.name,
        price: newProducts.price,
        singlePrice: parseInt(newProducts.singlePrice)
      }): this.setState({
        order:[]
      })



        //  {
        //     name: this.state.name,
        //     date: (new Date).toDateString(),
        //     dishName: this.state.dishName,
        //     quantity: this.state.quantity,
        //     size: this.state.size,
        //     type: this.state.dishName,
        //     color: this.state.color.name,
        //     price: +this.state.singlePrice,
        //     // singlePrice: this.state.singlePrice
        //   }
      
      console.log(this.state.order)

    }
    this.setState({
      barcode: '',
      name: '',
      dish: '',
      selectedBrand: {},
      selectedColor: '',
      itemPrice: '',
      // quantity: '',
      size: '',
    });
    // }
    if(this.state.barcode && newProducts){
    let tax = 0;
    let totalBill
     totalBill = this.state.totalBill + newProducts.singlePrice;
  
    if (this.state.discountMode) {
      discountedBill = Math.round(totalBill - totalBill * this.state.discountPercent);
    }
    if (this.state.checked) {
      tax = Math.round(0.16 * (this.state.totalBill + newProducts.singlePrice));
      let grandTotal = this.state.totalBill + (newProducts.singlePrice) + tax - discountedBill;
      this.setState({
        order: order,
        totalBill: this.state.totalBill + newProducts.singlePrice,
        grandTotal: grandTotal - discountedBill,
        taxAmount: tax
      });
    }
    if (this.state.specialDiscountMode) {
      this.setState({
        grandTotal: Math.round((totalBill - totalBill * this.state.specialDiscount / 100))
      })
    }
    else {
      this.setState({
        order: order,
        totalBill: (this.state.totalBill) + newProducts.singlePrice,
        grandTotal: parseInt(this.state.totalBill)
      });
    }
    this.updateBill({
      discountMode: this.state.discountMode,
      serviceCharges: this.state.serviceCharges,
      taxIncluded: this.state.checked,
      discount: this.state.discountMode ? this.state.discountPercent : 0
    })
  }else{
    // toast('Product Not found')
    return
  }
  }
 
  saveToLocal = (args) => {
    let ununcheckedTables = JSON.parse(localStorage.getItem('uTables') || '[]');
    let table = ununcheckedTables.find((uTable) => {
      return uTable.tableName == this.props.openTable.tableName
    });
    if (table) {
      table.data = this.state;
    } else {
      ununcheckedTables.push({
        tableName: this.props.openTable.tableName,
        data: this.state
      });
    }
    localStorage.setItem('uTables', JSON.stringify(ununcheckedTables));
  }
  updateBill = (args) => {
    if(this.state.order.length){
      let orderedDishes = [];
      orderedDishes.push.apply(orderedDishes, document.querySelectorAll('.ordered-data tbody tr'))
      let lTotal = 0;
      let discountedBill = 0;
      (args.order || this.state.order).forEach((item) => {
        lTotal += item.singlePrice;
      });
      var stotalBill = lTotal;
      if (args.discountMode || args.discount) {
        discountedBill = Math.round(stotalBill * (args.discount ? args.discount / 100 : 0));
      }
      let tax = 1;
      let serviceCharges = 1;
      if (args.taxIncluded) {
        tax = 1.16;
      }
      if (args.serviceCharges) {
        let rank = parseFloat(args.serviceCharges).toString() != "NaN" ? args.serviceCharges : this.state.serviceChargesAMT;
        serviceCharges = 1 + (rank ? rank / 100 : 1);
      }
      this.setState({
        grossTotal: lTotal,
        totalBill: lTotal,
        grandTotal: Math.round((lTotal - discountedBill) * tax * serviceCharges),
        taxAmount: Math.round((lTotal - discountedBill) * tax - (lTotal - discountedBill)),
        serviceChargesCAL: serviceCharges
      });
      setTimeout(() => {
        this.saveToLocal();
      }, 500);
    }else{
     return
    }
  }
  handleDiscount = (event) => {
    console.log(event.target.checked);
    this.setState({ discountMode: event.target.checked })
    this.updateBill({
      discount: event.target.checked ? this.state.discountPercent : 0,
      discountMode: event.target.checked,
      taxIncluded: this.state.checked,
      serviceCharges: this.state.serviceCharges
    });
  };
  handleCheckboxTax = name => event => {
    this.setState({ [name]: event.target.checked });
    this.updateBill({
      discountMode: this.state.discountMode,
      serviceCharges: this.state.serviceCharges,
      taxIncluded: event.target.checked,
      discount: this.state.discountMode ? this.state.discountPercent : 0
    });
  };
  handleKeySubmission(evt) {
    if (evt.key == "Enter") {
      if (!this.state.customerName) {
        return;
      }
      this.printBill();
    }
  }
  openColorPalette = (evt) => {
    this.setState({
      colorPalette: true
    });
  }
  printBill = (evt) => {
    if (this.props.openTable.inProcess) {
      return;
    }
    store.dispatch({
      type: 'UPDATE_INVENTORY',
      data: {
        order: this.state.order,
        totalBill: this.state.totalBill
      }
    });
    store.dispatch({
      type: 'SAVE_TRANSACTIONS_DATA',
      data: {
        orderId:uuid(),
        order: this.state.order,
      }
    });
   
  }
  printEstimation = () => {
    this.setState({
      estimation: true,
      hideReceipt: true
    });
    setTimeout(() => {
      store.dispatch(printEstimationAction({
        tableName: this.props.openTable.tableName,
        hallName: this.props.openTable.hallName,
        grandTotal: this.state.grandTotal,
        order: this.state.order,
        totalBill: this.state.totalBill,
        taxAmount: this.state.taxAmount,
        recieptNo: this.state.recieptNo
      }));
    }, 200);
  }
  handledNamedReceipt(evt) {

    this.setState({
      namedReceipt: evt.target.checked
    });
  }
  deleteItem = (item, getIndex, evt) => {
    let order = this.state.order;
    let getFiltered = order.filter((order, index) => {
      return getIndex !== index;
    });
    this.setState({ order: getFiltered });
    this.updateBill({
      order: getFiltered,
      serviceCharges: this.state.serviceCharges,
      taxIncluded: this.state.checked,
      discount: this.state.discountMode ? this.state.discountPercent : 0
    });
  }
  closeDialog = () => {
    this.handleClose();
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
  updateCustomerName(evt) {
    this.setState({
      customerName: evt.target.value
    });
  }
  updateDiscount = (evt) => {
    this.setState({
      discountPercent: evt.target.value,
    })
    this.updateBill({
      serviceCharges: this.state.serviceCharges,
      taxIncluded: this.state.checked,
      discount: this.state.discountMode ? evt.target.value : 0
    });
  }
  // handlePushOrder = (evt) => {
  //   if (evt.keyCode == 13 && this.state.dish && this.state.selectedDish && this.state.itemPrice && this.state.selectedColor.code) {
  //     this.addOrder();
  //   }
  // }
  handleChangeInput = (evt) => {
    this.setState({
      itemPrice: evt.target.value
    });
  }
  handlebarcodeInput = (evt) => {
    let value  = evt.target.value;

  this.setState({
      barcode:evt.target.value
    })
    setTimeout(()=>this.setState({
      barcode:''
    }),1000)
    
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
    item.singlePrice = +evt.target.value;
    item.price = +evt.target.value;
    this.updateBill({
      discountMode: this.state.discountMode,
      serviceCharges: this.state.serviceCharges,
      taxIncluded: this.state.checked,
      discount: this.state.discountMode ? this.state.discountPercent : 0
    })
  }
  handleServiceCharges(evt) {
    this.updateBill({
      discountMode: this.state.discountMode,
      taxIncluded: this.state.checked,
      discount: this.state.discountMode ? this.state.discountPercent : 0,
      serviceCharges: evt.target.checked ? this.state.serviceChargesAMT : 0
    });
    this.setState({
      serviceCharges: evt.target.checked
    });
  }
  updateServiceCharges(evt) {
    evt.target.value && this.setState({
      serviceChargesAMT: +evt.target.value
    });
    this.updateBill({
      discountMode: this.state.discountMode,
      taxIncluded: this.state.checked,
      discount: this.state.discountMode ? this.state.discountPercent : 0,
      serviceCharges: evt.target.value
    });
  }
  selectColor = (color) => (evt) => {
    console.log(color);
    this.setState({
      selectedColor: color,
      colorPalette: false
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
                hidden={this.state.colorPalette}
                className="Dialog"
                fullWidth={true}
                maxWidth="lg"
                fullScreen={false}
                open={true}
                onClose={this.handleClose}
                aria-labelledby="responsive-dialog-title"
              >
                <div className="inProcessContainer" hidden={!this.props.openTable.inProcess}></div>
                <img hidden={!this.props.openTable.inProcess} className="loadingGIF" src={savingGif} />
                <DialogTitle id="responsive-dialog-title">
                  <Paper className="paper-heading custHeader" elevation={1}>
                    <Grid container>
                      <Grid item xs={4}>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography className="custHeader" align="center" variant="h5" component="h3">
                          RECEIPT COUNTER
                  </Typography>
                      </Grid>
                      {this.props.hideReceipt &&
                        <Grid item xs={4}>
                          <Typography color="inherit" align="right" variant="body2">
                            <strong className="bill-estimation">(Bill Estimation Guide)</strong>
                          </Typography>
                        </Grid>
                      }
                      <Grid hidden={this.props.hideReceipt} item xs={4}>
                      </Grid>
                    </Grid>
                  </Paper>
                </DialogTitle>
                <DialogContent className="table-dialogContent">
                  <DialogContentText>
                    <div className="hiddenbarcode">
                      <Input
                        autoFocus={true}
                        disableUnderline={true}
                        placeholder="Product Id"
                        value={this.state.barcode}
                        onChange={this.handlebarcodeInput.bind(this)}
                        inputProps={{
                          'aria-label': 'Description',
                        }}
                      />
                    </div>
                    <div className="select-option">
                      <InputLabel htmlFor="category-simple">Brand</InputLabel>
                      <FormControl className="formControl">
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
                            this.state.settings.brands.map((item, index) => {
                              return <MenuItem key={item.name + index} value={item.name}>{item.name}</MenuItem>
                            })
                          }
                        </Select>
                      </FormControl>
                    </div>
                    <div className="select-option">
                      <InputLabel htmlFor="dish-simple">Item</InputLabel>
                      <FormControl className="formControl">
                        <Select
                          value={this.state.dish}
                          onChange={this.handleDish}
                          inputProps={{
                            name: 'name-dish',
                            id: 'dish-simple',
                          }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {
                            this.state.selectedCategory ? this.state.selectedCategory.map((item, index) => {
                              return <MenuItem key={item.name + index} value={item.name}>{item.name}</MenuItem>
                            }) : null
                          }
                        </Select>
                      </FormControl>
                    </div>
                    <div className="select-option">
                      <InputLabel htmlFor="sizeSimple">Size</InputLabel>
                      <FormControl className="formControl">
                        <Select
                          value={this.state.size}
                          onChange={this.handleSize}
                          inputProps={{
                            name: 'name-size',
                            id: 'sizeSimple',
                          }}
                        >
                          <MenuItem value="None">
                            <em>None</em>
                          </MenuItem>
                          {
                            this.state.selectedCategory ? this.state.sizes.map((item, index) => {
                              return <MenuItem key={item.name + index} value={item}>{item}</MenuItem>
                            }) : null
                          }
                        </Select>
                      </FormControl>
                    </div>
                    <div className="select-option">
                      <InputLabel htmlFor="color-simple">Color</InputLabel>
                      <span style={{ 'backgroundColor': this.state.selectedColor.code || 'white' }} className="color-preview"></span>
                      <img onClick={this.openColorPalette} src={colorIcon} className="def-btn" />
                    </div>
                    <div className="select-option">
                      <FormControl className="formControl-quantity">
                        <TextField
                          id="standard-price"
                          label="Quantity"
                          value={this.state.quantity}
                          type='number'
                          onChange={this.handleDishQuantity.bind(this)}
                          margin="normal"
                        />
                      </FormControl>
                    </div>
                    {
                      this.state.barcode[this.state.barcode.length-1] === '_' ? this.addOrder()
                        : null
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
                    {/* {
                                        this.state.dish == 'Buffet' && this.state.itemPrice ? <div className="select-option">
                                          {this.state.dish && this.state.selectedDish && this.state.quantity ? <Fab onClick={this.addOrder.bind(this)} size="medium" color="secondary" aria-label="Add">
                                            <AddIcon />
                                          </Fab> : null
                                          }
                                        </div> : null
                                      } */}
                    { 
                      // this.state.emptProductObject === undefined ? toast("Wow so easy !") :
                    this.state.order.length  ? <div className="ordered-data">
                    <Paper>
                      <Table>
                        <TableRow>
                          <TableCell align="left"><Typography className='typo-heading-table' variant='BUTTON'><b>Name</b></Typography></TableCell>
                          <TableCell align="left"><Typography className='typo-heading-table' variant='BUTTON'><b>Quantity</b></Typography></TableCell>
                          <TableCell align="left"><Typography className='typo-heading-table' variant='BUTTON'><b>Size</b></Typography></TableCell>
                          <TableCell align="left"><Typography className='typo-heading-table' variant='BUTTON'><b>Price</b></Typography></TableCell>
                        </TableRow>
                        <TableBody>
                          {this.state.order.map((item, index) => {

                            return <TableRow key={index}>
                              <TableCell component="th" scope="row">
                                {item.dishName}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {item.quantity + 1}
                                <div className="delete-button-div">
                                  <IconButton onClick={this.deleteItem.bind(this, item, index)} aria-label="Delete">
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </div>
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {item.size}
                              </TableCell>

                              <TableCell component="th" scope="row">
                                {item.singlePrice}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                <Barcode value={item.name + '_' + item.size + '_' + item.color+'_'}
                                  width={1}
                                  height={40}
                                  fontSize={8}
                                />
                              </TableCell>
                            </TableRow>
                          })}

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
                  </div> :null
                    
                    }
                    <Recipt data={this.state} hideReceipt={this.props.hideReceipt} />
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <div className="action-button">
                    {
                      this.state.namedReceipt ?
                        <TextField
                          id="customerNameField"
                          label="Customer Name"
                          value={this.state.customerName}
                          type='text'
                          onChange={this.updateCustomerName.bind(this)}
                          margin="normal"
                          onKeyDown={this.handleKeySubmission.bind(this)}
                          error={!this.state.customerName}
                          style={{ "width": 200 }}
                        /> : null
                    }
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
                      control={<div>
                        Named Receipt
                        <Checkbox
                          checked={this.state.namedReceipt}
                          onChange={this.handledNamedReceipt.bind(this)}
                          value="checked"
                        />
                      </div>
                      }
                    /> : null
                    }
                  </div>
                  {!this.props.hideReceipt && this.state.order.length ? <Button className="mr-10" disabled={this.state.namedReceipt && !this.state.customerName} onClick={this.printBill.bind(this)} variant="contained" color="secondary">
                      Save and Print
                <Print />
                    </Button> : null
                    }
                    {!this.props.hideReceipt && this.state.order.length ? <Button className="mr-10" onClick={this.printEstimation.bind(this)} variant="contained" color="secondary">
                      Print
              <Print />
                    </Button> : null
                    }
                  {!this.props.hideReceipt && this.state.order.length ? <div>
                    <Button className="mr-10" disabled={this.state.namedReceipt && !this.state.customerName} onClick={this.printBill.bind(this)} variant="contained" color="secondary">
                      Save
                <Print />
                    </Button>
                  </div> : null
                  }
                     <Button className="mr-10" onClick={this.closeDialog.bind(this)} variant="contained" color="secondary">
                      Close
                <Close />
                    </Button>
                </DialogActions>
              </Dialog>
              <div class="color-paletter-box" hidden={!this.state.colorPalette}>
                <div class="flex">
                  <Grid item md={12}>
                    <Typography color="textPrimary" align="center" variant="h5" component="h3">
                      COLOR LIBRARY
                  </Typography>
                  </Grid>
                  <Table className="table" border="1">
                    {this.state.updatedData.map((item, index) => {
                      return <TableRow className="height-10 color-row">
                        {item.map((col) => {
                          return <React.Fragment>
                            <TableCell onClick={this.selectColor(col)} className="color-box no-padding" style={{ 'background-color': col.code }}></TableCell>
                            <TableCell onClick={this.selectColor(col)} className="no-padding padd-left">{col.name}</TableCell>
                          </React.Fragment>
                        })}
                      </TableRow>
                    })}
                  </Table>
                </div>
              </div>
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
    orderedTables: state.closeTableButSaveReducer,
    settingOffer: state.settingReducer,
    loginReducer: state.loginReducer,
    settingOffer: state.settingsReducer

  }
}
const newResponsiveDialog = withMobileDialog()(ResponsiveDialog);
const dialogBox = connect(mapDispatchToProps)(newResponsiveDialog);
export default dialogBox;