import React, { Component } from "react";

import hallImage from "./images/hall.png";
import guessImage from "./images/guess.png";
import servedTables from "./images/dinner.png";
import tableImage from "./images/table-icon.png";
import leftButton from "./images/left-button.png";
import rightButton from "./images/right-button.png";
import TableDialogBox from "../openTableOrder/dialogBox";
import SettingsDialogBox from "../openSettingsOrder/dialogBox";
import ItemDiscountDialog from "../itemDiscount/itemDiscountDialog";
import BarCodes from "../barcodes/barCodes";

import barCodeIcon from "./../../barcode-icon.png";

import AccountsDialog from "../accounts/accounts";
import PurchasingDialog from "../openPurchaseOrder/dialogBox";
import ReturnSales from "../ReturnsSales/returnSales";
import CustomOrder from "../openCustomOrder/dialogBox";
import Button from "@material-ui/core/Button";
import Close from "@material-ui/icons/Close";

import { getLogOutAction } from "../../store/actions/getLoginDataAction/getLoginDataAction";

import { db } from "../../data/config";
import { closeTableByStoringAction } from "../../store/actions/closeTableByStoringAction/closeTableByStoringAction";
import getReportPhase1Action from "../../store/actions/getReportDataPhase1Action/getReportDataPhase1Action";
import reportImage from "./images/report.gif";
import shoppingImage from "./images/shopping.png";

import logoutImage from "./images/logout.png";
import userImage from "./images/user-icon.png";
import ReportPhase1 from "../report/reportPhase1/dialogBox";
import ReportPhase2 from "../report/reportPhase2/dialogBox";
import BarcodeGen from '../barcodeGen/barcodeGen'
// import ReportPhase3 from "../report/reportPhase3/dialogBox";

import { hallsData } from "./localData/localData";
import alphabet from "./localData/alphabetArray";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import StoreIcon from "@material-ui/icons/StoreMallDirectory";

import { connect } from "react-redux";
import store from "../../store/store";

import {
  openTableAction,
  openEstimatorAction
} from "../../store/actions/openTableAction/openTableAction";
import { openSettingsAction } from "../../store/actions/openTableAction/openTableAction";

import openCustomAction from "../../store/actions/openCustomAction/openCustomAction";

import { Redirect } from "react-router-dom";

import "./styles/style.css";
import { debug } from "util";

class Club extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      index: 0,
      selectedHall: null,
      selectedTable: null,
      openTable: false,
      customTables: [],
      lastTable: null,
      alphabetTable: 0,
      servedTablesWin: false,
      orders:[]
    };
    console.log(this.props);
  }
  // componentWillMount() {
  //     if (!this.state.selectedHall) {
  //         this.setState({
  //             coreTables: JSON.parse(JSON.stringify(hallsData)).halls.reduce((p, n) => { p.tables.push.apply(p.tables, n.tables); return p }),
  //             allTables: JSON.parse(JSON.stringify(hallsData)).halls.reduce((p, n) => { p.tables.push.apply(p.tables, n.tables); return p }),
  //             selectedHall: hallsData.halls[0]
  //         })
  //     }
  //     return true;
  // }
  // componentDidMount(){
  //     debugger;

  //     let ununcheckedTables = JSON.parse(localStorage.getItem('uTables') || '[]');

  //     ununcheckedTables.forEach((uTable)=>{

  //        store.dispatch(closeTableByStoringAction(uTable.data));
  //     });
  // }

  logout = () => {
    store.dispatch({
      type: "USER_LOGOUT"
    });
  };
  openAccounts = () => {
    store.dispatch({
      type: "OPEN_ACCOUNTS"
    });
  };
  openSalesOfficer = () => {
    debugger;
    store.dispatch({
      type: "OPEN_SALES_OFFER"
    });

    console.log(this.props.settingOffer);
  };
  openSalesManager = () => {
    store.dispatch({
      type: "OPEN_RECEIPT"
    });
    console.log(this.props.purchasing);
  };
  returnSales = () => {
    store.dispatch({
      type: "OPEN_SALE_DIALOG"
    });
  };
  openSettings = () => {
    store.dispatch(openSettingsAction());
  };
  openPurchases() {
    store.dispatch(openTableAction());
  }
  getDiscountValue = value => {
    debugger;
    store.dispatch({
      type: "DISCOUNT_VALUE",
      data: value
    });
    store.dispatch({
      type: "CLOSE_SALES_OFFER"
    });
  };
  generateCodes = () => {
    store.dispatch({
      type: "OPEN_BARCODE"
    });
  };
  // getOrders =(orders) =>{
  //   console.log('getOrders',orders)
  //   this.setState({
  //     orders
  //   })
  // }
  // prevHall() {
  //     this.setState({
  //         index: this.state.index - 1,
  //         selectedHall: hallsData.halls[this.state.index - 1]
  //     })
  // }
  // nextHall() {
  //     this.setState({
  //         index: this.state.index + 1,
  //         selectedHall: hallsData.halls[this.state.index + 1]
  //     })
  // }
  // checkOpenedTables = (tableName) => {

  //     return this.props.saveTableReducer.openTables.find((item) => {
  //         return item.table == tableName;
  //     });
  // }
  // openEstimationBilling() {

  //     store.dispatch(openEstimatorAction({}, {}));
  // }
  // addCustomTable() {
  //     let selectedHall = this.state.selectedHall;
  //     let customTables = this.state.customTables;
  //     if (alphabet.length > this.state.alphabetTable) {

  //             let lastTable = selectedHall.tables[selectedHall.tables.length - 1].name;
  //             let lastAlphabet = lastTable.match(/T\d+(\S+)/);
  //             let index = 0;
  //             if(lastAlphabet){
  //                 index = alphabet.indexOf(lastAlphabet[1]);
  //                 index++;
  //             }

  //             selectedHall.tables.push({ name:`T${parseFloat(lastTable.slice(1))}${alphabet[index]}`  });
  //             customTables.push({ name: `T${parseFloat(lastTable.slice(1))}${alphabet[index]}` });
  //             this.setState({
  //                 lastTable: lastTable,
  //                 selectedHall: selectedHall,
  //                 alphabetTable: this.state.alphabetTable + 1,
  //                 customTables: customTables,
  //                 allTables: { tables: this.state.coreTables.tables.concat(customTables) }
  //             });
  //         //}
  //     }

  // }

  // addCustomExpenses() {
  //     store.dispatch(openCustomAction());
  // }
  // openServedTables() {

  //     this.setState({ servedTablesWin: true });

  // }
  // closeServedTables() {

  //     this.setState({ servedTablesWin: false });

  // }
  handleReport = () => {
    let reportDataArray = [];
    db.collection(`${new Date().getFullYear() - 1}`)
      .get()
      .then(doc => {
        if (doc.docs.length) {
          doc.docs.forEach(doc => {
            reportDataArray.push({
              id: doc.id,
              year: new Date().getFullYear() - 1,
              data: doc.data()
            });
          });
          db.collection(`${new Date().getFullYear()}`)
            .get()
            .then(doc => {
              if (doc.docs.length) {
                doc.docs.forEach(doc => {
                  reportDataArray.push({
                    id: doc.id,
                    year: new Date().getFullYear(),
                    data: doc.data()
                  });
                });
                store.dispatch(getReportPhase1Action(reportDataArray));
              } else {
                store.dispatch(getReportPhase1Action(reportDataArray));
              }
            });
        } else {
          db.collection(`${new Date().getFullYear()}`)
            .get()
            .then(doc => {
              if (doc.docs.length) {
                doc.docs.forEach(doc => {
                  reportDataArray.push({
                    id: doc.id,
                    year: new Date().getFullYear(),
                    data: doc.data()
                  });
                });
                store.dispatch(getReportPhase1Action(reportDataArray));
              }
            });
        }
      });
  };
  render() {
    if (!this.props.loginReducer.flag) {
      return <Redirect from="/club" to="signin" />;
    }
    if (this.props.loginReducer.report) {
      return <Redirect from="/club" to="/main" />;
    }
    return (
      <div className="club-page">
        {this.props.phase1Reducer.flag ? <ReportPhase1 /> : null}
        {this.props.phase2Reducer.flag ? <ReportPhase2 /> : null}
        {/* {this.props.phase3Reducer.flag ? <ReportPhase3 /> : null} */}
        <div>
          <div className="user-title">
            <strong>
              Welcome, {this.props.loginReducer.loggedIn.username}
            </strong>
          </div>
          <div className="hall-IMG-SET">
            <div className="main-hall-title">
              <div className="hall-label">&lt;HALL NAME&gt;</div>
              {/* <div className="hall-name">{this.state.selectedHall.name}</div> */}
            </div>
            {/* <img className="hall-bk" src={hallImage} /> */}
            {/* <div hidden={!this.state.servedTablesWin} className="a-tables-container">
                            <div className="fu">
                                <Grid item lg={true}>
                                    <Typography color="error" align="center" variant="h2" component="h2">
                                        The Fine Club
                                   </Typography>
                                </Grid>
                                <Grid item lg={true}>
                                    <Typography color="primary" align="center" variant="h4" component="h4">
                                        SERVED TABLES
                                   </Typography>
                                </Grid>
                            </div>
                            <div className="all-tables-container">
                                {this.state.allTables.tables.map((table, index) => {
                                    return <div className="table cbtn" key={index} hidden={!this.checkOpenedTables(table.name)} onClick={() => { this.selectTable(this.state.selectedHall.name, table) }}>
                                        <a className="modal-trigger">
                                            <img src={tableImage} />
                                            <span>{table.name}</span>
                                        </a>
                                    </div>
                                })}
                            </div>
                            <Button className="mr-10 close-bl" onClick={this.closeServedTables.bind(this)} variant="contained" color="secondary">
                                Close
                <Close />
                            </Button>
                        </div> */}
            {/* <div className="tables-container">

                            {this.state.selectedHall.tables.map((table, index) => {
                                return <div key={index} className={this.checkOpenedTables(table.name) ? "selected-table table cbtn" : "simple-table table cbtn"} onClick={() => { this.selectTable(this.state.selectedHall.name, table) }}>
                                    <a className="modal-trigger"> <img src={tableImage} />
                                        <span>{table.name}</span>
                                    </a>
                                </div>
                            })}

                        </div> */}
            {/* <div className="row controls-panel">

                            <div className="col s4">

                            </div>

                            <div className="col s4">
                                <img className={this.state.index == 0 ? 'disabled st-btn' : 'st-btn'} onClick={(evt) => { this.prevHall(evt) }} title="Show Previous Hall" src={leftButton} />

                                <img className={this.state.index == (hallsData.halls.length - 1) ? 'disabled st-btn' : 'st-btn'} onClick={(evt) => { this.nextHall(evt) }} title="Show Next Hall" src={rightButton} />
                            </div>

                        </div> */}
            {
            
            }
            {/* <BarcodeGen
                    data={this.state}
                    /> */}
            {this.props.openTable.flag ? (
              <TableDialogBox hideReceipt={this.props.openTable.hideReceipt}
              getOrders={this.props.getOrders}
              />
            ) : null}
            {this.props.openTable.openBranding ? (
              <SettingsDialogBox
                hideReceipt={this.props.openTable.hideReceipt}
              />
            ) : null}
            {this.props.accountsData.open ? (
              <AccountsDialog hideReceipt={this.props.openTable.hideReceipt} />
            ) : null}
            {this.props.purchasing.open ? (
              <PurchasingDialog
              //  open = {this.props.purchasing.open}
              // openTable={this.props.openTable}
              />
            ) : null}
            {this.props.settingOffer.open === true ? (
              <ItemDiscountDialog getDiscountValue={this.getDiscountValue} />
            ) : null}
            {this.props.selling.open ? (
              <ReturnSales
              // openTable={this.props.openTable}
              />
            ) : null}
            {this.props.barCode.open ? <BarCodes data={this.props} /> : null}
            {this.props.openCustom.flag ? <CustomOrder /> : null} }
          </div>
        </div>
        <div className="side-options">
          <div title="Show Served Tables">
            <div
              onClick={this.openSettings}
              className="table cbtn estimation-tabe add-table-background"
            >
              <a>
                {" "}
                <img src={servedTables} />
              </a>
            </div>
          </div>
          <div title="Inventory Manager">
            <div
              onClick={this.openPurchases}
              className="table cbtn estimation-tabe add-table-background"
            >
              <a>
                {" "}
                <img src={guessImage} />
              </a>
            </div>
          </div>
          <div title="Sales Manager">
            <div
              onClick={this.openSalesManager}
              className="table cbtn add-table-background"
            >
              <a>
                {" "}
                <img src={tableImage} />
                <span>T</span>
              </a>
            </div>
          </div>
          {this.props.loginReducer.loggedIn.returns ? (
            <div title="ReturnItems">
              <div
                onClick={this.returnSales}
                className="table cbtn add-table-background"
              >
                <a>
                  {" "}
                  <img src={tableImage} />
                  <span>R</span>
                </a>
              </div>
            </div>
          ) : null}

          {this.props.loginReducer.loggedIn.itemDiscount ? (
            <div title="Offer Sales">
              <div
                onClick={this.openSalesOfficer}
                className="table cbtn store-background"
              >
                <a>
                  {" "}
                  <img src={shoppingImage} />
                </a>
                {/* <StoreIcon /> */}
              </div>
            </div>
          ) : null}

          <div title="Open Reporting">
            <div
              onClick={this.handleReport}
              className="table cbtn estimation-tabe add-table-background"
            >
              <a>
                {" "}
                <img src={reportImage} />
              </a>
            </div>
          </div>
          <div title="Logout">
            <div
              onClick={this.logout}
              className="table cbtn estimation-tabe add-table-background"
            >
              <a>
                {" "}
                <img src={logoutImage} />
              </a>
            </div>
          </div>
          {this.props.loginReducer.loggedIn.type == "admin" && (
            <div title="User Accounts">
              <div
                onClick={this.openAccounts}
                className="table cbtn estimation-tabe add-table-background"
              >
                <a>
                  {" "}
                  <img src={userImage} />
                </a>
              </div>
            </div>
          )}
          {this.props.loginReducer.loggedIn.type == "admin" && (
            <div title="User Accounts">
              <div
                onClick={this.generateCodes}
                className="table cbtn estimation-tabe add-table-background"
              >
                <a>
                  <img class="barCodeIcon hover-effect" src={barCodeIcon} />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // signout() {
  //   store.dispatch(getLogOutAction());
  // }
}

const mapDispatchToProps = state => {
  return {
    phase1Reducer: state.reportPhase1Reducer,
    phase2Reducer: state.reportPhase2Reducer,
    openTable: state.openTableReducer,
    accountsData: state.accountsData,
    openCustom: state.openCustomReducer,
    saveTableReducer: state.closeTableButSaveReducer,
    saveCustomReducer: state.closeCustomButSaveReducer,
    loginReducer: state.loginReducer,
    purchasing: state.purchasingReducer,
    settingOffer: state.settingsReducer,
    barCode: state.barCodeReducer,
    selling: state.sellingReducer
  };
};
const newClub = connect(mapDispatchToProps)(Club);
export default newClub;
