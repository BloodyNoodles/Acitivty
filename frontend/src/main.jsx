import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Registration from './registration';
import UserHome from './userhome';
import AdminHome from './AdminHome';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/userhome" component={UserHome} />
                <Route path="/adminhome" component={AdminHome} />
                <Route path="/" component={Registration} />
            </Switch>
        </Router>
    );
}

export default App;
