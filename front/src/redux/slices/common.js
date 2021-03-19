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
 * 
 * Payload Modal
 * @typedef {object} PayloadModal
 * @property {boolean} show Is modal displayed
 * @property {string=} title Title
 * @property {string=} subTitle Subtitle
 * @property {function=} callback Callback when clicking "Yes" button
 * @property {ReactElement=} content JSX content
 */

/**
 * Common State
 * @typedef {object} CommonState
 * @property {string} selectedKeyURL Current URL in application
 * @property {object} modal Modal
 * @property {boolean} modal.show Is modal displayed
 * @property {string=} modal.title Title
 * @property {string=} modal.subTitle Subtitle
 * @property {function=} modal.callback Callback when clicking "Yes" button
 * @property {ReactElement=} modal.content JSX content
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
        modal: {
            show: false,
            title: '',
            subTitle: '',
            callback: () => null,
            content: <></>
        }
    },
    reducers: {
        /**
         * Set Current Url
         * @param {PayloadAction<PayloadUrl>} action
         */
        setUrl: (state, action) => {
            state.selectedKeyURL = action.payload
        },
        /**
         * Set Modal
         * @param {PayloadAction<PayloadModal>} action
         */
        setModal: (state, action) => {
            state.modal = action.payload
        },
    },
})

const { setUrl, setModal } = commonSlice.actions
const commonReducer = commonSlice.reducer

export {
    setUrl, setModal, //Reducers, used to call actions
    commonReducer, //All reducers, used to create store
    commonMiddleware //Middleware
}