
import React from "react"
import { AppProps } from "App"// eslint-disable-line
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faCog, faEye, faPlay, faStar, faStop, faSync } from "@fortawesome/free-solid-svg-icons"
import classNames from "classnames"
import PokeLoader from "components/commons/pokeloader"

/**
 * @typedef {object} IndexProps
 * @property {any} example
 */

/**
 * @param {IndexProps & AppProps} props
 */
export default function Index({ example }) {
    const pokemon = {
        numero: 25,
        name: {
            fr: "Pikachu",
            en: "Pikachuen"
        }
    }
    const lang = "fr"
    const messageDisplayed = ""
    const timeLeft = 0
    const isAnswerDisplayed = false
    const isLoading = false
    const isGameOn = false
    const pkmnNameInputValue = ""

    const check = () => {
        console.log("check")
    }
    const changePkmnNameInputValue = (value) => {
        console.log("changePkmnNameInputValue")
    }
    const refresh = () => {
        console.log("refresh")
    }
    const response = () => {
        console.log("response")
    }
    const play = () => {
        console.log("play")
    }
    const openModal = () => {
        console.log("openModal")
    }
    const stop = () => {
        console.log("stop")
    }
    const openModalScore = () => {
        console.log("openModalScore")
    }




    return (
        <>
            <main className="app-index game-board">
                <div className="card">
                    <div className="card-image">
                        <div>
                            {!isLoading ?
                                <img
                                    style={{
                                        filter: isAnswerDisplayed ? "brightness(1)" : "brightness(0)",
                                        transition: isAnswerDisplayed ? '0.5s' : '0s'
                                    }}
                                    onClick={ev => ev.preventDefault()}
                                    src={require(`assets/imgs/pkmn/${pokemon.numero ?? 1}.png`).default}
                                    alt="pokemon"
                                    data-test-id="image-pkmn"
                                /> :
                                <PokeLoader />
                            }
                        </div>
                    </div>
                    <div className="card-content">
                        <h1 className="title has-text-centered">
                            {!isAnswerDisplayed ?
                                <span>
                                    <span data-test-id="answer-text">{pokemon?.name?.[lang]}</span> - N°<span>{pokemon.numero}</span>
                                </span> :
                                <span>&nbsp;</span>
                            }
                        </h1>
                        <br />
                        {isGameOn &&
                            <progress
                                className={classNames("progress", { "is-primary": timeLeft >= 20 }, { "is-warning": timeLeft < 20 }, { "is-danger": timeLeft < 10 })}
                                value={timeLeft}
                                max={60}
                            >
                                {timeLeft} sec
                            </progress>
                        }
                        <div className="button-row">
                            <div className="field has-addons">
                                <div className="control">
                                    <form
                                        onSubmit={ev => {
                                            ev.preventDefault()
                                            check()
                                        }}
                                    >
                                        <input
                                            className="input test"
                                            type="text"
                                            placeholder="Nom du Pokémon"
                                            defaultValue={pkmnNameInputValue}
                                            onChange={ev => changePkmnNameInputValue(ev.target.value)}
                                            data-test-id="input-pkmn-name"
                                            disabled={isLoading}
                                            id="pkmnNameInput"
                                        />
                                        <p className="help" data-test-id="message-pkmn-name">
                                            {messageDisplayed.length > 0 ? messageDisplayed : <>&nbsp;</>}
                                        </p>
                                    </form>
                                </div>
                                <div className="control">
                                    <button
                                        className="button is-success is-outlined"
                                        onClick={() => check()}
                                        data-test-id="check-button"

                                    >
                                        <span className="icon">
                                            <FontAwesomeIcon icon={faCheck} />
                                        </span>
                                        <span>Check</span>
                                    </button>
                                </div>
                            </div>
                            <button
                                className="button is-primary"
                                onClick={() => refresh()}
                                disabled={isLoading}
                            >
                                <span className="icon">
                                    <FontAwesomeIcon icon={faSync} />
                                </span>
                                <span>Refresh</span>
                            </button>
                            <button
                                className="button is-info"
                                onClick={() => response()}
                                disabled={isLoading || isGameOn}
                                data-test-id="answer-button"
                            >
                                <span className="icon">
                                    <FontAwesomeIcon icon={faEye} />
                                </span>
                                <span>Answer</span>
                            </button>
                            <button
                                className="button is-link"
                                onClick={() => openModal()}
                                disabled={isGameOn}
                            >
                                <span className="icon">
                                    <FontAwesomeIcon icon={faCog} />
                                </span>
                                <span>Settings</span>
                            </button>
                            {!isGameOn ?
                                <button
                                    className="button is-success"
                                    onClick={() => play()}
                                    data-test-id="play-timer-button"
                                >
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faPlay} />
                                    </span>
                                    <span>Play</span>
                                </button> :
                                <button
                                    className="button is-danger"
                                    onClick={() => stop()}
                                    data-test-id="close-timer-button"
                                >
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faStop} />
                                    </span>
                                    <span>Stop</span>
                                </button>
                            }
                            <button
                                className="button is-link"
                                onClick={() => openModalScore()}
                            >
                                <span className="icon">
                                    <FontAwesomeIcon icon={faStar} />
                                </span>
                                <span>Scores</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
