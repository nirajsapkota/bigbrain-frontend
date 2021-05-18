import React, { useContext, useState } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Link } from 'react-router-dom';
import { AdvanceQuiz, DeleteQuiz, EndQuiz, ReadSessionStatus, StartQuiz } from '../../api/adminQuizManagement';
import { ErrorModalContext, UserContext } from '../../contexts';

import { toast } from 'react-toastify';

const GameCard = ({
  index, game, edit, setShowSessionCodeModal, setShowResultsRedirectModal,
  setLastInteractedQuizId, updateQuizzes, setQuizzes, setLastInteractedSessionId
}) => {
  const [token] = useContext(UserContext);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [setShowErrorModal, setErrorModalMessage] = useContext(ErrorModalContext);

  const linkClasses = classNames('place-self-center');

  const startQuiz = async () => {
    try {
      await StartQuiz(token, game.id);
      updateQuizzes();

      // Set data for parent to know which quiz to
      // retrieve session code for, and show the modal
      setLastInteractedQuizId(game.id);
      setShowSessionCodeModal(true);

      toast(`🧠 Successfully started the ${game.name} quiz.`, {
        className: 'text-black text-sm'
      });
    } catch (err) {
      setErrorModalMessage(err.response.data.error);
      setShowErrorModal(true);
    }
  }

  const advanceQuiz = async () => {
    try {
      await AdvanceQuiz(token, game.id);
      const res = await ReadSessionStatus(token, game.active);
      setIsLastQuestion(res.data.results.position + 1 === res.data.results.questions.length);

      toast(`👉🏻 The ${game.name} quiz has been advanced!`, {
        className: 'text-black text-sm'
      });
    } catch (err) {
      setErrorModalMessage(err.response.data.error);
      setShowErrorModal(true);
    }
  }

  const endQuiz = async () => {
    try {
      setLastInteractedSessionId(game.active);
      await EndQuiz(token, game.id);
      updateQuizzes();

      // Set data for parent to know which quiz to
      // redirect to results for, and show the modal
      setLastInteractedQuizId(game.id);
      setShowResultsRedirectModal(true);

      toast(`🛌🏼 The ${game.name} quiz has now ended.`, {
        className: 'text-black text-sm'
      });
    } catch (err) {
      setErrorModalMessage(err.response.data.error);
      setShowErrorModal(true);
    }
  }

  const deleteQuiz = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await DeleteQuiz(token, game.id);
      updateQuizzes();
    } catch (err) {
      setErrorModalMessage(err.response.data.error);
      setShowErrorModal(true);
    }
  }

  return (
    <div className={linkClasses}>
      <Link to={`/dashboard/game/${game.id}`}>
        <div className="w-96 h-96 rounded-xl shadow-md hover:shadow-xl cursor-pointer duration-300" test-marker={`quiz-card-${index}`}>
          {
            edit
              ? (
                <span className="w-96 flex justify-end">
                  <span className="flex items-center justify-center absolute w-8 h-8 rounded-full bg-red-400 -m-3" onClick={(e) => deleteQuiz(e)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </span>
                </span>
                )
              : null
          }
          { game.thumbnail
            ? <img className="h-72 rounded-t-xl w-full object-cover" src={game.thumbnail} alt={game.name} />
            : <div className="flex items-center justify-center font-poppins font-bold text-gray-700 text-2xl h-72 bg-gray-300 rounded-t-xl">{game.name}</div>
          }
          <div className="px-5 py-4">
            <div className="font-bold font-poppins">{game.name}</div>
            <p className="font-poppins">{constructSubtitle(game.questions)}</p>
          </div>
        </div >
      </Link>
      <div className="flex items-center mt-4">
        {game.questions.length === 0 ? <span className="font-roboto text-xs text-gray-700 h-8">Add Questions To This Game to Play!</span> : null}
        {game.questions.length > 0
          ? game.active === null
              ? <div className="flex items-center cursor-pointer" onClick={() => startQuiz()} test-marker={`quiz-card-start-${index}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              <span className="font-roboto text-xs text-gray-700">START</span>
            </div>
              : <div className="flex">
              <div className="flex items-center mr-4 cursor-pointer" onClick={() => endQuiz()} test-marker={`quiz-card-stop-${index}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                </svg>
                <span className="font-roboto text-xs text-gray-700">STOP</span>
              </div>
              { !isLastQuestion
                ? <div className="flex items-center cursor-pointer" onClick={() => advanceQuiz()}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                </svg>
                <span className="font-roboto text-xs text-gray-700">ADVANCE</span>
                </div>
                : null
                }
            </div>
          : null
        }
      </div>
    </div>
  );
}

const constructSubtitle = (questions) => {
  const quizTime = questions.reduce((accumulator, question) => {
    return accumulator + question.timeLimit
  }, 0);

  let time;
  if (quizTime > 59) {
    time = parseInt((quizTime / 60)).toString() + ' mins';
  } else {
    time = quizTime.toString() + ' seconds';
  }

  return questions.length + ' Questions' + ' • ' + time;
}

export default GameCard;

GameCard.propTypes = {
  index: PropTypes.number.isRequired,
  game: PropTypes.object.isRequired,
  edit: PropTypes.bool.isRequired,
  setShowSessionCodeModal: PropTypes.func.isRequired,
  setShowResultsRedirectModal: PropTypes.func.isRequired,
  setLastInteractedSessionId: PropTypes.func.isRequired,
  setLastInteractedQuizId: PropTypes.func.isRequired,
  updateQuizzes: PropTypes.func.isRequired,
  setQuizzes: PropTypes.func.isRequired
};
