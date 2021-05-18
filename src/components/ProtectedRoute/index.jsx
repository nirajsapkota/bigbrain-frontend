import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from '../../contexts';
import Navigation from '../Navigation';

const ProtectedRoute = ({ ...rest }) => {
  const [user] = useContext(UserContext);

  if (user) {
    return (
      <>
        <Navigation />
        <Route {...rest} />
      </>
    );
  } else {
    return <Redirect to='/login' />;
  }
}

export default ProtectedRoute;
