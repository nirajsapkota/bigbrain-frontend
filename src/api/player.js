import axios from 'axios';
import url from './constants';

const JoinSession = (sessionID, name) => {
  return axios({
    url: url + `/play/join/${sessionID}`,
    method: 'POST',
    data: { name }
  });
}

const CheckStatus = (playerID) => {
  return axios({
    url: url + `/play/${playerID}/status`,
    method: 'GET'
  });
}

const GetQuestion = (playerID) => {
  return axios({
    url: url + `/play/${playerID}/question`,
    method: 'GET',
  });
}

const GetAnswer = (playerID) => {
  return axios({
    url: url + `/play/${playerID}/answer`,
    method: 'GET'
  });
}

const SubmitAnswer = (playerID, answerIds) => {
  return axios({
    url: url + `/play/${playerID}/answer`,
    method: 'PUT',
    data: { answerIds }
  });
}

const GetResults = (playerID) => {
  return axios({
    url: url + `/play/${playerID}/results`,
    method: 'GET'
  });
}

export {
  JoinSession,
  CheckStatus,
  GetQuestion,
  GetAnswer,
  SubmitAnswer,
  GetResults
}
