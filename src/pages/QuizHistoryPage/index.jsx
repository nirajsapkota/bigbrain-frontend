import React, { useState, useEffect, useContext } from 'react';
import { ReadQuiz, ReadQuizzes, ReadSessionResults } from '../../api/adminQuizManagement';
import { ErrorModalContext, UserContext } from '../../contexts';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const QuizHistoryPage = () => {
  const [token] = useContext(UserContext);
  const [quizzes, setQuizzes] = useState([]);
  const [setShowErrorModal, setErrorModalMessage] = useContext(ErrorModalContext);

  useEffect(() => {
    readQuizzes();
  }, []);

  const readQuizzes = async () => {
    try {
      const res = await ReadQuizzes(token);
      setQuizzes(res.data.quizzes);
    } catch (err) {
      setErrorModalMessage(err.response.data.error);
      setShowErrorModal(true);
    }
  }

  return (
    <div className="flex justify-center min-h-screen min-w-screen my-12">
      <div className="w-10/12 md:max-w-6xl">
        <h1 className="font-poppins font-bold text-3xl mb-12">Quiz History</h1>
        <div className="flex flex-col space-y-12">
          {quizzes.map((quiz, index) =>
            <Card
              key={index}
              id={index + 1}
              title={quiz.name}
              quizId={quiz.id}
              oldSessions={quiz.oldSessions}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const Card = ({ title, quizId, oldSessions }) => {
  return (
    <div className="rounded-lg shadow-md">
      <div className="flex items-center border-b border-gray-300 h-28 px-12">
        <div className="font-poppins font-medium text-xl">{title}</div>
      </div>
      {oldSessions.map((session, index) =>
        <Session
          key={index}
          index={index + 1}
          quizId={quizId}
          sessionId={session}
          isLast={oldSessions.length === index + 1}
          />
      )}
    </div>
  );
}

const Session = ({ index, quizId, sessionId, isLast }) => {
  const [token] = useContext(UserContext);
  const [winner, setWinner] = useState('');
  const [datePlayed, setDatePlayed] = useState('');
  const [setShowErrorModal, setErrorModalMessage] = useContext(ErrorModalContext);

  useEffect(() => {
    fetchSessionResults();
  }, []);

  const fetchSessionResults = async () => {
    try {
      const quizByIdRes = await ReadQuiz(token, quizId);
      const sessionReultsRes = await ReadSessionResults(token, sessionId);
      const winner = getWinner(quizByIdRes.data.questions, sessionReultsRes.data.results);
      const datePlayed = getDatePlayed(sessionReultsRes.data.results);
      setWinner(winner || 'N/A');
      setDatePlayed(datePlayed ? datePlayed.toLocaleString() : 'N/A');
    } catch (err) {
      setErrorModalMessage(err.response.data.error);
      setShowErrorModal(true);
    }
  }

  const getWinner = (quizQuestions, sessionResults) => {
    let playerWithHighestPoints;
    let highestPoints = 0;

    for (const player of sessionResults) {
      let playerPoints = 0;
      for (const [index, answer] of player.answers.entries()) {
        if (!answer.correct) continue;
        const questionStartedAt = new Date(answer.questionStartedAt);
        const answeredAt = new Date(answer.answeredAt);
        const timeLimit = quizQuestions[index].timeLimit;
        const timeTakenToAnswer = parseInt(((answeredAt.getTime() - questionStartedAt.getTime()) / 1000));
        const multiplier = timeLimit - timeTakenToAnswer;
        playerPoints += quizQuestions[index].points * multiplier;
      }

      if (playerPoints > highestPoints) {
        playerWithHighestPoints = player.name;
        highestPoints = playerPoints;
      }
    }

    return playerWithHighestPoints;
  }

  const getDatePlayed = (sessionResults) => {
    let lastestStartedQuestion;

    for (const player of sessionResults) {
      for (const answer of player.answers) {
        const questionStartedAt = new Date(answer.questionStartedAt);
        if (lastestStartedQuestion === undefined) {
          lastestStartedQuestion = questionStartedAt;
        } else if (lastestStartedQuestion.getTime() < questionStartedAt.getTime()) {
          lastestStartedQuestion = questionStartedAt;
        }
      }
    }

    return lastestStartedQuestion;
  }

  return (
    <div className={classNames({ 'flex flex-wrap justify-center sm:justify-between items-center py-8 px-12 w-full space-y-6': isLast }, {
      'flex flex-wrap justify-center sm:justify-between items-center border-b border-gray-300 py-8 px-12 w-full space-y-6': !isLast
    })}>
      <div>
        <div className="text-indigo-500 font-bold font-poppins mb-2">Session {index}</div>
        <div className="flex space-x-12">
          <div>
            <div className="font-poppins font-medium text-sm text-gray-500 mb-1">Winner</div>
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <div className="font-poppins text-sm">{winner}</div>
            </div>
          </div>
          <div>
            <div className="font-poppins font-medium text-sm text-gray-500 mb-1">Played on</div>
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-poppins text-sm">{datePlayed}</div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Link to={{
          pathname: `/dashboard/session/${sessionId}/results`,
          state: {
            quizId
          }
        }}>
          <button className="font-poppins font-medium text-sm text-indigo-500">View Results</button>
        </Link>
      </div>
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  quizId: PropTypes.number.isRequired,
  oldSessions: PropTypes.array.isRequired
};

Session.propTypes = {
  index: PropTypes.number.isRequired,
  quizId: PropTypes.number.isRequired,
  sessionId: PropTypes.number.isRequired,
  isLast: PropTypes.bool.isRequired
};

export default QuizHistoryPage;
