import axios from 'axios';
import url from './constants';

const CreateQuiz = (token, quizName) => {
  return axios({
    url: url + '/admin/quiz/new',
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    data: { name: quizName }
  });
}

const ReadQuizzes = (token) => {
  return axios({
    url: url + '/admin/quiz',
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

const ReadQuiz = (token, quizId) => {
  return axios({
    url: url + `/admin/quiz/${quizId}`,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

const UpdateQuiz = (token, quizId, name = undefined,
  questions = undefined, thumbnail = undefined) => {
  const request = {};

  if (name) request.name = name;
  if (questions) request.questions = questions;
  if (thumbnail) request.thumbnail = thumbnail;

  return axios({
    url: url + `/admin/quiz/${quizId}`,
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    data: request
  });
}

const DeleteQuiz = (token, quizId) => {
  return axios({
    url: url + `/admin/quiz/${quizId}`,
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
}

const StartQuiz = (token, quizId) => {
  return axios({
    url: url + `/admin/quiz/${quizId}/start`,
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
}

const AdvanceQuiz = (token, quizId) => {
  return axios({
    url: url + `/admin/quiz/${quizId}/advance`,
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
}

const EndQuiz = (token, quizId) => {
  return axios({
    url: url + `/admin/quiz/${quizId}/end`,
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
}

const ReadSessionStatus = (token, sessionId) => {
  return axios({
    url: url + `/admin/session/${sessionId}/status`,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });
}

const ReadSessionResults = (token, sessionId) => {
  return axios({
    url: url + `/admin/session/${sessionId}/results`,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });
}

export {
  CreateQuiz,
  ReadQuizzes,
  ReadQuiz,
  UpdateQuiz,
  DeleteQuiz,
  StartQuiz,
  AdvanceQuiz,
  EndQuiz,
  ReadSessionStatus,
  ReadSessionResults
};
