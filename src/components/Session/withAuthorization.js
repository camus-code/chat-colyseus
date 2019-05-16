import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as Colyseus from "colyseus.js";

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

var client = new Colyseus.Client('ws://localhost:2567');

const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
        if (!condition(authUser)) {
          this.props.history.push(ROUTES.SIGN_IN);
        }
        else {
        	// Send Firebase token to colyesus
        	authUser.getIdToken(/* forceRefresh */ true).then((idToken) => {
					 console.log(idToken)
					 client.join("chat", {idToken: idToken})
					}).catch(function(error) {
					  // Handle error
					});
			   }
      });
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            condition(authUser) ? <Component {...this.props} /> : null
          }
        </AuthUserContext.Consumer>
      );
    }
  }

  return compose(
    withRouter,
    withFirebase,
  )(WithAuthorization);
};

export default withAuthorization;