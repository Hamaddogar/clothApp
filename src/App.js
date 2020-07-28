import React, { Component } from 'react';

// import local components.
import MainComponent from './components/main/main';
import ReportComponent from './components/reporting/report';

import getReportPhase1Action from './store/actions/getReportDataPhase1Action/getReportDataPhase1Action';

import BarcodeGen from './components/barcodeGen/barcodeGen'

import Club from './components/club/club';
import Signin from './components/signin/signin';

import logo from './gLogo.png';
import cLogo from './c-logo.jpg';

// import react router dom.
import { Router, Route, Redirect } from 'react-router-dom';

// import redux components.
import { Provider } from 'react-redux';

// import store.
import store from './store/store';

// import history.
import history from './history';

// import material ui components.
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Warning from '@material-ui/icons/Warning';

// import firebase db.
import { db } from './data/config';

// import custom css.
import './App.css';


var menuItems = [
  {
    name: 'Diner', 
    items: [
      {
        name:'Cotton Red 1', 
        price:20
      }
    ]
  }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders:[],
      previousMonth: 0,
      nextMonth: 0
    }
  }
  componentDidMount = () => {


    db.collection('data').doc('dishes').set({
      menuData: {
        menuItems: menuItems
      }
    }).then(function (res) {
      console.log(res)
    }).catch(function (er) {
      console.log(er);
    });

    db.collection(`${(new Date().getFullYear()) - 1}`).onSnapshot(doc => {
      this.setState({
        previousMonth: 0,
        nextMonth: 0
      });
      if (doc.docs.length) {
        doc.docs.forEach((item) => {
          this.setState({
            previousMonth: this.state.previousMonth + 1
          });
        });
        db.collection(`${new Date().getFullYear()}`).onSnapshot(doc => {
          this.setState({
            nextMonth: 0
          });
          if (doc.docs.length) {
            doc.docs.forEach((item) => {
              this.setState({
                nextMonth: this.state.nextMonth + 1
              });
            });
          }
        })

      }
      else {
        db.collection(`${new Date().getFullYear()}`).onSnapshot(doc => {
          if (doc.docs.length) {
            doc.docs.forEach((item) => {
              this.setState({
                nextMonth: doc.docs.length
              });
            });
          }
        })
      }

    });
  }
  handleReport = () => {
    let reportDataArray = [];
    db.collection(`${(new Date().getFullYear()) - 1}`).get().then(doc => {
      if (doc.docs.length) {
        doc.docs.forEach((doc) => {
          reportDataArray.push({
            id: doc.id,
            year: (new Date().getFullYear()) - 1,
            data: doc.data()
          })
        });
        db.collection(`${new Date().getFullYear()}`).get().then(doc => {
          if (doc.docs.length) {
            doc.docs.forEach((doc) => {
              reportDataArray.push({
                id: doc.id,
                year: new Date().getFullYear(),
                data: doc.data()
              })
            });
            store.dispatch(getReportPhase1Action(reportDataArray));
          }
          else {
            store.dispatch(getReportPhase1Action(reportDataArray));
          }
        })

      }
      else {
        db.collection(`${new Date().getFullYear()}`).get().then(doc => {
          if (doc.docs.length) {
            doc.docs.forEach((doc) => {
              reportDataArray.push({
                id: doc.id,
                year: new Date().getFullYear(),
                data: doc.data()
              })
            })
            store.dispatch(getReportPhase1Action(reportDataArray));
          }
        })
      }

    });
  }
  getOrders =(orders) =>{
    console.log('getOrders',orders)
    this.setState({
      orders
    })
  }
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <div>
            <Route exact path="/main" component={MainComponent} />
            <Route exact path="/report" render={() => {
              this.handleReport();
              return <ReportComponent />
            }} />
            <Route exact path="/club"  render={()=>{
              return <Club getOrders = {this.getOrders} />
            }} />
            <Route exact path="/signin" component={Signin} />

            {this.state.previousMonth + this.state.nextMonth > 3 ?
              <div className='main-alert-div'>
                <Paper className='alert-paper' elevation={1}>
                  <Typography className='typo' variant="h5" component="h3">
                    <Warning className="icon" /> Please Download Data.
                  </Typography>
                </Paper>
              </div> : null
            }
            <Redirect from="/" to="/signin" />
          </div>
        </Router>
        {this.state.orders.length  ? <BarcodeGen className="itemBarcode" data = {this.state.orders} />:null}
        <div className="mLogo">
          <center><b>DEVELOPED BY</b></center>
          {/* <img src={logo} /> */}
        </div>
        <div className="cLogo">
          {/* <img src={cLogo} /> */}
        </div>
      </Provider>
    );
  }
}

export default App;
