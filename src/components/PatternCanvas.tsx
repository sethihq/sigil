import { useEffect, useRef } from 'react';

interface PatternCanvasProps {
  svgContent: string;
  className?: string;
}

export function PatternCanvas({ svgContent, className }: PatternCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = svgContent;

      const svg = containerRef.current.querySelector('svg');
      if (svg) {
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.display = 'block';
        svg.style.objectFit = 'contain';
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      }
    }
  }, [svgContent]);

  return (
    <div className={`flex items-center justify-center h-full w-full ${className ?? ''}`}>
      <div ref={containerRef} className="h-full w-full flex items-center justify-center" />
    </div>
  );
}
