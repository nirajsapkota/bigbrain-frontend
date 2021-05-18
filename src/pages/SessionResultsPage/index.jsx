import React, {
  useContext,
  useEffect,
  useState
} from 'react';

import {
  useLocation,
  useParams
} from 'react-router';

import {
  ErrorModalContext,
  UserContext
} from '../../contexts';

import {
  ReadQuiz,
  ReadSessionResults
} from '../../api/adminQuizManagement';

import {
  Winner,
  Participant,
  PlayersAnsweringCorrectlyBarChart,
  AverageResponseTimeBarChart
} from '../../components';

const SessionResultsPage = () => {
  const { sessionId } = useParams();
  const { quizId } = useLocation().state;
  const [token] = useContext(UserContext);
  const [topFivePlayers, setTopFivePlayers] = useState([]);
  const [pacpq, setPACPQ] = useState({ data: [], labels: [], numPlayers: 0 });
  const [art, setART] = useState({ data: [], labels: [] });
  const [setShowErrorModal, setErrorModalMessage] = useContext(ErrorModalContext);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      const readQuizResponse = await ReadQuiz(token, quizId);
      const sessionResultsResponse = await ReadSessionResults(token, sessionId);

      const quizQuestions = readQuizResponse.data.questions;
      const sessionResults = sessionResultsResponse.data.results;

      const [
        topFivePlayers,
        percentAnsweringCorrectPerQuestion,
        averageResponseTimesPerQuestion
      ] = evaulateSession(quizQuestions, sessionResults);

      setTopFivePlayers(topFivePlayers);
      setPACPQ(percentAnsweringCorrectPerQuestion);
      setART(averageResponseTimesPerQuestion);
    } catch (err) {
      setErrorModalMessage(err.response.data.error);
      setShowErrorModal(true);
    }
  }

  const evaulateSession = (questions, results) => {
    const playerPointsMap = [];

    const pacpq = {
      labels: [...Array(questions.length).keys()].map(value => value + 1),
      data: [...Array(questions.length).fill(0)],
      numPlayers: 0
    };

    const art = {
      labels: [...Array(questions.length).keys()].map(value => value + 1),
      data: [...Array(questions.length).fill(0)]
    };

    for (const player of results) {
      pacpq.numPlayers++;
      let playerTotalPoints = 0;
      for (const [index, answer] of player.answers.entries()) {
        const answeredAt = new Date(answer.answeredAt);
        const questionStartedAt = new Date(answer.questionStartedAt);
        const playerResponseTime = parseInt((answeredAt.getTime() - questionStartedAt.getTime()) / 1000);
        const timeLimit = questions[index].timeLimit;
        const multiplier = timeLimit - playerResponseTime;
        if (answer.correct) {
          pacpq.data[index]++;
          playerTotalPoints += questions[index].points * multiplier;
        }
        art.data[index] += playerResponseTime;
      }

      playerPointsMap.push({ name: player.name, points: playerTotalPoints });
    }

    art.data.map(responseTime => responseTime / pacpq.numPlayers);
    playerPointsMap.sort((a, b) => b.points - a.points);
    const topFive = playerPointsMap.slice(-5);
    topFive.reverse();

    return [topFive, pacpq, art];
  }

  return (
    <div className="flex justify-center min-h-screen min-w-screen my-12">
      <div className="w-10/12 md:max-w-6xl">
        <h1 className="font-poppins font-bold text-3xl">Session Results</h1>

        <section>
          <h1 className="font-poppins font-bold text-2xl text-gray-700">Top Players</h1>
          <div className="my-24">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 place-items-center">
              <div className="block lg:hidden">
                <Winner
                  position={1}
                  name={topFivePlayers[0] ? topFivePlayers[0].name : 'N/A'}
                  points={topFivePlayers[0] ? topFivePlayers[0].points : 0}
                  />
              </div>
              <Winner
                position={2}
                name={topFivePlayers[1] ? topFivePlayers[1].name : 'N/A'}
                points={topFivePlayers[1] ? topFivePlayers[1].points : 0}
                />
              <div className="hidden lg:block">
                <Winner
                  position={1}
                  name={topFivePlayers[0] ? topFivePlayers[0].name : 'N/A'}
                  points={topFivePlayers[0] ? topFivePlayers[0].points : 0}
                  />
              </div>
              <Winner
                position={3}
                name={topFivePlayers[2] ? topFivePlayers[2].name : 'N/A'}
                points={topFivePlayers[2] ? topFivePlayers[2].points : 0}
                />
            </div>

            <Participant
              position={4}
              name={topFivePlayers[3] ? topFivePlayers[3].name : 'N/A'}
              points={topFivePlayers[3] ? topFivePlayers[3].points : 0}
              />

            <Participant
              position={5}
              name={topFivePlayers[4] ? topFivePlayers[4].name : 'N/A'}
              points={topFivePlayers[4] ? topFivePlayers[4].points : 0}
              />
          </div>
        </section>

        <section>
          <h1 className="font-poppins font-bold text-2xl text-gray-700">Number of Players Answering Correctly</h1>
          <PlayersAnsweringCorrectlyBarChart
            labels={pacpq.labels}
            data={pacpq.data}
            numPlayers={pacpq.numPlayers}
            />
        </section>

        <section>
          <h1 className="font-poppins font-bold text-2xl text-gray-700">Average Response Times <span className="text-sm">(Lower is Better)</span></h1>
          <AverageResponseTimeBarChart
            labels={art.labels}
            data={art.data}
            />
        </section>
      </div>
    </div>
  );
}

export default SessionResultsPage;
