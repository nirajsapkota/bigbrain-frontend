import React, { useState, createContext } from 'react';
import PropTypes from 'prop-types';

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export {
  UserContext,
  UserProvider
};
