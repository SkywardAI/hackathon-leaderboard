import { useEffect, useState } from "react"
import { getLeaders } from "./utils/requests"

export default function Home() {

    const [leaders, setLeaders] = useState([]);

    async function syncScore() {
        const top_10 = await getLeaders();
        setLeaders(top_10);
    }

    useEffect(()=>{
        syncScore();
    }, [])

    return (
        <div className="leader-board">
            <div className="title-bar">
                <img src="/RMIT.jpg" className="icon" draggable={false} />
                <h1>RMIT Hackthon Leaderboard</h1>
            </div>
            <div className="participants">
            {
                leaders.map(({name, score, group}, index)=>{
                    return (
                        <div className="participant" key={`leader-${index}`}>
                            <div className="name">{name}</div>
                            <div className="score">{score}</div>
                            <div className="group">{group}</div>
                        </div>
                    )
                })
            }
            </div>
        </div>
    )
}