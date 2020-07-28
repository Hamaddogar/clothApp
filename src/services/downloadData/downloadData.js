import { ExportToCsv } from 'export-to-csv';
import { db } from '../../data/config';
import closeReportPhase1Action from '../../store/actions/closeReportPhase1Action/closeReportPhase1Action';
import closeReportPhase2Action from '../../store/actions/closeReportPhase2Action/closeReportPhase2Action';
import store from '../../store/store';
let dataArray = [];

var months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

Date.prototype.getMonthString = function () {

    return months[this.getMonth()];

}




export default {
    downloadDailyProfitAndLoss: (args) => {


        return new Promise((c, e) => {

            args = args || {};
            dataArray.length = 0;
            let sdate = args || new Date();
            let date = sdate.getDate();

            debugger;

            const options = {
                fieldSeparator: ',',
                quoteStrings: '"',
                decimalSeparator: '.',
                showLabels: true,
                showTitle: true,
                title: `${date}-${sdate.getMonthString()}-${sdate.getFullYear()}`,
                useTextFile: false,
                useBom: true,
                useKeysAsHeaders: true,
            };

            let dayTotalForHalls = 0;
            let totalExpenses = 0;

            db.collection(sdate.getFullYear().toString()).doc(sdate.getMonthString()).get().then(doc => {
                if (doc.exists) {
                    let downloadData = doc.data();


                    if (downloadData[date]) {


                        Object.keys(downloadData[date]).forEach((data) => {
                            let hall = data;
                            if (hall != 'customExpenses' && hall != 'customOrders') {
                                var totalBill = 0;
                                Object.keys(downloadData[date][hall]).forEach((data) => {
                                    let table = data;
                                    if (table != 'hallTotal' && table != 'orders') {
                                        dataArray.push({
                                            // date: `${date}`,
                                            '# ITEM #': hall,
                                            '# QUANTITY #': '',
                                            '# PRICE #': '',
                                            '# TABLE #': table,
                                            '# BILL #': downloadData[date][hall][table],
                                        });
                                        totalBill += downloadData[date][hall][table];

                                    }
                                });

                                dayTotalForHalls += totalBill;

                                dataArray.push({
                                    // date: `${date}`,
                                    '# ITEM #': '',
                                    '# QUANTITY #': '',
                                    '# PRICE #': '',
                                    '# TABLE #': '',
                                    '# BILL #': '',
                                });

                                dataArray.push({
                                    // date: `${date}`,
                                    '# ITEM #': '',
                                    '# QUANTITY #': '',
                                    '# PRICE #': '',
                                    '# TABLE #': '#TOTAL#',
                                    '# BILL #': totalBill,
                                });

                                dataArray.push({
                                    '# ITEM #': '',
                                    '# QUANTITY #': '',
                                    '# PRICE #': '',
                                    '# TABLE #': '',
                                    '# BILL #': '',
                                });

                            }
                            else if (hall != 'customOrders') {


                                dataArray.push({
                                    '# ITEM #': 'EXPENSES',
                                    '# QUANTITY #': '',
                                    '# PRICE #': '',
                                    '# TABLE #': '',
                                    '# BILL #': '',
                                });

                                var tBill = 0;

                                downloadData[date].customOrders.forEach((item) => {

                                    dataArray.push({
                                        '# ITEM #': item.dishName,
                                        '# QUANTITY #': item.quantity,
                                        '# PRICE #': item.singlePrice,
                                        '# TABLE #': '',
                                        '# BILL #': item.price,
                                    });

                                    tBill += item.price;

                                });

                                dataArray.push({
                                    // date: `${date}`,
                                    '# ITEM #': '',
                                    '# QUANTITY #': '',
                                    '# PRICE #': '',
                                    '# TABLE #': '',
                                    '# BILL #': '',
                                });

                                dataArray.push({
                                    // date: `${date}`,
                                    '# ITEM #': '',
                                    '# QUANTITY #': '',
                                    '# PRICE #': '',
                                    '# TABLE #': '# PURCHASES TOTAL#',
                                    '# BILL #': tBill,
                                });

                                totalExpenses += tBill;

                            }
                        });

                        dataArray.push({
                            // date: `${date}`,
                            '# ITEM #': '',
                            '# QUANTITY #': '',
                            '# PRICE #': '',
                            '# TABLE #': '# HALLS TOTAL#',
                            '# BILL #': dayTotalForHalls,
                        });
                    }

                    c({
                        revenue:dayTotalForHalls,
                        expenses:totalExpenses
                    });

                }
            });

        });
    },
    downloadTodaysReport: (args) => {

        args = args || {};
        dataArray.length = 0;
        let sdate = args || new Date();
        let date = sdate.getDate();

        debugger;

        const options = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalSeparator: '.',
            showLabels: true,
            showTitle: true,
            title: `${date}-${sdate.getMonthString()}-${sdate.getFullYear()}`,
            useTextFile: false,
            useBom: true,
            useKeysAsHeaders: true,
        };

        db.collection(sdate.getFullYear().toString()).doc(sdate.getMonthString()).get().then(doc => {
            if (doc.exists) {
                let downloadData = doc.data();

                // Object.keys(downloadData).forEach((data) => {            
                // let mData = downloadData[data][todate];

                if (downloadData[date]) {

                    let dayTotalForHalls = 0;

                    Object.keys(downloadData[date]).forEach((data) => {
                        let hall = data;
                        if (hall != 'customExpenses' && hall != 'customOrders') {
                            var totalBill = 0;
                            Object.keys(downloadData[date][hall]).forEach((data) => {
                                let table = data;
                                if (table != 'hallTotal' && table != 'orders') {
                                    dataArray.push({
                                        // date: `${date}`,
                                        '# ITEM #': hall,
                                        '# QUANTITY #': '',
                                        '# PRICE #': '',
                                        '# TABLE #': table,
                                        '# BILL #': downloadData[date][hall][table],
                                    });
                                    totalBill += downloadData[date][hall][table];

                                }
                            });

                            dayTotalForHalls += totalBill;

                            dataArray.push({
                                // date: `${date}`,
                                '# ITEM #': '',
                                '# QUANTITY #': '',
                                '# PRICE #': '',
                                '# TABLE #': '',
                                '# BILL #': '',
                            });

                            dataArray.push({
                                // date: `${date}`,
                                '# ITEM #': '',
                                '# QUANTITY #': '',
                                '# PRICE #': '',
                                '# TABLE #': '#TOTAL#',
                                '# BILL #': totalBill,
                            });

                            dataArray.push({
                                // date: `${date}`,
                                '# ITEM #': '',
                                '# QUANTITY #': '',
                                '# PRICE #': '',
                                '# TABLE #': '',
                                '# BILL #': '',
                            });

                        }
                        else if (hall != 'customOrders') {

                            // dataArray.push({
                            //     // date: `${date}`,
                            //     'hall #': 'Expenses',
                            //     'table #': '',
                            //     'bill': downloadData[date][hall],
                            // });

                            dataArray.push({
                                '# ITEM #': 'EXPENSES',
                                '# QUANTITY #': '',
                                '# PRICE #': '',
                                '# TABLE #': '',
                                '# BILL #': '',
                            });

                            var tBill = 0;

                            downloadData[date].customOrders.forEach((item) => {

                                dataArray.push({
                                    '# ITEM #': item.dishName,
                                    '# QUANTITY #': item.quantity,
                                    '# PRICE #': item.singlePrice,
                                    '# TABLE #': '',
                                    '# BILL #': item.price,
                                });

                                tBill += item.price;

                            });

                            dataArray.push({
                                // date: `${date}`,
                                '# ITEM #': '',
                                '# QUANTITY #': '',
                                '# PRICE #': '',
                                '# TABLE #': '',
                                '# BILL #': '',
                            });

                            dataArray.push({
                                // date: `${date}`,
                                '# ITEM #': '',
                                '# QUANTITY #': '',
                                '# PRICE #': '',
                                '# TABLE #': '# PURCHASES TOTAL#',
                                '# BILL #': tBill,
                            });

                            // downloadData[date].customOrders[0]
                            // dataArray.push({
                            //     // date: '',
                            //     'hall #': '',
                            //     'table #': '',
                            //     'bill': '',
                            // });
                        }
                    });

                    dataArray.push({
                        // date: `${date}`,
                        '# ITEM #': '',
                        '# QUANTITY #': '',
                        '# PRICE #': '',
                        '# TABLE #': '# HALLS TOTAL#',
                        '# BILL #': dayTotalForHalls,
                    });
                }
                //  });



                // let todayData = dataArray.filter((item) => {

                //     return item.date == toDate;

                // });

                const csvExporter = new ExportToCsv(options);
                csvExporter.generateCsv(dataArray);
                store.dispatch(closeReportPhase2Action());
                store.dispatch(closeReportPhase1Action());

                // db.collection(`${year}`).doc(`${month}`).delete().then(function() {
                //     const csvExporter = new ExportToCsv(options);
                //     csvExporter.generateCsv(dataArray);
                //     store.dispatch(closeReportPhase2Action());
                //     store.dispatch(closeReportPhase1Action());
                // }).catch(function(error) {
                //     console.error("Error removing document: ", error);
                // });
            }
        });
    },
    download: (month, year) => {

        dataArray.length = 0;

        // downloadTodaysReport();

        // return;

        const options = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalSeparator: '.',
            showLabels: true,
            showTitle: true,
            title: `${month}-${year}`,
            useTextFile: false,
            useBom: true,
            useKeysAsHeaders: true,
        };
        db.collection(`${year}`).doc(`${month}`).get().then(doc => {
            if (doc.exists) {
                let downloadData = doc.data();

                Object.keys(downloadData).forEach((data) => {
                    //Iterating on days

                    let date = data;
                    let dayTotalForHalls = 0;
                    Object.keys(downloadData[data]).forEach((data) => {
                        //Itearting on halls

                        let hall = data;
                        if (hall != 'customExpenses' && hall != 'customOrders') {
                            var totalBill = 0;
                            Object.keys(downloadData[date][hall]).forEach((data) => {
                                let table = data;
                                if (table != 'hallTotal' && table != 'orders') {
                                    dataArray.push({
                                        '# Date #': date,
                                        '# HALL #': hall,
                                        '# TABLE #': table,
                                        '# BILL #': downloadData[date][hall][table],
                                    });
                                    totalBill += downloadData[date][hall][table]
                                }
                            });


                            dataArray.push({
                                '# Date #': '',
                                '# HALL #': '',
                                '# TABLE #': '# TOTAL #',
                                '# BILL #': totalBill,
                            });

                            dataArray.push({
                                '# Date #': '',
                                '# HALL #': '',
                                '# TABLE #': '',
                                '# BILL #': '',
                            });

                        }
                        else if (hall != 'customOrders') {
                            dataArray.push({
                                '# Date #': date,
                                '# HALL #': '',
                                '# TABLE #': ' # PURCHASES #',
                                '# BILL #': downloadData[date][hall],
                            });
                            dataArray.push({
                                '# Date #': '',
                                '# HALL #': '',
                                '# TABLE #': '',
                                '# BILL #': '',
                            });
                        }

                        dayTotalForHalls += (totalBill || 0);

                        //Halls interation finished
                    });


                    dataArray.splice(dataArray.length - 2, 0, {
                        // date: `${date}`,
                        '# Date #': '',
                        '# HALL #': '',
                        '# TABLE #': '# HALLS TOTAL#',
                        '# BILL #': dayTotalForHalls,
                    });

                    dataArray.push({
                        // date: `${date}`,
                        '# Date #': '',
                        '# HALL #': '',
                        '# TABLE #': '',
                        '# BILL #': '',
                    });

                });

                const csvExporter = new ExportToCsv(options);
                csvExporter.generateCsv(dataArray);
                store.dispatch(closeReportPhase2Action());
                store.dispatch(closeReportPhase1Action());

                // db.collection(`${year}`).doc(`${month}`).delete().then(function() {
                //     const csvExporter = new ExportToCsv(options);
                //     csvExporter.generateCsv(dataArray);
                //     store.dispatch(closeReportPhase2Action());
                //     store.dispatch(closeReportPhase1Action());
                // }).catch(function(error) {
                //     console.error("Error removing document: ", error);
                // });
            }
        });
    }
}

// let date = new Date();
    // let toDate = date.getDate();

    // db.collection(date.getFullYear().toString()).doc(date.getMonthString()).get().then(doc => {


    //     let pDate = doc[toDate];

    //     for(var i in pDate){

    //         if(i != "customExpenses")

    //     }

    //     // let avaiableData = [];
    //     // avaiableData.push.apply(avaiableData, Object.keys(doc.data()));
    //     // avaiableData.forEach()


    // });