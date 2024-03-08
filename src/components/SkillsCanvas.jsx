import MatterCanvas from '../utilities/matter-react-utils/MatterCanvas';
import MatterBody from '../utilities/matter-react-utils/MatterBody';
import MatterOverlay from'../utilities/matter-react-utils/MatterOverlay';
import MatterOverlayDriver from '../utilities/matter-react-utils/MatterOverlayDriver';
import MatterOverlayPassenger from '../utilities/matter-react-utils/MatterOverlayPassenger';
import MatterAttractor from '../utilities/matter-react-utils/MatterAttractor';

import style from '../styles/components/SkillsCanvas.module.css'

import image from '../assets/icons/matter-logo.svg'

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

    const driverParams = {
      elementHTML: (<button>Example skill here later</button>)
    }

    const driverBodyParams = {
      bodyType: 'rectangle',
      bodyParams: {
        options: { isStatic: true}
      },
    }

    const passengerParams = {
      elementHTML: (<a className={style.floatingCircle} href="https://google.ca"><img src={image}/></a>)
    }

    const passengerBodyParams = {
      bodyType: 'circle',
      bodyParams: {
        scaleOnResize: false,
        normalized:{
          pos: {x: Math.random(), y: Math.random()},
        },
        radius: 50,
        options: { isStatic: false, render: {visible: false}}
      }, 
    }

    return (
      <MatterCanvas {...engineParams}>
        <MatterOverlay>
          <MatterOverlayDriver {...driverParams}>
            <MatterAttractor attractorID='1' isMain={true}  constraintOptions={{render: {visible: true}}}>
              <MatterBody {...driverBodyParams} />
            </MatterAttractor>
          </MatterOverlayDriver>
          <MatterOverlayPassenger {...passengerParams}>
            <MatterAttractor attractorID='1' isMain={false} constraintOptions={{render: {visible: true}}}>
              <MatterBody {...passengerBodyParams}/>
            </MatterAttractor>
          </MatterOverlayPassenger>
        </MatterOverlay>
      </MatterCanvas>
    )
}