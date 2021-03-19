
import React from "react"
import { AppProps } from "app"// eslint-disable-line

/**
 * @typedef {object} IndexProps
 * @property {any} example
 */

/**
 * @param {IndexProps & AppProps} props
 */
export default function Index({ example }) {
    return (
        <>
            <main className="app-index">
                Index
            </main>
        </>
    )
}
