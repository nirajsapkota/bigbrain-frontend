import React, { useState, createContext } from 'react';
import PropTypes from 'prop-types';
import { ErrorModal } from '../components/Modal';

const ErrorModalContext = createContext(null);

const ErrorModalProvider = ({ children }) => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <ErrorModalContext.Provider value={[setShow, setMessage]}>
      <ErrorModal
        show={show}
        setShow={setShow}
        message={message}
         />
      {children}
    </ErrorModalContext.Provider>
  );
}

ErrorModalProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export {
  ErrorModalContext,
  ErrorModalProvider
};
