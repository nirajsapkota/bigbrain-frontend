import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Attribution: https://medium.com/front-end-weekly/build-a-html-toggle-switch-in-just-7-lines-of-code-using-vue-tailwindcss-ed215394fcd
 */
const Switch = ({ toggle, setToggle }) => {
  return (
    <div className={classNames('w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out cursor-pointer', { 'bg-green-400': toggle })}
      onClick={() => setToggle(toggle => !toggle)}>
      <div className={classNames('bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out', { 'translate-x-6': toggle })}></div>
    </div>
  );
}

export default Switch;

Switch.propTypes = {
  toggle: PropTypes.bool.isRequired,
  setToggle: PropTypes.func.isRequired
};
