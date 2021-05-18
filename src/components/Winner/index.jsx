import React from 'react';
import PropTypes from 'prop-types';

import { ReactComponent as GoldMedalIcon } from '../../res/icons/gold-medal.svg';
import { ReactComponent as SilverMedalIcon } from '../../res/icons/silver-medal.svg';
import { ReactComponent as BronzeMedalIcon } from '../../res/icons/bronze-medal.svg';

const Winner = ({ position, name, points }) => {
  return (
    <div className="flex flex-col items-center">
      { position === 1 ? <GoldMedalIcon width={128} height={128} /> : null}
      { position === 2 ? <SilverMedalIcon width={96} height={96} className="lg:mt-24" /> : null}
      { position === 3 ? <BronzeMedalIcon width={96} height={96} className="lg:mt-24" /> : null}
      <div className="font-poppins font-bold text-xl mt-8">{name}</div>
      <div className="font-poppins text-lg">{points} pts</div>
    </div>
  );
}

export default Winner;

Winner.propTypes = {
  position: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  points: PropTypes.number.isRequired
};
