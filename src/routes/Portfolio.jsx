import style from '../styles/routes/portfolio.module.css'
import CardCarousel from '../components/CardCarousel'

import Loader from '../components/OLD/Loading/Loader'
import LoadScreen from '../components/Loading/LoadScreen'

import { useState } from 'react'


export default function Portfolio(){

    const [loaded, setLoaded] = useState(false);

    return (
        <LoadScreen isLoaded={loaded}>
                <div className={style.container}>
                    <CardCarousel />
                </div>
        </LoadScreen>
    )
}