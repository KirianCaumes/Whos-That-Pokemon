import React from 'react'
import ReactDOM from 'react-dom'
import 'styles/index.scss'
import App from 'app'
import { Provider } from 'react-redux'
import store from 'redux/store'
import { makeServer } from './server'
import { ApiClient, ApiProvider } from 'jsonapi-react'

console.log(process.env)
if (process.env.NODE_ENV === 'development')
    makeServer({ environment: process.env.NODE_ENV })

const client = new ApiClient({
    url: '/api',
    // headers: {
    //     "Authorization": `Bearer ${localStorage.getItem(`${process.env.REACT_APP_BASE_STORAGE_KEY}_token`)}`
    // },
    schema: {
        users: {
            type: "users",
            fields: {
                username: {
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