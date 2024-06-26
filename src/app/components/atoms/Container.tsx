import React from "react";

export default function Container({
  children,
  className,
  onClick,
}: {
  children: any;
  className?: string;
  onClick?: any;
}) {
  return (
    <div
      onClick={onClick}
      className={`max-w-[1200px] mx-auto p-10 w-full ${className}`}
    >
      {children}
    </div>
  );
}
