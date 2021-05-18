import React from 'react';
import { shallow } from 'enzyme';
import { Switch } from '../components';

describe('Switch', () => {
  it('  ---> Check default styles for an \'off\' switch', () => {
    const wrapper = shallow(<Switch toggle={false} setToggle={() => false} />);
    expect(wrapper.hasClass('bg-gray-300')).toBe(true);
  })

  it('  ---> Check default styles for an \'on\' switch', () => {
    const wrapper = shallow(<Switch toggle={true} setToggle={() => true} />);
    expect(wrapper.hasClass('bg-green-400')).toBe(true);
  })

  it('  --> Check the switch is not translated (to the left) when off', () => {
    const wrapper = shallow(<Switch toggle={false} setToggle={() => false} />);
    expect(wrapper.childAt(0).hasClass('transform')).toBe(true);
    expect(wrapper.childAt(0).hasClass('translate-x-6')).toBe(false);
  })

  it('  --> Check the switch is translate (to the right) when on', () => {
    const wrapper = shallow(<Switch toggle={true} setToggle={() => true} />);
    expect(wrapper.childAt(0).hasClass('transform')).toBe(true);
    expect(wrapper.childAt(0).hasClass('translate-x-6')).toBe(true);
  })

  it('  --> Test that the click event fires only once', () => {
    const onClick = jest.fn();
    const wrapper = shallow(<Switch toggle={true} setToggle={onClick} />)
    wrapper.simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
  })
})
