import React from 'react';
import PropTypes from 'prop-types';

const Participant = ({ position, name, points }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full lg:w-1/3 px-8 h-24 shadow-lg rounded-lg my-4">
        <div className="flex items-center justify-center h-full">
          <div className="font-poppins font-bold text-3xl">{position}<sup>th</sup></div>
          <div className="font-poppins text-xl mx-16">{name}</div>
          <div className="font-poppins text-lg">{points} pts</div>
        </div>
      </div>
    </div>
  );
}

export default Participant;

Participant.propTypes = {
  position: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  points: PropTypes.number.isRequired
};
