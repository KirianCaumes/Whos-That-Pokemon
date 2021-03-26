
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
export default function Register({ signIn, signOut }) {
    /** @type {[Status, function(Status):any]} Page Status */
    const [status, setStatus] = useState(Status.IDLE)
    /** @type {[string, function(string):any]} Username */
    const [username, setUsername] = useState()
    /** @type {[string, function(string):any]} Password */
    const [password, setPassword] = useState()
    /** @type {[string, function(string):any]} Error */
    const [error, setError] = useState()

    /** Register user */
    const [register] = useMutation('users/register')

    //Logout on page load
    useEffect(() => {
        signOut()
    }, [signOut])

    //When form is submitted
    const onSubmit = useCallback(async () => {
        const { data, error } = await register({ username, password })

        if (!error) {
            signIn(/** @type {any} */(data)?.token)
            history.push('/')
        } else {
            console.error(error)
            if (error.title !== "Aborted") {
                setStatus(Status.REJECTED)
                setError(error?.detail)
            }
        }
    }, [username, password, register, signIn])

    return (
        <>
            <main className="app-Register">
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
                                <Heading size={3}>Register</Heading>
                                <div className="field">
                                    <label className="label">Your name</label>
                                    <div className="control">
                                        <input
                                            required
                                            minLength={3}
                                            className="input"
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
                                            className="input"
                                            type="password"
                                            placeholder="Your password"
                                            autoComplete="new-password"
                                            defaultValue={password}
                                            onChange={ev => setPassword(ev.target.value)}
                                        />
                                    </div>
                                    <p className="help is-danger">{error}</p>
                                </div>
                                <div className="flex-row flex-space-between">
                                    <button
                                        className={classNames("button", "is-primary", { "is-loading": status === Status.PENDING })}
                                        type="submit"
                                    >
                                        <span className="icon is-medium">
                                            <FontAwesomeIcon icon={faSignInAlt} />
                                        </span>
                                        <span>Register</span>
                                    </button>
                                    <Link to="/login" style={{ marginTop: '10px' }}>
                                        Login
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
