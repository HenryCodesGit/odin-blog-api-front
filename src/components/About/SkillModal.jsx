import { useEffect, useRef, useState } from "react"

import style from '../../styles/components/SkillModal.module.css'

export default function SkillModal(){

    const ref = useRef()

    useEffect(()=>{
    },[])

    return(
        <dialog className={style.modal} ref={ref}> Empty Dialog </dialog>
    )
}