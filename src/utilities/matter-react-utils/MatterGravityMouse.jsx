//React
import { useState, useCallback, useContext} from 'react'
//MatterJS
import { Composite, Body } from 'matter-js'
//React MatterJS Components
import MatterBody from './MatterBody';
import MatterAttractor from './MatterAttractor'
import MatterMouse from './MatterMouse'
import MatterContext from './MatterContext';

MatterGravityMouse.defaultProps = {
  attractorID: 'mouse',
  isSensor: true,
}

export default function MatterGravityMouse({attractorID, isSensor}){

    const { engine } = useContext(MatterContext)

    const [mouseChildren, setMouseChildren] = useState();
    const [gravityWell, setGravityWell] = useState(null)



    const makeGravityWell = useCallback((event) => {
        //TODO: DOesn't work on firefox dev tools on touch screen mode?

        const newID = (typeof attractorID === 'string' || typeof attractorID === 'number') ? [attractorID] : attractorID
        const child = (
          <MatterAttractor attractorID={newID} isMain={true} constraintOptions={{render: {visible: false}}} bodyDataHandler={(data)=>setGravityWell(data)}>
            <MatterBody bodyType='circle' bodyParams={{
              radius: 15,
              x:event.mouse.mousedownPosition.x,
              y:event.mouse.mousedownPosition.y,
              options: { isStatic: true, render: {fillStyle: '#252525'}, isSensor: true }
            }}/>
          </MatterAttractor>
        );
        setMouseChildren(child);
      },[attractorID]);
    
      const deleteGravityWell = useCallback(() => {
        if(!engine) return;
        if(!gravityWell)  return;

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


    return (
        <MatterMouse key='1' mouseDownHandler={makeGravityWell} mouseUpHandler={deleteGravityWell} mouseMoveHandler={moveGravityWell}>
            {mouseChildren}
        </MatterMouse>
    )
}