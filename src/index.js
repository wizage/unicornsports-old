import React from 'react';
import ReactDOM from 'react-dom';
import Amplify from 'aws-amplify';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'rsuite/dist/rsuite.min.css';
import Routing from './components/Router';
/* Location 1 */

ReactDOM.render(
  <Routing />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
