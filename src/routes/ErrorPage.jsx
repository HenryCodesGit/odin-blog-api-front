import Loader from "../components/Loading/Loader"
import LoadScreen from "../components/Loading/LoadScreen"

import { useState } from "react"

export default function ErrorPage(){
    const [loaded, setLoaded] = useState(false);
    return (
        <LoadScreen isLoaded={loaded}>
            <Loader onLoadHandler={()=>{setLoaded(true)}}>
                <div> Something went wrong </div>
            </Loader>
        </LoadScreen>
    )
}