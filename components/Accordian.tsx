import React, { useState } from "react";
import clsx from "clsx";

interface AccordionProps {
  title: string;
  children: string | JSX.Element;
}
export default function Accordion({ title, children }: AccordionProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      className={clsx("overflow-hidden border-y bg-indigo-100/50 rounded-lg")}
    >
      <button
        className="flex items-center w-full py-6 px-4 text-2xl text-left"
        onClick={() => setIsActive(!isActive)}
      >
        <div className="w-16 ">💡 </div>
        <div className="flex-1">{title}</div>
        <div className="ml-auto">
          <svg className="shrink-0 w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11l-4 4-4-4" />
          </svg>
        </div>
      </button>
      <div
        className="grid transition-all"
        style={{
          gridTemplateRows: isActive ? "1fr" : "0fr",
        }}
      >
        <p
          className={clsx(
            "min-h-0",
            "pr-4 pl-20 text-lg",
            isActive ? "pb-4" : "pb-0"
          )}
        >
          {children}
        </p>
      </div>
    </div>
  );
};