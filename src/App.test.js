import React from 'react';
import { shallow } from 'enzyme';
import App from './App';

// test('renders learn react link', () => {
//   const { getByText } = render(<App />);
//   const linkElement = getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

describe('Examining the syntax of Jest tests', () => {
   
  it('renders without crash', () => {
      shallow(<App />);
   });
});