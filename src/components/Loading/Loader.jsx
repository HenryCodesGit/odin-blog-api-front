import { useEffect } from "react";

export default function Loader({onLoadHandler, children}){

    useEffect(()=>{
        onLoadHandler()
    },[onLoadHandler]);

    return children;
}