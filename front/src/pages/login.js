
import React, { useCallback, useEffect, useState } from "react"
import { AppProps } from "app"// eslint-disable-line
import { useMutation } from "jsonapi-react"
// @ts-ignore
import { Columns, Heading, Box } from 'react-bulma-components'
import { Status } from "types/status"
import classNames from "classnames"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons"
import { history } from "utils/history"
import { Link } from "react-router-dom"

/**
 * @param {AppProps} props
 */
export default function Login({ signIn, signOut }) {
    /** @type {[Status, function(Status):any]} Page Status */
    const [status, setStatus] = useState(Status.IDLE)
    /** @type {[string, function(string):any]} Username */
    const [username, setUsername] = useState()
    /** @type {[string, function(string):any]} Password */
    const [password, setPassword] = useState()

    /** Login user */
    const [login] = useMutation('users/login')

    //Logout on page load
    useEffect(() => {
        signOut()
    }, [signOut])

    //When form is submitted
    const onSubmit = useCallback(async () => {
        setStatus(Status.PENDING)

        const { data, error } = await login({ username, password })

        if (!error) {
            signIn(/** @type {any} */(data)?.token)
            history.push('/')
        } else {
            console.error(error)
            if (error.title !== "Aborted")
                setStatus(Status.REJECTED)
        }
    }, [username, password, login, signIn])

    return (
        <>
            <main className="app-login">
                <Columns>
                    <Columns.Column size="one-third" />
                    <Columns.Column size="one-third">
                        <Box>
                            <form
                                onSubmit={ev => {
                                    ev.preventDefault()
                                    onSubmit()
                                }}
                            >
                                <Heading size={3}>Login</Heading>
                                <div className="field">
                                    <label className="label">Your name</label>
                                    <div className="control">
                                        <input
                                            required
                                            minLength={3}
                                            className="input "
                                            data-test-cypress="username"
                                            type="text"
                                            placeholder="Your name"
                                            defaultValue={username}
                                            onChange={ev => setUsername(ev.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label">Your password</label>
                                    <div className="control">
                                        <input
                                            required
                                            minLength={3}
                                            className="input password"
                                            data-test-cypress="password"
                                            type="password"
                                            placeholder="Your password"
                                            autoComplete="new-password"
                                            defaultValue={password}
                                            onChange={ev => setPassword(ev.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex-row flex-space-between">
                                    <button
                                        className={classNames("button", "is-primary", { "is-loading": status === Status.PENDING })}
                                        data-test-cypress="submit"
                                        type="submit"
                                    >
                                        <span className="icon is-medium">
                                            <FontAwesomeIcon icon={faSignInAlt} />
                                        </span>
                                        <span>Login</span>
                                    </button>
                                    <Link to="/register" style={{ marginTop: '10px' }}>
                                        Register
                                    </Link>
                                </div>
                            </form>
                        </Box>
                    </Columns.Column>
                    <Columns.Column size="one-third" />
                </Columns>
            </main>
        </>
    )
}
