import React from 'react'
import { connect } from "react-redux"
import { Switch, Router } from 'react-router-dom'
import { PrivateRoute, PublicRoute } from 'components/routes'
import { history } from 'utils/history'
import { signIn, signOut } from 'redux/slices/user'
import { setModal, setUrl } from 'redux/slices/common'
import { RouteChildrenProps } from 'react-router-dom'// eslint-disable-line
import { PayloadSingIn, UserState } from 'redux/slices/user'// eslint-disable-line
import { PayloadUrl, PayloadModal, CommonState } from 'redux/slices/common'// eslint-disable-line
import Login from 'pages/login'
import Register from 'pages/register'
import Index from 'pages'

/**
 * Global components props
 * @typedef {ReduxProps & RouteChildrenProps} AppProps
 */

/**
 * @typedef {object} ReduxProps
 * @property {function(PayloadSingIn):void} signIn Sign in
 * @property {function():void} signOut Sign out
 * @property {function(PayloadModal):void} setModal Set Modal
 * @property {function(PayloadUrl):void} setUrl Set Current Url
 * 
 * @property {UserState["isAuthenticated"]} isAuthenticated Is user authenticated
 * @property {CommonState["selectedKeyURL"]} selectedKeyURL Current URL in application
 * @property {CommonState["modal"]} modal Modal
 */

const mapDispatchToProps = dispatch => ({
    signIn: token => dispatch(signIn(token)),
    signOut: () => dispatch(signOut(undefined)),

    setModal: ({ show, title, subTitle, callback, content }) => dispatch(setModal({ show, title, subTitle, callback, content })),
    setUrl: selectedKeyURL => dispatch(setUrl(selectedKeyURL)),
})

const mapStateToProps = state => ({
    isAuthenticated: state.user.isAuthenticated,
    selectedKeyURL: state.common.selectedKeyURL,
    modal: state.common.modal
})

// const AppModal = connect(mapStateToProps, mapDispatchToProps)(Modal)//TODO

const _Login = connect(mapStateToProps, mapDispatchToProps)(Login)
const _Register = connect(mapStateToProps, mapDispatchToProps)(Register)
const _Index = connect(mapStateToProps, mapDispatchToProps)(Index)

/**
 * @param {AppProps} Props
 */
function _App({ isAuthenticated }) {
    return (
        <>
            <Router history={history}>
                <Switch>
                    <PrivateRoute
                        exact
                        path="/"
                        component={_Index}
                        isAuthenticated={isAuthenticated}
                    />
                    <PublicRoute
                        path="/login"
                        component={_Login}
                    />
                    <PublicRoute
                        path="/register"
                        component={_Register}
                    />
                    {/* {isAuthenticated ?
                        <PublicRoute 
                        component={() => <p>Not found</p>} 
                        /> :
                        <Redirect
                            to={{
                                pathname: '/login',
                                state: { from: props.location }
                            }}
                        />} */}
                </Switch>
            </Router>
        </>
    )
}

const App = connect(mapStateToProps, mapDispatchToProps)(_App)

export default App
