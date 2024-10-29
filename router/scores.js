const {Router} = require("express")

function ScoresRouter() {
    const router = Router();
    router.get("/top/:top_n", (req, res)=>{
        const top_n = +req.params.top_n
        if(isNaN(top_n)) {
            res.status(401).send("Top N is not a number!")
        } else {
            // query top n from database
            res.status(200).send([
                { name: "Name 1", score: 100, group: "group 1" },
                { name: "Name 2", score: 99, group: "group 1" },
                { name: "Name 3", score: 70, group: "group 2" },
                { name: "Name 4", score: 70, group: "group 2" },
            ])
        }
    })
    return router;
}

module.exports = ScoresRouter;