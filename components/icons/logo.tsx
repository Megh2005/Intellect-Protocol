import * as React from "react";
import { SVGProps } from "react";

export const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="40"
    height="40"
    fill="url(#logo-gradient)"
    {...props}
  >
    <defs>
      <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--primary))" />
        <stop offset="100%" stopColor="hsl(var(--accent))" />
      </linearGradient>
    </defs>
    <path d="M9 8.25V7.5a3 3 0 013-3h0a3 3 0 013 3v.75m-6 0v.75a3 3 0 003 3h0a3 3 0 003-3v-.75m-6 0h6m-6.75 3h6.75" />
    <path d="M9 15.75V15a3 3 0 013-3h0a3 3 0 013 3v.75m-6 0v.75a3 3 0 003 3h0a3 3 0 003-3v-.75m-6 0h6m-6.75-6h6.75" />
  </svg>
);
