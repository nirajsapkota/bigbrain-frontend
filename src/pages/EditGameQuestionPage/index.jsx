import React, { useState, useContext, useEffect } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import classNames from 'classnames';

import { ErrorModalContext, UserContext } from '../../contexts';
import { UpdateQuiz } from '../../api/adminQuizManagement';
import { questionValidator } from '../../utils';

const EditGameQuestionPage = () => {
  const { gameId, questionId } = useParams();
  const { gameQuestions } = useLocation().state;
  const history = useHistory();

  const [token] = useContext(UserContext);
  const [isSingleAnswer, setIsSingleAnswer] = useState(true);
  const [setShowErrorModal, setErrorModalMessage] = useContext(ErrorModalContext);

  const [question, setQuestion] = useState({
    question: '',
    answers: [
      { value: '', isCorrect: true },
      { value: '', isCorrect: false },
      { value: '', isCorrect: false },
      { value: '', isCorrect: false },
      { value: '', isCorrect: false },
      { value: '', isCorrect: false }
    ],
    mediaLink: '',
    points: 10,
    timeLimit: 30
  });

  const updateQuestionCorrectAnswers = (id, setRestFalse) => {
    const answers = [...question.answers];

    if (setRestFalse) {
      for (const answer of answers) {
        answer.isCorrect = false;
      }
      answers[id].isCorrect = true;
      setQuestion(q => { return { ...q, answers } });
      return;
    }

    answers[id].isCorrect = true;
    setQuestion(q => { return { ...q, answers } });
  }

  const updateGame = async () => {
    const q = { ...question };

    if (q.mediaLink === '') { delete q.mediaLink; }
    q.answers = q.answers.filter(answer => answer.value !== '');

    const [success, message] = questionValidator(q);
    if (!success) {
      setErrorModalMessage(message);
      setShowErrorModal(true);
      return;
    }

    const updatedGameQuestions = [...gameQuestions];
    gameQuestions.length < questionId ? updatedGameQuestions.push(q) : updatedGameQuestions[questionId - 1] = q;

    try {
      await UpdateQuiz(token, gameId, undefined, updatedGameQuestions, undefined);
      history.push(`/dashboard/game/${gameId}`);
    } catch (err) {
      setErrorModalMessage(err.response.data.error);
      setShowErrorModal(true);
    }
  }

  useEffect(() => {
    if (gameQuestions.length < questionId) {
      setQuestion({
        question: '',
        answers: [
          { value: '', isCorrect: true },
          { value: '', isCorrect: false },
          { value: '', isCorrect: false },
          { value: '', isCorrect: false },
          { value: '', isCorrect: false },
          { value: '', isCorrect: false }
        ],
        mediaLink: '',
        points: 10,
        timeLimit: 30
      });
      return;
    }

    setQuestion(gameQuestions[parseInt(questionId) - 1]);
  }, [])

  return (
    <div className="flex justify-center min-h-screen min-w-screen">
      <div className="w-10/12 md:max-w-6xl my-12">
        <h1 className="font-poppins font-bold text-3xl mb-6">Question {questionId}</h1>

        <section className="mt-4 mb-12">
          <div className="font-roboto font-medium mb-1">Question</div>
          <div className="font-roboto text-gray-500 text-xs mb-4">Enter the question that will be shown to the players below.</div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pr-2 rounded-l-md">
              <svg xmlns="http://www.w3.org/2000/svg" className={classNames('h-6', 'w-6', 'text-gray-400')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <input
              type="text"
              className="font-roboto border-2 border-gray-400 w-full pl-11 py-2 focus:outline-none rounded-md h-12 focus:outline-none text-sm focus:border-roman overflow-ellipsis"
              placeholder="Question"
              value={question.question}
              onChange={(e) => setQuestion(q => {
                const d = { ...q };
                d.question = e.target.value;
                return d;
              })}
              test-marker="edit-game-question-input"
            />
          </div>
        </section>

        <section className="mb-12">
          <div className="font-roboto font-medium mb-1">Question Type</div>
          <div className="font-roboto text-gray-500 text-xs mb-4">Does the question only have one correct answer or multiple correct answers?</div>
          <div className="mb-2">
            <input
              type="radio"
              name="question-type"
              id="single-answer-radio"
              className="mr-2"
              onClick={() => {
                updateQuestionCorrectAnswers(0, true);
                setIsSingleAnswer(true);
              }}
              defaultChecked
            />
            <label htmlFor="single-answer-radio" className="font-roboto text-sm">Single</label>
          </div>
          <div>
            <input
              type="radio"
              name="question-type"
              id="multiple-answer-radio"
              className="mr-2"
              onClick={() => {
                updateQuestionCorrectAnswers(0, true);
                setIsSingleAnswer(false);
              }}
            />
            <label htmlFor="multiple-answer-radio" className="font-roboto text-sm">Multiple</label>
          </div>
        </section>

        <section className="mb-12">
          <div className="font-roboto font-medium mb-1">Answers</div>
          <div className="font-roboto text-gray-500 text-xs mb-4">Please enter 2 - 6 answers that will be shown to the players. Then, select the correct answer(s) using the buttons on the side.</div>

          {question.answers.map((answer, index) => {
            return (
              <div className="flex items-center mb-2" key={index}>
                <div className="flex-grow relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pr-2 rounded-l-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className={classNames('h-6', 'w-6', 'text-gray-400')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="font-roboto border-2 border-gray-400 w-full pl-11 py-2 focus:outline-none rounded-md h-12 focus:outline-none text-sm overflow-ellipsis"
                    placeholder={`Answer ${index + 1}`}
                    value={answer.value}
                    onChange={(e) => setQuestion(q => {
                      const answers = [...q.answers];
                      answers[index].value = e.target.value;
                      return { ...q, answers };
                    })}
                    test-marker={`edit-game-answer-input-${index}`}
                  />
                </div>
                <input
                  type={isSingleAnswer ? 'radio' : 'checkbox'}
                  className="ml-6"
                  name="answer"
                  checked={answer.isCorrect}
                  onChange={() => updateQuestionCorrectAnswers(index, isSingleAnswer)}
                />
              </div>
            );
          })}
          </section>

          <section className="mb-12">
            <div className="font-roboto font-medium mb-1">Media Link</div>
            <div className="font-roboto text-gray-500 text-xs mb-4">If you would like the question to be accompanied by an image or video, you can link to it here.</div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pr-2 rounded-l-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <input
                type="text"
                className="font-roboto border-2 border-gray-400 w-full pl-11 py-2 focus:outline-none rounded-md h-12 focus:outline-none text-sm overflow-ellipsis"
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                value={question.mediaLink}
                onChange={(e) => setQuestion(q => { return { ...q, mediaLink: e.target.value } })}
              />
            </div>
          </section>

          <section className="mb-12">
            <div className="font-roboto font-medium mb-1">Points</div>
            <div className="font-roboto text-gray-500 text-xs mb-4">How many points this question is worth. If the question has multiple correct answers, the total points are evenly split among each correct answer.</div>

            <input
              type="number"
              className="font-roboto border-2 border-gray-400 px-3 py-2 focus:outline-none rounded-md h-12 text-sm"
              value={parseInt(question.points)}
              min={1}
              onChange={(e) => setQuestion(q => { return { ...q, points: parseInt(e.target.value) } })}
            />
          </section>

          <section className="mb-12">
            <div className="font-roboto font-medium mb-1">Time Limit</div>
            <div className="font-roboto text-gray-500 text-xs mb-4">How much time, in seconds, the player has to select their answers before the end of the round.</div>

            <input
              type="number"
              className="font-roboto border-2 border-gray-400 px-3 py-2 focus:outline-none rounded-md h-12 text-sm"
              value={parseInt(question.timeLimit)}
              min={5}
              onChange={(e) => setQuestion(q => { return { ...q, timeLimit: parseInt(e.target.value) } })}
            />
          </section>

          <button test-marker="create-quiz-question-btn" className="font-roboto font-bold text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-md shadow-md hover:shadow-xl focus:outline-none duration-300" onClick={() => updateGame()}>Save Changes</button>
      </div>
      </div>
  );
}

export default EditGameQuestionPage;
