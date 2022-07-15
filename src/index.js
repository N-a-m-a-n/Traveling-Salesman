import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Auth from './components/Auth/Auth';
// import Signup from './Signup';

import './index.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

ReactDOM.render(
    <Router>
        <Routes>
            <Route path = "/" element = {<App />}/>
            <Route path = "/auth" element = {<Auth/>}/>
            {/* <Route path = "/signup" element = {<Signup/>}/> */}
        </Routes>
    </Router>,
    document.getElementById('root')
);