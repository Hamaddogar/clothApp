import React, {Component} from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Button from '@material-ui/core/Button';

export default class Confirmation extends React.Component{
    
    render(){

        confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <div className='custom-ui'>
                  <h4>{this.props.title}</h4>
                  <p>{this.props.desc}</p>
                  <Button  variant="contained" color="secondary"
                    onClick={() => {
                        this.props.onYes && this.props.onYes();
                        onClose();
                    }}
                  >
                    Yes, Delete it!
                  </Button>
                  <Button className="ml-10"  variant="contained" color="secondary" onClick={onClose}>No</Button>
                </div>
              );
            }
          });
        

        return "";



    }
    
}