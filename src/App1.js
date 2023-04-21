import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
//import Contact from './Contact';
import Product from './Product';

function App() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/contact" component={Home} />
      <Route path="/:productId" component={Product} />
    </Switch>
  );
}

export default App;