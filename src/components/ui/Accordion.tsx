'use client';

/**
 * Reusable Accordion component with smooth expand/collapse animation.
 * Matches the AQonnect eSIM details page design.
 */
import { useState, useRef, useEffect, type ReactNode } from 'react';

interface AccordionProps {
  title: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}

export default function Accordion({ title, icon, defaultOpen = false, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(
    defaultOpen ? undefined : 0
  );

  useEffect(() => {
    if (!contentRef.current) return;

    if (isOpen) {
      const height = contentRef.current.scrollHeight;
      setContentHeight(height);
      // After transition, set to auto so dynamic content works
      const timer = setTimeout(() => setContentHeight(undefined), 300);
      return () => clearTimeout(timer);
    } else {
      // First set the explicit height so we can animate from it
      const height = contentRef.current.scrollHeight;
      setContentHeight(height);
      // Force reflow then animate to 0
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setContentHeight(0);
        });
      });
    }
  }, [isOpen]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50/50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2.5">
          {icon && <span className="text-gray-500 flex-shrink-0">{icon}</span>}
          <span className="text-base font-semibold text-gray-900">{title}</span>
        </span>

        {/* Chevron */}
        <svg
          className="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        ref={contentRef}
        className="accordion-content"
        style={{
          height: contentHeight !== undefined ? `${contentHeight}px` : 'auto',
          overflow: 'hidden',
          transition: 'height 0.3s ease',
        }}
      >
        <div className="px-5 pb-5">{children}</div>
      </div>
    </div>
  );
}
