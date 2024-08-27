import {  useEffect, useRef } from "react";

export const useOutsideClick = (handleClick: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handleClick();
      }
    };

    document.addEventListener('click', onClick, true);

    return () => {
      document.removeEventListener('click', onClick, true);
    };
  }, [ref]);

  return ref;
};