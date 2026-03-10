import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('App Test', () => {
  it('renders without crashing', () => {
    // This is a placeholder test to verify vitest is working.
    // Replace with a real component test later.
    const div = document.createElement('div');
    div.textContent = 'Hello Claudia';
    document.body.appendChild(div);
    expect(screen.getByText('Hello Claudia')).toBeInTheDocument();
  });
});
