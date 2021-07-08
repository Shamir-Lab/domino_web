// LIBRARY
/*eslint-disable no-unused-vars*/
import React from 'react';
/*eslint-enable no-unused-vars*/
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

// COMPONENT
import Modules from './Modules';
import FileUpload from './FileUpload';
import LandingPage from "./LandingPage";

class MyRouter extends React.Component {

render() { 
	return (
		  <div className='routerContainer'>
              <Router>
                  <Switch>
                      <Route path="/modules" component={Modules} render={props => <Modules {...props} /> } />
                      <Route path="/" component={FileUpload} /> {/*file-upload*/}
                      {/*<Route path="/" component={LandingPage} />*/}
                  </Switch>
              </Router>
          </div>
        );
    }
}

export default MyRouter
