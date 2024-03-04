
import { useRef, useEffect } from 'react';
import { Engine, Runner, Mouse, MouseConstraint, Events, Body, Bodies, Composite, World, Constraint} from 'matter-js';

import MatterCanvas from '../utilities/matter-react-utils/MatterCanvas';
import { normalizedPosition } from '../utilities/matter-react-utils/MatterCanvasUtils';
import enableTouchScroll from '../utilities/enableTouchScroll';
import useResizeEffect from '../utilities/react-utils/useResizeEffect';

const COLORS = {
  black: '#14110F',
  darkGrey: '#333333',
  grey: '#7E7F83',
  lightGrey: '#DDD',
  beige: '#D9C5B2',
  white: '#F3F3F4',
  green: '#3B6D45',
}

export default function SkillsCanvas(){

    const scene = useRef();
    const engine = useRef(Engine.create({ 
      gravity: { y: 0 },
      constraintIterations: 2,
      positionIterations: 6,
      velocityIterations: 4,
    }))
    const runner = useRef(Runner.create());

    const mouse = useRef()
    const mouseConstraint = useRef()

    //On resize, 
    useResizeEffect(
      ()=> mouse.current.pixelRatio = window.devicePixelRatio, //Need to reset mouse pixel ratio as it might change (i.e. moving window between screens)
      ()=>{}, // No cleanup needed
      [], // No dependencies 
      {debounce: 30} // Throttle the function call
    )

    useEffect(()=>{
        console.log('Mounting SkillsCanvas');
        const currEngine = engine.current;
        const canvas = scene.current.querySelector('canvas')

        // Mouse and its constraint has to initiate after the other refs are created
        mouse.current = Mouse.create(canvas);
        mouse.current.pixelRatio = window.devicePixelRatio; // This is needed because the matterJS Library has a bug.
        mouseConstraint.current = MouseConstraint.create(engine.current, { mouse: mouse.current });

        // Creating the mouse prevents scroll events from occuring, so need to manually put it back in
        canvas.onmousewheel = (event) => { window.scrollBy(event.deltaX, event.deltaY);} // Mouse wheel
        const touchScroll = enableTouchScroll(canvas); // Touch events

        const particleSize = 40;
        const particles = []
        Events.on(mouseConstraint.current,'mousedown',(event)=>{
          const {x,y} = event.mouse.mousedownPosition
          const type = Math.random() > 0.5 ? 1 : 2
          const color = (type == 1) ? '#000' : '#FFF';
          // {isStatic: false, render: {fillStyle: color}, friction: 0.5, slop: 0.01, frictionAir: 0.03});
          const newParticle = Bodies.polygon(x, y,6,particleSize, {isStatic: false, render: {fillStyle: color, strokeStyle: '#222', lineWidth: 2}, friction: 0, frictionAir: 0.005});
          newParticle.typeHenry = type;
          Composite.add(currEngine.world, newParticle);

          //Add constraints
          particles.forEach((particle) => {
            const constraint = Constraint.create({
              bodyA: newParticle,
              bodyB: particle,
              damping: 0,
              get stiffness(){ 
                /* Custom getter, force will depend on distance between the two particles, like gravity */
                const posX = [this.bodyA.position.x, this.bodyB.position.x];
                const posY = [this.bodyA.position.y, this.bodyB.position.y];

                /* Ignoring mass because will be implementing constant mass between objects */
                // Baking it in to the gravitational constant
                const r = ((posX[0] - posX[1])^2 + (posY[0] - posY[1])^2)*0.5;

                let attractSign = (this.bodyA.typeHenry === -1*this.bodyB.typeHenry) ? 1 : 0;

                const MIN = 0;
                const MAX = 0.0005;
                const springConstant = Math.max(
                  MIN,
                  Math.min(Math.abs(this._G / (r^3)),
                  MAX
                ));
                
                return attractSign * springConstant;
              }, 
              set stiffness(name){ this._G = (this._G) ? name : 0.005; },
              length: particleSize * 2,
              render: {
                visible: false,
              }
            });
            Composite.add(currEngine.world, constraint);
          });

          particles.push(newParticle);

        });

        
        //Add a central attractor for black
        let type = -1
        let newParticle = Bodies.polygon(
          canvas.clientWidth/3,
          canvas.clientHeight/2,
          6,
          particleSize,
          {isStatic: true, render: {fillStyle: '#000'}, friction: 0 }
        );
        newParticle.typeHenry = type;
        Composite.add(currEngine.world, newParticle);
        particles.push(newParticle);

      //////////////////////////////////

          //Add a central attractor for white
          type = -2;
          newParticle = Bodies.polygon(
            2*canvas.clientWidth/3,
            canvas.clientHeight/2,
            6,
            particleSize,
            {isStatic: true, render: {fillStyle: '#FFF'}, friction: 0 }
          );
          newParticle.typeHenry = type;
          Composite.add(currEngine.world, newParticle);
          particles.push(newParticle);
  
        //////////////////////////////////

        return () => {
          Events.off(mouseConstraint.current);
          World.clear(currEngine.world); //Temporary delete after
          touchScroll.cleanup();
        }
    },[]);
    return (<MatterCanvas engine={engine.current} runner={runner.current} ref={scene} backgroundColor='#444'/>)
}

