import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Picker from './index';

describe('Picker Component', () => {
  const label = '0.00';

  test('validates input value on blur', () => {
    render(<Picker label={label} min="1" max="10" />);

    const input = screen.getByPlaceholderText('0.00') as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: '15' } });
    fireEvent.blur(input);

    expect(input.value).toBe('10');
  });

  test('handles arrow keys for increment and decrement', () => {
    render(<Picker label={label} min="0" max="10" step="1" />);
    
    const input = screen.getByPlaceholderText('0.00') as HTMLInputElement;
    
    expect(input.value).toBe('');

    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input.value).toBe('1');

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input.value).toBe('0');
  });
});
