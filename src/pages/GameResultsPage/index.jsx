import React, { useEffect, useContext, useState } from 'react'
import { GetResults } from '../../api/player'
import { ErrorModalContext } from '../../contexts';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const GameResultsPage = () => {
  const playerId = localStorage.getItem('playerId');
  const questions = JSON.parse(localStorage.getItem('questions'));
  const [totalPoints, setTotalPoints] = useState([]);
  const [setShowErrorModal, setErrorModalMessage] = useContext(ErrorModalContext);
  const [results, setResults] = useState([]);

  useEffect(() => {
    getResults();
  }, [])

  const getResults = async () => {
    try {
      const res = await GetResults(playerId);
      console.log(questions);
      let tp = 0;
      for (const [index, result] of res.data.entries()) {
        if (!result.correct) continue;
        const questionStartedAt = new Date(result.questionStartedAt);
        const answeredAt = new Date(result.answeredAt);
        const timeLimit = questions[index].timeLimit;
        const timeTakenToAnswer = parseInt(((answeredAt.getTime() - questionStartedAt.getTime()) / 1000));
        const multiplier = timeLimit - timeTakenToAnswer;
        tp += questions[index].points * multiplier;
      }
      setTotalPoints(tp);
      setResults(res.data);
    } catch (err) {
      console.log(err);
      setErrorModalMessage(err.response.data.error);
      setShowErrorModal(true);
    }
  }

  return (
    <div className="flex items-center justify-center min-w-screen min-h-screen">
      <div className="w-10/12 lg:max-w-4xl">
        <div className="font-poppins font-bold text-3xl mt-12">You scored {totalPoints} points!</div>
        <div className="font-poppins font-medium text-gray-700">Did you know: The quicker you answer a question, the more points you will gain.</div>

        <Link to='/'><div className="my-8 underline">Take me home</div></Link>

        <div className="font-poppins font-bold text-xl">Your Performance by Question</div>
        <div className="flex flex-col space-y-8 mt-8 mb-16">
          {results.map((result, index) => {
            const questionStartedAt = new Date(result.questionStartedAt);
            const answeredAt = new Date(result.answeredAt);
            const timeLimit = questions[index].timeLimit;

            const timeTakenToAnswer = parseInt(((answeredAt.getTime() - questionStartedAt.getTime()) / 1000));
            const multiplier = timeLimit - timeTakenToAnswer;

            return (
              <PerformanceBreakdown
                key={index}
                id={index + 1}
                question={questions[index].question}
                basePoints={questions[index].points}
                multiplier={multiplier}
                speed={timeTakenToAnswer}
                pointsEarned={result.correct ? questions[index].points * multiplier : 0}
                correct={result.correct}
              />
            );
          })}
        </div>

      </div>
    </div>
  );
}

const PerformanceBreakdown = ({ id, question, basePoints, multiplier, speed, pointsEarned, correct }) => {
  return (
    <div className="shadow-md rounded-lg flex flex-wrap justify-center sm:justify-between items-center py-8 px-12 w-full space-y-6">
      <div>
        <div>
          <div className="text-indigo-500 font-bold font-poppins">Question {id}</div>
          <div className="font-roboto text-gray-800">{question}</div>
        </div>
        <div className="flex space-x-4 md:space-x-20 my-8">
          <div>
            <div className="font-poppins font-medium text-sm text-gray-700 mb-1">Base Points</div>
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <div className="font-poppins text-sm">{basePoints} pts</div>
            </div>
          </div>
          <div>
            <div className="font-poppins font-medium text-sm text-gray-700 mb-1">Speed</div>
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div className="font-poppins text-sm">{speed}s</div>
            </div>
          </div>
          <div>
            <div className="font-poppins font-medium text-sm text-gray-700 mb-1">Multiplier</div>
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.871 4A17.926 17.926 0 003 12c0 2.874.673 5.59 1.871 8m14.13 0a17.926 17.926 0 001.87-8c0-2.874-.673-5.59-1.87-8M9 9h1.246a1 1 0 01.961.725l1.586 5.55a1 1 0 00.961.725H15m1-7h-.08a2 2 0 00-1.519.698L9.6 15.302A2 2 0 018.08 16H8" />
              </svg>
              <div className="font-poppins text-sm">{multiplier}x</div>
            </div>
          </div>
          <div>
            <div className="font-poppins font-medium text-sm text-gray-700 mb-1">Points Earned</div>
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <div className="font-poppins text-sm">{pointsEarned} pts</div>
            </div>
          </div>
        </div>
        <div>
          {correct
            ? <div className="font-poppins font-medium text-green-500 text-sm">✅ You answered correctly!</div>
            : <div className="font-poppins font-medium text-red-500 text-sm">❌ You answered incorrectly.</div>
          }
        </div>
      </div>
    </div>
  );
}

PerformanceBreakdown.propTypes = {
  id: PropTypes.number.isRequired,
  question: PropTypes.string.isRequired,
  basePoints: PropTypes.number.isRequired,
  multiplier: PropTypes.number.isRequired,
  speed: PropTypes.number.isRequired,
  pointsEarned: PropTypes.number.isRequired,
  correct: PropTypes.bool.isRequired
};

export default GameResultsPage;
