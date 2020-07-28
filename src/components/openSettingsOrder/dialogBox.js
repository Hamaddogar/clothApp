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
import Save from '@material-ui/icons/Save';
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
import { connect } from 'react-redux';
// import { getSettings } from '../../services/getDishes/getDishes';

import TablePagination from '@material-ui/core/TablePagination';


import Recipt from '../reciept/reciept';
import './styles/style.css';
import AutoSugession from '../autoSugessionInput/autoSugessionInput';
import AppBar from '@material-ui/core/AppBar';
import Switch from '@material-ui/core/Switch';


import backBtn from '../../back-btn.png';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
// import TablePagination from '@material-ui/core/TablePagination';
// import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import Tooltip from '@material-ui/core/Tooltip';

import savingGif from '../../saving-gif.gif';
import { debug } from 'util';

const theme = theme => ({
  root: {
    backgroundColor: 'rgb(202, 6, 75)',
    width: 500,
  },
  title: {
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
});

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}



function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  debugger;
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}



TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};


const rows = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'color', numeric: false, disablePadding: true, label: 'Color' },
  { id: 'size', numeric: false, disablePadding: false, label: 'Size' },
  { id: 'qty', numeric: true, disablePadding: false, label: 'Qty' },
  { id: 'date', numeric: true, disablePadding: false, label: 'Date' },
  { id: 'bar', numeric: true, disablePadding: false, label: '' }
];


class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead className="nestedHeader">
        <TableRow>
          {/* <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell> */}
          {rows.map(
            row => (
              <TableCell
                key={row.id}
                align='center'
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this,
          )}
        </TableRow>
      </TableHead>
    );
  }
}


class ResponsiveDialog extends React.Component {
  constructor(props) {
    super(props);
    this.inProcess = false;
    debugger;
    this.state = {
      selectedItems: [],
      selectedBrand: null,
      type: '',
      settings: {
        brands: this.props.openTable.brands || []
        // brands: [
        //   { name: "Diner", available: true, items: [{ name: 'Type 1', size: 'XL', color: 'GREEN', qty: "5" }, { name: 'Type 2', size: 'L', color: 'BLUE', qty: "2" }] },
        //   { name: "Brand 2", available: true, items: [{ name: 'Type 1', size: 'L', color: 'RED', qty: "5" }] },
        //   { name: "Brand 3", available: true, items: [{ name: 'Type 1', size: 'XL', color: 'RED', qty: "5" }] },
        //   { name: "Brand 4", available: true, items: [{ name: 'Type 1', size: 'XL', color: 'RED', qty: "5" }] }
        // ]
      },
      order: 'asc',
      orderBy: 'qty',
      page: 0,
      rowsPerPage: 10,
      selected: [],
      menuData: '',
      menuData: {
        menuItems: []
      },
      // checked: ['wifi'],
      name: '',
      dish: '',
      selectedCategory: '',
      selectedDish: '',
      quantity: '',
      // order: [],
      totalBill: 0,
      grandTotal: 0,
      checked: false,
      taxAmount: 0,
      table: this.props.openTable.tableName,
      itemPrice: '',
      recieptNo: '',
      checkReciept: false,
      serviceChargesAMT: 5,
      discountPercent: 10
    };
  }
  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };
  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };
  componentDidMount = () => {

    // debugger
    // this.setState({
    //   settings:{
    //     brands:this.props.openTable.brands
    //   }
    // });
    // this.state.settings.brands = this.props.openTable.brands;

    let recieptNo = reciept.getReciept();
    recieptNo.then((resp) => {
      this.setState({
        recieptNo: resp
      });
    });

    // getSettings().then((resp) => {
    //   debugger;
    //   this.setState({
    //     settings: resp || this.state.settings
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
      }
    }
    else {
      store.dispatch(removeTableByStoringAction({ table: this.props.openTable.tableName }));
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

    // if (this.state.dish == 'Buffet') {
    //   let selectedDish = this.state.selectedDish;
    //   selectedDish.price = this.state.itemPrice;
    //   this.setState({
    //     selectedDish: selectedDish
    //   });
    //   order.push({
    //     date: (new Date).toDateString(),
    //     dishName: this.state.dish,
    //     price: this.state.selectedDish.price * this.state.quantity,
    //     quantity: this.state.quantity,
    //     singlePrice: this.state.selectedDish.price
    //   });
    // }
    // else {
    order.push({
      date: (new Date).toDateString(),
      dishName: this.state.dish,
      // price: this.state.selectedDish.price * this.state.quantity,
      price: this.calculatePrice(this.state.quantity.toString(), { price: this.state.selectedDish.price }),
      quantity: this.state.quantity,
      singlePrice: this.state.selectedDish.price
    });
    // }

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
      discountMode: this.state.discountMode,
      serviceCharges: this.state.serviceCharges,
      taxIncluded: this.state.checked,
      discount: this.state.discountMode ? this.state.discountPercent : 0
    });


  }
  saveToLocal = (args) => {

    let ununcheckedTables = JSON.parse(localStorage.getItem('uTables') || '[]');

    // ununcheckedTables.push({
    //   mData: this.props.openTable,
    //   orders: this.state.order
    // });

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

    if (args.discountMode || args.discount) {
      discountedBill = Math.round(stotalBill * (args.discount ? args.discount / 100 : 0));
    }

    let tax = 1;
    let serviceCharges = 1;

    if (args.taxIncluded) {

      // tax = Math.round(0.16 * (this.state.totalBill - discountedBill));
      tax = 1.16;
    }

    if (args.serviceCharges) {

      let rank = parseFloat(args.serviceCharges).toString() != "NaN" ? args.serviceCharges : this.state.serviceChargesAMT;

      //serviceCharges = (lTotal - discountedBill) * (this.state.serviceChargesAMT ? this.state.serviceChargesAMT / 100: 0);
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
  resetSpecialFilter = (evt) => {

    this.setState({
      inSpecialFilter: false,
      selectedItems: this.state.selectedBrand.items
    });

  }
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
  printBill = (evt) => {

    if (this.props.openTable.inProcess) {
      return;
    }

    store.dispatch(printTableAction({
      tableName: this.props.openTable.tableName,
      hallName: this.props.openTable.hallName,
      grandTotal: this.state.grandTotal,
      order: this.state.order,
      totalBill: this.state.totalBill,
      taxAmount: this.state.taxAmount,
      recieptNo: this.state.recieptNo,
      customerName: this.state.namedReceipt ? this.state.customerName : '',
      discount: this.state.discountMode ? this.state.discountPercent : 0,
      serviceCharges: this.state.serviceCharges ? ((this.state.serviceChargesCAL - 1) * 100).toFixed(2) : 0
    }));
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
  }
  closeDialog = () => {

    this.handleClose();
  }
  saveData = () => {

    store.dispatch({
      type: 'SAVE_DATA',
      data: this.state.settings
    });

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
      //grandTotal: evt.target.value ? Math.round(this.state.totalBill - (this.state.totalBill * (evt.target.value / 100))) : this.state.totalBill
    })

    this.updateBill({
      serviceCharges: this.state.serviceCharges,
      taxIncluded: this.state.checked,
      discount: this.state.discountMode ? evt.target.value : 0
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
  handleChangeRowsPerPage = (event, page) => {

    this.setState({ rowsPerPage: event.target.value });
  }
  handleChangePage = (event, page) => {
    this.setState({ page });
  };
  customizeDishPrice(item, evt) {

    item.singlePrice = +evt.target.value;
    item.price = +evt.target.value;

    // item.singlePrice = evt.target.value;
    // item.price = this.calculatePrice(item.quantity.toString(), { price: item.singlePrice });

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
  handleChange = (event, value) => {
    this.setState({ value });
  };
  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  deleteBrandType = (item) => (evt) => {

    let indexOf = this.state.selectedBrand.types.indexOf(item);
    indexOf != -1 && (this.state.selectedBrand.types.splice(indexOf, 1));

    //TBI
    this.setState({
      brands: this.state.settings.brands
    });

  }
  deleteBrand = (item) => (evt) => {

    let indexOf = this.state.settings.brands.indexOf(item);
    indexOf != -1 && (this.state.settings.brands.splice(indexOf, 1));

    //TBI
    this.setState({
      brands: this.state.settings.brands
    });

  }
  handleBrandAvailability = item => (evt) => {

    item.available = !item.available;

    this.setState({
      brands: this.state.settings.brands
    });



  };
  handleToggle = value => () => {
    debugger;
  };
  updateBrandNameOnKey = (evt) => {

    if (evt.keyCode == 13) {
      this.addNewBrand(evt.target.value);
    }

  }
  addNewBrand = (evt) => {

    let newBrand = { name: evt.brandNameField || this.state.brandNameField, available: true, items: [], types: [] };
    let brands = this.state.settings.brands;
    brands.push(newBrand);
    this.setState({ brands: brands, brandNameField: '' });


  }
  updateBrandName = (evt) => {

    this.setState({ brandNameField: evt.target.value });

  }
  selectBrand = brand => (evt) => {
    this.setState({
      selectedBrand: brand,
      selectedItems: brand.items || []
    });
  }
  isSelected = id => this.state.selected.indexOf(id) !== -1;
  addNewType = (evt) => {

    if (this.state.selectedBrand) {
      this.state.selectedBrand.types.push({ name: this.state.type });
      this.setState({
        type: '',
        brands: this.state.settings.brands
      });
    }

  }
  showByCol = (prop) => (evt) => {

    function getProp(obj, name) {

      let item = name.split('.');

      for (let prop of item) {
        obj = obj[prop];
      }

      return obj;
    }

    debugger;
    let selectedItems = this.state.selectedBrand.items.filter((item) => {

      return getProp(item, prop) == evt.target.innerText;

    });

    this.setState({
      inSpecialFilter: true,
      selectedItems: selectedItems
    });

    // let selcetedColor = evt.target.innerText;


  }
  handleBrandType = (evt) => {
    this.setState({
      type: evt.target.value
    });
  }

  render() {
    const { fullScreen } = this.props;
    const { order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.state.selectedBrand ? this.state.selectedBrand.items.length - page * rowsPerPage : 0);


    return (
      <div>
        {
          this.state.recieptNo && this.state.menuData ?
            <div className="printable">
              <div className="inProcessContainer" hidden={!this.props.openTable.inProcess}></div>
              <Dialog
                className="Dialog"
                fullWidth={true}
                maxWidth="lg"
                fullScreen={false}
                open={true}
                onClose={this.handleClose}
                aria-labelledby="responsive-dialog-title"
              >
                <DialogTitle id="responsive-dialog-title">
                  <Paper className="paper-heading custHeader" elevation={1}>
                    <Grid container>
                      <Grid item xs={4}>
                        <Typography color="inherit" align="left" variant="body2">
                          {new Date().getMonth() + 1}/{new Date().getDate()}/{new Date().getFullYear()}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography color="textPrimary" align="center" variant="h5" component="h3">
                          SETTINGS
                  </Typography>
                      </Grid>

                    </Grid>
                  </Paper>
                </DialogTitle>
                <DialogContent className="table-dialogContent">
                  <DialogContentText>


                    <AppBar position="static" color="default">
                      <Tabs
                        value={this.state.value}
                        onChange={this.handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                      >
                        <Tab label="My Store" />

                        {/* { this.props.loginReducer.loggedIn.labeling && <Tab label="Labels" /> } */}
                        {this.props.loginReducer.loggedIn.brandManagement && <Tab label="Brand Management" />}
                        <Tab label="Labels" /> }
                        {/* <Tab label="Item Three" /> */}
                      </Tabs>
                    </AppBar>

                    <SwipeableViews
                      axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                      index={this.state.value}
                      onChangeIndex={this.handleChangeIndex}
                    >

                      <TabContainer dir={theme.direction}>

                        <Grid item xs={12} md={12}>
                          <Typography variant="h6" className={theme.title}>
                            Brands Manager
                          </Typography>

                          {/* 
                          <div className="select-option">
                            <FormControl className="formControl-quantity">
                              <TextField
                                id="brandNameField"
                                label="Brand Name"
                                value={this.state.brandNameField}
                                type='text'
                                onChange={this.updateBrandName.bind(this)}
                                margin="normal"
                                onKeyDown={this.updateBrandNameOnKey.bind(this)}
                                error={!this.state.customerName}
                                style={{ "width": 200 }}
                              />
                            </FormControl>
                          </div>
                          <span className="add-btn-adjusted">
                            {this.state.brandNameField ? <Fab onClick={this.addNewBrand.bind(this)} size="medium" color="secondary" aria-label="Add">
                              <AddIcon />
                            </Fab> : null}
                          </span> */}


                          <Grid container>
                            <Grid item xs={4}>

                            <img hidden={!this.props.openTable.inProcess} className="loadingGIF" src={savingGif} />

                              <div className={"mxh-40hv " + theme.demo}>
                                <List dense={true} className="customizedList">
                                  {this.state.settings.brands.map((item) => {
                                    // generate([0,1,2],

                                    return <ListItem className={"pointer " + (item == this.state.selectedBrand ? 'selected' : '')} onClick={this.selectBrand(item)}>
                                      <ListItemText
                                        primary={item.name}
                                        secondary={'Secondary name to be added!'}
                                      />
                                      <ListItemSecondaryAction>
                                        <IconButton aria-label="Delete">
                                          <DeleteIcon onClick={this.deleteBrand(item)} />
                                        </IconButton>
                                        <Switch
                                          onClick={this.handleBrandAvailability(item)}
                                          checked={item.available}
                                        />
                                      </ListItemSecondaryAction>

                                    </ListItem>
                                  })
                                  }

                                </List>
                              </div>                                  

                            </Grid>

                            {this.state.selectedBrand ?

                              <Grid item xs={8} className="stock-table-cont">
                                <Typography className="nestedRootHeader" color="textPrimary" align="center" variant="h6" component="h6">
                                  Stock For {this.state.selectedBrand.name}
                                </Typography>

                                <div>
                                  {
                                    this.state.selectedBrand ?

                                      <React.Fragment>

                                        <span className="relative">
                                          {<img hidden={!this.state.inSpecialFilter} onClick={this.resetSpecialFilter} className="def-btn inventory-back" src={backBtn} />}
                                        </span>


                                        <Grid container>

                                          <Grid item md={5}>

                                            <div className="summary-box">
                                              <strong>WE HAVE TOTAL <strong class="bold"> {
                                               this.state.selectedItems.length ?  this.state.selectedItems.map((item) => item.quantity).reduce((a, b) => +a + +b)
                                             : <strong>0 </strong> } </strong>ITEMS of <strong class="bold">{this.state.selectedBrand.name}</strong></strong>
                                            </div>
                                          </Grid>

                                          <Grid item md={7}>

                                            <TablePagination
                                              rowsPerPageOptions={[5, 10, 25]}
                                              component="div"
                                              count={this.state.selectedItems.length}
                                              rowsPerPage={rowsPerPage}
                                              page={page}
                                              backIconButtonProps={{
                                                'aria-label': 'Previous Page',
                                              }}
                                              nextIconButtonProps={{
                                                'aria-label': 'Next Page',
                                              }}
                                              onChangePage={this.handleChangePage}
                                              onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                            />

                                          </Grid>

                                        </Grid>



                                        <Table className="" aria-labelledby="tableTitle">

                                          <EnhancedTableHead
                                            numSelected={selected.length}
                                            order={order}
                                            orderBy={orderBy}
                                            onSelectAllClick={this.handleSelectAllClick}
                                            onRequestSort={this.handleRequestSort}
                                            rowCount={this.state.selectedBrand ? this.state.selectedBrand.items.length : 0}
                                          />

                                          <TableBody>

                                            {stableSort(this.state.selectedItems, getSorting(order, orderBy))
                                              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                              .map(n => {
                                                // const isSelected = this.isSelected(n.id);
                                                const isSelected = false;
                                                debugger
                                                return (
                                                  <TableRow
                                                    hover
                                                    // onClick={event => this.handleClick(event, n.id)}
                                                    role="checkbox"
                                                    aria-checked={isSelected}
                                                    tabIndex={-1}
                                                    key={n.id}
                                                    selected={isSelected}
                                                  >


                                                    <TableCell className="pointer" onClick={this.showByCol("type")} align="center">{n.type}</TableCell>
                                                    <TableCell className="pointer" onClick={this.showByCol("color.name")} align="center">{n.color.name}</TableCell>
                                                    <TableCell className="pointer" onClick={this.showByCol("size")} align="center">{n.size}</TableCell>
                                                    <TableCell align="center">{n.quantity}</TableCell>
                                                    <TableCell align="center">{n.date}</TableCell>

                                                  </TableRow>
                                                );
                                              })}



                                          </TableBody>
                                        </Table>

                                        {/* <Table>
                                          <TableRow>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell><strong class="bold">IN STOCK </strong> <strong class="bold"> {
                                              this.state.selectedItems.map((item) => item.quantity).reduce((a, b) => +a + +b)
                                            } </strong> </TableCell>
                                          </TableRow>
                                        </Table> */}
                                      </React.Fragment> : ''
                                  }



                                </div>

                              </Grid>
                              : null}

                          </Grid>

                        </Grid>


                      </TabContainer>
                      <TabContainer dir={theme.direction}>


                        <Grid item xs={12} md={12}>
                          <Typography variant="h6" className={theme.title}>
                            Manage My Brands
                          </Typography>


                          <div className="select-option">
                            <FormControl className="formControl-quantity">
                              <TextField
                                id="brandNameField"
                                label="Brand Name"
                                value={this.state.brandNameField}
                                type='text'
                                onChange={this.updateBrandName.bind(this)}
                                margin="normal"
                                onKeyDown={this.updateBrandNameOnKey.bind(this)}
                                error={!this.state.customerName}
                                style={{ "width": 200 }}
                              />
                            </FormControl>
                          </div>
                          <span className="add-btn-adjusted">
                            {this.state.brandNameField ? <Fab onClick={this.addNewBrand.bind(this)} size="medium" color="secondary" aria-label="Add">
                              <AddIcon />
                            </Fab> : null}
                          </span>


                          <Grid container>
                            <Grid item xs={4}>


                              <div className={"mxh-40hv " + theme.demo}>
                                <List dense={true} className="customizedList">
                                  {this.state.settings.brands.map((item) => {
                                    // generate([0,1,2],

                                    return <ListItem className={"pointer " + (item == this.state.selectedBrand ? 'selected' : '')} onClick={this.selectBrand(item)}>
                                      <ListItemText
                                        primary={item.name}
                                        secondary={'Secondary name to be added!'}
                                      />
                                      <ListItemSecondaryAction>
                                        <IconButton aria-label="Delete">
                                          <DeleteIcon onClick={this.deleteBrand(item)} />
                                        </IconButton>
                                        <Switch
                                          onClick={this.handleBrandAvailability(item)}
                                          checked={item.available}
                                        />
                                      </ListItemSecondaryAction>

                                    </ListItem>
                                  })
                                  }

                                </List>
                              </div>


                            </Grid>

                            {this.state.selectedBrand ?

                              <Grid item xs={4}>
                                <Typography className="nestedRootHeader" color="textPrimary" align="center" variant="h5" component="h5">
                                  {this.state.selectedBrand.types.length ? 'Brand Types' : 'No Types Defined'}
                                </Typography> :

                                <div>


                                  {this.state.selectedBrand ? <div className={"mxh-40hv " + theme.demo}>
                                    <List dense={true} className="customizedList brand-type">
                                      {this.state.selectedBrand.types.map((item) => {
                                        // generate([0,1,2],

                                        return <ListItem className={"pointer " + (item == this.state.selectedBrand ? 'selected' : '')}>
                                          <ListItemText
                                            primary={item.name}
                                          // secondary={'Secondary name to be added!'}
                                          />
                                          <ListItemSecondaryAction>
                                            <IconButton aria-label="Delete">
                                              <DeleteIcon onClick={this.deleteBrandType(item)} />
                                            </IconButton>

                                          </ListItemSecondaryAction>

                                        </ListItem>
                                      })
                                      }

                                    </List>
                                  </div>
                                    : null}

                                  <div className="select-option">
                                    <FormControl>
                                      {/* <InputLabel htmlFor="brand-type">Type</InputLabel> */}
                                      <TextField
                                        id="brand-type"
                                        label="Type"
                                        value={this.state.type}
                                        type='text'
                                        onChange={this.handleBrandType.bind(this)}
                                        margin="normal"
                                      />
                                    </FormControl>
                                    <span className="add-btn-adjusted">
                                      {this.state.type ? <Fab onClick={this.addNewType.bind(this)} size="medium" color="secondary" aria-label="Add">
                                        <AddIcon />
                                      </Fab> : null}
                                    </span>
                                  </div>




                                </div>

                              </Grid>
                              : null}

                          </Grid>

                        </Grid>



                      </TabContainer>
                      <TabContainer dir={theme.direction}>Item Three</TabContainer>
                    </SwipeableViews>

                    {/* <div className="auto-sugession">
                      <AutoSugession menuData={this.state.menuData} selectDishFun={this.selectDish.bind(this)} />
                    </div>
                    <div className="select-option">
                      <FormControl className="formControl">
                        <InputLabel htmlFor="category-simple">Brand</InputLabel>
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
                        <InputLabel htmlFor="dish-simple">Item</InputLabel>
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
                                    value={item.price}
                                    type='number'
                                    onChange={this.customizeDishPrice.bind(this, item)}
                                    margin="normal"
                                    style={{ "width": 70 }}
                                  />
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
                    <Recipt data={this.state} hideReceipt={this.props.hideReceipt} />
 */}



                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <div className="action-button">
                    <Button className="mr-10" onClick={this.closeDialog.bind(this)} variant="contained" color="secondary">
                      Close
                <Close />
                    </Button>
                    <Button className="mr-10" onClick={this.saveData.bind(this)} variant="contained" color="secondary">
                      Save
                <Save />
                    </Button>
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
  debugger;
  return {
    loginReducer: state.loginReducer,
    openTable: state.openTableReducer,
    orderedTables: state.closeTableButSaveReducer
  }
}

const newResponsiveDialog = withMobileDialog()(ResponsiveDialog);
const dialogBox = connect(mapDispatchToProps)(newResponsiveDialog);
export default dialogBox;