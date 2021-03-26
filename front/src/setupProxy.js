const { createProxyMiddleware } = require('http-proxy-middleware')

/**
 * Create proxy for redirect API call in API Url (⚠️ DEV ONLY)
 */
module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:5000',
            secure: false,
            changeOrigin: true,
        })
    )
}