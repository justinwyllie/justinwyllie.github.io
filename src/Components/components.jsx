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



export default ErrorMessageDisplay; 