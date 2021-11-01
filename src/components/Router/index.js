import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Home from '../home';
import Channel from '../channel';
import ChannelAdmin from '../admin';

const Routing = (
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/:channelName/admin" render={({match}) => (<ChannelAdmin name={match.params.channelName} />)}/>
        <Route path="/:channelName" render={({match}) => (<Channel name={match.params.channelName} />)}/>
      </Switch>
    </div>
  </Router>
);

export default Routing;