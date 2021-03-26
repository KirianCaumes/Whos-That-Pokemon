import {
    getDefaultMiddleware,
    createSlice,
} from "@reduxjs/toolkit"
import { Middleware } from "redux" // eslint-disable-line
import { Slice, PayloadAction } from "@reduxjs/toolkit" // eslint-disable-line

/**
 * User middlewares, must have "getDefaultMiddleware"
 * @type {Middleware[]}
 */
const userMiddleware = [
    ...getDefaultMiddleware()
]

/**
 * Payload SingIn
 * @typedef {string} PayloadSingIn Token
 */

/**
 * User State
 * @typedef {object} UserState
 * @property {boolean} isAuthenticated Is user authenticated
*/

/**
 * User Slice
 * @type {Slice<UserState>}
 */
const userSlice = createSlice({
    name: "user",
    /** @type {UserState} */
    initialState: {
        isAuthenticated: !!localStorage.getItem(`${process.env.REACT_APP_BASE_STORAGE_KEY}_token`),
    },
    reducers: {
        /**
         * Sign in
         * @param {PayloadAction<PayloadSingIn>} action
         */
        signIn: (state, action) => {
            localStorage.setItem(`${process.env.REACT_APP_BASE_STORAGE_KEY}_token`, action.payload)
            state.isAuthenticated = true
        },
        /**
         * Sign out
         * @param {PayloadAction} action
         */
        signOut: (state) => {
            localStorage.removeItem(`${process.env.REACT_APP_BASE_STORAGE_KEY}_token`)
            state.isAuthenticated = false
        }
    },
})

const { signIn, signOut } = userSlice.actions
const userReducer = userSlice.reducer

export {
    signIn, signOut, //Reducers, used to call actions
    userReducer, //All reducers, used to create store
    userMiddleware //Middleware
}