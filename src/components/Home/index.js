import React from 'react';
import { withAuthorization } from '../Session';

const HomePage = () => (
  <h1>
  	This is the home page only logged in users can see
  </h1>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);