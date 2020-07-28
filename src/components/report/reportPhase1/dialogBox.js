import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import store from '../../../store/store';
import closePhase1Action from '../../../store/actions/closeReportPhase1Action/closeReportPhase1Action';
import getReportDataPhase2Action from '../../../store/actions/getReportDataPhase2Action/getReportDataPhase2Action';
import {connect} from 'react-redux';
import monthsArray from './monthArray';
import './styles/style.css';

class ResponsiveDialog extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showToday: false,
      todayData: {}
    };
  }
  componentDidMount = () => {
    let getToday = this.props.phase1Reducer.dataArray.find((item)=>{
      return item.id == `${monthsArray[new Date().getMonth()]}` && item.year == `${new Date().getFullYear()}` && item.data.hasOwnProperty([new Date().getDate()])
    });
    if(getToday){
      this.setState({
        showToday: true,
        todayData: getToday
      });
    }
  }
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    store.dispatch(closePhase1Action());
  };
  openSecondPhase = (item,check) => {
    if(check){
      store.dispatch(getReportDataPhase2Action({item,today:true}));
    }
    else{
      store.dispatch(getReportDataPhase2Action({item,today:false}));
    }
  }
  render() {
    const { fullScreen } = this.props;
    return (
      <div className="printable">
        <Dialog
          fullScreen={fullScreen}
          open={this.props.phase1Reducer.flag}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
          <div className="heading-main">
            <Paper className="paper-heading" elevation={1}>
                <Typography color="error" align="center" variant="h3" component="h3">
                  Report
                </Typography>
            </Paper>
          </div>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {
                this.props.phase1Reducer.dataArray.map((item,index)=>{
                  return (
                    <div key={index} className="heading-main clickable">
                      <Paper onClick={this.openSecondPhase.bind(this,item,false)} className="paper-heading" elevation={1}>
                          <Typography color="default" align="center" variant="h5" component="h3">
                            {`${item.id} - ${item.year}`}
                          </Typography>
                      </Paper>
                    </div>
                  )
                })
              }
              {
                this.state.showToday?<div className="heading-main clickable">
                  <Paper onClick={this.openSecondPhase.bind(this,this.state.todayData,true)} className="paper-heading" elevation={1}>
                      <Typography color="default" align="center" variant="h5" component="h3">
                        Show Today Report
                      </Typography>
                  </Paper>
                </div>:null
              }
              
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ResponsiveDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
};

const mapDispatchToProps = (state)=>{
    return{
      phase1Reducer: state.reportPhase1Reducer,
    }
}

const newResponsiveDialog = withMobileDialog()(ResponsiveDialog);
const dialogBox = connect(mapDispatchToProps)(newResponsiveDialog);
export default dialogBox;