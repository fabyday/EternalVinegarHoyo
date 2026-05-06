import { useEffect } from "react";
import React from "react";
interface ImageButonProps {
  id: string;
  src: string;
  name: string;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onMouseHover: () => void;
}

export function ImageButton({
  id,
  src,
  name,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseHover,
}: ImageButonProps) {
  return (
    <div className="flex bg-amber-500 ">
      <img className="w-2xs" src="./bobtongirihoyo_wide.png" />
      test
    </div>
  );
}
