import React from 'react'

export default function Wrapper({children,className}:{children:any;className?:string}) {
  return (
    <section className={`w-full pt-12 ${className}`}>
        {children}
    </section>
  )
}
