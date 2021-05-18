import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';

const AverageResponseTimeBarChart = ({ labels, data }) => {
  return (
    <div className="my-24 w-full">
      <Line
        data={{
          labels,
          datasets: [{
            data,
            backgroundColor: '#EA5B57'
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
                max: 30,
                callback: function (value) {
                  return value + 's'; // convert it to percentage
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
                labelString: 'Average Response Time (ms) v Question No.',
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

export default AverageResponseTimeBarChart;

AverageResponseTimeBarChart.propTypes = {
  labels: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired
};
