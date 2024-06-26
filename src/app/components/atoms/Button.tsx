import React from "react";

export default function Button(props: any) {
  return <button  {...props} className={`bg-blue-700 text-white hover:bg-blue-500 rounded-md p-2 w-fit ${props?.className}`}>{props?.children}</button>;
}
