import React, { useContext, useEffect, useRef, useState } from 'react';

import {
  Switch
} from '../../components';

import { Link, useParams } from 'react-router-dom';
import { ReadQuiz, UpdateQuiz } from '../../api/adminQuizManagement';
import { ErrorModalContext, UserContext } from '../../contexts';
import { fileToDataUrl } from '../../utils';
import { toast } from 'react-toastify';

const EditGamePage = () => {
  const { gameId } = useParams();

  const [token] = useContext(UserContext);
  const [game, setGame] = useState({});
  const [editing, setEditing] = useState(false);
  const [setShowErrorModal, setErrorModalMessage] = useContext(ErrorModalContext);
  const hiddenFileInputRef = useRef(null);

  const readQuiz = async () => {
    try {
      const res = await ReadQuiz(token, gameId);
      setGame(res.data);
    } catch (err) {
      setErrorModalMessage(err.response.data.error);
      setShowErrorModal(true);
    }
  }

  const deleteQuizQuestion = async (e, removeId) => {
    e.preventDefault();
    e.stopPropagation();

    const questions = [...game.questions].filter((question, questionId) => questionId !== removeId);
    try {
      await UpdateQuiz(token, gameId, undefined, questions, undefined);
      setGame({ ...game, questions: questions });
    } catch (err) {
      setErrorModalMessage(err.response.data.error);
      setShowErrorModal(true);
    }
  }

  const handleFileSelected = async (e) => {
    const file = e.target.files[0];
    const dataURL = await fileToDataUrl(file);

    try {
      await UpdateQuiz(token, gameId, undefined, undefined, dataURL);
      toast(`Successfully updated the thumbnail for the ${game.name} quiz!`, {
        className: 'text-black text-sm'
      });
    } catch (err) {
      setErrorModalMessage(err.response.data.error);
      setShowErrorModal(true);
    }
  }

  useEffect(() => {
    readQuiz();
  }, []);

  return (
    <div className="flex justify-center min-h-screen min-w-screen">
      <div className="w-10/12 md:max-w-6xl my-12">
        <h1 className="font-poppins font-bold text-3xl">{game.name}</h1>
        <div className="flex items-center justify-between my-4 mb-8">
          <div className="flex justify-center mr-6">
            <div className="flex flex-col mr-6">
              <div className="text-sm font-light mr-4 text-gray-700 mb-2 font-bold">Upload Thumbnail</div>
              <div className="flex items-center">
                <button className="rounded-md bg-indigo-500 text-white text-sm px-4 py-2" onClick={() => hiddenFileInputRef.current.click()}>Select File</button>
                <input ref={hiddenFileInputRef} type="file" accept="image/png, image/jpg, image/jpeg" className="hidden" onChange={(e) => handleFileSelected(e)} />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-light mr-4 text-gray-700 mb-2 font-bold">Delete Mode</div>
              <Switch
                toggle={editing}
                setToggle={setEditing}
              />
            </div>
          </div>
          {
            game.questions &&
            <Link to={{
              pathname: `/dashboard/game/${gameId}/question/${game.questions.length + 1}`,
              state: {
                gameQuestions: game.questions
              }
            }}>
              <button test-marker="add-question-to-quiz-btn" className="bg-roman hover:bg-roman font-bold py-2 px-3 rounded-md shadow-md hover:shadow-xl duration-300 inline-flex items-center text-white focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Add Question</span>
              </button>
            </Link>
          }
        </div>
        <div className="grid gap-y-4">
          {game.questions && game.questions.map((question, index) => {
            return (
              <Link key={index} to={{
                pathname: `/dashboard/game/${gameId}/question/${index + 1}`,
                state: {
                  gameQuestions: game.questions
                }
              }}>
                {
                  editing
                    ? (
                      <span className="w-full flex justify-end" onClick={(e) => deleteQuizQuestion(e, index)}>
                        <span className="flex items-center justify-center absolute w-8 h-8 rounded-full bg-red-400 -mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </span>
                      </span>
                      )
                    : null
                }
                <div className="w-full h-auto rounded-md shadow-md hover:shadow-xl duration-300 h-24 cursor-pointer px-14 py-6">
                  <div className="font-poppins font-bold">Question {index + 1}</div>
                  <div className="font-roboto text-gray-600">{question.question}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default EditGamePage;
