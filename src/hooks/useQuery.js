import { localStorageCache, sessionStorageCache } from "@/utils/cache"
import { delay } from "@/utils/delay"
import { CanceledError } from "axios"
import { useRef } from "react"
import { useMemo } from "react"
import { useEffect, useState } from "react"

const _cache = {
    localStorage: localStorageCache,
    sessionStorage: sessionStorageCache,
}
// lưu trữ các promise
const _asyncFunction = {
    // key: Promise
}

export const useQuery = ({
        queryFn,
        queryKey,
        dependencyList = [],
        keepPrivousData = false,
        enabled = true,
        cacheTime,
        // sắp xếp thứ tự
        onSuccess,
        onError,
        limitDuration,
        storeDriver = 'localStorage' 
    } = {}) => {
    const cache = _cache[storeDriver]
    const refetchRef = useRef()

    const dataRef = useRef({})
    const [data, setData] = useState()
    const [loading, setLoading] = useState(enabled)
    const [error, setError] = useState()
    const [status, setStatus] = useState('idle')

    const cacheName = Array.isArray(queryKey) ? queryKey[0] : queryKey
    // cancel request
    const controllerRef = useRef(new AbortController())
    // useEffect(() => {
    //     if(typeof refetchRef.current === 'boolean') {
    //         refetchRef.current = true
    //     }
    // }, dependencyList)

    // hủy request khi uses thoát khỏi trang
    useEffect(() => {
        return () => {
            controllerRef.current.abort()
        }
    }, [])
    useEffect(() => {
        if (enabled) {
            fetchData()
        }
    }, [enabled].concat(queryKey))


    const getCacheDataOrPrivousData = () => {
        if(cacheName) {
            if(keepPrivousData && dataRef.current[cacheName]) {
                return dataRef.current[cacheName]
            }
            if(_asyncFunction[cacheName]) {
                return _asyncFunction[cacheName]
            }
            // Kiểm tra cache xem có dữ liệu hay không
            return cache.get(queryKey)

        }
    }

    const setCacheDataOrPrivousData = (data) => {
        if(keepPrivousData) {
            dataRef.current[cacheName] = data;
        }

        if(cacheName && cacheTime) {
            let expired = cacheTime
            if (cacheTime) {
                expired += Date.now()
            }
            cache.set(cacheName, data, expired)
        }
    }


    const fetchData = async (...args) => {
        // khi gọi dl thì cancel request cũ đi
        controllerRef.current.abort()
        controllerRef.current = new AbortController()
        const startTime = new Date()

        let res
        let error
        try {
            setLoading(true)
            setStatus('pending')

            res = getCacheDataOrPrivousData()

            if (!res) {
                res = queryFn({signal : controllerRef.current.signal, params : args})
                if(cacheName) {
                    _asyncFunction[cacheName] = res
                }
            }

            if(res instanceof Promise) {
                res = await res
            }
            
        } catch (err) {
            console.log(err)
            // ktr nếu obj của err không có class CanceledError thì ...
            error = err
        }

        const endTime = new Date()

        if(limitDuration) {
            let timeout = endTime - startTime
            if(timeout < limitDuration) {
                await delay(limitDuration - timeout)
            }
        }
        if(cacheName) delete _asyncFunction[cacheName]
        // neu có res và res k dc là Promise
        if(res && !(res instanceof Promise)) {
            setStatus('success')
            // gọi trc khi get data
            onSuccess?.(res)
            setData(res)


            setCacheDataOrPrivousData(res)

            refetchRef.current = false
            setLoading(false)
            return res
        }

        if(error instanceof CanceledError) {
            
        } else {
            onError?.(error)
            setError(error)
            setStatus('error')
            setLoading(false)
            throw error
        }


    }

    const clearKeepPrivousData = () => {
        dataRef.current = {}
    }
    return {
        loading,
        error,
        data,
        status,
        refetch : fetchData,
        clearKeepPrivousData
    }
}