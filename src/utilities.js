import html2canvas from 'html2canvas';

export function getProfitLossStatement(args) {

    return new Promise((c, e) => {

        args = args || {};
        let parent = document.createElement('div');
        args.id && (parent.id = "profitAndLoss");
        let profit = args.revenue - args.expenses;

        if (profit > 0) {
            profit = profit + "Rs.";
        } else {
            profit = "(" + profit + "Rs.)";
        }

        parent.innerHTML = '<table id="profit_loss_table" border="1" cellspacing="0">\
                                    <tr>\
                                        <th colspan="2">\
                                            <h4><center>THE FINE CLUB<center></h4>\
                                            <div style="text-align:center" >511, KOHINOOR CITY, FAISALABAD</div>\
                                        </th>\
                                    </tr>\
                                    <tr>\
                                        <th colspan="2">\
                                            <h5><center>PROFIT AND LOSS STATEMENT<center></h5>\
                                        </th>\
                                    </tr>\
                                    <tr>\
                                        <td colspan="2">\
                                            <strong class="bold">PERIOD </strong>\
                                            <strong>'+ (args.period || "") + '</strong>\
                                        </td>\
                                    </tr>\
                                    <tr>\
                                        <td><strong class="bold">REVENUE</strong></td>\
                                        <td class="center np">'+ args.revenue + '</td>\
                                    </tr>\
                                    <tr>\
                                        <td><strong class="bold">EXPENSES</strong></td>\
                                        <td class="center np">('+ args.expenses + ')</td>\
                                    </tr>\
                                    <tr>\
                                        <td style="text-align:center" colspan="2" class="np fin">\
                                            <span> <strong class="bold">NET PROFIT</strong></span>\
                                            <span class="bold">'+ (profit) + '</span>\
                                        </td>\
                                    </tr>\
                                    </table>\
    <style>\
        #profit_loss_table {\
        width: 50%;\
        z-index:-100;\
        font-family: Arial, Helvetica, sans-serif;\
    }\
    .fin{\
        border-top:2px solid;\
    }\
    #profit_loss_table td.np span {\
        position: relative;\
        left: 150px;\
    }\
    .center{\
        text-align:center;\
    }\
    #profit_loss_table td.np {\
        padding: 24px 0px 15px\
    }\
    .bold{\
        font-weight:bold;\
    }\
    <style>';

    let container = document.getElementById('printingCont');
    container.innerHTML = '';
    container.appendChild(parent);    

    html2canvas(container).then(function (canvas) {
        c(canvas.toDataURL())
    });

    });


    // return parent;

}