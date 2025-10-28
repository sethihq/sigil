import { useEffect, useRef } from 'react';

interface PatternCanvasProps {
  svgContent: string;
}

export function PatternCanvas({ svgContent }: PatternCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = svgContent;
    }
  }, [svgContent]);

  return (
    <div className="flex-1 flex items-center justify-center bg-[#1a1a1a] p-8">
      <div
        ref={containerRef}
        className="bg-[#0a0a0a] rounded-lg shadow-2xl border border-[#2a2a2a]"
      />
    </div>
  );
}
