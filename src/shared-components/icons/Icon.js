import React from "react";

export default function Icon(props) {
  let contents = null;
  switch (props.name) {
    case "x":
      contents = (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      );
      break;
    default:
      contents = (
        <>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12" y2="16" />
        </>
      );
      break;
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24"
      width="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={props.strokeWidth || 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={props.style}
      className={"icon " + (props.className || "")}
    >
      {contents}
    </svg>
  );
}
