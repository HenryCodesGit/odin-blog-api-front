// Styling
import '../styles/globals.css'; // Global CSS File between the routes
import style from '../styles/routes/app.module.css' // Module specific CSS file
//React
import { useState, useEffect, useCallback, useRef} from 'react'
//MatterJS
import { Composite, Body, Constraint } from 'matter-js'
//React MatterJS Components
import MatterCanvas from '../utilities/matter-react-utils/MatterCanvas';
import MatterBody from '../utilities/matter-react-utils/MatterBody';
import MatterOverlay from '../utilities/matter-react-utils/MatterOverlay'
import MatterEmitter from '../utilities/matter-react-utils/MatterEmitter'
import MatterAttractor from '../utilities/matter-react-utils/MatterAttractor'
import MatterOverlayPassenger from '../utilities/matter-react-utils/MatterOverlayPassenger'
import MatterOverlayDriver from '../utilities/matter-react-utils/MatterOverlayDriver'
import MatterMouse from '../utilities/matter-react-utils/MatterMouse'
// Component
import HeroCanvas from '../components/HeroCanvas';
import NavExpanding from '../components/NavExpanding';
import NavDropdown from '../components/NavDropdown';
import Constraints from '../utilities/matter-react-utils/Constraints';
import HomeSign from '../components/HomeSign';

function App() {

  const [engine, setEngine] = useState(null);
  const [mouseChildren, setMouseChildren] = useState();
  const [gravityWell, setGravityWell] = useState(null)

  const makeLink = (id, title, url) => {return {id, title, url}};
  const linkArray = [
    makeLink(1,'HOME','/'),
    makeLink(2,'BLOG','/2'),
    makeLink(3,'ABOUT','/3'),
    makeLink(4,'CONTACT','/4'),
  ];

  const makeGravityWell = useCallback((event) => {
    //TODO: DOesn't work on firefox dev tools on touch screen mode?
    const child = (
      <MatterAttractor attractorID='mouse' isMain={true} constraintOptions={{render: {visible: false}}} bodyDataHandler={(data)=>setGravityWell(data)}>
        <MatterBody bodyType='circle' bodyParams={{
          radius: 15,
          x:event.mouse.mousedownPosition.x,
          y:event.mouse.mousedownPosition.y,
          options: { isStatic: true, render: {fillStyle: '#252525'}, isSensor: true }
        }}/>
      </MatterAttractor>
    );
    setMouseChildren(child);
  },[]);

  const deleteGravityWell = useCallback(() => {
    if(!engine) return console.warn('Engine is not done loading or is not specified. Cancelling makeParticle function call');
    if(!gravityWell)  return console.warn('Gravity well does not exit, ignoring deletion');

    //Removing all constraints
    const constraintsToRemove = []
    engine.world.constraints.forEach((constraint)=>{
      if(constraint.bodyA.id === gravityWell.id || constraint.bodyB.id === gravityWell.id){ constraintsToRemove.push(constraint);}
    })
    Composite.remove(engine.world, constraintsToRemove)

    
    Composite.remove(engine.world, gravityWell)

    //Remove from page
    setGravityWell(null);
    setMouseChildren(null);
  },[engine, gravityWell])

  const moveGravityWell = useCallback((event) => {
    if(gravityWell) Body.setPosition(gravityWell, {x: event.mouse.position.x, y: event.mouse.position.y})
  },[gravityWell])


  const canvasParams = {
    backgroundColor: 'transparent',
    engineOptions: {
      gravity: { y : 0.1 },
      enableSleeping: true
    },
    setEngineHandler: setEngine
  }

  const groundPlane = {
    bodyType: 'rectangle',
    bodyParams:{
      keepRelativeWorldDims:{
        position: true,
        size: true,
      },
      normalized:{
        position: {x: 0.5, y: 1.05},
        width: 1,
        height: 0.1,
      },
      options: { isStatic: true }
    }
  }

  return (
    <div className={style.container}>
      <MatterCanvas {...canvasParams}>
        <MatterMouse key='1' mouseDownHandler={makeGravityWell} mouseUpHandler={deleteGravityWell} mouseMoveHandler={moveGravityWell}>
          {mouseChildren}
        </MatterMouse>
        <MatterEmitter />
        <MatterBody {...groundPlane}/>
        <MatterOverlay>
          <header><NavExpanding className={style.navExpanding} links = {linkArray} /></header>
          <HomeSign/>
        </MatterOverlay>
      </MatterCanvas>
    </div>
  );
}

export default App;