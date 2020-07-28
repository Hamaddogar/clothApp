import React, { Component } from 'react';
import './style.css';
class Reciept extends Component {
    render() {
        return <div className="reciept-print">
            <div className="row">
                <div>
                    <div className="row">
                        <div style={{ textAlign: 'center', fontSize: '28px' }}>
                            <br />
                            <h3>The Fine Club</h3>
                            {this.props.data.hideReceipt && <h5>BILL ESTIMATION</h5>}
                        </div>

                        <div style={{ float: 'left', display: 'inline-block' }}>
                            <address>
                                <br />
                                511 - Kohinoor City, Faisalabad
                                <br />
                                <abbr title="Phone">P:</abbr> 041-8711344
                            </address>
                        </div>

                        <div style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                           {/* {this.props.estimation ? <h2>Purchasing Report</h2> : <h2>Receipt</h2> }  */}
                           {this.props.data.estimation && this.props.data.hideReceipt &&  <h2>Estimation Bill</h2> } 
                           {!this.props.data.estimation && !this.props.data.hideReceipt && <h2>Receipt</h2> } 
                           {this.props.data.hideReceipt && !this.props.data.estimation && <h2>Purchasing Report</h2> } 
                        </div>
                        {/* <div style={{ float: 'right', display: 'inline-block' }}>
                            <p>
                                <em>Date: {new Date().getMonth() + 1}/{new Date().getDate()}/{new Date().getFullYear()}</em>
                            </p>
                            <p>
                               

                            </p>
                        </div> */}
                    </div>
                    <div className="row">

                        <table>
                            <tr>
                                <td>Date</td>
                                <td>{new Date().getMonth() + 1}/{new Date().getDate()}/{new Date().getFullYear()}</td>  
                                <td></td>                         
                            {
                                this.props.data.hasOwnProperty('recieptNo') && <td>Receipt #:</td>
                            }
                            {
                                this.props.data.hasOwnProperty('recieptNo') && <td>{this.props.data.recieptNo}</td>
                            }
                        </tr>
                            {this.props.data.namedReceipt ? <tr>
                                <td colSpan="2">
                                    Customer Name
                                    </td>
                                <td  colSpan="2">
                                    {this.props.data.customerName}
                                </td>
                            </tr> : null
                            }
                        {!this.props.data.namedReceipt && ! this.props.data.estimation? <tr>
                                <td colSpan="2">
                                    Table
                                    </td>
                                <td  colSpan="2">
                                    {this.props.data.table}
                                </td>
                            </tr> : null
                            }



                        </table>

                       

                        <table style={{ width: '100%' }} className="table-hover">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th className="text-center">Price</th>
                                    <th className="text-center">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.props.data.order.map((item, index) => {
                                        return <tr key={item.price + index}>
                                            <td className="col-md-9"><em>{item.dishName}</em></td>
                                            <td className="col-md-1" style={{ textAlign: 'center' }}> {item.quantity} </td>
                                            <td className="col-md-1 text-center">{item.singlePrice}</td>
                                            <td className="col-md-1 text-center">{item.price}</td>
                                        </tr>
                                    })
                                }
                                <tr>
                                    <td> </td>
                                    <td>   </td>
                                    <td>
                                        <p>
                                            <strong>Subtotal: </strong>
                                        </p>
                                    </td>
                                    <td className="text-center">
                                        <p>
                                            <strong>{this.props.data.grossTotal}</strong>
                                        </p>
                                    </td>
                                </tr>
                                {this.props.data.serviceCharges ?
                                    <tr>
                                        <td> </td>
                                        <td>   </td>
                                        <td className="text-right">
                                            <p>
                                                <strong>Service Charges: ({this.props.data.serviceChargesAMT}%)</strong>
                                            </p>
                                        </td>
                                        <td className="text-center">
                                            <p>
                                                <strong>{Math.round(this.props.data.grossTotal * (this.props.data.serviceChargesAMT / 100))}</strong>
                                            </p>
                                        </td>
                                    </tr> : null
                                }
                                {this.props.data.discountMode ?
                                    <tr>
                                        <td> </td>
                                        <td>   </td>
                                        <td className="text-right">
                                            <p>
                                                <strong>Discount: </strong>
                                            </p>
                                        </td>
                                        <td className="text-center">
                                            <p>
                                                <strong>{this.props.data.discountPercent}%</strong>
                                            </p>
                                        </td>
                                    </tr> : null
                                }
                                {this.props.data.hasOwnProperty('taxAmount') ?
                                    <tr>
                                        <td> </td>
                                        <td>   </td>
                                        <td className="text-right">

                                            {this.props.data.checked ? <p>
                                                <strong>Sales Tax: </strong>
                                            </p>
                                                : ''}
                                        </td>
                                        <td className="text-center">

                                            {this.props.data.checked ? <p>
                                                <strong>{this.props.data.taxAmount}</strong>
                                            </p>
                                                : ''}
                                        </td>
                                    </tr> : null
                                }
                                <tr>
                                    <td>   </td>
                                    <td>   </td>
                                    <td className="text-right"><h4><strong>Total: </strong></h4></td>
                                    <td className="text-center text-danger"><h4><strong>{this.props.data.hasOwnProperty('grandTotal') ? this.props.data.grandTotal : this.props.data.totalBill}</strong></h4></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    }
}
export default Reciept;