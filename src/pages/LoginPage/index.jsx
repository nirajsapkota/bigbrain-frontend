import React, { useContext, useState } from 'react';

import { AdminAuthLogin } from '../../api/adminAuth';
import { Link, useHistory } from 'react-router-dom';

import { ReactComponent as SignInWithGoogleIcon } from '../../res/icons/google.svg';
import { ReactComponent as SignInWithFacebookIcon } from '../../res/icons/facebook.svg';
import { ReactComponent as WinnersImage } from '../../res/images/winners.svg';

import { UserContext, ErrorModalContext } from '../../contexts';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, setUser] = useContext(UserContext);
  const [setShowErrorModal, setErrorModalMessage] = useContext(ErrorModalContext);
  const history = useHistory();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await AdminAuthLogin(email, password);
      setUser(res.data.token);
      history.push('/dashboard');
    } catch (err) {
      setErrorModalMessage(err.response.data.error);
      setShowErrorModal(true);
    }
  }

  return (
    <div className="flex items-center justify-center min-w-screen min-h-screen py-14">
      <div className="w-10/12 lg:max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 place-items-center">
          <div className="w-full">
            <h1 className="text-6xl font-bold text-christalle mb-10">Sign In</h1>
            <div className="flex items-center mb-12">
              <hr className="border-roman border w-16 mr-4" />
              <span className="text-roman font-bold">Sign in with</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              <div className="flex items-center border-2 border-gray-200 rounded-lg px-6 py-3 cursor-pointer">
                <SignInWithGoogleIcon className="w-6 h-6 mr-6" />
                <span className="font-light text-sm">Sign in with Google</span>
              </div>
              <div className="flex items-center border-2 border-gray-200 rounded-lg px-6 py-3 cursor-pointer">
                <SignInWithFacebookIcon className="w-6 h-6 mr-6" />
                <span className="font-light text-sm">Sign in with Facebook</span>
              </div>
            </div>
            <form id="signin-form" onSubmit={(e) => submit(e)}>
              <div className="flex flex-col my-12">
                <div className="mb-6">
                  <label className="text-sm">Email</label>
                  <div className="relative mt-2">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pr-2 rounded-l-md">
                      <svg className="w-6 h-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full  border-2 border-gray-200 pl-11 py-2 focus:outline-none rounded-md h-12 focus:outline-none"
                      test-marker="login-email-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm">Password</label>
                  <div className="relative mt-2">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pr-2 rounded-l-md">
                      <svg className="w-6 h-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-2 border-gray-200 w-full pl-11 py-2 focus:outline-none rounded-md h-12 focus:outline-none"
                      test-marker="login-password-input"
                    />
                  </div>
                </div>
              </div>

              <p className="mb-12">New to BigBrain? Join <Link to="/register"><span className="text-roman underline" test-marker="login-to-register-btn">here!</span></Link></p>

              <button test-marker="login-button" type="submit" className="flex items-center justify-center bg-roman outline-none focus:outline-none cursor-pointer rounded-xl h-16 w-16 font-bold shadow-md hover:shadow-xl duration-300">
                <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
          </div>
          <div>
            <WinnersImage className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
