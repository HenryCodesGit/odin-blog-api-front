// React
import { useState } from 'react'
// Matter React Utilities
import MatterCanvas from "../utilities/matter-react-utils/MatterCanvas"
import MatterOverlay from '../utilities/matter-react-utils/MatterOverlay';
import MatterGravityMouse from '../utilities/matter-react-utils/MatterGravityMouse'
// Components
import LoadScreen from '../components/Loading/LoadScreen';
import Loader from '../components/OLD/Loading/Loader';
import SkillCategory from '../components/About/SkillCategory'
import SkillItem from '../components/About/SkillItem'
// Styles
import style from '../styles/routes/about.module.css'
// Images
import autocadLogo from '../assets/icons/autocad.svg';
import comsolLogo from '../assets/icons/comsol.png';
import matlabLogo from '../assets/icons/matlab.png';
import solidworksLogo from '../assets/icons/solidworks.png';

import unityLogo from '../assets/icons/unity.svg'
import matterLogo from '../assets/icons/matterJS.svg';

import htmlLogo from '../assets/icons/html.svg';
import cssLogo from '../assets/icons/css.svg';
import jsLogo from '../assets/icons/javascript.svg';
import mongoLogo from '../assets/icons/mongoDB.svg';
import nodeLogo from '../assets/icons/nodeJS.svg';
import postgresLogo from '../assets/icons/postgreSQL.svg';

import solderLogo from '../assets/icons/soldering.png';
import instrumentLogo from '../assets/icons/instrumentation.png';
import printingLogo from '../assets/icons/3d-printing.png';

export default function About(){

    const [ engine, setEngine ] = useState();
    const [loaded, setLoaded] = useState(false);

    const canvasParams = {
        backgroundColor: 'transparent',
        engineOptions: {
          gravity: { y : 0 },
          enableSleeping: true
        },
        setEngineHandler: setEngine
      }

    return (
    <>
    <LoadScreen isLoaded={loaded}>
        <MatterCanvas {...canvasParams} onLoadHandler={()=>setLoaded(true)}>
            <MatterGravityMouse attractorID={['dev','eng','fun','etc']}/>
            <MatterOverlay className={style.overlay} elementHTML={<div></div>}>
            <ul className={style.skill}>
                <li className={style.skillHeading}>
                    <SkillCategory attractorID={['dev']} text='/dev/'/>
                    <ul className={style.skillList}>
                        <li className={style.skillItem}><SkillItem link='https://developer.mozilla.org/en-US/docs/Web/HTML' imageSRC={htmlLogo} attractorID='dev' /></li>
                        <li className={style.skillItem}><SkillItem link='https://developer.mozilla.org/en-US/docs/Web/CSS' imageSRC={cssLogo} attractorID='dev' /></li>
                        <li className={style.skillItem}><SkillItem link='https://www.javascript.com/' imageSRC={jsLogo} attractorID='dev' /></li>
                        <li className={style.skillItem}><SkillItem link='https://www.mongodb.com/' imageSRC={mongoLogo} attractorID='dev' /></li>
                        <li className={style.skillItem}><SkillItem link='https://nodejs.org/' imageSRC={nodeLogo} attractorID='dev' /></li>
                        <li className={style.skillItem}><SkillItem link='https://www.postgresql.org/' imageSRC={postgresLogo} attractorID='dev' /></li>
                    </ul>
                </li>
                <li className={style.skillHeading}>
                    <SkillCategory attractorID={['eng']} text='/eng/'/>
                    <ul className={style.skillList}>
                        <li className={style.skillItem}><SkillItem link='https://www.autodesk.com/products/autocad/' imageSRC={autocadLogo} attractorID='eng' /></li>
                        <li className={style.skillItem}><SkillItem link='https://www.comsol.com/' imageSRC={comsolLogo} attractorID='eng' /></li>
                        <li className={style.skillItem}><SkillItem link='https://www.mathworks.com/products/matlab.html' imageSRC={matlabLogo} attractorID='eng' /></li>
                        <li className={style.skillItem}><SkillItem link='https://www.solidworks.com/' imageSRC={solidworksLogo} attractorID='eng' /></li>
                    </ul>
                </li>
                <li className={style.skillHeading}>
                    <SkillCategory attractorID={['fun']} text='/fun/'/>
                    <ul className={style.skillList}>
                        <li className={style.skillItem}><SkillItem link='https://unity.com/' imageSRC={unityLogo} attractorID='fun' /></li>
                        <li className={style.skillItem}><SkillItem link='https://brm.io/matter-js/' imageSRC={matterLogo} attractorID='fun' /></li>
                    </ul>
                </li>
                <li className={style.skillHeading}>
                    <SkillCategory attractorID={['etc']} text='/etc/'/>
                    <ul className={style.skillList}>
                        <li className={style.skillItem}><SkillItem imageSRC={solderLogo} attractorID='etc' /></li>
                        <li className={style.skillItem}><SkillItem imageSRC={instrumentLogo} attractorID='etc' /></li>
                        <li className={style.skillItem}><SkillItem imageSRC={printingLogo} attractorID='etc' /></li>
                    </ul>
                </li>
            </ul>
            </MatterOverlay>
        </MatterCanvas>
    </ LoadScreen>
    </>);
}