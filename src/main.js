import React from 'react'
import ReactDOM from 'react-dom'
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom'
import Loginapp from './components/login'
import Search from './components/search'


  


const App = () =>
 (
    <div className="app-routes">
        <Router>
            <div>  
                          
            <Route path="/" component={Loginapp} />
            <Route path="/search" component={Search} /> 
            <Route path="/logout" component={Loginapp}/>
           
            </div>
        </Router>
    </div>
)


ReactDOM.render(<App/>, document.getElementById('root'));




