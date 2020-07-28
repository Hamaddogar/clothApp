import React, { Component } from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Redirect } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import { connect } from "react-redux";
import Close from "@material-ui/icons/Close";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Save from "@material-ui/icons/Save";

import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import TableCell from "@material-ui/core/TableCell";

import Confirm from "../confirmation/confirmation";

import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import TableRow from "@material-ui/core/TableRow";

import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import adminIcon from "./images/admin-icon.png";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import store from "../../store/store";
import Button from "@material-ui/core/Button";

import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import "./styles.css";
import { timingSafeEqual } from "crypto";

function TabContainer(props) {
  return <div>{props.children}</div>;
}

class Accounts extends Component {
  constructor(props) {
    super(props);

    let users = [
      {
        type: "admin",
        username: "user@gmail.com",
        password: "123456",
        returns: true,
        brandManagement: true,
        itemDiscount: true
      },
      {
        type: "user",
        username: "normal@gmail.com",
        password: "123456"
      }
    ];

    //  this.state = {
    //     endUsers: users.filter(user => user.type == "user"),
    //     users: users.filter(user => user.type == "admin"),
    //     selectedTab: 0
    // };

    this.state = {
      endUsers: this.props.accountsData.users.filter(
        user => user.type == "user"
      ),
      users: this.props.accountsData.users.filter(user => user.type == "admin"),
      selectedTab: 0,
      // itemdiscountFiled:false
    };
  }
  addUser = evt => {
    let newUser = {
      type: "user",
      username: this.state.username,
      password: this.state.password
    };

    this.setState({
      endUsers: [...this.state.endUsers, newUser]
    });
  };
  handleTabChange = (evt, value) => {
    this.setState({ selectedTab: value });
  };
  updateLabel = label => evt => {
    this.setState({ [label]: evt.target.value });
  };
  editField = (targets, item, fieldName, evt) => {
    // let endEnds = this.state.endUsers;
    item[fieldName] =
      evt.target[
        evt.target.parentNode.parentNode.getAttribute("data-controls") ||
          "value"
      ];
    this.setState({
      [targets]: this.state[targets],
    });
  };
  selectEndUser = (item, evt) => {
    this.setState({
      selectedEndUser: item
    });
  };
  closeDialog = evt => {
    store.dispatch({
      type: "CLOSE_ACCOUNTS"
    });
  };
  saveData = evt => {
    // this.setState({ openConfirm: true });

    // confirmAlert({
    //     title: 'Confirm to submit',
    //     message: 'Are you sure to do this.',
    //     buttons: [
    //       {
    //         label: 'Yes',
    //         onClick: () => alert('Click Yes')
    //       },
    //       {
    //         label: 'No',
    //         onClick: () => alert('Click No')
    //       }
    //     ]
    //   });

    // return;

    store.dispatch({
      type: "SAVE_USER_ACCOUNTS",
      data: {
        users: this.state.users.concat(this.state.endUsers)
      }
    });
  };
  removeUser = (item, evt) => {
    this.setState({
      deleteConfirm: true,
      selectedEndUser: item
    });
  };
  onDelete = evt => {
    if (this.state.selectedEndUser) {
      this.state.users.remove(this.state.selectedEndUser);
    }
  };
  render() {
    if (!this.props.loginReducer.flag) {
      return <Redirect from="/club" to="signin" />;
    }
    return (
      <div className="accounts-page">
        {this.state.deleteConfirm && (
          <Confirm
            onYes={this.onDelete}
            title="Delete User Account"
            desc="Are you sure you want to remove this user account?"
          />
        )}

        <Dialog
          className="accounts-window"
          fullWidth={true}
          maxWidth="lg"
          fullScreen={false}
          open={this.props.accountsData.open}
          // onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            <Paper className="paper-heading" elevation={1}>
              <Grid container>
                <Grid item xs={4} />
                <Grid item xs={4}>
                  <Typography
                    color="error"
                    align="center"
                    variant="h5"
                    component="h3"
                  >
                    Accounts Control
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </DialogTitle>

          <DialogContent>
            <Tabs value={this.state.value} onChange={this.handleTabChange}>
              <Tab label="Admin" />
              <Tab label="User Control" />
            </Tabs>

            {this.state.selectedTab === 0 && (
              <TabContainer>
                <div className="tab-container">
                  <List component="nav">
                    {this.state.users.map(item => {
                      return (
                        <React.Fragment>
                          <ListItem
                            button
                            onClick={() => this.setState({ aUser: item })}
                          >
                            <ListItemIcon>
                              <img className="user-icon" src={adminIcon} />
                            </ListItemIcon>
                            <ListItemText
                              className="user-name"
                              primary={item.username}
                            />
                          </ListItem>
                          {this.state.aUser == item && (
                            <ListItem>
                              <Grid container>
                                <Grid item md={3}>
                                  <FormControl className="formControl-quantity">
                                    <TextField
                                      id="editPasswordField"
                                      label="Password"
                                      value={item.password}
                                      type="password"
                                      onChange={this.editField.bind(
                                        this,
                                        "users",
                                        item,
                                        "password"
                                      )}
                                      margin="normal"
                                      // onKeyDown={this.updateBrandNameOnKey.bind(this)}
                                      error={!this.state.customerName}
                                      style={{ width: 200 }}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={1}>
                                  <span
                                    className="cursor text-black"
                                    onClick={() => {
                                      this.setState({
                                        aUser: null
                                      });
                                    }}
                                  >
                                    <Close />
                                  </span>
                                </Grid>
                                >
                              </Grid>
                            </ListItem>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </List>
                </div>
              </TabContainer>
            )}

            {this.state.selectedTab === 1 && (
              <TabContainer>
                <Grid container>
                  <Grid item md={2}>
                    <FormControl className="formControl-quantity">
                      <TextField
                        id="userNameField"
                        label="UserName"
                        value={this.state.username}
                        type="text"
                        onChange={this.updateLabel("username")}
                        margin="normal"
                        // onKeyDown={this.updateBrandNameOnKey.bind(this)}
                        error={!this.state.customerName}
                        style={{ width: 200 }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={4}>
                    <Grid container>
                      <Grid item md={2}>
                        <FormControl className="formControl-quantity">
                          <TextField
                            id="passwordField"
                            label="Password"
                            value={this.state.password}
                            type="text"
                            onChange={this.updateLabel("password")}
                            margin="normal"
                            // onKeyDown={this.updateBrandNameOnKey.bind(this)}
                            error={!this.state.customerName}
                            style={{ width: 200 }}
                          />
                        </FormControl>
                      </Grid>

                      {/* <Grid item md={2}>

                                                    
                                                </Grid> */}
                    </Grid>
                  </Grid>

                  <Grid item md={1}>
                    {this.state.username && this.state.password && (
                      <Fab
                        className="btn-adjust-top"
                        onClick={this.addUser}
                        size="medium"
                        color="secondary"
                        aria-label="Add"
                      >
                        <AddIcon />
                      </Fab>
                    )}
                  </Grid>
                </Grid>

                <div className="tab-container">
                  <List>
                    {this.state.endUsers.map(item => {
                      return (
                        <React.Fragment>
                          <ListItem
                            button
                            onClick={this.selectEndUser.bind(this, item)}
                          >
                            <ListItemIcon>
                              <img className="user-icon" src={adminIcon} />
                            </ListItemIcon>
                            <ListItemText
                              className="user-name"
                              primary={item.username}
                            />
                          </ListItem>
                          {this.state.selectedEndUser == item && (
                            <ListItem>
                              <Grid container>
                                <Grid item md={3}>
                                  <FormControl className="formControl-quantity">
                                    <TextField
                                      id="editPasswordField"
                                      label="Password"
                                      value={item.password}
                                      type="password"
                                      onChange={this.editField.bind(
                                        this,
                                        "endUsers",
                                        item,
                                        "password"
                                      )}
                                      margin="normal"
                                      // onKeyDown={this.updateBrandNameOnKey.bind(this)}
                                      error={!this.state.customerName}
                                      style={{ width: 200 }}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item md={7}>
                                  <h5>Settings and Permissions</h5>

                                  <FormControlLabel
                                    control={
                                      <div>
                                        BRAND MANAGEMENT
                                        <Checkbox
                                          checked={item.brandManagement}
                                          data-controls="checked"
                                          onChange={this.editField.bind(
                                            this,
                                            "endUsers",
                                            item,
                                            "brandManagement"
                                          )}
                                          value="checked"
                                        />
                                      </div>
                                    }
                                  />

                                  <FormControlLabel
                                    control={
                                      <div>
                                        Returns
                                        <Checkbox
                                          checked={item.returns}
                                          data-controls="checked"
                                          onChange={this.editField.bind(
                                            this,
                                            "endUsers",
                                            item,
                                            "returns"
                                          )}
                                          value="checked"
                                        />
                                      </div>
                                    }
                                  />
                                  <FormControlLabel
                                    control={
                                      <div>
                                        Item Discount
                                        <Checkbox
                                          checked={item.itemDiscount}
                                          data-controls="checked"
                                          onChange={this.editField.bind(
                                            this,
                                            "endUsers",
                                            item,
                                            "itemDiscount"
                                          )}
                                          value="checked"
                                        />
                                      </div>
                                    }
                                  />
                                  {this.state.itemDiscount ? (
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
                                          onChange={this.updateDiscount.bind(
                                            this
                                          )}
                                          margin="normal"
                                          //   style={{ "width": 70 }}
                                        />
                                      </TableCell>
                                    </TableRow>
                                  ) : null}
                                  <IconButton
                                    onClick={this.removeUser.bind(this, item)}
                                    aria-label="Delete"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Grid>
                                <Grid item md={1}>
                                  <span
                                    className="cursor"
                                    onClick={() => {
                                      this.setState({
                                        selectedEndUser: null
                                      });
                                    }}
                                  >
                                    <Close />
                                  </span>
                                </Grid>
                                >
                              </Grid>
                            </ListItem>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </List>
                </div>
                <div />
              </TabContainer>
            )}
          </DialogContent>

          <DialogActions>
            <div className="action-button">
              <Button
                className="mr-10"
                onClick={this.closeDialog.bind(this)}
                variant="contained"
                color="secondary"
              >
                Close
                <Close />
              </Button>
              <Button
                className="mr-10"
                onClick={this.saveData.bind(this)}
                variant="contained"
                color="secondary"
              >
                Save
                <Save />
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapDispatchToProps = state => {
  return {
    loginReducer: state.loginReducer,
    accountsData: state.accountsData
  };
};
const newResponsiveDialog = withMobileDialog()(Accounts);
const dialogBox = connect(mapDispatchToProps)(newResponsiveDialog);
export default dialogBox;
