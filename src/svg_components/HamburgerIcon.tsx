import React from "react";

interface HamburgerIconProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  opened: boolean;
  setOpened: (opened: boolean) => void;
}

export const HamburgerIcon = ({
  opened,
  setOpened,
  ...props
}: HamburgerIconProps) => {
  const toggleMenu = () => {
    setOpened(!opened);
  };

  return (
    <button
      className={`menu ${opened ? "opened" : ""}`}
      onClick={toggleMenu}
      aria-label="Main Menu"
      aria-expanded={opened}
      {...props}
    >
      <svg width="40" height="40" viewBox="0 0 100 100">
        <path
          className="line line1"
          d="M 20,29 H 80 C 80,29 94.5,28.8 94.5,66.7 C 94.5,78 91,81.7 85.3,81.7 C 79.6,81.7 75,75 75,75 L 25,25"
        />
        <path className="line line2" d="M 20,50 H 80" />
        <path
          className="line line3"
          d="M 20,71 H 80 C 80,71 94.5,71.2 94.5,33.3 C 94.5,22 91,18.3 85.3,18.3 C 79.6,18.3 75,25 75,25 L 25,75"
        />
      </svg>
      <style jsx>{`
        .menu {
          background-color: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          padding: 0;
          transition: transform 0.3s ease;
        }
        .menu:hover {
          transform: scale(1.05);
        }
        .line {
          fill: none;
          stroke: currentColor;
          stroke-width: 6;
          transition: stroke-width 0.3s ease,
            stroke-dasharray 600ms cubic-bezier(0.4, 0, 0.2, 1),
            stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .menu:hover .line {
          stroke-width: 8;
        }
        .line1 {
          stroke-dasharray: 60 207;
        }
        .line2 {
          stroke-dasharray: 60 60;
        }
        .line3 {
          stroke-dasharray: 60 207;
        }
        .opened .line1 {
          stroke-dasharray: 90 207;
          stroke-dashoffset: -134;
        }
        .opened .line2 {
          stroke-dasharray: 1 60;
          stroke-dashoffset: -30;
        }
        .opened .line3 {
          stroke-dasharray: 90 207;
          stroke-dashoffset: -134;
        }
      `}</style>
    </button>
  );
};
