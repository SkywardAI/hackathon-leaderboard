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
            <div className="fixed-title">
                <div className="title-bar">
                    <img src="/RMIT.jpg" className="icon" draggable={false} />
                    <h1>RMIT Hackathon Leaderboard</h1>
                </div>
                <div className="column-title-container">
                    <div className="column-title">
                        <div className="name">Participant Name</div>
                        <div className="score">Score</div>
                        <div className="group">Group Name</div>
                    </div>
                </div>
            </div>
            <div className="participants">
            {
                leaders.map(({name, score, group}, index)=>{
                    return (
                        <div className="participant" key={`leader-${index}`}>
                            <div className="name" title={name}>{name}</div>
                            <div className="score" title={score}>{score}</div>
                            <div className="group" title={group}>{group}</div>
                        </div>
                    )
                })
            }
            </div>
            <div className="declaimer">
                <div className="copyright">2024 &copy; SkywardAI</div>
                <div>This leaderboard doesn't represent the final score. Scores are not updated at real time. The final right of interpretation belongs to SkywardAI and RMIT University.</div>
            </div>
        </div>
    )
}