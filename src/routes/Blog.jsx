import Loader from "../components/Loading/Loader"
import LoadScreen from "../components/Loading/LoadScreen"
import { Outlet } from "react-router-dom";

import { useState } from "react"

export default function Blog(){
    const [loaded, setLoaded] = useState(false);
    return (
        <LoadScreen isLoaded={loaded}>
            <Loader onLoadHandler={()=>{setLoaded(true)}}>
                <Outlet />
            </Loader>
        </LoadScreen>
    )
}