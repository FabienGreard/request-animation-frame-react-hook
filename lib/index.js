import React, { useRef, useCallback, useState, useEffect } from 'react';

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

const useRequestInterval = (delay = 0) => {
  const ref = useRef(requestAnimationFrame(interval));
  const refInterval = useRef(Date.now());
  const [done, setDone] = useState(false);
  const isInterval = () =>
    Math.abs(refInterval.current - Date.now()) >= delay * 0.9;

  const interval = useCallback(() => {
    ref.current = requestAnimationFrame(interval);
  });

  useEffect(() => {
    isInterval()
      ? setDone(true)
      : (ref.current = requestAnimationFrame(interval));
    return () => cancelAnimationFrame(ref);
  }, [ref]);

  return done;
};

export { useRequestTimeout, useRequestInterval };
