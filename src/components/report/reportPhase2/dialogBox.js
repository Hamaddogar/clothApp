import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import Download from '@material-ui/icons/ArrowDownward';
import Button from '@material-ui/core/Button';
import Close from '@material-ui/icons/Close';
import TableRow from '@material-ui/core/TableRow';
import store from '../../../store/store';
import closePhase2Action from '../../../store/actions/closeReportPhase2Action/closeReportPhase2Action';
import getReportDataPhase3Action from '../../../store/actions/getReportDataPhase3Action/getReportDataPhase3Action';
import { connect } from 'react-redux';
import downloadService from '../../../services/downloadData/downloadData';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './styles/style.css';
import monthArray from './monthArray';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { getProfitLossStatement } from '../../../utilities';
import jsPDF from 'jspdf';

function TabContainer(props) {
  return (
    <div>
      {props.children}
    </div>
  );
}

class ResponsiveDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cHallOrders: [],
      allOrders: {
        'Hall 1': [],
        'G1': [],
        'G2': [],
        'EXT': [],
        'HALL2': [],
        'Hall3': []
      },
      select: 'total',
      'Hall 1': 0,
      G1: 0,
      G2: 0,
      EXT: 0,
      HALL2: 0,
      Hall3: 0,
      customExpenses: 0,
      total: 0,
      weeklyArray: [],
      week: '',
      startDate: new Date(),
      value: 0
    };
    this.handleChangeDate = this.handleChangeDate.bind(this);
  }

  daysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  }

  // componentDidMount() {
  //   if (this.props.phase2Reducer.today) {
  //     this.setState({
  //       select: 'daily'
  //     }, () => {
  //       this.handleChangeDate(new Date());
  //     });

  //   }

  // }
  handleChangeDate(date) {
    this.setState({
      startDate: date,
      'Hall 1': 0,
      G1: 0,
      G2: 0,
      EXT: 0,
      HALL2: 0,
      Hall3: 0,
      customExpenses: 0,
      total: 0,
      weeklyArray: [],
      week: '',
    }, () => {
      debugger;
      if (this.props.phase2Reducer.dataObject.year == date.getFullYear() && this.props.phase2Reducer.dataObject.id == monthArray[date.getMonth()]) {
        if (this.props.phase2Reducer.dataObject.data.hasOwnProperty(`${date.getDate()}`)) {
          let item = this.props.phase2Reducer.dataObject.data[date.getDate()];
          if (item.hasOwnProperty('customExpenses')) {
            this.setState({
              customExpenses: item.customExpenses,
              customOrders: item.customOrders
            });
          }
          this.setHallsData(item);
        }
        // else{
        //   alert('Data Not Found.');
        // }

      }
      else {
        alert('Data Not Found.');
      }

      setTimeout(() => {
        this.setState({
          // total: this.state["Hall 1"] + this.state.G1 + this.state.G2 + this.state.EXT + this.state.HALL2 + this.state.Hall3 + this.state.customExpenses
          total: this.state["Hall 1"] + this.state.G1 + this.state.G2 + this.state.EXT + this.state.HALL2 + this.state.Hall3
        });
      }, 200);
    });

  }
  downloadDailyProfitAndLoss = () => {
    downloadService.downloadDailyProfitAndLoss(this.state.startDate).then((data) => {


      getProfitLossStatement({ expenses: data.expenses, revenue: data.revenue, period: this.state.startDate.toDateString() }).then((content) => {

        var doc = new jsPDF()

        doc.addImage(content, 0, 0);
        doc.save('Profile and Loss Statement.pdf');

      });

    });
  }
  downloadDailyReport = () => {
    downloadService.downloadTodaysReport(this.state.startDate);
  }

  downloadData = () => {
    downloadService.download(this.props.phase2Reducer.dataObject.id, this.props.phase2Reducer.dataObject.year);
  }

  setHallsData = (item) => {

    debugger;
    let allOrders = this.state.allOrders;

    Object.keys(item).forEach((key) => {

      let status = false;

      switch (key) {
        case 'Hall 1':
          allOrders[key] = item[key].orders
          this.setState({
            allOrders: allOrders,
            'Hall 1': item[key].hallTotal + this.state['Hall 1']
          });
          break;
        case 'G1':
          allOrders[key] = item[key].orders
          this.setState({
            allOrders: allOrders,
            G1: item[key].hallTotal + this.state.G1
          });
          break;
        case 'G2':
          allOrders[key] = item[key].orders
          this.setState({
            allOrders: allOrders,
            G2: item[key].hallTotal + this.state.G2
          });
          break;
        case 'EXT':
          allOrders[key] = item[key].orders
          this.setState({
            allOrders: allOrders,
            EXT: item[key].hallTotal + this.state.EXT
          });
          break;
        case 'HALL2':
          allOrders[key] = item[key].orders
          this.setState({
            allOrders: allOrders,
            HALL2: item[key].hallTotal + this.state.HALL2
          });
          break;
        case 'Hall3':
          allOrders[key] = item[key].orders
          this.setState({
            allOrders: allOrders,
            Hall3: item[key].hallTotal + this.state.Hall3
          });
          break;
        default:
          break;
      }

      this.handleAllOrders({
        target: {
          value: this.state.selectedAllHall
        }
      });
      // if (status) {
      //   allOrders[key] = item[key].orders
      // allOrders[key] = item[key].orders.map(function (item) {

      //   let orders = item.order;

      //   orders.map((cItem) => {
      //     cItem.tableName = item.tableName
      //   });

      //   return orders
      // })
      //  }

      this.setState({
        allOrders: allOrders
      });

    });


  }
  handleClickOpen = () => {
    this.setState({ open: true });
  };
  closeReporting = () => {
    this.handleClose();
  };
  handleClose = () => {
    store.dispatch(closePhase2Action());
  };
  openThirdPhase = (item) => {
    item.sMonth = this.selectedMonthPurchasing;
    store.dispatch(getReportDataPhase3Action(item));
  };
  checkState = () => {
    let weeklyArray = this.state.weeklyArray;
    if (this.state["Hall 1"] || this.state.G1 || this.state.G2 || this.state.EXT || this.state.HALL2 || this.state.Hall3 || this.state.customExpenses) {
      let checkExist = weeklyArray.findIndex((data) => {
        return data.week == this.state.week
      });
      if (checkExist >= 0) {
        weeklyArray[checkExist]["Hall 1"] += this.state["Hall 1"];
        weeklyArray[checkExist].G1 += this.state.G1;
        weeklyArray[checkExist].G2 += this.state.G2;
        weeklyArray[checkExist].EXT += this.state.EXT;
        weeklyArray[checkExist].Hall2 += this.state.HALL2;
        weeklyArray[checkExist].Hall3 += this.state.Hall3;
        weeklyArray[checkExist].customExpenses += this.state.customExpenses;
        this.setState({
          weeklyArray: weeklyArray,
          'Hall 1': 0,
          G1: 0,
          G2: 0,
          EXT: 0,
          HALL2: 0,
          Hall3: 0,
          customExpenses: 0,
          total: 0,
          week: ''
        });
      }
      else {
        weeklyArray.push({
          week: this.state.week,
          "Hall 1": this.state["Hall 1"],
          G1: this.state.G1,
          G2: this.state.G2,
          EXT: this.state.EXT,
          Hall2: this.state.HALL2,
          Hall3: this.state.Hall3,
          customExpenses: this.state.customExpenses
        });
        this.setState({
          weeklyArray: weeklyArray,
          'Hall 1': 0,
          G1: 0,
          G2: 0,
          EXT: 0,
          HALL2: 0,
          Hall3: 0,
          customExpenses: 0,
          total: 0,
          week: ''
        });
      }
    }
  }
  handleSelectOption = event => {

    this.setState({
      select: event.target.value,
      'Hall 1': 0,
      G1: 0,
      G2: 0,
      EXT: 0,
      HALL2: 0,
      Hall3: 0,
      customExpenses: 0,
      total: 0,
      weeklyArray: [],
      week: '',
    }, () => {

      if (event.target.value == 'total') {
        Object.values(this.props.phase2Reducer.dataObject.data).forEach((item) => {
          setTimeout(() => {
            if (item.hasOwnProperty('customExpenses')) {
              this.setState({
                customOrders: item.customOrders,
                customExpenses: this.state.customExpenses + item.customExpenses
              });
            }
            this.setHallsData(item);
          }, 100);

        });
        setTimeout(() => {
          this.setState({
            // total: this.state["Hall 1"] + this.state.G1 + this.state.G2 + this.state.EXT + this.state.HALL2 + this.state.Hall3 + this.state.customExpenses
            total: this.state["Hall 1"] + this.state.G1 + this.state.G2 + this.state.EXT + this.state.HALL2 + this.state.Hall3
          });
        }, 200);
      }
      else if (event.target.value == 'weekly') {
        let self = this;
        let phase2Data = this.props.phase2Reducer.dataObject.data;
        let monthIndex = monthArray.findIndex((item) => {
          return this.props.phase2Reducer.dataObject.id == item;
        });
        let daysInMonth = this.daysInMonth(this.props.phase2Reducer.dataObject.year, monthIndex);
        let month = this.props.phase2Reducer.dataObject.id;
        let year = this.props.phase2Reducer.dataObject.year;
        Object.keys(phase2Data).forEach((key) => {
          if (key >= 1 && key <= 7) {
            setTimeout(() => {
              if (this.state.week != `1-${month}-${year} to 7-${month}-${year}`) {
                this.checkState();
              };
              this.setState({
                week: `1-${month}-${year} to 7-${month}-${year}`
              }, () => {
                if (phase2Data[key].hasOwnProperty('customExpenses')) {
                  this.setState({
                    customOrders: phase2Data[key].customOrders,
                    customExpenses: this.state.customExpenses + phase2Data[key].customExpenses
                  });
                }
                self.setHallsData(phase2Data[key]);
              });
            }, 200)

          }
          else if (key >= 8 && key <= 14) {
            setTimeout(() => {
              if (this.state.week != `8-${month}-${year} to 14-${month}-${year}`) {
                this.checkState();
              };
              this.setState({
                week: `8-${month}-${year} to 14-${month}-${year}`
              }, () => {
                if (phase2Data[key].hasOwnProperty('customExpenses')) {
                  this.setState({
                    customOrders: phase2Data[key].customOrders,
                    customExpenses: this.state.customExpenses + phase2Data[key].customExpenses
                  });
                }
                self.setHallsData(phase2Data[key]);
              });
            }, 200)
          }
          else if (key >= 15 && key <= 21) {
            setTimeout(() => {
              if (this.state.week != `15-${month}-${year} to 21-${month}-${year}`) {
                this.checkState();
              };
              this.setState({
                week: `15-${month}-${year} to 21-${month}-${year}`
              }, () => {
                if (phase2Data[key].hasOwnProperty('customExpenses')) {
                  this.setState({
                    customOrders: phase2Data[key].customOrders,
                    customExpenses: this.state.customExpenses + phase2Data[key].customExpenses
                  });
                }
                self.setHallsData(phase2Data[key]);
              });
            }, 200)
          }
          else if (key >= 22 && key <= 28) {
            setTimeout(() => {
              if (this.state.week != `22-${month}-${year} to 28-${month}-${year}`) {
                this.checkState();
              };
              this.setState({
                week: `22-${month}-${year} to 28-${month}-${year}`
              }, () => {
                if (phase2Data[key].hasOwnProperty('customExpenses')) {
                  this.setState({
                    customOrders: phase2Data[key].customOrders,
                    customExpenses: this.state.customExpenses + phase2Data[key].customExpenses
                  });
                }
                self.setHallsData(phase2Data[key]);
              });
            }, 200)
          }
          else if (key >= 29 && key <= daysInMonth) {
            setTimeout(() => {
              if (this.state.week != `29-${month}-${year} to ${daysInMonth}-${month}-${year}`) {
                this.checkState();
              };
              this.setState({
                week: `29-${month}-${year} to ${daysInMonth}-${month}-${year}`
              }, () => {
                if (phase2Data[key].hasOwnProperty('customExpenses')) {
                  this.setState({
                    customOrders: phase2Data[key].customOrders,
                    customExpenses: this.state.customExpenses + phase2Data[key].customExpenses
                  });
                }
                self.setHallsData(phase2Data[key]);
              });
            }, 200)
          }
          setTimeout(() => {
            this.checkState();
          }, 200)
        });
        // setTimeout(()=>{
        //   this.setState({
        //     total: this.state["Hall 1"]+this.state.G1+this.state.G2+this.state.EXT+this.state.HALL2+this.state.Hall3+this.state.customExpenses
        //   });
        // },200);
      }
      else if (event.target.value == 'daily') {
        this.handleChangeDate(new Date());
      }
    });


  };
  handleAllOrders = (evt) => {

    debugger;
    this.setState({
      selectedAllHall: evt.target.value || 'Hall 1',
      cHallOrders: this.state.allOrders[evt.target.value || 'Hall 1']
    });

  }
  handleTabChange(evt, value) {
    this.setState({ value: value });
  }
  render() {
    const { fullScreen } = this.props;

    var totalBill = 0;
    var targetOrders = (this.state.customOrders || []).filter((order) => {
      return order.date == this.state.startDate.toDateString()
    });

    let data = this.props.phase2Reducer.dataObject.data;

    this.selectedMonthPurchasing = [];

    Object.keys(data).forEach((item) => {
      this.selectedMonthPurchasing.push.apply(this.selectedMonthPurchasing, data[item].customOrders);
      // console.log(data[item]);
    });

    // for(let item of this.props.phase2Reducer.dataObject.data){
    //   console.log(item);
    // }

    targetOrders.forEach((item) => {
      totalBill += item.price;
    });

    return (
      <div className="printable">
        <Dialog
          fullScreen={true}
          open={this.props.phase2Reducer.flag}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            <div className="heading-main">
              <Paper className="paper-heading" elevation={1}>
                <Typography color="error" align="center" variant="h4" component="h3">
                  Report for {this.props.phase2Reducer.dataObject.id + ' - ' + this.props.phase2Reducer.dataObject.year}
                </Typography>
              </Paper>
            </div>
          </DialogTitle>
          <DialogContent className="main-dialogue">
            <DialogContentText>
              <div className="report-phase2-main-div">
                {/* <div>
                  <FormControl className="formControl">
                    <InputLabel htmlFor="select-simple">Select</InputLabel>
                    <Select

                      value={this.state.select}
                      onChange={this.handleSelectOption}
                      inputProps={{
                        name: 'select',
                        id: 'select-simple',
                      }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="total">Total</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="daily">Daily</MenuItem>
                    </Select>
                  </FormControl>
                </div> */}
                {
                  this.state.select == 'daily' ? <div className="date-picker-div">
                    <DatePicker
                      selected={this.state.startDate}
                      onChange={this.handleChangeDate}
                    />
                  </div> : null
                }

                {this.state.select && this.state.select != 'weekly' ? <div>
                  <Paper>

                    <Tabs value={this.state.value} onChange={this.handleTabChange.bind(this)}>
                      <Tab label="Restaruent Revenue" />
                      <Tab label="Expenses" />
                      <Tab label="Details" />
                    </Tabs>
                    {this.state.value === 0 && <TabContainer>
                      <Table fullWidth>
                        <TableBody>
                          {
                            this.state["Hall 1"] ? <TableRow>
                              <TableCell className='halls-section'>Hall 1</TableCell>
                              <TableCell align="left" className='halls-section'>{this.state["Hall 1"]}</TableCell>
                            </TableRow> : null
                          }
                          {
                            this.state.G1 ? <TableRow>
                              <TableCell className='halls-section'>G1</TableCell>
                              <TableCell align="left" className='halls-section'>{this.state.G1}</TableCell>
                            </TableRow> : null
                          }
                          {
                            this.state.G2 ? <TableRow>
                              <TableCell className='halls-section'>G2</TableCell>
                              <TableCell align="left" className='halls-section'>{this.state.G2}</TableCell>
                            </TableRow> : null
                          }
                          {
                            this.state.EXT ? <TableRow>
                              <TableCell className='halls-section'>EXT</TableCell>
                              <TableCell align="left" className='halls-section'>{this.state.EXT}</TableCell>
                            </TableRow> : null
                          }
                          {
                            this.state.HALL2 ? <TableRow>
                              <TableCell className='halls-section'>HALL2</TableCell>
                              <TableCell align="left" className='halls-section'>{this.state.HALL2}</TableCell>
                            </TableRow> : null
                          }
                          {
                            this.state.Hall3 ? <TableRow>
                              <TableCell className='halls-section'>Hall3</TableCell>
                              <TableCell align="left" className='halls-section'>{this.state.Hall3}</TableCell>
                            </TableRow> : null
                          }

                          {this.state.total ? <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell className='total-section'>Grand Total</TableCell>
                            <TableCell align="left" className='total-section'>{this.state.total}</TableCell>
                          </TableRow> : null
                          }
                        </TableBody>
                      </Table>
                    </TabContainer>}


                    {this.state.value === 1 && <TabContainer>
                      <Table>
                        <TableBody>
                          {this.state.customOrders && this.state.customOrders.filter((order) => {
                            return order.date == this.state.startDate.toDateString()
                          }).length != 0 ?
                            <TableRow>
                              <TableCell> <strong className="strong">Item Name</strong></TableCell>
                              <TableCell><strong className="strong">Quantity</strong></TableCell>
                              <TableCell><strong className="strong">Price</strong></TableCell>
                              <TableCell><strong className="strong">Total</strong></TableCell>
                            </TableRow> :
                            <TableHead>
                              <TableRow>
                                <TableCell colSpan="4">No expenses found!</TableCell>
                              </TableRow>
                            </TableHead>
                          }
                          {
                            this.state.customOrders && this.state.customOrders.map((order) => {
                              return this.state.customExpenses ? <TableRow>
                                <TableCell className='halls-section'>{order.dishName}</TableCell>
                                <TableCell align="left" className='halls-section'>{order.quantity}</TableCell>
                                <TableCell align="left" className='halls-section'>{order.singlePrice}</TableCell>
                                <TableCell align="left" className='halls-section'>{order.price}</TableCell>
                              </TableRow> : null
                            })

                          }
                          {
                            targetOrders.length ? <TableRow>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell className='total-section'>Grand Total</TableCell>
                              <TableCell align="left" className='total-section'>{totalBill || 'No expenses found!'}</TableCell>
                            </TableRow> : null
                          }
                        </TableBody>
                      </Table>
                    </TabContainer>}

                    {this.state.value === 2 && <TabContainer>

                      <FormControl className="formControl">
                        <InputLabel htmlFor="select-simple">Select Hall</InputLabel>
                        <Select

                          value={this.state.selectedAllHall}
                          onChange={this.handleAllOrders}
                          inputProps={{
                            name: 'select',
                            id: 'select-simple',
                          }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value="Hall 1">Hall 1</MenuItem>
                          <MenuItem value="G1">G1</MenuItem>
                          <MenuItem value="G2">G2</MenuItem>
                          <MenuItem value="EXT">EXT</MenuItem>
                          <MenuItem value="HALL2">HALL2</MenuItem>
                          <MenuItem value="Hall3">Hall3</MenuItem>
                        </Select>
                      </FormControl>

                      <Table>
                        <TableBody>
                          {this.state.cHallOrders.map((order) => {
                            return <TableRow>
                              <TableCell className="det-table-name">
                                <strong className="strong">{order.tableName}</strong>
                                <div> <strong className="strong">RecieptNo</strong> {
                                  order.recieptNo
                                }</div>
                              </TableCell>
                              <TableCell>
                                <Table fullWidth={true}>
                                  {order.order.map((sOrder) => {
                                    return <TableRow>
                                      <TableCell align="left" className='tb-special-value'>{sOrder.dishName}</TableCell>
                                      <TableCell align="left" className='tb-special-value'>{sOrder.quantity}</TableCell>
                                      <TableCell align="left" className='tb-special-value'>{sOrder.singlePrice}</TableCell>

                                    </TableRow>
                                  })}
                                </Table>
                              </TableCell>

                              <TableCell className="det-table-name">
                                {
                                  <details>
                                  <summary>SHOW RECEIPT</summary>                                  
                                  <div>
                                    <table>
                                      {order.customerName ? <tr><td><strong className="strong">CUS NAME:</strong></td><td>{order.customerName}</td></tr> : ''}                                      
                                      <tr><td><strong className="strong">GROSS TOTAL</strong></td><td>{order.totalBill}</td></tr>                                      
                                      {parseFloat(order.taxAmount) > 0 ? <tr><td><strong className="strong">GST:</strong></td><td>{order.taxAmount}</td></tr> : ''}                                      
                                      {parseFloat(order.discount) > 0 ? <tr><td><strong className="strong">DISCOUNT:</strong></td><td>{order.discount}%</td></tr> : ''}
                                      {parseFloat(order.serviceCharges) > 0 ? <tr><td><strong className="strong">SERV. CHARGES:</strong></td><td>{order.serviceCharges}%</td></tr> : ''}
                                      <tr class="bg-rcpt-total"><td><strong className="strong">NET TOTAL</strong></td><td><strong className="strong">{order.grandTotal}</strong></td></tr>
                                      {/* <tr><td>GROSS TOTAL</td><td>{order.totalBill}</td></tr> */}
                                    </table>
                                    {/* <strong className="strong">{order.totalBill}</strong> */}
                                  </div>
                                  </details>
                                }
                              </TableCell>

                            </TableRow>
                          })}
                        </TableBody>
                      </Table>
                    </TabContainer>}

                  </Paper>
                </div> : ''
                }
                {
                  this.state.weeklyArray.map((item, index) => {
                    return (
                      <div key={index} className="heading-main clickable">
                        <Paper className="paper-heading" elevation={1}>
                          <Typography color="default" align="center" variant="h5" component="h3">
                            {`${item.week}`}
                          </Typography>
                        </Paper>
                      </div>
                    )
                  })
                }

              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>          
            {/* {this.state.select == 'daily' ?
              <Button onClick={this.downloadDailyReport.bind(this)} variant="contained">
                <Download />Download
              </Button> : null

            }
            {this.state.select == 'daily' ?
              <Button onClick={this.downloadDailyProfitAndLoss.bind(this)} variant="contained">
                <Download />Download Profit And Loss
              </Button> : null

            } */}
            {this.state.select == 'total' ?
              <Button onClick={this.downloadData.bind(this)} variant="contained">
                <Download />Download
              </Button> : null
            }
              <Button className="mr-10" onClick={this.closeReporting.bind(this)} variant="contained" color="secondary">
              Close
                <Close />
            </Button>
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
    phase2Reducer: state.reportPhase2Reducer,
  }
}

const newResponsiveDialog = withMobileDialog()(ResponsiveDialog);
const dialogBox = connect(mapDispatchToProps)(newResponsiveDialog);
export default dialogBox;