import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import _ from 'lodash'
import {Redirect} from 'react-router'
class Loginapp extends React.Component {
    constructor() {
        super()
        this.state = { username: "", password: "" ,valid:true, msg:"", loginsuccess:false, loading:false};

    }
    //update username and password to state
    updateelement(val, event) {
        if (val == "uname") {
            this.setState({ username: event.target.value });
        }
        else {
            this.setState({ password: event.target.value });
        }

    }
    
    //Validate login
    login() {
        var that = this;
        this.setState({loading:true});
        if(!this.state.username)
        {
            this.setState({valid:false,msg:"Please enter username"});
        }
        else if(!this.state.password)
        {
            this.setState({valid:false,msg:"Please enter password"});
        }
        else
        {
        axios.get('https://swapi.co/api/people/')
            .then(function (response) {
                console.log(response.status);
                if(response.status === 200)
                {
                    let validuser = _.find(response.data.results,function(val,i){
                            return val.name === that.state.username && val.birth_year === that.state.password
                    });
                    if(validuser)
                    {
                        sessionStorage.setItem("authToken",true);
                        that.setState({loginsuccess:true});
                        //that.props.history.push('/search') 
                        sessionStorage.setItem("uname",that.state.username)
                    }
                    else
                    {
                        sessionStorage.setItem("authToken",false);
                        that.setState({valid:false,msg:"Invalid username and password"});
                        
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }

    };
    //React render method
    render() {
        const { from } = this.props.location.state || '/'
        const { loginsuccess } = this.state
        return (
            <div className="container">
               
               {this.state.loginsuccess?"":<div className="row">
                    <div className="col-3"></div>

                    <div className="col-6">


                        <h1 class="h3 mb-3 font-weight-normal custommargin calign">Star Wars</h1>
                        <label for="inputEmail" class="sr-only">Username</label>
                        <input type="text" id="Username" class="form-control custommargin" placeholder="Username" required autofocus value={this.state.username} onChange={this.updateelement.bind(this, "uname")} />
                        <label for="inputPassword" class="sr-only">Password</label>
                        <input type="password" id="inputPassword" class="form-control custommargin" placeholder="Password" required value={this.state.password} onChange={this.updateelement.bind(this, "pwd")} />

                        <button class="btn btn-lg btn-primary btn-block custommargin" type="submit" onClick={this.login.bind(this)}>{this.state.loading?<i class="fa fa-spinner fa-spin"></i>:""}Log In</button>
                        {!this.state.valid?<div className="alert alert-danger custommargin" role="alert">
 {this.state.msg}
</div>:""}


                    </div>

                <div className="col-3"></div></div>}
                {this.state.loginsuccess?<Redirect to={from || '/search'}/>:""}
            </div>

        )
    }
}

export default Loginapp
