// import React components.
import React, { Component } from 'react';

// import material-ui components.
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

// import react router dom.
import { Redirect } from 'react-router-dom';
import Close from '@material-ui/icons/Close';
import {getLogOutAction} from '../../store/actions/getLoginDataAction/getLoginDataAction';


// import custom styles.
// import './styles/style.css';

// import browser history object.
import history from '../../history';

// import firebase db.
import { db } from '../../data/config';

// import actions.
import getReportPhase1Action from '../../store/actions/getReportDataPhase1Action/getReportDataPhase1Action';

// import store.
import store from '../../store/store';

// import redux components.
import { connect } from 'react-redux';


// import local components.
import ReportPhase1 from '../report/reportPhase1/dialogBox';
import ReportPhase2 from '../report/reportPhase2/dialogBox';
// import ReportPhase3 from '../report/reportPhase3/dialogBox';

// material-ui styles.
const styles = theme => ({
    button: {
        backgroundCcolor: '#db2e30',
        color: 'white',
        fontWeight: 'bold',
        margin: theme.spacing.unit,
    }
});

class Report extends Component {
    //   handleReport = () => {
    //     let reportDataArray = [];
    //     db.collection(`${(new Date().getFullYear()) - 1}`).get().then(doc => {
    //       if (doc.docs.length) {
    //         doc.docs.forEach((doc) => {
    //           reportDataArray.push({
    //             id: doc.id,
    //             year: (new Date().getFullYear()) - 1,
    //             data: doc.data()
    //           })
    //         });
    //         db.collection(`${new Date().getFullYear()}`).get().then(doc => {
    //           if (doc.docs.length) {
    //             doc.docs.forEach((doc) => {
    //               reportDataArray.push({
    //                 id: doc.id,
    //                 year: new Date().getFullYear(),
    //                 data: doc.data()
    //               })
    //             });
    //             store.dispatch(getReportPhase1Action(reportDataArray));
    //           }
    //           else {
    //             store.dispatch(getReportPhase1Action(reportDataArray));
    //           }
    //         })

    //       }
    //       else {
    //         db.collection(`${new Date().getFullYear()}`).get().then(doc => {
    //           if (doc.docs.length) {
    //             doc.docs.forEach((doc) => {
    //               reportDataArray.push({
    //                 id: doc.id,
    //                 year: new Date().getFullYear(),
    //                 data: doc.data()
    //               })
    //             })
    //             store.dispatch(getReportPhase1Action(reportDataArray));
    //           }
    //         })
    //       }

    //     });
    //   }
    signout(){
        store.dispatch(getLogOutAction());
    }
    render() {
        const classes = styles;
        if (!this.props.loginReducer.flag) {
            return <Redirect to="/signin" />
        }
        // else 
        // if (this.props.loginReducer.report) {
        // //    this.handleReport();
        //    return <span>asdsad</span>;
        // // / return <Redirect  to="signin" />
        //  }
        return (
            <div className="app-wrapper">
                {
                    this.props.phase1Reducer.flag ? <ReportPhase1 /> : null
                }
                {
                    this.props.phase2Reducer.flag ? <ReportPhase2 /> : null
                }
                {
                    // this.props.phase3Reducer.flag ? <ReportPhase3 /> : null
                }
                <Button className="mr-10 close-bl" onClick={this.signout.bind(this)} variant="contained" color="secondary">
                    SignOut
                <Close />
                </Button>
            </div>
        );
    }
}
const mapDispatchToProps = (state) => {
    return {
        phase1Reducer: state.reportPhase1Reducer,
        phase2Reducer: state.reportPhase2Reducer,
        // phase3Reducer: state.reportPhase3Reducer,
        loginReducer: state.loginReducer
    }
}
const newMain = connect(mapDispatchToProps)(withStyles(styles)(Report));
export default newMain;

