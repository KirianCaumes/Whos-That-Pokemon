import { useEffect, useRef } from "react"
import { MutableRefObject } from "react"// eslint-disable-line

/**
 * Return previous value
 * @template T
 * @param {T} value 
 * @returns {T}
 */
export default function usePrevious(value) {
    /** @type {MutableRefObject<T>} */
    const ref = useRef()

    useEffect(() => {
        ref.current = value
    })

    return ref.current
}