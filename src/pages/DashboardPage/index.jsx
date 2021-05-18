import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import Modal from 'react-modal';
import classNames from 'classnames';

// import {
//   Link
// } from 'react-router-dom';

import {
  ReadQuiz,
  ReadQuizzes
} from '../../api/adminQuizManagement';

import {
  GameCard,
  CreateNewQuizModal,
  Switch
} from '../../components';

import {
  ErrorModalContext,
  UserContext
} from '../../contexts';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [user] = useContext(UserContext);
  const [editToggle, setEditToggle] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [sortMethod, setSortMethod] = useState('0');
  const [lastInteractedQuizId, setLastInteractedQuizId] = useState(null);
  const [lastInteractedSessionId, setLastInteractedSessionId] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  /* Modals */
  const [showCNQM, setShowCNQM] = useState(false); // Create New Quiz Modal (CNQM)
  const [showSessionCodeModal, setShowSessionCodeModal] = useState(false);
  const [showResultsRedirectModal, setShowResultsRedirectModal] = useState(false);
  const [setShowErrorModal, setErrorModalMessage] = useContext(ErrorModalContext);

  const readQuizzes = async () => {
    try {
      const accumulated = [];

      const readQuizzesRes = await ReadQuizzes(user);
      for (const quiz of readQuizzesRes.data.quizzes) {
        const readQuizRes = await ReadQuiz(user, quiz.id);
        accumulated.push({ ...readQuizRes.data, id: quiz.id });
      }

      setQuizzes(accumulated);
    } catch (err) {
      setErrorModalMessage(err.response.data.error);
      setShowErrorModal(true);
    }
  }

  const updateQuizzes = async () => {
    try {
      const accumulated = [];

      const readQuizzesRes = await ReadQuizzes(user);
      for (const quiz of readQuizzesRes.data.quizzes) {
        const readQuizRes = await ReadQuiz(user, quiz.id);
        accumulated.push({ ...readQuizRes.data, id: quiz.id });
      }

      sortQuizzes(accumulated);
      setQuizzes(accumulated);
    } catch (err) {
      setErrorModalMessage(err.response.data.error);
      setShowErrorModal(true);
    }
  }

  const getSessionCodeForLastInteractedQuiz = () => {
    if (lastInteractedQuizId === null) {
      // TODO: Use error modal to show this
      return 'That\'s odd, an error looks like it has occured since this modal is not showing a link to play the game';
    }

    const item = quizzes.find(quiz => quiz.id === lastInteractedQuizId);
    return item.active;
  }

  const sortQuizzes = (quizzes) => {
    if (sortMethod === '0') sortAlphabetically(quizzes, true);
    if (sortMethod === '1') sortAlphabetically(quizzes, false);
    if (sortMethod === '2') sortByCreationDate(quizzes, true);
    if (sortMethod === '3') sortByCreationDate(quizzes, false);
  }

  useEffect(() => {
    readQuizzes();
  }, [])

  useEffect(() => {
    const copy = [...quizzes];
    sortQuizzes(copy);
    setQuizzes(copy);
  }, [sortMethod])

  return (
    <>
      <CreateNewQuizModal
        show={showCNQM}
        setShow={setShowCNQM}
        updateQuizzes={updateQuizzes}
      />

      <Modal
        isOpen={showSessionCodeModal}
        onRequestClose={() => {
          setIsCopied(false);
          setShowSessionCodeModal(false);
        }}
        className="absolute top-1/2 left-1/2 right-auto bottom-auto -mr-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10/12 md:w-1/2 border border-gray-400 rounded-md bg-white focus:outline-none"
      >
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-3/4 py-14">
            <h1 className="font-poppins font-bold text-3xl">Let The Games Begin! 🎉</h1>
            <div className="font-roboto text-gray-500 font-bold text-sm mt-1">Share the session code or URL to your friends!</div>

            <section className="mt-10">
              <h1 className="font-poppins font-bold text-xl">Session Code</h1>
              <h1 className="font-poppins text-2xl mt-1 text-gray-600 font-bold">{getSessionCodeForLastInteractedQuiz()}</h1>
            </section>

            <section className="mt-6">
              <h1 className="font-poppins font-bold text-xl">URL</h1>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pr-2 rounded-l-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="text-gray-600 font-poppins font-bold border-2 border-gray-400 w-full pl-11 focus:outline-none rounded-md h-12 focus:outline-none text-sm overflow-ellipsis"
                  value={`http://localhost:3000/play/${getSessionCodeForLastInteractedQuiz()}`}
                  disabled
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pl-2">
                  <button className={classNames('rounded-md py-2 px-4 text-white text-bold text-sm focus:outline-none', { 'bg-blue-500': !isCopied, 'bg-green-500': isCopied })}
                    onClick={() => {
                      navigator.clipboard.writeText(`http://localhost:3000/play/${getSessionCodeForLastInteractedQuiz()}`);
                      setIsCopied(true);
                    }}>
                    {isCopied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </section>
          </div>
          <div className="flex justify-center w-full bg-gray-100 bottom-0">
            <div className="flex justify-end py-4 w-3/4">
              <button className="bg-red-500 rounded-md font-bold text-white py-2 px-4" test-marker="close-session-popup" onClick={() => {
                setIsCopied(false);
                setShowSessionCodeModal(false);
              }}>Close</button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showResultsRedirectModal}
        onRequestClose={() => setShowResultsRedirectModal(false)}
        className="absolute top-1/2 left-1/2 right-auto bottom-auto -mr-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10/12 md:w-1/2 border border-gray-400 bg-white rounded-md focus:outline-none"
      >
        <div className="flex flex-col items-center justify-center h-2/3 py-14">
          <h1 className="font-poppins font-bold text-2xl">That was Fun! 🏆</h1>
          <div>Would you like to view the results?</div>

          <div className="grid grid-cols-1 md:grid-cols-2 mt-8 gap-y-4 gap-x-8 place-items-center">
            <div className="flex flex-col justify-center text-center cursor-pointer shadow-md rounded-lg hover:shadow-xl duration-300 w-48 h-48 px-4">
              <div className="text-sm font-poppins mb-1" onClick={() => setShowResultsRedirectModal(false)}>No, I don&apos;t want to know!</div>
              <div className="text-3xl">🙅🏼‍♀️</div>
            </div>

            <Link to={{ pathname: `/dashboard/session/${lastInteractedSessionId}/results`, state: { quizId: lastInteractedQuizId } }}>
              <div className="flex flex-col justify-center text-center cursor-pointer shadow-md rounded-lg hover:shadow-xl duration-300 w-48 h-48 px-4" test-marker="navigate-to-results-page-btn">
                <div className="text-sm font-poppins mb-1">Yes! Take me to the results of the Quiz!</div>
                <div className="text-3xl">🚀</div>
              </div>
            </Link>
          </div>
        </div>
        <div className="flex justify-center w-full bg-gray-100 bottom-0">
          <div className="flex justify-end py-4 w-3/4">
            <button className="bg-red-500 rounded-md font-bold text-white py-2 px-4" onClick={() => setShowResultsRedirectModal(false)}>Close</button>
          </div>
        </div>
      </Modal>

      <div className="flex justify-center min-h-screen min-w-screen">
        <div className="w-10/12 md:max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-12 my-12">
            <div className="flex items-center justify-between lg:col-span-2 2xl:col-span-3">
              <h1 className="font-bold font-poppins text-3xl">My Quizzes</h1>
              <button onClick={() => setShowCNQM(true)} className="bg-roman hover:bg-roman font-bold py-3 px-4 rounded-md shadow-md hover:shadow-xl duration-300 inline-flex items-center text-white focus:outline-none" test-marker="create-new-quiz-button">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>New Quiz</span>
              </button>
            </div>
            <div className="flex items-center lg:col-span-2 2xl:col-span-3 -mt-8">
              <div className="grid grid-cols-1 gap-y-2 w-full">
                <h2 className="text-sm mr-12 font-bold text-gray-600">Filters and Tools</h2>
                <div>
                <div className="flex justify-between items-center">
                  <div className="text-sm font-light mr-4 text-gray-700">Sort By</div>
                  <select className="rounded-md p-2 focus:outline-none cursor-pointer bg-gray-200 font-roboto text-sm" onChange={(e) => setSortMethod(e.target.value)}>
                    <option value={0}>Alphabetically (A-Z)</option>
                    <option value={1}>Alphabetically (Z-A)</option>
                    <option value={2}>Created (Newest First)</option>
                    <option value={3}>Created (Oldest First)</option>
                  </select>
                </div>
                </div>
                <div>
                <div className="flex justify-between items-center">
                  <div className="text-sm font-light mr-4 text-gray-700">Delete Mode</div>
                  <Switch
                    toggle={editToggle}
                    setToggle={setEditToggle}
                  />
                </div>
                </div>
              </div>
            </div>
            {quizzes.map((quiz, index) =>
              <GameCard
                key={index}
                index={index}
                game={quiz}
                edit={editToggle}
                setShowSessionCodeModal={setShowSessionCodeModal}
                setShowResultsRedirectModal={setShowResultsRedirectModal}
                setLastInteractedQuizId={setLastInteractedQuizId}
                setLastInteractedSessionId={setLastInteractedSessionId}
                updateQuizzes={updateQuizzes}
                setQuizzes={setQuizzes}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const sortAlphabetically = (data, isIncreasing) => {
  if (isIncreasing) {
    data.sort((a, b) => a.name.localeCompare(b.name));
    return;
  }

  data.sort((a, b) => b.name.localeCompare(a.name));
}

const sortByCreationDate = (data, isIncreasing) => {
  if (isIncreasing) {
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return;
  }

  data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

export default DashboardPage;
