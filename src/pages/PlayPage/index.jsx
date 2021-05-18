import React, { useEffect, useState, useContext } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import { JoinSession } from '../../api/player';
import { ErrorModalContext } from '../../contexts';
import { ReactComponent as CuteBrainIcon } from '../../res/icons/cute-brain.svg';

const PlayPage = () => {
  const { gameId } = useParams();

  const [name, setName] = useState('');
  const [sessionID, setID] = useState('');
  const [setShowErrorModal, setErrorModalMessage] = useContext(ErrorModalContext);
  const history = useHistory();

  const handleSubmit = async () => {
    if (name === '') {
      setErrorModalMessage('You must provide a non-empty name.');
      setShowErrorModal(true);
      return;
    }

    try {
      const res = await JoinSession(sessionID, name);
      localStorage.setItem('playerId', res.data.playerId);
      history.push('/lobby');
    } catch (err) {
      setErrorModalMessage(err.response.data.error);
      setShowErrorModal(true);
    }
  }

  useEffect(() => {
    if (gameId !== undefined) {
      setID(gameId);
    }
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen">
      <div className="w-10/12 lg:max-w-2xl">
        <div className="flex flex-col my-12">
          <Link to="/" className="mb-12">
            <div className="flex space-x-4 items-center">
              <CuteBrainIcon className="w-12 h-12" />
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                <p className="font-poppins font-bold ml-1">Back to Landing Page</p>
              </div>
            </div>
          </Link>
          <h1 className="font-poppins font-bold text-3xl mb-2">Join a Session</h1>
          <h1 className="font-poppins font-medium text-gray-700 mb-12">Choose a display name and enter the session code given to you by a quiz admin</h1>
          <div className="mb-6">
            <label className="text-sm">Name</label>
            <div className="relative mt-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pr-2 rounded-l-md">
                <svg className="w-6 h-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full  border-2 border-gray-200 pl-11 py-2 focus:outline-none rounded-md h-12 focus:border-roman"
              />
            </div>
          </div>
          <div>
            <label className="text-sm">Session ID</label>
            <div className="relative mt-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pr-2 rounded-l-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                </svg>
              </div>
              <input
                type="sessionID"
                value={sessionID}
                onChange={(e) => setID(e.target.value)}
                className="border-2 border-gray-200 w-full pl-11 py-2 focus:outline-none rounded-md h-12 focus:border-roman"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={() => handleSubmit()} type="submit" className="flex items-center justify-center bg-roman outline-none focus:outline-none cursor-pointer rounded-xl h-16 w-16 font-bold shadow-md hover:shadow-xl duration-300">
            <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}

export default PlayPage;
