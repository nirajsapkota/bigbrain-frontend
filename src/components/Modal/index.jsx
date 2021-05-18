import React, { useContext, useRef, useState } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CreateQuiz, UpdateQuiz } from '../../api/adminQuizManagement';
import { ErrorModalContext, UserContext } from '../../contexts';
import { Switch } from '..';
import { quizValidator } from '../../utils';
import { toast } from 'react-toastify';

const CreateNewQuizModal = ({ show, setShow, updateQuizzes }) => {
  const [user] = useContext(UserContext);
  const [name, setName] = useState('');
  const [fileName, setFileName] = useState('Select File');
  const [file, setFile] = useState(null);
  const [setShowErrorModal, setErrorModalMessage] = useContext(ErrorModalContext);
  const [useFileUpload, setUseFileUpload] = useState(false);
  const classes = classNames('fixed', 'z-10', 'inset-0', 'overflow-y-auto', { hidden: show === false });
  const fileInputRef = useRef(null);

  const createQuiz = async () => {
    if (useFileUpload) {
      createQuizByFileWrapper();
      resetFields();
      return;
    }

    createQuizByName();
  }

  const createQuizByName = async () => {
    if (name === '') {
      setErrorModalMessage('Quiz must have a non-empty name.');
      setShowErrorModal(true);
      return;
    }

    try {
      await CreateQuiz(user, name);
      resetFields();
      setShow(false);
      updateQuizzes();
    } catch (err) {
      setErrorModalMessage(err.response.data.error)
      setShowErrorModal(true);
    }
  }

  const createQuizByFileWrapper = () => {
    if (file === null) {
      setErrorModalMessage('You have not selected a file to upload.');
      setShowErrorModal(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => createQuizByFile(e);
    reader.readAsText(file);
  }

  const createQuizByFile = async (e) => {
    const quiz = JSON.parse(e.target.result);

    const [success, message] = quizValidator(quiz);
    if (!success) {
      setErrorModalMessage(message);
      setShowErrorModal(true);
      return;
    }

    try {
      const createQuizRes = await CreateQuiz(user, quiz.name);
      await UpdateQuiz(user, createQuizRes.data.quizId, undefined, quiz.questions, quiz.thumbnail);

      toast('🦄 Successfully uploaded the quiz!', {
        className: 'text-black text-sm'
      });

      resetFields();
      updateQuizzes();
      setShow(false);
    } catch (err) {
      setErrorModalMessage(err.response.data.error);
      setShowErrorModal(true);
    }
  }

  const handleFileSelected = (e) => {
    if (e.target.files[0] === undefined) {
      resetFields();
      return;
    }

    setFileName(e.target.files[0].name);
    setFile(e.target.files[0]);
  }

  const resetFields = () => {
    setName('');
    setFileName('Select File');
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div className={classes} aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen
        pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-grow">
                <h3 className="font-poppins text-lg font-bold text-gray-900 mb-2" id="modal-title">Create a New Quiz</h3>

                <div className="flex justify-between items-center mb-4">
                  <div className="font-poppins mr-4 text-sm">Upload quiz from file</div>
                  <Switch
                    toggle={useFileUpload}
                    setToggle={setUseFileUpload}
                  />
                </div>

                {useFileUpload
                  ? <div>
                    <button className="flex items-center rounded-md bg-indigo-500 text-white px-4 py-2" onClick={() => fileInputRef.current.click()}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      {fileName}
                    </button>
                    <input ref={fileInputRef} type="file" accept='application/json' className="hidden" onChange={(e) => handleFileSelected(e)} />
                  </div>
                  : <div className="mt-2 mb-2">
                    <div className="font-poppins">Name</div>
                    <div className="relative mt-2">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pr-2 rounded-l-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border-2 border-gray-200 pl-11 py-2 focus:outline-none rounded-md h-10 focus:outline-none"
                        test-marker="new-quiz-name-input"
                      />
                    </div>
                  </div>
                }

              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button onClick={() => createQuiz()} test-marker="new-quiz-create-btn" type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-roman text-base font-medium text-white hover:bg-roman focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
              Create
            </button>
            <button onClick={() => {
              resetFields();
              setShow(false);
            }} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ErrorModal = ({ show, setShow, message }) => {
  const classes = classNames('fixed', 'z-10', 'inset-0', 'overflow-y-auto', { hidden: show === false });

  return (
    <div className={classes} aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen
        pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-grow">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6" id="modal-title">
                  Error!
                </h3>
                <div className="mt-2">
                  <p>{message}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button onClick={() => setShow(false)} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export {
  CreateNewQuizModal,
  ErrorModal,
};

CreateNewQuizModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  updateQuizzes: PropTypes.func.isRequired
};

ErrorModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired
};
