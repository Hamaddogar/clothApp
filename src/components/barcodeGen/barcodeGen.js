import React, { Component } from "react";
import "./style.css";
import Barcode from "react-barcode";

class BarcodeGen extends Component {
  render() {
    return (
      <div className="reciept-print">
        <div className="row">
          <div>
            {this.props.data.map((item, index) => {
              debugger;
              return (
                <div key={index}>
                  <div className = 'itemBarcode'>
                    <Barcode
                    
                      value={
                        item.brand +
                        "_" +
                        item.size +
                        "_" +
                        item.color.name +
                        "_"
                      }
                      marginTop={-5}
                      fontSize={13}
                      width={0.6}                     
                      height={45}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
export default BarcodeGen;
