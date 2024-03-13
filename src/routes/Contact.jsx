import Loader from "../components/Loading/Loader"
import LoadScreen from "../components/Loading/LoadScreen"

import { useState } from "react"

export default function Contact(){
    const [loaded, setLoaded] = useState(false);
    return (
        <LoadScreen isLoaded={loaded}>
            <Loader onLoadHandler={()=>{setLoaded(true)}}>
                <div> TBD </div>
            </Loader>
        </LoadScreen>
    )
}