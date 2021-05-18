import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { CheckStatus } from '../../api/player';
import { ErrorModalContext } from '../../contexts';

import PropTypes from 'prop-types';

import {
  BoltLoader,
  BookLoader,
  BoxesLoader,
  CircleLoader,
  ScatterBoxLoader,
  SunspotLoader,
  WifiLoader,
  XlviLoader
} from 'react-awesome-loaders';

const LobbyPage = () => {
  localStorage.removeItem('questions');
  const playerId = localStorage.getItem('playerId');
  const [setShowErrorModal, setErrorModalMessage] = useContext(ErrorModalContext);
  const history = useHistory();

  const poll = async () => {
    try {
      const res = await CheckStatus(playerId);
      if (res.data.started) {
        clearInterval(int);
        history.push('/game');
      }
    } catch (err) {
      clearInterval(int);
      setErrorModalMessage(err.response.data.error);
      setShowErrorModal(true);
      history.push('/');
    }
  }

  const int = setInterval(poll, 1000);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-screen">
      <h1 className="font-bold font-poppins text-3xl mb-24 text-center">Waiting for the game to start!</h1>
      <RandomLoader number={Math.floor(Math.random() * 8)} />
    </div>
  );
}

const RandomLoader = ({ number }) => {
  switch (number) {
    case 0: return <BoltLoader />;
    case 1: return <BookLoader />;
    case 2: return <BoxesLoader />;
    case 3: return <CircleLoader />;
    case 4: return <ScatterBoxLoader />;
    case 5: return <SunspotLoader />;
    case 6: return <WifiLoader />;
    case 7: return <XlviLoader boxColors={['#EF4444', '#F59E0B', '#6366F1']} />;
  }
}

RandomLoader.propTypes = {
  number: PropTypes.number.isRequired
};

export default LobbyPage;
