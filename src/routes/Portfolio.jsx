import style from '/src/styles/routes/portfolio.module.css'
import CardCarousel from '/src/components/Portfolio/CardCarousel'

import Loader from '/src/components/Loading/Loader'
import LoadScreen from '/src/components/Loading/LoadScreen'
import PortfolioModal from '../components/Portfolio/PortfolioModal'

import { useState } from 'react'


export default function Portfolio(){

    const [loaded, setLoaded] = useState(false);
    const [modalState, setModalState] = useState(false);

    return (
        <LoadScreen isLoaded={loaded} afterLoadHandler={()=>{setModalState(true)}}>
            <Loader onLoadHandler={()=>setLoaded(true)}>
                {/* <PortfolioModal modalVisible={modalState}/> */}
                <div className={style.container}>
                    <CardCarousel />
                </div>
            </Loader>
        </LoadScreen>
    )
}