import Loader from "../components/Loading/Loader"
import LoadScreen from "../components/Loading/LoadScreen"
import SkillModal from "../components/About/SkillModal";

import { useState } from "react"

export default function Blog(){
    const [loaded, setLoaded] = useState(false);
    return (
        <LoadScreen isLoaded={loaded}>
            <Loader onLoadHandler={()=>{setLoaded(true)}}>
                THere's nothing here yet
            </Loader>
        </LoadScreen>
    )
}