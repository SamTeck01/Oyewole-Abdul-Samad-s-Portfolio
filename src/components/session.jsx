import { useParams } from "react-router-dom";
import '../App.css'
import {getSession} from '../api.js'
const Session=()=>{

    const {catId, sessionId} = useParams();
    const {name, desc, speaker} = getSession(sessionId, catId);

    return(
        <>
            <div>
                <h3>{name}</h3>
                <p>{desc}</p>

                <h4 className="text-grey fs-4">{speaker.name}</h4>
                <span>{speaker.title} at {speaker.org} </span>
                <p>{speaker.bio}</p>
            </div>
            
        </>
    )
}

export default Session;