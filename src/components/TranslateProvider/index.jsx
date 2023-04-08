import React, { createContext, useContext, useEffect, useState } from 'react'
import vi from '@/locales/vi.json';
import china from '@/locales/china.json';


const Context = createContext({})
const translate = {
    vi,
    china
}

export const TranslateProvider = ({children}) => {
    const [lang,setLang] = useState(() => {
        return localStorage.getItem('lang') || 'en'
    })
    useEffect(() => {
        localStorage.setItem('lang', lang)
    }, [lang])
    const t = (key) => {
        return translate ?.[lang]?.[key] || key
    }
    return (
        <Context.Provider value={{t,lang, setLang}}>{children}</Context.Provider>
    )
}

export const useTranslate = () => useContext(Context)