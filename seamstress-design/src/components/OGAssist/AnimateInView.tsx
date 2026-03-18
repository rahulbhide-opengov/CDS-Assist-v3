import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

interface AnimateInViewProps {
  children: React.ReactNode;
  delay?: number;
  threshold?: number;
  sx?: SxProps<Theme>;
}

export const AnimateInView: React.FC<AnimateInViewProps> = ({
  children,
  delay = 0,
  threshold = 0.1,
  sx,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only trigger once when entering viewport
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      {
        threshold: threshold,
        rootMargin: '0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, isVisible]);

  return (
    <Box
      ref={ref}
      sx={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
        transitionDelay: isVisible ? `${delay}s` : '0s',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};