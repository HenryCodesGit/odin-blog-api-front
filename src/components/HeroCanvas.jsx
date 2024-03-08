import MatterCanvas from '../utilities/matter-react-utils/MatterCanvas';
import MatterBody from '../utilities/matter-react-utils/MatterBody';
import MatterEmitter from '../utilities/matter-react-utils/MatterEmitter';
import MatterMouse from '../utilities/matter-react-utils/MatterMouse';
import MatterAttractor from '../utilities/matter-react-utils/MatterAttractor'

import { useState, useCallback } from 'react';

import { Composite, Body} from 'matter-js'

export default function HeroCanvas(){

  const [engine, setEngine] = useState(null);
  const [mouseChildren, setMouseChildren] = useState();
  const [gravityWell, setGravityWell] = useState(null)

  const makeGravityWell = useCallback((event) => {
    if(!engine) return console.warn('Engine is not done loading or is not specified. Cancelling makeParticle function call');
    // Test making and returning a react component from within here
    const key = Date.now(); //TODO Use UUID Later
    const child = (
      <MatterAttractor key={key} attractorID='mouse' isMain={true} constraintOptions={{render: {visible: false}}} bodyDataHandler={(data)=>setGravityWell(data)}>
        <MatterBody bodyType='circle' bodyParams={{
          scaleOnResize: false,
          normalized:{
            radius: 0.01,
          },
          x:event.mouse.mousedownPosition.x,
          y:event.mouse.mousedownPosition.y,
          options: { isStatic: true, render: {fillStyle: '#252525'} }
        }}/>
      </MatterAttractor>
    );
    setMouseChildren(child);

},[engine]);

  const deleteGravityWell = useCallback(() => {
    if(!engine) return console.warn('Engine is not done loading or is not specified. Cancelling makeParticle function call');

    //Removing all constraints
    const toRemove = []
    engine.world.constraints.forEach((constraint)=>{
      if(constraint.bodyA.id === gravityWell.id || constraint.bodyB.id === gravityWell.id){ toRemove.push(constraint);}
    })
    Composite.remove(engine.world, toRemove)

    // Test making and returning a react component from within here
    Composite.remove(engine.world, gravityWell)

    console.log('deleting gravity well');
    setGravityWell(null);
  },[engine, gravityWell])

  const moveGravityWell = useCallback((event) => {
    if(gravityWell) Body.setPosition(gravityWell, {x: event.mouse.position.x, y: event.mouse.position.y})
  },[gravityWell])


  const canvasParams = {
    backgroundColor: 'transparent',
    engineOptions: {
      gravity: { y : 0.25 * 10}
    },
    setEngineHandler: setEngine
  }

  const particleParams = {
    bodyType: 'rectangle',
    bodyParams:{
      scaleOnResize: true,
      normalized:{
        pos: {x: 0.5, y: 1.05},
        width: 1,
        height: 0.1,
      },
      options: { isStatic: true }
    }
  }

  return (
    <MatterCanvas {...canvasParams}>
      <MatterMouse mouseDownHandler={makeGravityWell} mouseUpHandler={deleteGravityWell} mouseMoveHandler={moveGravityWell}>
        {mouseChildren}
      </MatterMouse>
      <MatterEmitter />
      <MatterBody {...particleParams}/>
    </MatterCanvas>
  )
}