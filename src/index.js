import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import Fuse from "fuse.js";

class Labs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            labs: [],
            search: '',
        }
    }

    componentDidMount(){
        axios.get('https://perchresearch.com:3000/api/challenge_project_data')
        .then(response => response.data.result.map(lab => ({
                id: `${lab.id}`,
                title: `${lab.title}`,
                description: `${lab.description}`,
                duties: `${lab.duties}`,
                time_commitment: `${lab.time_commitment}`,
                classification: `${lab.classification}`,
            })))
        .then(newLab => this.setState({labs: newLab}))
        .catch(error => alert(error))
    }
    
    render() {
        let output;

        var options = {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
              "title",
              "description",
              "classification",
            ]
        };

        var result;
        var fuse = new Fuse(this.state.labs, options);
        if (this.state.search.length < 3) {
            result = this.state.labs;
        }
        else {
            result = fuse.search(this.state.search);
            result.sort((a, b) => a.id - b.id);
        }

        if (result.length != 0) {
            return (
                <div>
                    <div class="row">
                        <div class="col-sm"></div>
                        <div class="col-sm">
                            <form>
                                <div class="form-group">
                                    <input onChange={e => this.setState({ search: e.target.value })} class="form-control" placeholder="Search labs" />
                                    <small class="form-text text-muted">Enter at least 3 characters for search.</small>
                                    <small class="form-text text-muted">Searches by title, description, and classification.</small>
                                    <small class="form-text text-muted">Output is sorted by id.</small>
                                </div>
                            </form>
                        </div>
                        <div class="col-sm"></div>
                    </div>
                    { result.map(lab =>
                        <div key={lab.id} className="card card-width">
                            <div className="card-body">
                                <Link to={{ pathname: `/lab/${lab.id}`, state: { labs: this.state.labs } }}>
                                    <h5 className="card-title center">{lab.id}  {lab.title}</h5>
                                </Link>
                                <h6 className="card-subtitle mb-2 text-muted center">{lab.classification}</h6>
                            </div>
                        </div>
                    )}
                </div>
            );
        }
        else {
            return (
                <div>
                    <div class="row">
                        <div class="col-sm"></div>
                        <div class="col-sm">
                            <form>
                                <div class="form-group">
                                    <input onChange={e => this.setState({ search: e.target.value })} class="form-control" placeholder="Search labs" />
                                    <small class="form-text text-muted">Enter at least 3 characters for search.</small>
                                    <small class="form-text text-muted">Searches by title and description.</small>
                                    <small class="form-text text-muted">Output is sorted by id.</small>
                                </div>
                            </form>
                        </div>
                        <div class="col-sm"></div>
                    </div>
                    <h2>No labs found :(</h2>
                </div>
            );
        }
    }
}

const Lab = (props) => {
    const labs = props.location.state.labs
    const labID = props.match.params.id
    var exists = false;
    var i;
    for (i = 0; i < labs.length; ++i) {
        if (labs[i].id === labID) {
            var lab = labs[i];
            exists = true;
            break;
        }
    }
    
    if (exists) {
        return (
            <div>
                <div className="card card-width">
                    <div className="card-body">
                        <h5 className="card-title center">{lab.title}</h5>
                        <h6 className="card-subtitle mb-2 text-muted center">{lab.classification}</h6>
                        <p className="card-text">{lab.description}</p>
                        <p className="card-text">{lab.duties}</p>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">Time commitment: {lab.time_commitment} hours</li>
                        </ul>
                    </div>
                </div>
                <br></br>
                <Link to='/'>Go Back</Link>
            </div>
        )
    }
    else {
        return (
            <div>
                <h1>Lab was not found.</h1>
                <br></br>
                <Link to='/'>Go Back</Link>
            </div>
        )
    }
    
}

const NotFound = () => (
    <h1>Page Not Found</h1>
)

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Labs} />
            <Route path="/lab/:id" component={Lab} />
            <Route path='*' component={NotFound} />
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);