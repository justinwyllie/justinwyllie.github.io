import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App.jsx";
import './custom.scss';
import "@babel/polyfill"; //for stripe
import 'core-js/actual/structured-clone';



ReactDOM.render(<App />, document.getElementById("root"));