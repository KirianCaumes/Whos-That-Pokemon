import React from 'react'
import ReactDOM from 'react-dom'
import 'styles/index.scss'
import App from 'App'
import { Provider } from 'react-redux'
import store from 'redux/store'
import { makeServer } from './server'
import { ApiClient, ApiProvider } from 'jsonapi-react'

if (process.env.NODE_ENV === 'development')
    makeServer({ environment: process.env.NODE_ENV })

const client = new ApiClient({
    url: '/api',
    schema: {
        users: {
            type: "users",
            fields: {
                name: {
                    type: "string"
                },
                password: {
                    type: "string"
                },
                token: {
                    type: "string"
                },
            },
            relationships: {
                highscores: {
                    type: "array",
                    items: {
                        type: "highscores"
                    }
                }
            }
        },
        highscores: {
            type: "highscores",
            fields: {
                score: {
                    type: "number"
                },
                generations: {
                    type: "array",
                    items: {
                        type: "number"
                    }
                }
            }
        },
        pokemons: {
            type: "pokemons",
            fields: {
                number: {
                    type: "number"
                },
                name: {
                    type: "object"
                },
                generation: {
                    type: "number"
                },
            }
        }
    }

})

ReactDOM.render(
    <ApiProvider client={client}>
        <Provider store={store}>
            {/* @ts-ignore */}
            <App />
        </Provider>
    </ApiProvider>,
    document.getElementById('root')
)