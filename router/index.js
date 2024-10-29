const {Router, static} = require("express")
const {join} = require("path");
const ScoresRouter = require("./scores");

function indexRouter(app) {
    app.use(static(join(__dirname, '..', 'dist')))

    const router = Router();

    router.get("*", (req, res)=>{
        res.redirect(join(__dirname, '..', 'dist', 'index.html'));
    })

    return router;
}

function createRouters(app) {
    app.use('/api/scores', ScoresRouter()); 
    app.use('/', indexRouter(app));
}

module.exports = createRouters