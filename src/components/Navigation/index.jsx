import React, { useContext, useState } from 'react';
import { ErrorModalContext, UserContext } from '../../contexts';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { AdminAuthLogout } from '../../api/adminAuth';
import { ReactComponent as CuteBrainIcon } from '../../res/icons/cute-brain.svg';

import classNames from 'classnames';

const Navigation = () => {
  const [token, setUser] = useContext(UserContext);
  const [setShowErrorModal, setErrorModalMessage] = useContext(ErrorModalContext);
  const [expanded, setExpanded] = useState(false);
  const history = useHistory();
  const location = useLocation();

  const logout = async () => {
    try {
      await AdminAuthLogout(token)
      setUser('');
      history.push('/');
    } catch (err) {
      setErrorModalMessage(err.response.data.error)
      setShowErrorModal(true);
    }
  }

  return (
    <nav className="bg-gray-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button type="button" onClick={() => setExpanded(e => !e)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              <svg className={classNames('h-6 w-6', { hidden: expanded })} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className={classNames('h-6 w-6', { hidden: !expanded })} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <Link test-marker="to-dashbard-btn" to='/dashboard' className="flex items-center">
                <CuteBrainIcon className="h-8 w-auto mr-4" />
                <div className="hidden lg:block font-poppins font-bold text-white">Big Brain</div>
              </Link>
              <div className="hidden sm:block sm:ml-6">
                <div className="flex space-x-4">
                  <Link to='/dashboard' className={classNames('px-3 py-2 rounded-md text-sm font-medium', { 'bg-gray-900 text-white': location.pathname === '/dashboard' }, { 'hover:bg-gray-700 text-gray-300 hover:text-white': location.pathname !== '/dashboard' })}>Dashboard</Link>
                  <Link to='/dashboard/quiz-history' className={classNames('text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium', { 'bg-gray-900 text-white': location.pathname === '/dashboard/quiz-history' }, { 'hover:bg-gray-700 text-gray-300 hover:text-white': location.pathname !== '/dashboard/quiz-history' })}>Past Quiz Results</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium" test-marker="logout-button" onClick={() => logout()}>Logout</button>
          </div>
        </div>
      </div>

      <div className={classNames('sm:hidden', { hidden: !expanded })} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1">
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to='/dashboard' className={classNames('block px-3 py-2 rounded-md text-base font-medium w-full text-left', { 'bg-gray-900 text-white': location.pathname === '/dashboard' }, { 'hover:bg-gray-700 text-gray-300 hover:text-white': location.pathname !== '/dashboard' })}>Dashboard</Link>
            <Link to='/dashboard/quiz-history' className={classNames('block px-3 py-2 rounded-md text-base font-medium w-full text-left', { 'bg-gray-900 text-white': location.pathname === '/dashboard/quiz-history' }, { 'hover:bg-gray-700 text-gray-300 hover:text-white': location.pathname !== '/dashboard/quiz-history' })}>Past Quiz Results</Link>
            <button className="hover:bg-gray-700 text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left" onClick={() => logout()} test-marker="logout-button">Logout</button>
          </div>
        </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
