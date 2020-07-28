import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Close from "@material-ui/icons/Close";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import Print from "@material-ui/icons/Print";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import store from "../../store/store";
import closeDialogAction from "../../store/actions/closeDialogAction/closeDialogAction";
import {
  printTableAction,
  printEstimationAction,
  pre_printEstimationAction
} from "../../store/actions/printTableAction/printTableAction";
import {
  closeTableByStoringAction,
  removeTableByStoringAction
} from "../../store/actions/closeTableByStoringAction/closeTableByStoringAction";
import reciept from "../../services/reciept/reciept";
import { connect } from "react-redux";
import { getDishes } from "../../services/getDishes/getDishes";
import BarcodeGen from "../barcodeGen/barcodeGen";
import Receipt from "../reciept/reciept";
import "./styles/style.css";
import AutoSugession from "../autoSugessionInput/autoSugessionInput";
import JsBarcode from "jsbarcode";
// import Canvas from "canvas";
import Barcode from "react-barcode";
import  fs from'fs';
// import {dirname} from './utils.js';
import {saveAs} from 'file-saver' 
import path from 'path';


import colorIcon from "./color-icon.png";
import savingGif from "../../saving-gif.gif";
import { debug } from "util";

class ResponsiveDialog extends React.Component {
  constructor(props) {
    super(props);
    window.estimation = this.printEstimation;

    //TBC decouple this code

    // this.rows = props.openTable.colors / 10;

    let updatedData = [];

    let colData = [];
    let cCounter = 0;
    var columns = 8;

    props.openTable.colors.forEach((item, index) => {
      if (cCounter == columns) {
        updatedData.push(colData.slice(0));
        colData.length = 0;
        cCounter = 0;
      }

      cCounter++;
      colData.push(item);
    });

    let generatedItems = columns * updatedData.length;

    if (props.openTable.colors.length > generatedItems) {
      updatedData.push(props.openTable.colors.slice(generatedItems));
    }

    super(props);
    this.inProcess = false;
    this.state = {
      selectedColor: {},
      updatedData: updatedData,
      sizes: ["XL", "X", "M", "L", "XL"],
      color: ["BLUE", "GREEN", "RED", "MAGENTA"],

      settings: {
        brands: this.props.openTable.brands || []
      },
      // menuData: '',
      menuData: {
        menuItems: []
      },
      name: "",
      dish: "",
      selectedCategory: "",
      selectedDish: "",

      quantity: "",
      price: 0,
      barCode: "",
      order: [],
      totalBill: 0,
      grandTotal: 0,
      checked: false,
      taxAmount: 0,
      table: this.props.openTable.tableName,
      itemPrice: "",
      recieptNo: "",
      checkReciept: false,
      serviceChargesAMT: 5,
      discountPercent: 10
    };
  }

  componentDidMount = () => {
    let recieptNo = reciept.getReciept();
    recieptNo.then(resp => {
      this.setState({
        recieptNo: resp
      });
    });

    // dishes().then((resp) => {
    //   this.setState({
    //     menuData: resp
    //   });
    // });
    // let tableToOpen = this.props.openTable.tableName;
    // let orderedTables = this.props.orderedTables.openTables;
    // let tableExist = orderedTables.find((table) => {
    //   return tableToOpen == table.table
    // });
    // if (tableExist) {
    //   this.setState({
    //     ...tableExist
    //   });
    //   setTimeout(() => {
    //     this.updateBill({
    //       discountMode: this.state.discountMode,
    //       serviceCharges: this.state.serviceCharges,
    //       taxIncluded: this.state.checked,
    //       discount: this.state.discountMode ? this.state.discountPercent : 0
    //     });
    //   }, 100);
    // }
    // else {
    //   let recieptNo = reciept.getReciept();
    //   recieptNo.then((resp) => {
    //     this.setState({
    //       recieptNo: resp
    //     });
    //   });
    // }
  };
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    debugger;
    if (this.state.order.length) {
      if (this.state.checkReciept) {
        store.dispatch(closeTableByStoringAction(this.state));
      } else {
        this.setState(
          {
            checkReciept: true
          },
          () => {
            reciept.increaseReciept().then(() => {
              store.dispatch(closeTableByStoringAction(this.state));
            });
          }
        );
      }
    } else {
      debugger;
      // store.dispatch(removeTableByStoringAction({ table: this.props.openTable.tableName }));
      store.dispatch(closeDialogAction());
    }
  };

  handleCategory = event => {
    let selectedBrand = this.state.settings.brands.find(brand => {
      return brand.name == event.target.value;
    });

    this.setState({
      name: selectedBrand.name,
      selectedBrand: selectedBrand,
      selectedCategory: selectedBrand.types
    });

    // this.setState({
    //   dish: '',
    //   selectedDish: ''
    // }, () => {
    //   let selectedItem = this.state.menuData.menuItems.find((item) => {
    //     return item.name == event.target.value
    //   })
    //   this.setState({
    //     name: event.target.value,
    //     selectedCategory: selectedItem
    //   });
    // });
  };
  handleSize = event => {
    this.setState({
      size: event.target.value
    });
  };
  handleColor = event => {
    this.setState({
      color: event.target.value
    });
  };
  handleDish = event => {
    if (this.state.selectedCategory) {
      let selectedDish = this.state.selectedCategory.find(dish => {
        return dish.name == event.target.value;
      });
      this.setState({
        dish: event.target.value,
        selectedDish: selectedDish
      });
    }
  };

  handleDishQuantity = event => {
    if (this.state.dish && this.state.selectedDish) {
      console.log(
        ` your dish is: ${this.state.dish} and price is: ${this.state
          .selectedDish.price * event.target.value}`
      );
      this.setState({ quantity: event.target.value });
    }
  };
  addOrder = event => {
    let order = this.state.order;

    let discountedBill = 0;

    // if (this.state.dish == 'Buffet') {
    //   let selectedDish = this.state.selectedDish;
    //   selectedDish.price = this.state.itemPrice;
    //   this.setState({
    //     selectedDish: selectedDish
    //   });
    //   order.push({
    //     date: (new Date).toDateString(),
    //     size:this.state.size,
    //     dishName: this.state.dish,
    //     price: this.state.selectedDish.price * this.state.quantity,
    //     quantity: this.state.quantity,
    //     singlePrice: this.state.selectedDish.price
    //   });
    // }
    // else {

    order.push({
      brand: this.state.selectedBrand.name,
      date: new Date().toDateString(),
      dishName: this.state.dish,
      size: this.state.size,
      type: this.state.dish,
      color: this.state.selectedColor,
      // price: this.state.selectedDish.price * this.state.quantity,
      // price: this.calculatePrice(this.state.quantity.toString(), { price: this.state.selectedDish.price }),
      price: +this.state.quantity * +this.state.itemPrice,
      quantity: this.state.quantity,
      singlePrice: this.state.itemPrice
    });

    this.setState({
      name: "",
      dish: "",
      selectedBrand: {},
      selectedColor: "",
      itemPrice: "",
      quantity: "",
      size: ""
    });

    // var w = 420, h = 200;
    // var canvas = document.getElementById("canvasId");
    // var g = canvas.getContext("2d");
    // g.fillStyle = "white";
    // g.fillRect(0, 0, w, h);
    // bardcode.drawBarcode(g, "test", {});
    // const newBar = this.state.dish + this.state.itemPrice
    // const element = document.getElementById('canvasId')
    // JsBarcode(element, newBar)
    // }

    let tax = 0;

    let totalBill =
      this.state.totalBill +
      this.state.selectedDish.price * this.state.quantity;

    if (this.state.discountMode) {
      discountedBill = Math.round(
        totalBill - totalBill * this.state.discountPercent
      );
    }

    if (this.state.checked) {
      tax = Math.round(
        0.16 *
          (this.state.totalBill +
            this.state.selectedDish.price * this.state.quantity)
      );

      let grandTotal =
        this.state.totalBill +
        this.state.selectedDish.price * this.state.quantity +
        tax -
        discountedBill;
      this.setState({
        order: order,
        totalBill:
          this.state.totalBill +
          this.state.selectedDish.price * this.state.quantity,
        grandTotal: grandTotal - discountedBill,
        taxAmount: tax
      });
    } else {
      this.setState({
        order: order,
        totalBill:
          this.state.totalBill +
          this.state.selectedDish.price * this.state.quantity,
        grandTotal:
          this.state.totalBill +
          this.state.selectedDish.price * this.state.quantity
      });
    }

    this.updateBill({
      discountMode: this.state.discountMode,
      serviceCharges: this.state.serviceCharges,
      taxIncluded: this.state.checked,
      discount: this.state.discountMode ? this.state.discountPercent : 0
    });
    this.props.getOrders(this.state.order);
  };
  saveToLocal = args => {
    let ununcheckedTables = JSON.parse(localStorage.getItem("uTables") || "[]");

    // ununcheckedTables.push({
    //   mData: this.props.openTable,
    //   orders: this.state.order
    // });

    let table = ununcheckedTables.find(uTable => {
      return uTable.tableName == this.props.openTable.tableName;
    });

    if (table) {
      table.data = this.state;
    } else {
      ununcheckedTables.push({
        tableName: this.props.openTable.tableName,
        data: this.state
      });
    }

    localStorage.setItem("uTables", JSON.stringify(ununcheckedTables));
  };
  updateBill = args => {
    let orderedDishes = [];
    orderedDishes.push.apply(
      orderedDishes,
      document.querySelectorAll(".ordered-data tbody tr")
    );

    let lTotal = 0;
    let discountedBill = 0;

    (args.order || this.state.order).forEach(item => {
      lTotal += item.price;
      // lTotal += this.calculatePrice(item.quantity.toString(), {price:item.singlePrice})
      // lTotal += this.calculatePrice(item.quantity.toString(), {price:item.singlePrice})
      //lTotal += item.singlePrice;
    });
    var stotalBill = lTotal;

    if (args.discountMode || args.discount) {
      discountedBill = Math.round(
        stotalBill * (args.discount ? args.discount / 100 : 0)
      );
    }

    let tax = 1;
    let serviceCharges = 1;

    if (args.taxIncluded) {
      // tax = Math.round(0.16 * (this.state.totalBill - discountedBill));
      tax = 1.16;
    }

    if (args.serviceCharges) {
      let rank =
        parseFloat(args.serviceCharges).toString() != "NaN"
          ? args.serviceCharges
          : this.state.serviceChargesAMT;

      //serviceCharges = (lTotal - discountedBill) * (this.state.serviceChargesAMT ? this.state.serviceChargesAMT / 100: 0);
      serviceCharges = 1 + (rank ? rank / 100 : 1);
    }

    this.setState({
      grossTotal: lTotal,
      totalBill: lTotal,
      grandTotal: Math.round((lTotal - discountedBill) * tax * serviceCharges),
      taxAmount: Math.round(
        (lTotal - discountedBill) * tax - (lTotal - discountedBill)
      ),
      serviceChargesCAL: serviceCharges
    });

    setTimeout(() => {
      this.saveToLocal();
    }, 500);
  };
  handleDiscount = event => {
    console.log(event.target.checked);

    this.setState({ discountMode: event.target.checked });

    this.updateBill({
      discount: event.target.checked ? this.state.discountPercent : 0,
      discountMode: event.target.checked,
      taxIncluded: this.state.checked,
      serviceCharges: this.state.serviceCharges
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
      discountMode: this.state.discountMode,
      serviceCharges: this.state.serviceCharges,
      taxIncluded: event.target.checked,
      discount: this.state.discountMode ? this.state.discountPercent : 0
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
  handleKeySubmission(evt) {
    if (evt.key == "Enter") {
      if (!this.state.customerName) {
        return;
      }
      this.printBill();
    }
  }
  openColorPalette = evt => {
    this.setState({
      colorPalette: true
    });
  };
  getBarCodeSvg = () => {
    debugger
    var someCnvas = document.getElementById('someCnvas')
    var data = document.querySelectorAll(".barcode");
    var svg = '';
    data.forEach(item=>{
      debugger;
      svg += item.innerHTML;
      debugger
      var blob = new Blob([svg], {type: "text/html;charset=utf-8"});
      saveAs(blob,'svg.txt')
    })
  }
    //   convertSVGToPNG(svg).then((base64)=>{

    //     var base64Data =base64.replace(/^data:image\/png;base64,/, "");
    
    // fs.writeFile(require('path').resolve(__dirname,'./log.png'), base64Data, 'base64', function(err) {
    //   console.log(err);
    // });          
    // });
    // debugger
    
    // function convertSVGToPNG(data){
    
    // return new Promise((c, e)=>{
    
    // let img=new Image();
    // img.src = svg2img(data);
    
    // img.onload = ()=>{
    
    //     someCnvas.setAttribute('width', img.width);
    //     someCnvas.setAttribute('height', img.height);
    //     someCnvas.setAttribute('xmlns', img.xmlns);
    
    //     let ctx=  someCnvas.getContext('2d');
    
    //     ctx.drawImage(img,0,0);
    
    //     c(someCnvas.toDataURL());
    // }
    
    
    // });
    
    // debugger
    
    //  function svg2img(svg){
    //     // var svg = document.querySelector('svg');
    //     // var xml = new XMLSerializer().serializeToString(svg);
    //     var svg64 = btoa(svg); //for utf8: btoa(unescape(encodeURIComponent(xml)))
    //     var b64start = 'data:image/svg+xml;base64,';
    //     var image64 = b64start + svg64;
    //     return image64;
    // };
    
    
    // }

    // debugger


    // })
    // // var svg = toString(data.firstChild)
    // console.log(data[0].innerHTML)
  // };
  printBill = evt => {
    if (this.props.openTable.inProcess) {
      return;
    }

    debugger;

    store.dispatch({
      type: "UPDATE_INVENTORY",
      data: {
        order: this.state.order,
        totalBill: this.state.totalBill
      }
    });
    this.getBarCodeSvg();

    // debugger;
    // store.dispatch(printTableAction({

    //   // tableName: this.props.openTable.tableName,
    //   // hallName: this.props.openTable.hallName,

    //   grandTotal: this.state.grandTotal,
    //   order: this.state.order,
    //   brandName: this.state.name,
    //   totalBill: this.state.totalBill,
    //   taxAmount: this.state.taxAmount,
    //   recieptNo: this.state.recieptNo,
    //   customerName: this.state.namedReceipt ? this.state.customerName : '',
    //   discount: this.state.discountMode ? this.state.discountPercent : 0,
    //   serviceCharges: this.state.serviceCharges ? ((this.state.serviceChargesCAL - 1) * 100).toFixed(2) : 0
    // }));
  };
  printEstimation = () => {
    this.setState({
      generateBarCode: true,
      estimation: true,
      hideReceipt: true
    });

    setTimeout(() => {
      store.dispatch(
        printEstimationAction({
          tableName: this.props.openTable.tableName,
          hallName: this.props.openTable.hallName,
          grandTotal: this.state.grandTotal,
          order: this.state.order,
          totalBill: this.state.totalBill,
          taxAmount: this.state.taxAmount,
          recieptNo: this.state.recieptNo
        })
      );
    }, 200);
  };
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
    // if (this.state.checked) {
    //   this.setState({
    //     totalBill: this.state.totalBill - item.price,
    //     taxAmount: this.state.taxAmount - (Math.round(0.16 * item.price)),
    //     grandTotal: this.state.grandTotal - (Math.round(0.07 * item.price) + item.price),
    //     order: getFiltered
    //   });
    // }
    // else {
    //   this.setState({
    //     totalBill: this.state.totalBill - item.price,
    //     grandTotal: this.state.grandTotal - item.price,
    //     order: getFiltered
    //   });
    // }
    this.setState({ order: getFiltered });
    this.updateBill({
      order: getFiltered,
      serviceCharges: this.state.serviceCharges,
      taxIncluded: this.state.checked,
      discount: this.state.discountMode ? this.state.discountPercent : 0
    });
  };
  closeDialog = () => {
    this.handleClose();
  };
  selectDish = dishName => {
    this.state.menuData.menuItems.forEach(mainItem => {
      let category = mainItem.name;
      mainItem.items.forEach(item => {
        if (item.name == dishName) {
          this.setState({
            name: category,
            dish: item.name,
            selectedCategory: mainItem,
            selectedDish: item
          });
          return;
        }
      });
    });
  };
  updateCustomerName(evt) {
    this.setState({
      customerName: evt.target.value
    });
  }
  updateDiscount = evt => {
    this.setState({
      discountPercent: evt.target.value
      //grandTotal: evt.target.value ? Math.round(this.state.totalBill - (this.state.totalBill * (evt.target.value / 100))) : this.state.totalBill
    });

    this.updateBill({
      serviceCharges: this.state.serviceCharges,
      taxIncluded: this.state.checked,
      discount: this.state.discountMode ? evt.target.value : 0
    });
  };
  handlePushOrder = evt => {
    if (
      evt.keyCode == 13 &&
      this.state.dish &&
      this.state.selectedDish &&
      this.state.quantity &&
      this.state.itemPrice &&
      this.state.selectedColor.code
    ) {
      this.addOrder();
    }
  };
  handleChangeInput = evt => {
    this.setState({
      itemPrice: evt.target.value
    });
  };

  calculatePrice(unit, args) {
    let price = 0;

    let uniDiv = unit.split(".");

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
    });
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
    evt.target.value &&
      this.setState({
        serviceChargesAMT: +evt.target.value
      });
    this.updateBill({
      discountMode: this.state.discountMode,
      taxIncluded: this.state.checked,
      discount: this.state.discountMode ? this.state.discountPercent : 0,
      serviceCharges: evt.target.value
    });
  }
  selectColor = color => evt => {
    console.log(color);

    this.setState({
      selectedColor: color,
      colorPalette: false
    });
  };
  render() {
    const { fullScreen } = this.props;
    return (
      <div>
        {this.state.recieptNo &&
        this.state.menuData &&
        !this.props.hideReceipt ? (
          <div className="printable">
            <Dialog
              hidden={this.state.colorPalette}
              className="dialog"
              scroll="body"
              // fullWidth={true}
              maxWidth="lg"
              fullScreen={false}
              open={true}
              onClose={this.handleClose}
              aria-labelledby="responsive-dialog-title"
            >
              {/* {this.state.order.length ? (
                <div className="itemBarcode">
                  {" "}
                  <BarcodeGen data={this.state} />
                </div>
              ) : null} */}
              <div className="main">
              <canvas  style = {{display:'none'}}id="someCnvas"></canvas>
                <div
                  className="inProcessContainer"
                  hidden={!this.props.openTable.inProcess}
                />
                <img
                  hidden={!this.props.openTable.inProcess}
                  className="loadingGIF"
                  src={savingGif}
                />

                <DialogTitle id="responsive-dialog-title">
                  <Paper className="paper-heading custHeader" elevation={1}>
                    <Grid container>
                      <Grid item xs={4}>
                        {/* <Typography color="inherit" align="left" variant="body2">
                          {new Date().getMonth() + 1}/{new Date().getDate()}/{new Date().getFullYear()}
                        </Typography> */}
                      </Grid>
                      <Grid item xs={4}>
                        <Typography
                          className="custHeader"
                          align="center"
                          variant="h5"
                          component="h3"
                        >
                          INVENTORY MANAGER
                        </Typography>
                      </Grid>
                      {this.props.hideReceipt && (
                        <Grid item xs={4}>
                          <Typography
                            color="inherit"
                            align="right"
                            variant="body2"
                          >
                            <strong className="bill-estimation">
                              (Bill Estimation Guide)
                            </strong>
                          </Typography>
                        </Grid>
                      )}
                      <Grid hidden={this.props.hideReceipt} item xs={4}>
                        {/* <Typography color="inherit" align="right" variant="body2">
                          Receipt No:{this.state.recieptNo}
                        </Typography> */}
                      </Grid>
                    </Grid>
                  </Paper>
                </DialogTitle>
                <DialogContent className="table-dialogContent">
                  <DialogContentText>
                    <div className="auto-sugession">
                      <AutoSugession
                        menuData={this.state.menuData}
                        selectDishFun={this.selectDish.bind(this)}
                      />
                    </div>
                    <div className="select-option">
                      <InputLabel htmlFor="category-simple">Brand</InputLabel>
                      <FormControl className="formControl">
                        <Select
                          value={this.state.name}
                          onChange={this.handleCategory}
                          inputProps={{
                            name: "name",
                            id: "category-simple"
                          }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {this.state.settings.brands.map((item, index) => {
                            return (
                              <MenuItem
                                key={item.name + index}
                                value={item.name}
                              >
                                {item.name}
                              </MenuItem>
                            );
                          })}
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
                            name: "name-dish",
                            id: "dish-simple"
                          }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {this.state.selectedCategory
                            ? this.state.selectedCategory.map((item, index) => {
                                return (
                                  <MenuItem
                                    key={item.name + index}
                                    value={item.name}
                                  >
                                    {item.name}
                                  </MenuItem>
                                );
                              })
                            : null}
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
                            name: "name-size",
                            id: "sizeSimple"
                          }}
                        >
                          <MenuItem value="None">
                            <em>None</em>
                          </MenuItem>
                          {this.state.selectedCategory
                            ? this.state.sizes.map((item, index) => {
                                return (
                                  <MenuItem
                                    key={item.name + index}
                                    value={item}
                                  >
                                    {item}
                                  </MenuItem>
                                );
                              })
                            : null}
                        </Select>
                      </FormControl>
                    </div>
                    {/* <div className="select-option">
                      <FormControl className="formControl">
                        <InputLabel htmlFor="size-simple">Size</InputLabel>
                        <Select
                          value={this.state.size}
                          onChange={this.handleSize}
                          inputProps={{
                            name: 'disha',
                            id: 'size-simple',
                          }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {
                            this.state.selectedCategory ? this.state.sizes.map((item, index) => {
                              return <MenuItem key={item.name + index} value={item}>{item}</MenuItem>
                            }) : null
                          }
                        </Select>
                      </FormControl>
                    </div> */}
                    <div className="select-option">
                      <InputLabel htmlFor="color-simple">Color</InputLabel>
                      <span
                        style={{
                          backgroundColor:
                            this.state.selectedColor.code || "white"
                        }}
                        className="color-preview"
                      />
                      <img
                        onClick={this.openColorPalette}
                        src={colorIcon}
                        className="def-btn"
                      />
                      {/* <InputLabel htmlFor="color-simple">Color</InputLabel>
                      <FormControl className="formControl">
                        <Select
                          value={this.state.color}
                          // onChange={this.handleColor}
                          onColor={this.openColorPalette}
                          inputProps={{
                            name: 'dish',
                            id: 'color-simple',
                          }} */}

                      {/* <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {
                            this.state.selectedCategory ? this.props.openTable.colors.map((item, index) => {
                              return <MenuItem key={item.name + index} value={item}>

                                <Grid container>
                                  <Grid item xs={9}>
                                    {item.name}
                                  </Grid>
                                  <Grid xs={3} style={{ 'background-color': item.code }} item >
                                  </Grid>
                                </Grid>
                              </MenuItem>
                            }) : null
                          } */}
                      {/* </Select>
                      </FormControl> */}
                    </div>
                    <div className="select-option">
                      <FormControl className="formControl-quantity">
                        {/* <InputLabel htmlFor="quantity-simple">Select</InputLabel> */}
                        <TextField
                          id="standard-price"
                          label="Quantity"
                          value={this.state.quantity}
                          type="number"
                          onChange={this.handleDishQuantity.bind(this)}
                          margin="normal"
                        />
                      </FormControl>
                    </div>
                    <div className="select-option">
                      <FormControl className="formControl-quantity">
                        {/* <InputLabel htmlFor="quantity-simple">Select</InputLabel> */}
                        <TextField
                          id="standard-price"
                          label="Price"
                          value={this.state.itemPrice}
                          type="number"
                          onKeyDown={this.handlePushOrder}
                          onChange={this.handleChangeInput.bind(this)}
                          margin="normal"
                        />
                      </FormControl>
                    </div>

                    {this.state.dish != "Buffet" ? (
                      <div className="select-option">
                        {this.state.dish &&
                        this.state.selectedDish &&
                        this.state.quantity &&
                        this.state.itemPrice &&
                        this.state.selectedColor.code ? (
                          <Fab
                            onClick={this.addOrder.bind(this)}
                            size="medium"
                            color="secondary"
                            aria-label="Add"
                          >
                            <AddIcon />
                          </Fab>
                        ) : null}
                      </div>
                    ) : null}
                    {/* {
                      this.state.dish == 'Buffet' && this.state.itemPrice ? <div className="select-option">
                        {this.state.dish && this.state.selectedDish && this.state.quantity ? <Fab onClick={this.addOrder.bind(this)} size="medium" color="secondary" aria-label="Add">
                          <AddIcon />
                        </Fab> : null
                        }
                      </div> : null
                    } */}

                    {this.state.dish == "Buffet" ? (
                      <div className="select-inputs-tableOrder">
                        <div>
                          <TextField
                            id="standard-price"
                            label="price"
                            value={this.state.itemPrice}
                            type="number"
                            onChange={this.handleChangeInput.bind(this)}
                            margin="normal"
                          />
                        </div>
                      </div>
                    ) : null}

                    {this.state.order.length ? (
                      <div className="ordered-data">
                        <Paper>
                          <Table>
                            <TableRow>
                              <TableCell align="left">
                                <Typography
                                  className="typo-heading-table"
                                  variant="BUTTON"
                                >
                                  <b>Item Name</b>
                                </Typography>
                              </TableCell>
                              <TableCell align="left">
                                <Typography
                                  className="typo-heading-table"
                                  variant="BUTTON"
                                >
                                  <b>Qty</b>
                                </Typography>
                              </TableCell>
                              <TableCell align="left">
                                <Typography
                                  className="typo-heading-table"
                                  variant="BUTTON"
                                >
                                  <b>Size</b>
                                </Typography>
                              </TableCell>
                              <TableCell align="left">
                                <Typography
                                  className="typo-heading-table"
                                  variant="BUTTON"
                                >
                                  <b>Price</b>
                                </Typography>
                              </TableCell>
                              <TableCell align="left">
                                <Typography
                                  className="typo-heading-table"
                                  variant="BUTTON"
                                >
                                  <b>BarCode</b>
                                </Typography>
                              </TableCell>
                            </TableRow>
                            <TableBody>
                              {this.state.order.map((item, index) => {
                                debugger;
                                return (
                                  <TableRow key={index}>
                                    <TableCell component="th" scope="row">
                                      {item.dishName}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                      {item.quantity}
                                      <div className="delete-button-div">
                                        <IconButton
                                          onClick={this.deleteItem.bind(
                                            this,
                                            item,
                                            index
                                          )}
                                          aria-label="Delete"
                                        >
                                          <DeleteIcon fontSize="small" />
                                        </IconButton>
                                      </div>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                      {item.size}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                      {/* <TextField
                                    id="standard-price"
                                    label="price"
                                    value={item.price}
                                    type='number'
                                    onChange={this.customizeDishPrice.bind(this, item)}
                                    margin="normal"
                                    style={{ "width": 70 }}
                                  /> */}
                                      {item.singlePrice}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                      <div className="barcode">
                                        <Barcode
                                          value={
                                            item.brand +
                                            "_" +
                                            item.size +
                                            "_" +
                                            item.color.name +
                                            "_"
                                          }
                                          width={1}
                                          height={40}
                                          fontSize={8}
                                        />
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                              {/* Not required in dress */}
                              {/* <TableRow>
                              <TableCell rowSpan={3} />
                              <TableCell className="amount-section">Sub Total</TableCell>
                              <TableCell align="left" className="amount-section">{this.state.grossTotal}</TableCell>
                            </TableRow> */}

                              {this.state.taxAmount ? (
                                <TableRow>
                                  <TableCell className="amount-section">
                                    Sales Tax
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    className="amount-section"
                                  >
                                    {this.state.taxAmount
                                      ? this.state.taxAmount
                                      : ""}
                                  </TableCell>
                                </TableRow>
                              ) : null}

                              {this.state.discountMode ? (
                                <TableRow>
                                  <TableCell className="amount-section">
                                    Discount
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    className="amount-section"
                                  >
                                    <TextField
                                      id="discount-percent"
                                      label="Discount"
                                      value={this.state.discountPercent}
                                      type="number"
                                      onChange={this.updateDiscount.bind(this)}
                                      margin="normal"
                                      style={{ width: 70 }}
                                    />
                                  </TableCell>
                                </TableRow>
                              ) : null}
                              {this.state.serviceCharges ? (
                                <TableRow>
                                  <TableCell className="amount-section">
                                    Service Charges
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    className="amount-section"
                                  >
                                    <TextField
                                      id="discount-percent"
                                      label="Service Charges%"
                                      value={this.state.serviceChargesAMT}
                                      type="number"
                                      onChange={this.updateServiceCharges.bind(
                                        this
                                      )}
                                      margin="normal"
                                      style={{ width: 70 }}
                                    />
                                  </TableCell>
                                </TableRow>
                              ) : null}

                              <TableRow>
                                <TableCell className="amount-section">
                                  Grand Total
                                </TableCell>
                                <TableCell
                                  align="left"
                                  className="amount-section"
                                >
                                  {this.state.grandTotal}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Paper>
                      </div>
                    ) : null}

                    {/* hideReceipt={this.props.hideReceipt} */}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  {/* <div className="action-button">

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
*/}
                  <div>
                    {!this.props.hideReceipt &&
                    !this.state.generateBarCode &&
                    this.state.order.length ? (
                      <Button
                        className="mr-10"
                        disabled={
                          this.state.namedReceipt && !this.state.customerName
                        }
                        onClick={this.printBill.bind(this)}
                        variant="contained"
                        color="secondary"
                      >
                        Save and Print
                        <Print />
                      </Button>
                    ) : null}
                    {!this.props.hideReceipt &&
                    !this.state.generateBarCode &&
                    this.state.order.length ? (
                      <Button
                        id="mybuttons"
                        className="mr-10"
                        onClick={this.printEstimation.bind(this)}
                        variant="contained"
                        color="secondary"
                      >
                        Print
                        <Print />
                      </Button>
                    ) : null}
                    {!this.state.generateBarCode ? (
                      <Button
                        className="mr-10"
                        onClick={this.closeDialog.bind(this)}
                        variant="contained"
                        color="secondary"
                      >
                        Closeryrtyrtyrty
                        <Close />
                      </Button>
                    ) : null}
                  </div>

                  {/* Saved for pucrchasing customization */}
                  {/* {!this.props.hideReceipt && this.state.order.length ? <Button className="mr-10" disabled={this.state.namedReceipt && !this.state.customerName} onClick={this.printBill.bind(this)} variant="contained" color="secondary">
                    Save and Print
                <Print />
                  </Button> : null
                  } */}

                  {!this.props.hideReceipt &&
                  !this.state.generateBarCode &&
                  this.state.order.length ? (
                    <Button
                      className="mr-10"
                      disabled={
                        this.state.namedReceipt && !this.state.customerName
                      }
                      onClick={this.printBill.bind(this)}
                      variant="contained"
                      color="secondary"
                    >
                      Save
                      <Print />
                    </Button>
                  ) : null}
                </DialogActions>
              </div>
            </Dialog>
            <div class="color-paletter-box" hidden={!this.state.colorPalette}>
              <div class="flex">
                <Grid item md={12}>
                  <Typography
                    color="textPrimary"
                    align="center"
                    variant="h5"
                    component="h3"
                  >
                    COLOR LIBRARY
                  </Typography>
                </Grid>

                <Table className="table" border="1">
                  {this.state.updatedData.map((item, index) => {
                    debugger;
                    return (
                      <TableRow className="height-10 color-row">
                        {item.map(col => {
                          return (
                            <React.Fragment>
                              <TableCell
                                onClick={this.selectColor(col)}
                                className="color-box no-padding"
                                style={{ "background-color": col.code }}
                              />
                              <TableCell
                                onClick={this.selectColor(col)}
                                className="no-padding padd-left"
                              >
                                {col.name}
                              </TableCell>
                            </React.Fragment>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </Table>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

ResponsiveDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired
};

const mapDispatchToProps = state => {
  debugger;
  return {
    openTable: state.openTableReducer,
    orderedTables: state.closeTableButSaveReducer
  };
};

const newResponsiveDialog = withMobileDialog()(ResponsiveDialog);
const dialogBox = connect(mapDispatchToProps)(newResponsiveDialog);
export default dialogBox;
