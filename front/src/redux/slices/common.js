import {
    getDefaultMiddleware,
    createSlice,
} from "@reduxjs/toolkit"

import { Middleware } from "redux" // eslint-disable-line
import { Slice, PayloadAction } from "@reduxjs/toolkit" // eslint-disable-line
import React, { ReactElement } from 'react' // eslint-disable-line

/**
 * Common middlewares, must have "getDefaultMiddleware"
 * @type {Middleware[]}
 */
const commonMiddleware = [
    ...getDefaultMiddleware()
]

/** 
 * Payload Url
 * @typedef {string} PayloadUrl Current Url
 */

/**
 * Common State
 * @typedef {object} CommonState
 * @property {string} selectedKeyURL Current URL in application
*/
/**
 * Common Slice
 * @type {Slice<CommonState>}
 */
const commonSlice = createSlice({
    name: "common",
    /** @type {CommonState} */
    initialState: {
        selectedKeyURL: '/',
    },
    reducers: {
        /**
         * Set Current Url
         * @param {PayloadAction<PayloadUrl>} action
         */
        setUrl: (state, action) => {
            state.selectedKeyURL = action.payload
        },
    },
})

const { setUrl } = commonSlice.actions
const commonReducer = commonSlice.reducer

export {
    setUrl, //Reducers, used to call actions
    commonReducer, //All reducers, used to create store
    commonMiddleware //Middleware
}