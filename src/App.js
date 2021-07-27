import logo from './logo.svg';
import './App.css';
import Board from './Board'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Home from './Home';

const App = () => {
  return (
    <Router>
      <Switch> 
        <Route exact path="/" component={Home}/>
        <Route exact path="/:roomname" component={props => <Board {...props}/>}/>
      </Switch>
    </Router>
  );
}

export default App;