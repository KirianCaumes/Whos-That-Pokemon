const { populatedb } = require("./populatedb");

(async () => {
    await populatedb()
    process.exit(0)
})()