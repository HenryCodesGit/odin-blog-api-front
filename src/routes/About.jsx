// React
import { useEffect, useState, useRef } from 'react'
// Matter React Utilities
import MatterCanvas from "../utilities/matter-react-utils/MatterCanvas"
import MatterOverlay from '../utilities/matter-react-utils/MatterOverlay';
import MatterGravityMouse from '../utilities/matter-react-utils/MatterGravityMouse'
// Components
import LoadScreen from '../components/Loading/LoadScreen';
import Loader from '../components/OLD/Loading/Loader';
import SkillCategory from '../components/About/SkillCategory'
import SkillItem from '../components/About/SkillItem'
import SkillModal from '../components/About/SkillModal';
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
    const modalRef = useRef();
    
    const [canvasParams, setCanvasParams] = useState()
    const [loaded, setLoaded] = useState(false);

    useEffect(()=>{
        setCanvasParams({
            backgroundColor: 'transparent',
            engineOptions: {
              gravity: { y : 0 },
              enableSleeping: true
            },
            setEngineHandler: setEngine
        });
    },[])

    if(!canvasParams) return null;

    //TODO: Pull the list out into an array. Iterate and generate the list dynamically
    //Store data somewhere else?
    return (
    <>
    <LoadScreen isLoaded={loaded}>
      <Loader onLoadHandler={()=>setLoaded(true)}>
        <SkillModal ref={modalRef} />
        <MatterCanvas {...canvasParams}>
            <MatterGravityMouse attractorID={['dev','eng','fun','etc']} isSensor={false}/>
            <MatterOverlay className={style.overlay} elementHTML={<div></div>}>
            <ul className={style.skill}>
                <li className={style.skillHeading}>
                    <SkillCategory attractorID={['dev']} text='/dev/'/>
                    <ul className={style.skillList}>
                        <li className={style.skillItem}>
                            <SkillItem 
                                imageSRC={htmlLogo} 
                                attractorID='dev' 
                                skillInfo={
                                    {
                                        title: 'HTML', 
                                        length: 'since December 2023', 
                                        description: (<>Learned through personal projects and <a href="https://www.theodinproject.com/">The Odin Project</a>&nbsp;course offerings</>),
                                        link: 'https://developer.mozilla.org/en-US/docs/Web/HTML'
                                    }
                                }
                                onClickHandler={(data)=>modalRef.current.showModal(data)}
                            />
                        </li>
                        <li className={style.skillItem}>
                            <SkillItem 
                                imageSRC={cssLogo} 
                                attractorID='dev' 
                                skillInfo={
                                    {
                                        title: 'CSS', 
                                        length: 'since December 2023', 
                                        description: (<>Learned through personal projects and <a href="https://www.theodinproject.com/">The Odin Project</a>&nbsp;course offerings</>),
                                        link: 'https://developer.mozilla.org/en-US/docs/Web/CSS'
                                    }
                                }
                                onClickHandler={(data)=>modalRef.current.showModal(data)}
                            />
                        </li>
                        <li className={style.skillItem}>
                            <SkillItem 
                                imageSRC={jsLogo} 
                                attractorID='dev' 
                                skillInfo={
                                    {
                                        title: 'Javascript', 
                                        length: 'since December 2023', 
                                        description: (<>Learned through personal projects and <a href="https://www.theodinproject.com/">The Odin Project</a>&nbsp;course offerings</>),
                                        link: 'https://www.javascript.com/'
                                    }
                                }
                                onClickHandler={(data)=>modalRef.current.showModal(data)}
                            />
                        </li>
                        <li className={style.skillItem}>
                            <SkillItem 
                                imageSRC={mongoLogo} 
                                attractorID='dev' 
                                skillInfo={
                                    {
                                        title: 'MongoDB', 
                                        length: 'since December 2023', 
                                        description: (<>Learned through <a href="https://www.theodinproject.com/">The Odin Project</a>&nbsp;course offerings</>),
                                        link: 'https://www.mongodb.com/'
                                    }
                                }
                                onClickHandler={(data)=>modalRef.current.showModal(data)}
                            />
                        </li>
                        <li className={style.skillItem}>
                            <SkillItem 
                                imageSRC={nodeLogo} 
                                attractorID='dev' 
                                skillInfo={
                                    {
                                        title: 'NodeJS', 
                                        length: 'since December 2023', 
                                        description: (<>Learned through <a href="https://www.theodinproject.com/">The Odin Project</a>&nbsp;course offerings</>),
                                        link: 'https://nodejs.org/'
                                    }
                                }
                                onClickHandler={(data)=>modalRef.current.showModal(data)}
                            />
                        </li>
                        <li className={style.skillItem}>
                            <SkillItem 
                                imageSRC={postgresLogo} 
                                attractorID='dev' 
                                skillInfo={
                                    {
                                        title: 'PostgreSQL', 
                                        length: 'since December 2023', 
                                        description: (<>Learned through personal projects</>),
                                        link: 'https://www.postgresql.org/'
                                    }
                                }
                                onClickHandler={(data)=>modalRef.current.showModal(data)}
                            />
                        </li>
                    </ul>
                </li>
                <li className={style.skillHeading}>
                    <SkillCategory attractorID={['eng']} text='/eng/'/>
                    <ul className={style.skillList}>
                        <li className={style.skillItem}>
                            <SkillItem 
                                imageSRC={autocadLogo} 
                                attractorID='eng' 
                                skillInfo={
                                    {
                                        title: 'AutoCAD', 
                                        length: 'since 2009', 
                                        description: (<>Learned through professional work experience, co-op work placements, schooling, and personal projects for engineering design and project management</>),
                                        link: 'https://www.autodesk.com/products/autocad/'
                                    }
                                }
                                onClickHandler={(data)=>modalRef.current.showModal(data)}
                            />
                        </li>
                        <li className={style.skillItem}>
                            <SkillItem 
                                imageSRC={comsolLogo} 
                                attractorID='eng' 
                                skillInfo={
                                    {
                                        title: 'COMSOL Multiphysics', 
                                        length: 'since 2015', 
                                        description: (<>Learned through schooling and applied to Master&apos;s thesis work for simulating the laser powder bed fusion process</>),
                                        link: 'https://www.comsol.com/'
                                    }
                                }
                                onClickHandler={(data)=>modalRef.current.showModal(data)}
                            />
                        </li>
                        <li className={style.skillItem}>
                            <SkillItem 
                                imageSRC={matlabLogo} 
                                attractorID='eng' 
                                skillInfo={
                                    {
                                        title: 'MATLAB', 
                                        length: 'since 2011', 
                                        description: (<>Learned through schooling, and applied to Master{`'`}s thesis work for processing large image datasets and performing statistical analysis</>),
                                        link: 'https://www.mathworks.com/products/matlab.html'
                                    }
                                }
                                onClickHandler={(data)=>modalRef.current.showModal(data)}
                            />
                        </li>
                        <li className={style.skillItem}>
                            <SkillItem 
                                imageSRC={solidworksLogo} 
                                attractorID='eng' 
                                skillInfo={
                                    {
                                        title: 'Solidworks', 
                                        length: 'since 2009', 
                                        description: (<>Learned through professional work experience, co-op work placements, schooling, and personal projects for engineering design work</>),
                                        link: 'https://www.solidworks.com'
                                    }
                                }
                                onClickHandler={(data)=>modalRef.current.showModal(data)}
                            />
                        </li>
                    </ul>
                </li>
                <li className={style.skillHeading}>
                    <SkillCategory attractorID={['fun']} text='/fun/'/>
                    <ul className={style.skillList}>
                        <li className={style.skillItem}>
                            <SkillItem 
                                imageSRC={unityLogo} 
                                attractorID='fun' 
                                skillInfo={
                                    {
                                        title: 'Unity Game Engine', 
                                        length: 'since 2018', 
                                        description: (<>Learned through personal projects for hobby game development</>),
                                        link: 'https://unity.com/'
                                    }
                                }
                                onClickHandler={(data)=>modalRef.current.showModal(data)}
                            />
                        </li>
                        <li className={style.skillItem}>
                            <SkillItem 
                                imageSRC={matterLogo} 
                                attractorID='fun' 
                                skillInfo={
                                    {
                                        title: 'MatterJS Physics Engine', 
                                        length: 'since 2024', 
                                        description: (<>First implemented into personal project {'('}this website!{')'}, with further applications into hobby projects TBD.</>),
                                        link: 'https://brm.io/matter-js/'
                                    }
                                }
                                onClickHandler={(data)=>modalRef.current.showModal(data)}
                            />
                        </li>
                    </ul>
                </li>
                <li className={style.skillHeading}>
                    <SkillCategory attractorID={['etc']} text='/etc/'/>
                    <ul className={style.skillList}>
                        <li className={style.skillItem}>
                            <SkillItem 
                                imageSRC={solderLogo} 
                                attractorID='etc' 
                                skillInfo={
                                    {
                                        title: 'Soldering and Electronic PCB Repair', 
                                        length: 'since 2011', 
                                        description: (<>Learned as part of personal hobby of repairing old electronic devices</>),
                                        link: 'https://en.wikipedia.org/wiki/Rework_(electronics)'
                                    }
                                }
                                onClickHandler={(data)=>modalRef.current.showModal(data)}
                            />
                        </li>
                        <li className={style.skillItem}>
                            <SkillItem 
                                imageSRC={printingLogo} 
                                attractorID='etc' 
                                skillInfo={
                                    {
                                        title: 'Additive Manufacturing (3D Printing)', 
                                        length: 'since 2014', 
                                        description: (<>Learned through professional work experience, Master{`'`}s thesis work, co-op work placements, and personal projects</>),
                                        link: 'https://en.wikipedia.org/wiki/3D_printing'
                                    }
                                }
                                onClickHandler={(data)=>modalRef.current.showModal(data)}
                            />
                        </li>
                    </ul>
                </li>
            </ul>
            </MatterOverlay>
        </MatterCanvas>
      </Loader>
    </ LoadScreen>
    </>);
}