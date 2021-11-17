import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { AuthState } from '@aws-amplify/ui-components';
import Home from '../home';
import Channel from '../channel';
import ChannelAdmin from '../Admin';
import Login from '../Login';

const Routing = () => {
  const [authState, setAuthState] = React.useState();
  const [user, setUser] = React.useState();


  if (authState !== AuthState.SignedIn || !user) {
    return (
      <Login setAuthState={setAuthState} setUser={setUser}/>
    );
  } else {
    console.log(user);
  
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/:channelName/admin" render={
              ({match}) => {
                if(match.params.channelName === user.username) {
                  return (<ChannelAdmin name={match.params.channelName} />)
                } else {
                  return (<Redirect to={`/${match.params.channelName}`} />)
                }
              }}/>
            <Route path="/:channelName" render={({match}) => (<Channel name={match.params.channelName} />)}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default Routing;