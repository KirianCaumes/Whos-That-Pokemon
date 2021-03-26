import React from "react"
import { render, screen } from '@testing-library/react';
import App from '../app';
import { client } from '../index';
import { Provider } from "react-redux";
import store from "redux/store";
import { ApiProvider } from "jsonapi-react";

test('App mount', () => {
    render(
        <ApiProvider client={client}>
            <Provider store={store}>
                {/* @ts-ignore */}
                <App />
            </Provider>
        </ApiProvider>
    )
    const linkElement = screen
    expect(linkElement).toBeTruthy();
});
