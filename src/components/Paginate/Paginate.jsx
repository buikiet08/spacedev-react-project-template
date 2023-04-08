import React from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { useCurrentPage } from '../../hooks/useCurrentPage'

function Paginate({totalPage, name = 'page'}) {
    // mặc định page = 1
    const [search,setSearch] = useSearchParams()
    const {pathname} = useLocation()
    const currentPage = useCurrentPage()
    const _search = new URLSearchParams(search)
    const renderPage = () => {
        let start = currentPage - 2
        let end = currentPage + 2


        if(start < 1) {
            start = 1
            end = 5
        }

        
        if(end > totalPage) {
            end = totalPage
            start = end - 4
            if(start < 1) start = 1
        }

        const list = []
        for (let i = start; i <= end; i++) {
            _search.set(name, i)
            let path = `${pathname}?${_search.toString()}`
            list.push(
            (
                <li className={`page-item ${currentPage === i ? 'active' : ''}`}>
                    <Link className="page-link" to={path}>{i}</Link>
                </li>
            )
            )
        }
        return list
    }

    _search.set(name, currentPage - 1)
    const prevLink = `${pathname}?${_search.toString()}`

    _search.set(name, currentPage + 1)
    const nextLink = `${pathname}?${_search.toString()}`

    if(totalPage <= 1) return null
    return (
        <nav className="d-flex justify-content-center justify-content-md-end">
            <ul className="pagination pagination-sm text-gray-400">
                {
                    currentPage > 1 && 
                    <li className="page-item">
                        <Link className="page-link page-link-arrow" to={prevLink}>
                            <i className="fa fa-caret-left" />
                        </Link>
                    </li>
                }
                {renderPage()}
                {
                    currentPage < totalPage &&
                    <li className="page-item">
                        <Link className="page-link page-link-arrow" to={nextLink}>
                            <i className="fa fa-caret-right" />
                        </Link>
                    </li>
                }
            </ul>
        </nav>
    )
}

export default Paginate