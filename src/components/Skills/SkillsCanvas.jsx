import MatterCanvas from '../../utilities/matter-react-utils/MatterCanvas';
import MatterBody from '../../utilities/matter-react-utils/MatterBody';
import MatterOverlay from'../../utilities/matter-react-utils/MatterOverlay';
import MatterOverlayDriver from '../../utilities/matter-react-utils/MatterOverlayDriver';
import MatterOverlayPassenger from '../../utilities/matter-react-utils/MatterOverlayPassenger';
import MatterAttractor from '../../utilities/matter-react-utils/MatterAttractor';

import SkillCircle from './SkillCircle';
import SkillHeader from './SkillHeader';

import style from '../../styles/components/SkillsCanvas.module.css';


import autocadLogo from '../../assets/icons/autocad.svg';
import comsolLogo from '../../assets/icons/comsol.png';
import matlabLogo from '../../assets/icons/matlab.png';
import solidworksLogo from '../../assets/icons/solidworks.png';

import unityLogo from '../../assets/icons/unity.svg'
import matterLogo from '../../assets/icons/matterJS.svg';

import htmlLogo from '../../assets/icons/html.svg';
import cssLogo from '../../assets/icons/css.svg';
import jsLogo from '../../assets/icons/javascript.svg';
import mongoLogo from '../../assets/icons/mongoDB.svg';
import nodeLogo from '../../assets/icons/nodeJS.svg';
import postgresLogo from '../../assets/icons/postgreSQL.svg';

import solderLogo from '../../assets/icons/soldering.png';
import instrumentLogo from '../../assets/icons/instrumentation.png';
import printingLogo from '../../assets/icons/3d-printing.png';

import { useRef } from 'react';

// TODO: Skills will be arranged in this structure:
/*
---WEB DEV
- HTML, CSS, JS, REACT, EXPRESS, NODE, MONGO, POSTGRESQL, GIT

-GAME PROGAMMING
-UNITY (C#), matterJS?

---ENGINEERING DESIGN
AUTOCAD, SOLIDWORKS, MATLAB, COMSOL

----HANDS ON
-SCIENTIFIC INSTRUMENT OPERATION AND TROUBLESHOOTING, ELECTRONIC COMPONENT REPAIR, ADDITIVE MANUFACTURING DESIGN AND OPERATION

---HOBBIES
-ROCKCLIMBING, SNOWBOARDING, VIDEOGAMES, BOARD GAMES, ANIME

*/

// Headings will become static rigid bodies that will become linked to HTML elements above the canvas. 
// If the HTML element moves because of flex or resizing, the rigid body moves as well
// Purpose of this is so that it is accessible.
// Or maybe isntead have accessible only html elements that are hidden from normal DOM?

// Skills inside will become free floating rigid body elements inside the canvas, also linked to an HTML element, but instead it has position: absolute.

//TODO: Size of hexagons will resize to fit canvas -> Canvas will resize to fit page due to its styling
//TODO: Clicking and dragging the headings will momentarily change them to position:absolute and remove them from the default flow?
export default function SkillsCanvas(){


    const engineParams = {
      backgroundColor: 'transparent',
      engineOptions: {
        gravity: { y: 0}
      }
    }

    const driverBodyParams = {
      bodyType: 'circle',
      bodyParams: {
        options: { isStatic: true, render: {visible: true, fillStyle: '#444', }}
      },
    }

    const passengerBodyParams = {
      bodyType: 'circle',
      bodyParams: {
        scaleOnResize: false,
        normalized:{
          pos: {
            get x(){ return Math.random() },
            get y(){ return Math.random() }
          },
        },
        radius: 25,
        options: { isStatic: false, render: {visible: true, fillStyle: '#444'}}
      }, 
    }

    return (
      <MatterCanvas {...engineParams}>
        <MatterOverlay className={style.overlayWhat} elementHTML={(<ul className={style.listReset}></ul>)}>{/*----------------------------------------------------------------------------- */}
            <li>
              <SkillHeader text='/dev/' attractorID='1' className={style.skillHeading} matterBodyParams={driverBodyParams} />
              <ul className={style.flexIgnore}>
              <SkillCircle link='https://developer.mozilla.org/en-US/docs/Web/HTML' imageSRC={htmlLogo} attractorID='1' MatterBodyParams={passengerBodyParams} className={style.listItem} />
              <SkillCircle link='https://developer.mozilla.org/en-US/docs/Web/CSS' imageSRC={cssLogo} attractorID='1' MatterBodyParams={passengerBodyParams} className={style.listItem} />
              <SkillCircle link='https://www.javascript.com/' imageSRC={jsLogo} attractorID='1' MatterBodyParams={passengerBodyParams} className={style.listItem} />
              <SkillCircle link='https://www.mongodb.com/' imageSRC={mongoLogo} attractorID='1' MatterBodyParams={passengerBodyParams} className={style.listItem} />
              <SkillCircle link='https://nodejs.org/' imageSRC={nodeLogo} attractorID='1' MatterBodyParams={passengerBodyParams} className={style.listItem} />
              <SkillCircle link='https://www.postgresql.org/' imageSRC={postgresLogo} attractorID='1' MatterBodyParams={passengerBodyParams} className={style.listItem} />
              </ul>
            </li>
            <li>
              <SkillHeader text='/eng/' attractorID='2' className={style.skillHeading} matterBodyParams={driverBodyParams} />
              <ul className={style.flexIgnore}>
              <SkillCircle link='https://www.autodesk.com/products/autocad/' imageSRC={autocadLogo} attractorID='2' MatterBodyParams={passengerBodyParams} className={style.listItem} />
              <SkillCircle link='https://www.comsol.com/' imageSRC={comsolLogo} attractorID='2' MatterBodyParams={passengerBodyParams} className={style.listItem} />
              <SkillCircle link='https://www.mathworks.com/products/matlab.html' imageSRC={matlabLogo} attractorID='2' MatterBodyParams={passengerBodyParams} className={style.listItem} />
              <SkillCircle link='https://www.solidworks.com/' imageSRC={solidworksLogo} attractorID='2' MatterBodyParams={passengerBodyParams} className={style.listItem} />
              </ul>
            </li>
            <li>
              <SkillHeader text='/game/' attractorID='3' className={style.skillHeading} matterBodyParams={driverBodyParams} />
              <ul className={style.flexIgnore}>
              <SkillCircle link='https://unity.com/' imageSRC={unityLogo} attractorID='3' MatterBodyParams={passengerBodyParams} className={style.listItem} />
              <SkillCircle link='https://brm.io/matter-js/' imageSRC={matterLogo} attractorID='3' MatterBodyParams={passengerBodyParams} className={style.listItem} />
              </ul>
            </li>
            <li>
              <SkillHeader text='/etc/' attractorID='4' className={style.skillHeading} matterBodyParams={driverBodyParams} />
              <ul className={style.flexIgnore}>
              <SkillCircle imageSRC={solderLogo} attractorID='4' MatterBodyParams={passengerBodyParams} className={style.listItem} />
              <SkillCircle imageSRC={instrumentLogo} attractorID='4' MatterBodyParams={passengerBodyParams} className={style.listItem} />
              <SkillCircle imageSRC={printingLogo} attractorID='4' MatterBodyParams={passengerBodyParams} className={style.listItem} />
              </ul>
            </li>
        </MatterOverlay>{/*----------------------------------------------------------------------------- */}
      </MatterCanvas>
    )
}


// import solderLogo from '../../assets/icons/soldering.png';
// import instrumentLogo from '../../assets/icons/instrumentation.png';
// import printingLogo from '../../assets/icons/3d-printing.png';