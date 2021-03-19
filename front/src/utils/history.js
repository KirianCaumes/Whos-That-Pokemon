
//Component that allow you to navigates from anywhere, even in no react component
//Simply import 'history', and then : history.push({ pathname: '/something', arg1: "Blabla", arg2: "Blabla" })
import store from 'redux/store/index.js'
import { createBrowserHistory } from 'history'
import { setUrl } from '../redux/slices/common'

export const history = createBrowserHistory()
// @ts-ignore
history.pages = []

history.listen((location, action) => {
    // @ts-ignore
    history.pages.push(location.pathname)
    store.dispatch(setUrl(location.pathname))    
})