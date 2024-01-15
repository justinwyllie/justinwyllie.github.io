import React, {Component} from "react";
import Alert from 'react-bootstrap/Alert';

//TODO TRANSLATION!
 const ErrorMessageDisplay = (props) => {
    console.log("props", props.message);
    return (
        <p variant="danger" className="space-above-below"  >
            Sorry. An error has occured. There may be further information here: {props.message}
        </p>
    )

}



const ConfirmMessageDisplay = (props) => {

    let status;
    if (!props.status)
    {
        status = "success";
    }
    else
    {   
        status = props.status;
    }
   
    return (
        <div className={`alert alert-${status}`} role="alert">
            {props.message}
        </div>
    )

}





export {

    ErrorMessageDisplay,
    ConfirmMessageDisplay
}