import React, { useCallback, useState } from 'react'
import ReactDOM from "react-dom"
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Status } from 'types/status'

/**
 * @typedef {object} ModalType
 * @property {boolean} isDisplay Is modal display
 * @property {string=} title Title
 * @property {React.ReactNode=} children Content
 * @property {function():any=} props.onClickYes On click
 * @property {function():any=} props.onClickNo On click
 * @property {boolean=} props.isFormDisable Force disable form
 * @property {string=} props.validateText Validate text
 */

/**
 * Modal
 * @param {ModalType} props
 */
function Modal({ isDisplay, title, children, onClickYes, onClickNo, isFormDisable = false, validateText = "Validate" }) {
    /** @type {[string, function(string):any]} Status */
    const [status, setStatus] = useState(Status.RESOLVED)

    const onSubmit = useCallback(
        async () => {
            setStatus(Status.PENDING)
            await onClickYes?.()
            setStatus(Status.RESOLVED)
        },
        [onClickYes]
    )

    if (!isDisplay)
        return <></>

    return ReactDOM.createPortal(
        <div className={classNames("modal is-active")}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <form
                    onSubmit={ev => {
                        ev.preventDefault()
                        onSubmit()
                    }}
                >
                    <header className={classNames("modal-card-head")}>
                        <p className="modal-card-title">{title}</p>
                        <button
                            className="delete"
                            aria-label="close"
                            type="button"
                            onClick={() => {
                                onClickNo?.() ?? onClickYes?.()
                            }}
                        />
                    </header>
                    <section className={classNames("modal-card-body")} style={{ overflow: "auto", maxHeight: "50vh" }}>
                        <div className="content">
                            {children}
                        </div>
                    </section>
                    <footer className={classNames("modal-card-foot flex-end")}>
                        <button
                            className={classNames(
                                "button is-success",
                                { "is-loading": status === Status.PENDING }
                            )}
                            data-test-cypress="save"
                            type={isFormDisable ? 'button' : 'submit'}
                            onClick={() => isFormDisable ? onSubmit() : null}
                            disabled={status === Status.PENDING}
                        >
                            <span className="icon">
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span>{validateText}</span>
                        </button>
                        {!!onClickNo &&
                            <button
                                className={classNames("button")}
                                type={isFormDisable ? 'button' : 'submit'}
                                onClick={() => onClickNo?.()}
                                disabled={status === Status.PENDING}
                            >
                                <span className="icon">
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                                <span>Cancel</span>
                            </button>
                        }
                    </footer>
                </form>
            </div>
        </div>,
        document.getElementById('modal-portal')
    )
}
export default Modal