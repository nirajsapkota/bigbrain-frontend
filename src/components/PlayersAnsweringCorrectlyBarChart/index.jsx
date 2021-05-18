import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';

const PlayersAnsweringCorrectlyBarChart = ({ labels, data, numPlayers }) => {
  return (
    <div className="my-24 w-full">
      <Bar
        data={{
          labels,
          datasets: [{
            data,
            backgroundColor: '#5375F9'
          }]
        }}
        width={100}
        height={500}
        options={{
          legend: {
            display: false
          },
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              afterFit: function (scale) {
                scale.width = scale.width + 10
              },
              gridLines: {
                display: false,
                drawBorder: false
              },
              ticks: {
                min: 0,
                max: numPlayers,
                callback: function (value) {
                  return (value / this.max * 100).toFixed(0) + '%'; // convert it to percentage
                },
              }
            }],
            xAxes: [{
              afterFit: function (scale) {
                scale.height = scale.height + 30
              },
              gridLines: {
                display: true,
                drawBorder: false
              },
              scaleLabel: {
                display: true,
                labelString: '% Players Answering Correctly v Question No.',
                fontStyle: 'bold',
                fontSize: '14'
              }
            }]
          }
        }}
      />
    </div>
  );
}

export default PlayersAnsweringCorrectlyBarChart;

PlayersAnsweringCorrectlyBarChart.propTypes = {
  labels: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  numPlayers: PropTypes.number.isRequired
};
