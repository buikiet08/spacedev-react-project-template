import React from "react"
import { Link } from "react-router-dom"

export const Breadcrumb = ({children}) => {
    return (
        <ol className="breadcrumb mb-md-0 font-size-xs text-gray-400">
            {children}
        </ol>
    )
}

Breadcrumb.Title = ({ to, children }) => {
    const Comp = to ? Link : React.Fragment
    return (
        <li className="breadcrumb-item text-gray-400">
            <Comp to={to}>{children}</Comp>
        </li>
    )
}