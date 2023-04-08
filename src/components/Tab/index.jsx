import { cn } from "@/utils"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import { useLocation, useSearchParams } from "react-router-dom"


const Context = createContext({})
export const Tab = ({name='Tab', removeOnDeActive, children, activeDefault,onChange}) => {
    const [search] = useSearchParams()
    const [active,_setActive] = useState(search.get(name) || activeDefault)

    const setActive = (value) => {
        _setActive(value)
        onChange?.(value)
    }
    return (
        <Context.Provider value={{removeOnDeActive,name,active :search.get(name) || activeDefault , setActive}}>{children}</Context.Provider>
    )
}

Tab.Title = ({children, value}) => {
    const { pathname } = useLocation()
    const [search,setSearch] = useSearchParams()
    const {active, setActive,name} = useContext(Context)
    const onClick = (ev) => {
        ev.preventDefault()
        setActive(value)

        setSearch((search) => {
            const _search = new URLSearchParams(search)
            _search.set(name, value)
            return _search
        })
    }
    return <a onClick={onClick} className={cn("nav-link cursor-pointer", {active: value === active})}>{children}</a>
}

Tab.Content = ({children,value}) => {
    const firstRender = useRef()
    const {active, removeOnDeActive} = useContext(Context)
    useEffect(() => {
        if(active === value) {
            firstRender.current =true
        }
    }, [active])

    if(removeOnDeActive && active !== value) {
        if(!firstRender.current) {
            return null
        }
    }
    return <div className={cn("tab-pane fade", {'show active' : active === value})}>{children}</div>
}