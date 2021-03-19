
import React, { useEffect } from "react"
import { AppProps } from "app"// eslint-disable-line
import { useQuery } from "jsonapi-react";

/**
 * @typedef {object} LoginProps
 * @property {any} example
 */

/**
 * @param {LoginProps & AppProps} props
 */
export default function Login({ example }) {
    const { data } = useQuery('users?include=highscores')

    useEffect(() => {
        console.log(data)
    }, [data])

    return (
        <>
            <main className="app-login">
                Login
            </main>
        </>
    )
}
