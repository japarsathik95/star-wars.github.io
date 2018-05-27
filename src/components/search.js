import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import _ from 'lodash'
import SuggestionInputSearch from 'suggestion-react-input-search';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom'
class Search extends React.Component {
    
    constructor() {
        super()
        this.state = { inputdata: "", planetnames: [], results: [], showsearch: false, showplanet: false, postplanet: [], logout:false, starttime:new Date().getMinutes(), alertmsg:"", alertflag:false };
        this.counter = 0;
    }
    //update search value to state
    updateelement(event) {

        this.setState({ inputdata: event.target.value });


    }

    //ComponentDidMount
    componentDidMount() {
        if (sessionStorage.getItem("authToken") === "true") {
            this.getPlanetDetails();
           
        }
        
        
    }

    handleOnSubmit(e) {
       
        let currenttime = new Date().getMinutes();
        let diffmints = currenttime - this.state.starttime;
        console.log(diffmints);
        console.log(this.counter);
        if(sessionStorage.getItem("uname") != "Luke Skywalker" && this.counter >= 15 && diffmints > 1)
        {
            this.setState({alertmsg:"you can not make more then 15 searches in a minute", alertflag:true});
        
        }
        else
        {
        this.counter++;
        let planets = e.toString().split(" ");
        let postplanet = _.filter(this.state.results, function (val, i) {

            return val.name.split(" ")[0].toLowerCase() === planets[1].toLowerCase();
        });
      
        this.setState({ postplanet });
        this.setState({ showplanet: true });
        }

    }

    //get All planet details
    getPlanetDetails() {
        var that = this;
        axios.get('https://swapi.co/api/planets/')
            .then(function (response) {
                console.log(response.status);
                if (response.status === 200) {
                    let planetnames = [];
                    _.map(response.data.results, function (val, i) {
                        planetnames.push(`Planet ${val.name} population of ${val.population}`);
                    });
                    that.setState({ planetnames });
                    that.setState({ results: response.data.results, showsearch: true });
                    console.log(that.state.planetnames);
                }
            })
            .catch(function (error) {
                console.log(error);
            });

    };

    //logout App
    logout()
    {
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("uname");
        this.setState({logout:true});
        

    }
    //React render method
    render() {
        const placeholder = 'Search planet details';
        const inputPosition = 'center';
        const suggestion = this.state.planetnames;
        const { from } = this.props.location.state || '/'
        const { logoutsuccess } = this.state
        return (

            <div className="container">
                <nav className="navbar navbar-expand-sm bg-light navbar-light">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="#">StarWars</a>
                        </li>


                    </ul>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="#">Welcome {sessionStorage.getItem("uname")}</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#" onClick={this.logout.bind(this)}>Log Out</a>
                        </li>
                    </ul>
                </nav>
                <div className="row">
                    <div className="col-2"></div>

                    <div className="col-8 customcls">

                        {this.state.showsearch ? <SuggestionInputSearch
                            onSubmitFunction={this.handleOnSubmit.bind(this)}
                            recentSearches={suggestion}
                            placeholder={placeholder}
                            inputPosition={inputPosition}
                        /> : ""}
                        {this.state.showplanet && this.state.planetnames.length > 0 && !this.state.alertflag?
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Planet details</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Name of the planet</td>
                                        <td>{this.state.postplanet[0].name}</td>
                                    </tr>
                                    <tr>
                                        <td>Rotation period</td>
                                        <td>{this.state.postplanet[0].rotation_period}</td>
                                    </tr>
                                    <tr>
                                        <td>Orbital period</td>
                                        <td>{this.state.postplanet[0].orbital_period}</td>
                                    </tr>
                                    <tr>
                                        <td>Diameter</td>
                                        <td>{this.state.postplanet[0].diameter}</td>
                                    </tr>
                                    <tr>
                                        <td>Climate</td>
                                        <td>{this.state.postplanet[0].climate}</td>
                                    </tr>
                                    <tr>
                                        <td>Terrain</td>
                                        <td>{this.state.postplanet[0].terrain}</td>
                                    </tr>
                                    <tr>
                                        <td>Surface water</td>
                                        <td>{this.state.postplanet[0].surface_water}</td>
                                    </tr>
                                    <tr>
                                        <td>Population</td>
                                        <td>{this.state.postplanet[0].population}</td>
                                    </tr>
                                </tbody>
                            </table> : ""}

                           

                    </div>
                    {this.state.alertmsg?<div className="alert alert-danger custommargin calign" role="alert">
 {this.state.alertmsg}
</div>:""}
                    </div>

                <div className="col-2"></div>

                {this.state.logout || sessionStorage.getItem("authToken") == "false"?<Redirect to={from || '/logout'}/>:""}

            </div>

        )
    }
}

export default Search
