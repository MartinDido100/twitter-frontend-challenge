import { useEffect, useRef } from "react";

interface UseIntersectionObserverProps {
  cb: () => void;
  loading: boolean;
}

export const useIntersectionObserver = ({cb,loading}: UseIntersectionObserverProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            cb();
          }
        });
      },
      { 
        threshold: 1.0,
        rootMargin: '0px',
        root: null
      }
    );

    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [cb]);

  return observerRef;
}