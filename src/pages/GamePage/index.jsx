import React, { useEffect, useContext, useState } from 'react'
import { GetQuestion, GetAnswer, SubmitAnswer } from '../../api/player'
import { ErrorModalContext } from '../../contexts';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useHistory } from 'react-router';

const GamePage = () => {
  const playerId = localStorage.getItem('playerId');
  const [setShowErrorModal, setErrorModalMessage] = useContext(ErrorModalContext);
  const [question, setQuestion] = useState({
    question: '',
    answers: []
  });
  const [countdown, setCountdown] = useState(undefined);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    const questionPollingTimerId = setInterval(pollForNextQuestion, 1000);
    const countdownTimerId = setInterval(() => {
      setCountdown(countdown => {
        if (countdown === 0) {
          getAnswersForCurrent();
          clearInterval(countdownTimerId);
          return 0;
        }

        return countdown - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdownTimerId);
      clearInterval(questionPollingTimerId);
    }
  }, [question]);

  const fetch = async () => {
    try {
      const res = await GetQuestion(playerId);
      setQuestion(res.data.question);

      const q = JSON.parse(localStorage.getItem('questions')) || [];
      if (!q.find(q => q.isoTimeLastQuestionStarted === res.data.question.isoTimeLastQuestionStarted)) {
        q.push(res.data.question);
      }
      localStorage.setItem('questions', JSON.stringify(q));

      setSelectedAnswers(Array(res.data.question.answers.length).fill(false));
      setAnswers(Array(res.data.question.answers.length).fill(undefined));

      const timeQuestionCloses = new Date(res.data.question.isoTimeLastQuestionStarted);
      timeQuestionCloses.setSeconds(timeQuestionCloses.getSeconds() + res.data.question.timeLimit);

      const remainingTimeToAnswer = Math.ceil((timeQuestionCloses.getTime() - Date.now()) / 1000);
      remainingTimeToAnswer >= 0 ? setCountdown(remainingTimeToAnswer) : setCountdown(0);
    } catch (err) {
      setErrorModalMessage(err.response.data.error);
      setShowErrorModal(true);
    }
  }

  const pollForNextQuestion = async () => {
    try {
      const res = await GetQuestion(playerId);
      if (res.data.question.isoTimeLastQuestionStarted !== question.isoTimeLastQuestionStarted) {
        fetch();
      }
    } catch (err) {
      if (err.response.data.error === 'Session ID is not an active session') {
        history.push('/results');
        return;
      }

      setErrorModalMessage(err.response.data.error);
      setShowErrorModal(true);
    }
  }

  const getAnswersForCurrent = async () => {
    try {
      const res = await GetAnswer(playerId);
      const t = Array(question.answers.length).fill(false);
      for (const answerId of res.data.answerIds) {
        t[answerId] = true;
      }
      setAnswers(t);
    } catch (err) {
      setErrorModalMessage(err.response.data.error);
      setShowErrorModal(true);
    }
  }

  const submit = async (answerId) => {
    const currentSelectedAnswers = [...selectedAnswers];
    currentSelectedAnswers[answerId] = !currentSelectedAnswers[answerId];
    setSelectedAnswers(currentSelectedAnswers);

    const selectedAnswerIds = [];
    for (const [index, answer] of currentSelectedAnswers.entries()) {
      if (answer) {
        selectedAnswerIds.push(index);
      }
    }

    /* We can't send an empty array (if user de-selects all answers),
     * so send [-1] since that will never be the value of a correct answer
     */
    if (selectedAnswerIds.length === 0) {
      selectedAnswerIds.push(-1);
    }

    try {
      await SubmitAnswer(playerId, selectedAnswerIds);
    } catch (err) {
      setErrorModalMessage(err.response.data.error);
      setShowErrorModal(true);
    }
  }

  return (
    <div className="flex flex-col items-center justify-around min-w-screen min-h-screen">
      <div className="w-10/12 lg:max-w-4xl">
        <div className="flex flex-col">
          <h1 className="font-poppins font-bold text-4xl mb-4">{question.question}</h1>
          <p className="font-poppins font-medium mb-1">Time remaining: {countdown} seconds</p>
          <div className="h-3 relative w-full rounded-full overflow-hidden">
            <div className="w-full h-full bg-gray-200 absolute"></div>
            <div className={classNames('transition-all ease-out duration-1000 h-full relative',
              { 'bg-green-500': ((countdown / question.timeLimit) * 100) > 66 },
              { 'bg-yellow-500': ((countdown / question.timeLimit) * 100) < 66 && ((countdown / question.timeLimit) * 100) > 33 },
              { 'bg-red-500': ((countdown / question.timeLimit) * 100) < 33 })}
              style={{ width: (((countdown - 0) / (question.timeLimit - 0)) * 100) + '%' }}></div>
          </div>

          <div className="flex justify-center mt-14">
            {question.mediaLink ? <Media mediaLink={question.mediaLink} /> : null}
          </div>

          <div className="grid grid-cols md:grid-cols-2 gap-4 my-14">
            {question.answers && question.answers.map((answer, index) =>
              <div className={classNames('bg-gray-200 rounded-xl w-full py-4 cursor-pointer duration-300', {
                'bg-green-500': selectedAnswers[index]
              })} onClick={() => submit(index)} key={index}>
                <div className="flex px-6">
                  <input type="checkbox" value={selectedAnswers[index]} checked={selectedAnswers[index]} />
                  <div className="font-poppins text-blue-900 font-medium ml-3 text-sm mr-auto">{answer.value}</div>
                  {answers[index] === true ? '✅' : null}
                  {answers[index] === false ? '❌' : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const Media = ({ mediaLink }) => {
  const isYoutubeVideo = mediaLink.includes('youtube');
  const autoplaying = mediaLink + '?autoplay=1&mute=1';

  return (
    <>
      { isYoutubeVideo && <iframe
        className="w-full rounded-2xl"
        height="600"
        src={autoplaying}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen>
      </iframe>}
      { !isYoutubeVideo && <img
        src={mediaLink}
        className="rounded-2xl w-96 h-96 object-cover"
      />}
    </>
  );
}

Media.propTypes = {
  mediaLink: PropTypes.string.isRequired
};

export default GamePage;
