import React from 'react';
import { shallow } from 'enzyme';
import { Participant } from '../components';

describe('Component Test: Participant', () => {
  it('  ---> Check that the component can be rendered', () => {
    const wrapper = shallow(<Participant position={1} name={'name'} points={1} />);
    expect(wrapper.exists());
  })

  it('  ---> Check participant has expected default styles', () => {
    const wrapper = shallow(<Participant position={1} name={'name'} points={1} />);
    expect(wrapper.find('div').at(0).hasClass('flex')).toBe(true);
    expect(wrapper.find('div').at(0).hasClass('items-center')).toBe(true);
    expect(wrapper.find('div').at(0).hasClass('justify-center')).toBe(true);

    expect(wrapper.find('div').at(1).hasClass('w-full')).toBe(true);
    expect(wrapper.find('div').at(1).hasClass('lg:w-1/3')).toBe(true);
    expect(wrapper.find('div').at(1).hasClass('px-8')).toBe(true);
    expect(wrapper.find('div').at(1).hasClass('h-24')).toBe(true);
    expect(wrapper.find('div').at(1).hasClass('shadow-lg')).toBe(true);
    expect(wrapper.find('div').at(1).hasClass('rounded-lg')).toBe(true);
    expect(wrapper.find('div').at(1).hasClass('my-4')).toBe(true);

    expect(wrapper.find('div').at(2).hasClass('flex items-center justify-center h-full')).toBe(true);
    expect(wrapper.find('div').at(2).hasClass('items-center')).toBe(true);
    expect(wrapper.find('div').at(2).hasClass('justify-center')).toBe(true);
    expect(wrapper.find('div').at(2).hasClass('h-full')).toBe(true);

    expect(wrapper.find('div').at(3).hasClass('font-poppins')).toBe(true);
    expect(wrapper.find('div').at(3).hasClass('font-bold')).toBe(true);
    expect(wrapper.find('div').at(3).hasClass('text-3xl')).toBe(true);

    expect(wrapper.find('div').at(4).hasClass('font-poppins')).toBe(true);
    expect(wrapper.find('div').at(4).hasClass('text-xl')).toBe(true);
    expect(wrapper.find('div').at(4).hasClass('mx-16')).toBe(true);
  })

  it('  ---> Check that the position is being displayed based on provided prop', () => {
    const wrapperA = shallow(<Participant position={1} name={'name'} points={1} />);
    const wrapperB = shallow(<Participant position={1} name={'name'} points={10} />);
    expect(wrapperA.find('div').at(5).text()).toBe('1 pts');
    expect(wrapperB.find('div').at(5).text()).toBe('10 pts');
  })

  it('  ---> Check that the player\'s name is being displayed based on provided prop', () => {
    const wrapperA = shallow(<Participant position={1} name={'Hayden'} points={1} />);
    const wrapperB = shallow(<Participant position={2} name={'John Lennon'} points={1} />);
    expect(wrapperA.find('div').at(4).text()).toBe('Hayden');
    expect(wrapperB.find('div').at(4).text()).toBe('John Lennon');
  })

  it('  ---> Check that the player\'s points are being displayed based on the provided prop', () => {
    const wrapperA = shallow(<Participant position={1} name={'name'} points={1} />);
    const wrapperB = shallow(<Participant position={2} name={'name'} points={1} />);
    expect(wrapperA.find('div').at(3).text()).toBe('1th');
    expect(wrapperB.find('div').at(3).text()).toBe('2th');
  })
})
