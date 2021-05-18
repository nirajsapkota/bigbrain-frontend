import React from 'react';
import { shallow } from 'enzyme';
import { Winner } from '../components';

describe('winner', () => {
  it('  ---> Check winner exists', () => {
    const wrapper = shallow(<Winner position={1} name={'name'} points={1} />);
    expect(wrapper.exists());
  })

  it('  ---> Check name exists', () => {
    const wrapper = shallow(<Winner position={1} name={'name'} points={1} />);
    expect(wrapper.find('div').at(1).text()).toContain(name);
  })

  it('  ---> Check points is displayed correctly exists', () => {
    const points = 400
    const wrapper = shallow(<Winner position={1} name={'name'} points={points} />);
    expect(wrapper.find('div').at(2).text()).toContain(points);
  })

  it('  ---> Check default styles', () => {
    const wrapper = shallow(<Winner position={1} name={'name'} points={1} />);
    expect(wrapper.find('div').at(0).hasClass('flex')).toBe(true);
    expect(wrapper.find('div').at(0).hasClass('flex-col')).toBe(true);
    expect(wrapper.find('div').at(0).hasClass('items-center')).toBe(true);
  })

  it('  ---> Check style changes depending on position', () => {
    const wrapper = shallow(<Winner position={1} name={'name'} points={1} />);
    expect(wrapper.find('div').at(1).hasClass('lg:mt-24')).toBe(false);
  })

  it('  ---> Check name styles', () => {
    const wrapper = shallow(<Winner position={1} name={'name'} points={1} />);
    expect(wrapper.find('div').at(1).hasClass('font-bold')).toBe(true)
    expect(wrapper.find('div').at(1).hasClass('text-xl')).toBe(true)
    expect(wrapper.find('div').at(1).hasClass('mt-8')).toBe(true)
    expect(wrapper.find('div').at(1).hasClass('font-poppins')).toBe(true)
  })
  it('  ---> Check points styles', () => {
    const wrapper = shallow(<Winner position={1} name={'name'} points={1} />);
    expect(wrapper.find('div').at(2).hasClass('text-lg')).toBe(true)
    expect(wrapper.find('div').at(2).hasClass('font-poppins')).toBe(true)
  })
})
