import { db } from "../../data/config";
import store from "../../store/store";
import closeDialogAction from "../../store/actions/closeDialogAction/closeDialogAction";
import closeCustomAction from "../../store/actions/closeCustomAction/closeCustomAction";
import filterAfterPrintAction from "../../store/actions/filterAfterPrintAction/filterAfterPrintAction";
import removeCustomAfterPrintAction from "../../store/actions/removeCustomAfterPrint/removeCustomAfterPrint";
import uuid from "uuid";
// import nw from 'nw';

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

let saveDataService = {
  printEstimation: data => {
    window.nw.Window.get().print({
      headers:false,
      landscape:true,
      autoprint :true
    });
  },
  saveSettingsData: data => {
    db.collection("settings")
      .doc("brands")
      .set(data)
      .then(doc => {
        console.log("data saved from save setting");
        store.dispatch({
          type: "UPDATED_INVENTORY"
        });
      })
      .catch(() => {
        console.log("data not saved");
      });
  },

  //
  // .set({
  // orders:[data]}).
  //
  saveTransactionsData: data => {
    db.collection("trasnactions")
      .doc("transactions")
      .set({ orders: [data] })
      .then(doc => {
        // let newData = doc.data().orders.push(data)
        debugger;
        // db.collection('trasnactions').doc('transactions').set({orders:newData})
        debugger;

        console.log("data saved");
        console.log("data saved", doc.data().orders);
        // console.log(doc.data());
        // store.dispatch({
        //     type:"UPDATED_TRANSACTIONS"
        // });
      })
      .catch(() => {
        console.log("data not saved");
      });
  },
  getTransactionsData: () => {
    db.collection("trasnactions")
      .doc("transactions")
      .get()
      .then(doc => {
        console.log("data saved");
        console.log(doc.data());
        let newData = doc.data().orders;

        console.log(newData);
        store.dispatch({
          type: "LOAD_TRANSACTIONS_DATA",
          data: newData
        });

        return newData;
      })
      .catch(() => {
        console.log("data not saved");
      });
  },
  getSigleItemSettingsData: data => {
    db.collection("settings")
      .doc("brands")
      .get()
      .then(doc => {
        console.log("data saved");
        console.log(doc.data());
        let newData = doc.data();
        store.dispatch({
          type: "LOAD_DATA",
          data: newData
        });
        console.log(doc.data());
      })
      .catch(() => {
        console.log("data not saved");
      });
  },
  saveSellSettingsData: data => {
    db.collection("settings")
      .doc("brands")
      .set(data)
      .then(doc => {
        console.log("data sell saved");
        store.dispatch({
          type: "UPDATED_INVENTORY_SELL"
        });
      })
      .catch(() => {
        console.log("data not saved");
      });
  },
  saveTableDataToBackEnd: data => {
    debugger;
    db.collection(`${new Date().getFullYear()}`)
      .doc(`${monthNames[new Date().getMonth()]}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          let documentData = doc.data();
          if (doc.data().hasOwnProperty([new Date().getDate()])) {
            let dateWise = documentData[new Date().getDate()];
            if (dateWise.hasOwnProperty(`${data.hallName}`)) {
              let ordersArray =
                documentData[new Date().getDate()]["PURCHASING"].orders;
              ordersArray.push(data);
              // ordersArray.push({
              //     tableName: data.tableName,
              //     hallName: data.hallName,
              //     grandTotal: data.grandTotal,
              //     order: data.order,
              //     totalBill: data.totalBill,
              //     taxAmount: data.taxAmount,
              //     recieptNo: data.recieptNo
              // });
              documentData[new Date().getDate()][
                "PURCHASING"
              ].orders = ordersArray;
              if (dateWise["PURCHASING"].hasOwnProperty(["TOTAL"])) {
                let oldValue =
                  documentData[new Date().getDate()]["PURCHASING"]["TOTAL"];

                let hallOldTotal =
                  documentData[new Date().getDate()]["PURCHASING"].hallTotal;

                documentData[new Date().getDate()]["PURCHASING"].hallTotal =
                  hallOldTotal + data.grandTotal;

                documentData[new Date().getDate()]["PURCHASING"]["TOTAL"] =
                  data.grandTotal + oldValue;
                db.collection(`${new Date().getFullYear()}`)
                  .doc(`${monthNames[new Date().getMonth()]}`)
                  .set(documentData)
                  .then(() => {
                    removeTableFromLS(data.tableName);
                    window.print();
                    store.dispatch(filterAfterPrintAction(data.tableName));
                    store.dispatch(closeDialogAction());
                  })
                  .catch(err => {
                    console.log(err);
                  });
              } else {
                let hallOldTotal =
                  documentData[new Date().getDate()]["PURCHASING"].hallTotal;

                documentData[new Date().getDate()]["PURCHASING"].hallTotal =
                  hallOldTotal + data.grandTotal;

                documentData[new Date().getDate()]["PURCHASING"]["TOTAL"] =
                  data.grandTotal;
                db.collection(`${new Date().getFullYear()}`)
                  .doc(`${monthNames[new Date().getMonth()]}`)
                  .set(documentData)
                  .then(() => {
                    removeTableFromLS(data.tableName);
                    window.print();
                    store.dispatch(filterAfterPrintAction(data.tableName));
                    store.dispatch(closeDialogAction());
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }
            } else {
              documentData[new Date().getDate()]["PURCHASING"] = {
                // [`${data.tableName}`]: data.grandTotal,
                ["TOTAL"]: data.grandTotal,
                orders: [data]
                // orders: [{
                //     tableName: data.tableName,
                //     hallName: data.hallName,
                //     grandTotal: data.grandTotal,
                //     order: data.order,
                //     totalBill: data.totalBill,
                //     taxAmount: data.taxAmount,
                //     recieptNo: data.recieptNo
                // }]
              };
              db.collection(`${new Date().getFullYear()}`)
                .doc(`${monthNames[new Date().getMonth()]}`)
                .set(documentData)
                .then(() => {
                  removeTableFromLS(data.tableName);
                  window.print();
                  store.dispatch(filterAfterPrintAction(data.tableName));
                  store.dispatch(closeDialogAction());
                })
                .catch(err => {
                  console.log(err);
                });
            }
          } else {
            let monthData = {
              // [`${data.hallName}`]: {
              ["PURCHASING"]: {
                ["TOTAL"]: data.grandTotal,
                // [`${data.tableName}`]: data.grandTotal,
                hallTotal: data.grandTotal,
                orders: [data]
                // orders: [{
                //     tableName: data.tableName,
                //     hallName: data.hallName,
                //     grandTotal: data.grandTotal,
                //     order: data.order,
                //     totalBill: data.totalBill,
                //     taxAmount: data.taxAmount,
                //     recieptNo: data.recieptNo
                // }]
              }
            };
            documentData[new Date().getDate()] = monthData;
            db.collection(`${new Date().getFullYear()}`)
              .doc(`${monthNames[new Date().getMonth()]}`)
              .set(documentData)
              .then(() => {
                removeTableFromLS(data.tableName);
                window.print();
                store.dispatch(filterAfterPrintAction(data.tableName));
                store.dispatch(closeDialogAction());
              })
              .catch(err => {
                console.log(err);
              });
          }
        } else {
          db.collection(`${new Date().getFullYear()}`)
            .doc(`${monthNames[new Date().getMonth()]}`)
            .set({
              [new Date().getDate()]: {
                // [`${data.hallName}`]: {
                ["PURCHASING"]: {
                  //[`${data.tableName}`]: data.grandTotal,
                  ["TOTAL"]: data.grandTotal,
                  hallTotal: data.grandTotal,
                  orders: [data]
                  // orders: [{
                  //     tableName: data.tableName,
                  //     hallName: data.hallName,
                  //     grandTotal: data.grandTotal,
                  //     order: data.order,
                  //     totalBill: data.totalBill,
                  //     taxAmount: data.taxAmount,
                  //     recieptNo: data.recieptNo
                  // }]
                }
              }
            })
            .then(() => {
              removeTableFromLS(data.tableName);
              window.print();
              store.dispatch(filterAfterPrintAction(data.tableName));
              store.dispatch(closeDialogAction());
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
  },
  saveCustomDataToBackEnd: data => {
    db.collection(`${new Date().getFullYear()}`)
      .doc(`${monthNames[new Date().getMonth()]}`)
      .get()
      .then(doc => {
        if (doc.exists) {
          let documentData = doc.data();
          if (doc.data().hasOwnProperty([new Date().getDate()])) {
            if (
              doc.data()[new Date().getDate()].hasOwnProperty("customExpenses")
            ) {
              let oldValue = documentData[new Date().getDate()].customExpenses;
              let customExpensesArray =
                documentData[new Date().getDate()].customOrders;
              documentData[new Date().getDate()].customOrders = [
                ...customExpensesArray,
                ...data.order
              ];
              documentData[new Date().getDate()].customExpenses =
                oldValue + data.totalBill;
              db.collection(`${new Date().getFullYear()}`)
                .doc(`${monthNames[new Date().getMonth()]}`)
                .set(documentData)
                .then(() => {
                  removePurchasesFomLS();
                  window.print();
                  store.dispatch(removeCustomAfterPrintAction());
                  store.dispatch(closeCustomAction());
                })
                .catch(err => {
                  console.log(err);
                });
            } else {
              documentData[new Date().getDate()].customExpenses =
                data.totalBill;
              documentData[new Date().getDate()].customOrders = data.order;
              db.collection(`${new Date().getFullYear()}`)
                .doc(`${monthNames[new Date().getMonth()]}`)
                .set(documentData)
                .then(() => {
                  removePurchasesFomLS();
                  window.print();
                  store.dispatch(removeCustomAfterPrintAction());
                  store.dispatch(closeCustomAction());
                })
                .catch(err => {
                  console.log(err);
                });
            }
          } else {
            let monthData = {
              customExpenses: data.totalBill,
              customOrders: data.order
            };
            documentData[new Date().getDate()] = monthData;
            db.collection(`${new Date().getFullYear()}`)
              .doc(`${monthNames[new Date().getMonth()]}`)
              .set(documentData)
              .then(() => {
                removeTableFromLS(data.tableName);
                window.print();
                store.dispatch(removeCustomAfterPrintAction());
                store.dispatch(closeCustomAction());
              })
              .catch(err => {
                console.log(err);
              });
          }
        } else {
          db.collection(`${new Date().getFullYear()}`)
            .doc(`${monthNames[new Date().getMonth()]}`)
            .set({
              [new Date().getDate()]: {
                customExpenses: data.totalBill,
                customOrders: data.order
              }
            })
            .then(() => {
              removeTableFromLS(data.tableName);
              window.print();
              store.dispatch(removeCustomAfterPrintAction());
              store.dispatch(closeCustomAction());
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
  }
};

function removePurchasesFomLS() {
  localStorage.removeItem("cOrders");
}

function removeTableFromLS(tableName) {
  let ununcheckedTables = JSON.parse(localStorage.getItem("uTables") || "[]");

  let tTable = ununcheckedTables.find(uTable => {
    return uTable.tableName == tableName;
  });

  if (tTable) {
    let tIndex = ununcheckedTables.indexOf(tTable);
    if (tIndex != -1) {
      ununcheckedTables.splice(tIndex, 1);
    }
    localStorage.setItem("uTables", ununcheckedTables);
  }
}

export default saveDataService;
