import React from 'react';
import Chat from './components/Chat/Chat';
import './index.css';
import {BrowserRouter as Router, Route} from 'react-router-dom'


const App = () => (
	<Router>
		<Route exact path="/" component={Chat}></Route>
	</Router>
)

export default App;