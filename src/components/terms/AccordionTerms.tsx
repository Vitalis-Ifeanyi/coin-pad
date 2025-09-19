import React, { useState, useRef, useEffect, useContext } from "react";
import { ChevronDown, ChevronUp, Clipboard } from "lucide-react";
import { DarkModeContext } from "../../context/DarkModeContext";

interface Term {
  term: string;
  definition: string;
}

export const AccordionTerms: React.FC<{ term: Term }> = ({ term }) => {
   const context = useContext(DarkModeContext);

  if (!context) {
    throw new Error("Terms must be used within a DarkModeProvider");
  }

  const { isDark } = context;
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  // to animate the opening and closing of accordion
  useEffect(() => {
    setMaxHeight(isOpen ? `${contentRef.current?.scrollHeight}px` : "0px");
  }, [isOpen]);

  // to copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(term.definition);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 ${
        isDark
          ? "bg-gradient-to-r from-purple-800 via-pink-800 to-red-800 hover:from-purple-700 hover:to-red-700"
          : "bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 hover:from-blue-500 hover:to-purple-600"
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex justify-between items-center focus:outline-none"
      >
        <h3 className="text-lg font-bold text-white">{term.term}</h3>
        {isOpen ? (
          <ChevronUp className="text-white" />
        ) : (
          <ChevronDown className="text-white" />
        )}
      </button>

      <div
        ref={contentRef}
        style={{ maxHeight }}
        className="px-6 overflow-hidden transition-[max-height] duration-500 ease-in-out"
      >
        <p className="py-2 text-white text-sm md:text-base opacity-95">
          {term.definition}
        </p>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1 rounded bg-white/20 hover:bg-white/30 text-white text-sm font-medium transition mb-2"
        >
          <Clipboard className="w-4 h-4" />
          {copied ? "Copied!" : "Copy Definition"}
        </button>
      </div>
    </div>
  );
};
