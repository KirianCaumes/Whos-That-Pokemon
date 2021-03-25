
import React, { useCallback, useEffect, useState } from "react"
import { AppProps } from "App"// eslint-disable-line
import { useMutation } from "jsonapi-react"
// @ts-ignore
import { Columns, Heading, Box } from 'react-bulma-components'
import { Status } from "types/status"
import classNames from "classnames"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons"
import { history } from "utils/history"

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

    /** Register user */
    const [register] = useMutation('users/register')

    //Logout on page load
    useEffect(() => {
        signOut()
    }, [signOut])

    //When form is submitted
    const onSubmit = useCallback(async () => {
        setStatus(Status.PENDING)
        const token = /** @type {any} */(await register({ username, password }))?.data?.token
        signIn(token)
        history.push('/')
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
                                </div>
                                <button
                                    className={classNames("button", "is-primary", { "is-loading": status === Status.PENDING })}
                                    type="submit"
                                >
                                    <span className="icon is-medium">
                                        <FontAwesomeIcon icon={faSignInAlt} />
                                    </span>
                                    <span>Register</span>
                                </button>
                            </form>
                        </Box>
                    </Columns.Column>
                    <Columns.Column size="one-third" />
                </Columns>
            </main>
        </>
    )
}
