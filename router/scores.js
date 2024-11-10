const {Router} = require("express");
const { calculateLeadingTeam } = require("../utils");

function ScoresRouter() {
    const router = Router();
    router.get("/top/:top_n", async (req, res)=>{
        const top_n = +req.params.top_n
        if(isNaN(top_n)) {
            res.status(401).send("Top N is not a number!")
        } else {
            // query top n from database
            const scores = await calculateLeadingTeam();
            res.status(200).send(scores)
        }
    })
    return router;
}

module.exports = ScoresRouter;