import React, { useMemo } from "react"

const choices = ["normal", "great", "ultra", "master", "safari"]

export default function PokeLoader() {
    const choice = useMemo(() => choices[Math.floor(Math.random() * Math.floor(choices.length))], [])

    return (
        <div
            className="app-pokeloader"
            data-choice={choice}
        />
    )
}