import style from '../styles/routes/portfolio.module.css'
import CardCarousel from '../components/CardCarousel'

import Loader from '../components/Loading/Loader'
import LoadScreen from '../components/Loading/LoadScreen'

import { useState } from 'react'


export default function Portfolio(){

    const [loaded, setLoaded] = useState(false);

    return (
        <LoadScreen isLoaded={loaded}>
            <Loader onLoadHandler={()=>setLoaded(true)}>
                <div className={style.container}>
                    <CardCarousel />
                </div>
            </Loader>
        </LoadScreen>
    )
}