import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let outerX = 0, outerY = 0;
    let innerX = 0, innerY = 0;
    let animFrame: number;

    const onMove = (e: MouseEvent) => {
      innerX = e.clientX;
      innerY = e.clientY;
      if (!visible) setVisible(true);
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      outerX = lerp(outerX, innerX, 0.12);
      outerY = lerp(outerY, innerY, 0.12);

      if (outerRef.current) {
        outerRef.current.style.left = `${outerX}px`;
        outerRef.current.style.top = `${outerY}px`;
      }
      if (innerRef.current) {
        innerRef.current.style.left = `${innerX}px`;
        innerRef.current.style.top = `${innerY}px`;
      }
      animFrame = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    animFrame = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;

  return (
    <>
      <div
        id="cursor-outer"
        ref={outerRef}
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div
        id="cursor-inner"
        ref={innerRef}
        style={{ opacity: visible ? 1 : 0 }}
      />
    </>
  );
};
