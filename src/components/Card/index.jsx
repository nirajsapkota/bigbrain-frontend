import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

const Card = ({ Icon, title, subtitle, link }) => {
  return (
    <Link to={link}>
      <div className="w-96 h-96 flex items-center justify-center shadow-md hover:shadow-2xl rounded-2xl cursor-pointer bg-white duration-300">
        <div className="flex flex-col items-center">
          <Icon className="w-1/2 h-1/2 mb-4" />
          <div className="font-bold text-2xl">{title}</div>
          <div>{subtitle}</div>
        </div>
      </div>
    </Link>
  );
}

export default Card;

Card.propTypes = {
  Icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired
};
