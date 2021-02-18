import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import MyRouter from "./components/MyRouter"
import FileUpload from "./components/FileUpload";
import Modules from "./components/Modules";
import * as serviceWorker from "./serviceWorker";
import { Link, Route, BrowserRouter as Router} from 'react-router-dom'


ReactDOM.render(<MyRouter/>, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
