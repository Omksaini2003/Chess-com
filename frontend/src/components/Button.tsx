import React from "react"

export const Button = ({onClick, children}: {onClick: () => void, children: React.ReactNode}) => {
      return <>
      <button onClick={onClick} className="px-8 py-4 bg-green-500 hover:bg-blue-700 text-white font-bold rounded">
           {children}
      </button>
      </>
}