
import React, { useCallback, useState, useEffect, useRef } from "react"
import { Dispatch, SetStateAction, MutableRefObject } from "react"// eslint-disable-line
import { AppProps } from "app"// eslint-disable-line
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faCog, faEye, faPlay, faStar, faStop, faSync } from "@fortawesome/free-solid-svg-icons"
import classNames from "classnames"
import PokeLoader from "components/commons/pokeloader"
import similarity from "utils/similarity"
import { Status } from "types/status"
import { useClient } from 'jsonapi-react'
import { IResult, StringMap } from 'jsonapi-react'// eslint-disable-line
import usePrevious from "utils/hooks/usePrevious"
import Modal from "components/commons/modal"
import { ModalType } from "components/commons/modal"// eslint-disable-line

/** @type {Pokemon} */
const EMPTY_PKMN = { number: null, name: { fr: null }, generation: 1 }

const MESSAGES = {
    found: "Found !",
    close: "So close !",
    quiteClose: "Quite close",
    notClose: "So far...",
    empty: "You must write something!"
}

const TIME_MAX = 10

const LANGS = {
    de: "German",
    en: "English",
    fr: "French",
    ja: "Japanese",
    ko: "Korean"
}

const GENERATIONS = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
}

/** @type {Settings} */
const INIT_SETTINGS = { lang: "fr", generations: [1, 2, 3, 4, 5, 6] }

/**
 * @typedef {object} Settings
 * @property {keyof LANGS | string} lang
 * @property {(keyof GENERATIONS | number)[]} generations
 */

/**
 * @typedef {object} Pokemon
 * @property {number} number
 * @property {object} name
 * @property {number} generation
 */
/**
 * @typedef {object} Highscore
 * @property {object} user
 * @property {string} user.username
 * @property {Date} createdAt
 * @property {number} score
 * @property {number[]} generations
 */
/**
 * @typedef {object} IndexProps
 * @property {any} example
 */

/**
 * @param {IndexProps & AppProps} props
 */
export default function Index({ example }) {
    /** @type {[Status, Dispatch<SetStateAction<Status>>]} Page Status */
    const [status, setStatus] = useState(Status.PENDING)
    /** @type {[string, Dispatch<SetStateAction<string>>]} Message */
    const [message, setMessage] = useState("")
    /** @type {[boolean, Dispatch<SetStateAction<boolean>>]} Is answer displayed */
    const [isAnswerDisplayed, setIsAnswerDisplayed] = useState(!true)
    /** @type {[string, Dispatch<SetStateAction<string>>]} Value */
    const [value, setValue] = useState("")
    /** @type {[boolean, Dispatch<SetStateAction<boolean>>]} Is game running */
    const [isGameRunning, setIsGameRunning] = useState(!true)
    /** @type {[number, Dispatch<SetStateAction<number>>]} Score in game */
    const [score, setScore] = useState(0)
    /** @type {[number, Dispatch<SetStateAction<number>>]} Time left in secondes */
    const [secondsLeft, setSecondsLeft] = useState(0)
    /** @type {[Pokemon, Dispatch<SetStateAction<Pokemon>>]} Pokemon */
    const [pokemon, setPokemon] = useState({ ...EMPTY_PKMN })
    /** @type {[Settings, Dispatch<SetStateAction<Settings>>]} Settings */
    const [settings, setSettings] = useState({ ...INIT_SETTINGS })
    /** @type {[Highscore[], Dispatch<SetStateAction<Highscore[]>>]} Highscores */
    const [highscores, setHighScores] = useState([])


    /** @type {[ModalType, function(ModalType):any]} Modal */
    const [modal, setModal] = useState({ isDisplay: !true })
    /** @type {[ModalType, Dispatch<SetStateAction<ModalType>>]} Modal Settings */
    const [modalSettings, setModalSettings] = useState({ isDisplay: !true })
    /** @type {[ModalType, Dispatch<SetStateAction<ModalType>>]} Modal HighScores */
    const [modalHighScores, setModalHighScores] = useState({ isDisplay: !true })

    /** @type {MutableRefObject<HTMLInputElement>} */
    const inputRef = useRef(null)
    /** @type {MutableRefObject<NodeJS.Timeout>} */
    const timer = useRef()
    /** @type {MutableRefObject<Promise<IResult<StringMap | StringMap[]>>>} */
    const getPokemonRandomRequest = useRef()
    /** @type {MutableRefObject<Promise<IResult<StringMap | StringMap[]>>>} */
    const getHighScoresRequest = useRef()

    /** Api Client */
    const client = useClient()

    /** Refresh pokemon to display a new one */
    const refresh = useCallback(async () => {
        setPokemon({ ...EMPTY_PKMN })
        setIsAnswerDisplayed(false)
        setMessage("")
        setValue("")
        setStatus(Status.PENDING)

        getPokemonRandomRequest.current = client.fetch(
            [
                "pokemons",
                `random?${settings.generations.map(gen => `generations[]=${gen}`).join('&')}`
            ],
            { headers: { "Authorization": `Bearer ${localStorage.getItem(`${process.env.REACT_APP_BASE_STORAGE_KEY}_token`)}` } }
        )
        const { data, error } = await getPokemonRandomRequest.current

        if (!error) {
            setPokemon(/** @type {Pokemon} */(data))
            setStatus(Status.RESOLVED)
            setTimeout(() => inputRef.current.focus(), 1)
        } else {
            console.error(error)
            if (error.title !== "Aborted")
                setStatus(Status.REJECTED)
        }
    }, [client, inputRef, settings])

    /** Check if input match pokemon name */
    const check = useCallback(() => {
        const similarityScore = similarity(pokemon?.name?.[settings?.lang], value)

        if (similarityScore < 3) {
            setMessage(MESSAGES.found)
            setIsAnswerDisplayed(true)
            if (isGameRunning) {
                setTimeout(() => refresh(), 1000)
                setScore(score => score + 1)
            }
        } else if (similarityScore < 5) {
            setMessage(MESSAGES.close)
        } else if (similarityScore < 7) {
            setMessage(MESSAGES.quiteClose)
        } else {
            setMessage(MESSAGES.notClose)
        }
    }, [pokemon, value, refresh, isGameRunning, settings])

    /** Show response */
    const showResponse = useCallback(() => {
        if (!!pokemon.number)
            setIsAnswerDisplayed(true)
        setMessage("")
    }, [pokemon])

    /** Stop game running */
    const stop = useCallback(() => {
        setIsGameRunning(false)
        showResponse()
        setValue("")
        // @ts-ignore
        getPokemonRandomRequest.current?.abort()
        clearInterval(timer.current)

        setModal({
            isDisplay: true,
            children: <>
                <p className="subtitle has-text-centered is-5">
                    Congrutalations! You have just found <b>{score ?? 0}</b> Pokémon(s) in 60 seconds!
                </p>
            </>,
            onClickYes: async () => {
                const { error } = await client.mutate(
                    ['highscores'],
                    {
                        score: score,
                        generations: settings.generations
                    },
                    { headers: { "Authorization": `Bearer ${localStorage.getItem(`${process.env.REACT_APP_BASE_STORAGE_KEY}_token`)}` } }
                )

                if (error) {
                    console.error(error)
                    if (error.title !== "Aborted")
                        setStatus(Status.REJECTED)
                }
                setModal({ isDisplay: false })
                refresh()
            },
            onClickNo: () => {
                setModal({ isDisplay: false })
                refresh()
            },
            title: "Game Over",
            validateText: "Save",
        })
    }, [showResponse, timer, score, refresh, client, settings])


    /** Start game */
    const play = useCallback(() => {
        setIsGameRunning(true)
        setSecondsLeft(TIME_MAX)
        setScore(0)
        // @ts-ignore
        getPokemonRandomRequest.current?.abort()
        refresh()
    }, [refresh])

    /** Show highscores */
    const showHighScore = useCallback(async () => {
        setModalHighScores({ isDisplay: true })
        getHighScoresRequest.current = client.fetch(
            ["highscores?include=user&page[offset]=0&page[limit]=10&sort=-score"],
            { headers: { "Authorization": `Bearer ${localStorage.getItem(`${process.env.REACT_APP_BASE_STORAGE_KEY}_token`)}` } }
        )
        const { data, error } = await getHighScoresRequest.current

        if (!error) {
            setHighScores(/** @type {any} */(data))
        } else {
            console.error(error)
            if (error.title !== "Aborted")
                setStatus(Status.REJECTED)
        }
    }, [client])

    /** Previous value of seconds left */
    const prevSecondsLeft = usePrevious(secondsLeft)
    /** Previous value of refresh */
    const prevRefresh = usePrevious(refresh)

    /** Launch timer on game start */
    useEffect(() => {
        clearInterval(timer.current)
        if (isGameRunning)
            timer.current = setInterval(() => {
                if (status !== Status.PENDING) { //Pokemon is load
                    setSecondsLeft(time => time - 1)
                    setTimeout(() => inputRef.current.focus(), 1)
                }
            }, 1000)
    }, [isGameRunning, timer, status])

    // Stop game if no remaining time
    useEffect(() => {
        if (prevSecondsLeft > 0 && secondsLeft === 0)
            stop()
    }, [secondsLeft, prevSecondsLeft, stop])

    // Life cycle
    useEffect(() => {
        // On component mount
        if (prevRefresh?.toString() !== refresh?.toString())
            refresh()
    }, [prevRefresh, refresh])

    // Life cycle
    useEffect(() => {
        // On component unmount
        return () => {
            // @ts-ignore
            getPokemonRandomRequest.current?.abort()
            // @ts-ignore
            getHighScoresRequest.current?.abort()
        }
    }, [])


    return (
        <>
            <main className="app-index game-board">
                <div className="card">
                    <div className="card-image">
                        <div>
                            {status !== Status.PENDING ?
                                <img
                                    style={{
                                        filter: isAnswerDisplayed ? "brightness(1)" : "brightness(0)",
                                        transition: isAnswerDisplayed ? '0.5s' : '0s'
                                    }}
                                    onClick={ev => ev.preventDefault()}
                                    src={require(`assets/imgs/pkmn/${pokemon.number ?? 1}.png`).default}
                                    alt="pokemon"
                                    data-test-id="image-pkmn"
                                /> :
                                <PokeLoader />
                            }
                        </div>
                    </div>
                    <div className="card-content">
                        <h1 className="title has-text-centered">
                            <span>
                                {isAnswerDisplayed ?
                                    <><span data-test-id="answer-text" data-test-cypress="pkmn-answer">{pokemon?.name?.[settings?.lang]}</span> - N°<span>{pokemon.number}</span></> :
                                    <>&nbsp;</>
                                }
                            </span>
                        </h1>
                        <br />
                        {isGameRunning &&
                            <progress
                                className={classNames(
                                    "progress",
                                    { "is-primary": secondsLeft >= TIME_MAX / 100 * 20 },
                                    { "is-warning": secondsLeft < TIME_MAX / 100 * 20 },
                                    { "is-danger": secondsLeft < TIME_MAX / 100 * 10 }
                                )}
                                value={secondsLeft}
                                max={TIME_MAX}
                            >
                                {secondsLeft} sec
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
                                            value={value}
                                            onChange={ev => setValue(ev.target.value)}
                                            data-test-id="input-pkmn-name"
                                            data-test-cypress="pkmn-name"
                                            disabled={status === Status.PENDING}
                                            ref={inputRef}
                                        />
                                        <p className="help" data-test-id="message-pkmn-name">
                                            {message.length > 0 ? message : <>&nbsp;</>}
                                        </p>
                                    </form>
                                </div>
                                <div className="control">
                                    <button
                                        className="button is-success is-outlined"
                                        onClick={() => check()}
                                        data-test-id="check-button"
                                        data-test-cypress="check"
                                        disabled={status === Status.PENDING}
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
                                disabled={status === Status.PENDING}
                                data-test-cypress="refresh"
                            >
                                <span className="icon">
                                    <FontAwesomeIcon icon={faSync} />
                                </span>
                                <span>Refresh</span>
                            </button>
                            <button
                                className="button is-info"
                                onClick={() => showResponse()}
                                disabled={status === Status.PENDING || isGameRunning}
                                data-test-id="answer-button"
                                data-test-cypress="answer"
                            >
                                <span className="icon">
                                    <FontAwesomeIcon icon={faEye} />
                                </span>
                                <span>Answer</span>
                            </button>
                            <button
                                className="button is-link"
                                onClick={() => setModalSettings(currentModalSettings => ({ ...currentModalSettings, isDisplay: true }))}
                                disabled={status === Status.PENDING || isGameRunning}
                                data-test-cypress="settings"
                            >
                                <span className="icon">
                                    <FontAwesomeIcon icon={faCog} />
                                </span>
                                <span>Settings</span>
                            </button>
                            {!isGameRunning ?
                                <button
                                    className="button is-success"
                                    onClick={() => play()}
                                    data-test-id="play-timer-button"
                                    disabled={status === Status.PENDING}
                                    data-test-cypress="play"
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
                                    disabled={status === Status.PENDING}
                                    data-test-cypress="stop"
                                >
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faStop} />
                                    </span>
                                    <span>Stop</span>
                                </button>
                            }
                            <button
                                className="button is-light"
                                onClick={() => showHighScore()}
                                disabled={status === Status.PENDING || isGameRunning}
                                data-test-cypress="scores"
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

            <Modal
                isDisplay={modalSettings.isDisplay}
                onClickYes={() => setModalSettings(currentModalSettings => ({ ...currentModalSettings, isDisplay: false }))}
                title="Settings"
                validateText="Ok"
            >
                <p className="subtitle has-text-centered is-5">Generations :</p>
                <div className="flex-row flex-space-around">
                    {Object.keys(GENERATIONS).map((x, i) => (
                        <label
                            className="checkbox"
                            key={`lang_${i}`}
                        >
                            <input
                                type="checkbox"
                                defaultChecked={settings.generations.indexOf(GENERATIONS[x]) > -1}
                                onChange={ev => setSettings(currentSettings => {
                                    if (ev.target.checked) {
                                        currentSettings.generations.push(GENERATIONS[x])
                                    } else {
                                        currentSettings.generations = currentSettings.generations.filter(y => y !== GENERATIONS[x])
                                    }
                                    return { ...currentSettings }
                                })}
                            />
                            Gen. {GENERATIONS[x]}
                        </label>
                    ))}
                </div>
                <br />
                <br />
                <p className="subtitle has-text-centered is-5">Lang :</p>
                <div className="flex-row flex-space-around">
                    {Object.keys(LANGS).map((x, i) => (
                        <label
                            className="radio"
                            key={`generation_${i}`}
                        >
                            <input
                                type="radio"
                                name="lang"
                                defaultChecked={settings.lang === x}
                                onChange={ev => {
                                    setSettings(settings => {
                                        settings.lang = x
                                        return { ...settings }
                                    })
                                }}
                            />
                            {LANGS[x]}
                        </label>
                    ))}
                </div>
            </Modal>

            <Modal
                isDisplay={modalHighScores.isDisplay}
                onClickYes={() => setModalHighScores({ isDisplay: false })}
                // onClickNo={modalHighScores.onClickNo}
                title="Highscores"
                validateText="Ok"
            >
                <table className="table is-fullwidth">
                    <thead>
                        <tr>
                            <th>Position</th>
                            <th>Nom</th>
                            <th>Date</th>
                            <th>Score</th>
                            <th>Generations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {highscores.map((x, i) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{x.user?.username}</td>
                                <td>{(() => {
                                    try {
                                        return new Date(x?.createdAt)?.toISOString()?.split('T')?.[0]
                                    } catch (error) {
                                        return null
                                    }
                                })()}</td>
                                <td>{x.score}</td>
                                <td>{x.generations.join(', ')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Modal>

            <Modal
                isDisplay={modal.isDisplay}
                onClickYes={modal.onClickYes}
                onClickNo={modal.onClickNo}
                title={modal.title}
                validateText={modal.validateText}
            >
                {modal.children}
            </Modal>
        </>
    )
}
