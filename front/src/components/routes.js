import { ReactComponentElement, JSXElementConstructor } from "react" //eslint-disable-line
import React from "react"
import { Redirect, Route } from 'react-router-dom'
import { RouteProps } from 'react-router-dom' //eslint-disable-line
import { ConnectedComponent } from "react-redux" //eslint-disable-line

/**
 * @typedef {object} _PrivateRouteProps
 * @property {boolean} isAuthenticated Is user authentificated
 * @property {ReactComponentElement | ConnectedComponent<any, any> | JSXElementConstructor<any>} component Component to render
 * 
 * @typedef {_PrivateRouteProps & RouteProps} PrivateRouteProps
 */

/**
 * Component for private route when we need to be authentified
 * @param {PrivateRouteProps} props 
 */
export const PrivateRoute = (props) => {
	return (
		<Route
			{...{ ...props, component: undefined }}
			render={routeProps =>
				props.isAuthenticated ?
					<props.component {...routeProps} />
					:
					<Redirect
						to={{
							pathname: '/login',
							state: { from: props.location }
						}}
					/>
			}
		/>
	)
}


/**
 * @typedef {object} _PublicRouteProps
 * @property {ReactComponentElement | ConnectedComponent<any, any>} component Component to render
 * 
 * @typedef {_PublicRouteProps & RouteProps} PublicRouteProps
 */

/**
 * Component for private route when we need to be authentified
 * @param {PublicRouteProps} props 
 */
export const PublicRoute = (props) => {
	return (
		<Route {...props} />
	)
}