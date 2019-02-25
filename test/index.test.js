import React, { useRef, useCallback, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';

const useRequestTimeout = (delay = 0) => {
  const ref = useRef(requestAnimationFrame(timeout));
  const refTimeout = useRef(Date.now());
  const [done, setDone] = useState(false);
  const isTimeout = () =>
    Math.abs(refTimeout.current - Date.now()) >= delay * 0.9;

  const timeout = useCallback(() => {
    ref.current = requestAnimationFrame(timeout);
    if (isTimeout()) {
      cancelAnimationFrame(ref.current);
    }
  });

  useEffect(() => {
    isTimeout()
      ? setDone(true)
      : (ref.current = requestAnimationFrame(timeout));
    return () => cancelAnimationFrame(ref);
  }, [ref]);

  return done;
};

const AppWithTimeout = () => {
  const [title, setTitle] = useState('Title');

  const timeout = useRequestTimeout(30);

  useEffect(() => {
    timeout && setTitle('Title set after 300 ms');
  }, [timeout]);

  return <h1>{title}</h1>;
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('useRequestAnimationFrame', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  it('renders without crashing', async () => {
    ReactDOM.render(<AppWithTimeout />, container);

    const title = container.querySelector('h1');

    await delay(300);

    await expect(title.textContent).toBe('Title set after 300 ms');
  });
});
