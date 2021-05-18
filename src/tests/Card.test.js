import React from 'react';
import { shallow } from 'enzyme';
import { ReactComponent as CuteBrain } from '../res/icons/cute-brain.svg';
import { Card } from '../components';

describe('Card', () => {
  const title = 'Card Title';
  const subtitle = 'Card Subtitle';
  const link = '/';
  const wrapper = shallow(<Card Icon={CuteBrain} title={title} subtitle={subtitle} link={link} />);

  it('  ---> Check title prop is used in component', () => {
    expect(wrapper.find('div').at(1).text()).toContain(title);
  })

  it('  ---> Check subtitle prop is used in component', () => {
    expect(wrapper.find('div').at(3).text()).toContain(subtitle);
  })

  it('  ---> Check link prop is used in component', () => {
    expect(wrapper.find('Link').props().to).toContain(link);
  })

  it('  ---> Check default applied styles', () => {
    expect(wrapper.find('div').at(0).hasClass('w-96')).toBe(true);
    expect(wrapper.find('div').at(0).hasClass('h-96')).toBe(true);
    expect(wrapper.find('div').at(0).hasClass('flex')).toBe(true);
    expect(wrapper.find('div').at(0).hasClass('items-center')).toBe(true);
    expect(wrapper.find('div').at(0).hasClass('justify-center')).toBe(true);
    expect(wrapper.find('div').at(0).hasClass('shadow-md')).toBe(true);
    expect(wrapper.find('div').at(0).hasClass('hover:shadow-2xl')).toBe(true);
    expect(wrapper.find('div').at(0).hasClass('rounded-2xl')).toBe(true);
    expect(wrapper.find('div').at(0).hasClass('cursor-pointer')).toBe(true);
    expect(wrapper.find('div').at(0).hasClass('bg-white')).toBe(true);
    expect(wrapper.find('div').at(0).hasClass('duration-300')).toBe(true);
  })
})
