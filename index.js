const express = require("express")
const app = express();

app.use(require("cors")())
app.use(require("body-parser").json())

require("./router")(app)

const PORT = 3000

app.listen(PORT, '0.0.0.0', ()=>{
    console.log(`App running on port ${PORT}`)
})