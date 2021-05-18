import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import {
  ProtectedRoute
} from './components';

import {
  LandingPage,
  LoginPage,
  RegisterPage,
  PlayPage,
  DashboardPage,
  EditGamePage,
  EditGameQuestionPage,
  SessionResultsPage,
  LobbyPage,
  GamePage,
  QuizHistoryPage,
  GameResultsPage
} from './pages';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Router>
      <ToastContainer />

      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
        <Route exact path="/play/:gameId?" component={PlayPage} />
        <Route exact path="/lobby" component={LobbyPage} />
        <Route exact path="/game" component={GamePage} />
        <Route exact path="/results" component={GameResultsPage} />
        <ProtectedRoute exact path="/dashboard" component={DashboardPage} />
        <ProtectedRoute exact path="/dashboard/game/:gameId" component={EditGamePage} />
        <ProtectedRoute exact path="/dashboard/game/:gameId/question/:questionId" component={EditGameQuestionPage} />
        <ProtectedRoute exact path="/dashboard/session/:sessionId/results" component={SessionResultsPage} />
        <ProtectedRoute exact path="/dashboard/quiz-history" component={QuizHistoryPage} />
      </Switch>
    </Router>
  );
}

export default App;
