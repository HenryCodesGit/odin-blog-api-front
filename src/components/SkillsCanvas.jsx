
import MatterCanvas from '../utilities/matter-react-utils/MatterCanvas';
import { normalizedPosition } from '../utilities/matter-react-utils/MatterCanvasUtils';
import enableTouchScroll from '../utilities/enableTouchScroll';

import { useRef, useEffect } from 'react';
import { Engine, Runner, Mouse, MouseConstraint, Events, Body, Bodies, Composite, World, Constraint} from 'matter-js';

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

    useEffect(()=>{
        console.log('Mounting SkillsCanvas');
        const currEngine = engine.current;
        window.engine = currEngine;
        const canvas = scene.current.querySelector('canvas')

        // Mouse and its constraint has to initiate after the other refs are created
        mouse.current = Mouse.create(canvas);
        Mouse.setScale(mouse.current, {x: 1/window.devicePixelRatio, y: 1/window.devicePixelRatio}); // A little confused about why I need to divide both x and Y by the pixel ratio, but its require to make this work
        mouseConstraint.current = MouseConstraint.create(engine.current, { mouse: mouse.current });
        const currMouseConstraint = mouseConstraint.current; // Making it easier to type and paste the variable around

        // Creating the mouse prevents scroll events from occuring, so need to manually put it back in
        canvas.onmousewheel = (event) => { window.scrollBy(event.deltaX, event.deltaY);} // Mouse wheel
        const touchScroll = enableTouchScroll(canvas); // Touch events


        const particleSize = 40;
        const particles = []

        
        Events.on(currMouseConstraint,'mousedown',(event)=>{
          const {x,y} = event.mouse.mousedownPosition
          const type = Math.random() > 0.5 ? 1 : 2
          const color = (type == 1) ? '#000' : '#FFF';
          console.log(color);
          // {isStatic: false, render: {fillStyle: color}, friction: 0.5, slop: 0.01, frictionAir: 0.03});
          const newParticle = Bodies.polygon(x,y,6,particleSize, {isStatic: false, render: {fillStyle: color, strokeStyle: '#222', lineWidth: 2}, friction: 0.01, slop: 0.01, frictionAir: 0.01});
          newParticle.typeHenry = type;
          Composite.add(currEngine.world, newParticle);

          //Add constraints
          
          particles.forEach((particle) => {
            const posX = [particle.position.x, newParticle.position.x];
            const posY = [particle.position.y, newParticle.position.y];
            console.log(((posX[0] - posX[1])^2 + (posY[0] - posY[1])^2)*0.5);

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

                let attractSign = (this.bodyA.typeHenry === this.bodyB.typeHenry) ? 1 : 0;

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
        let type = 1
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
          type = 2;
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








        // Events.on(currEngine,'afterUpdate',()=>{
        //   particles.forEach((particle)=>{
        //     Body.setAngularSpeed(particle, 0);
        //     Body.setAngularVelocity(particle, 0);
        //   })
        // })

        return () => {
          Events.off(currMouseConstraint);
          World.clear(currEngine.world); //Temporary delete after
          touchScroll.cleanup();
        }
    },[]);
    return (<MatterCanvas engine={engine.current} runner={runner.current} ref={scene} backgroundColor='#444'/>)
}

