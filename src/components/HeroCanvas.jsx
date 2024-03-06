
import MatterCanvas from '../utilities/matter-react-utils/MatterCanvas';
import { normalizedPosition } from '../utilities/matter-react-utils/MatterCanvasUtils';

import { useRef, useEffect } from 'react';
import { Engine, Runner, Body, Bodies, Composite, Events} from 'matter-js';

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

export default function HeroCanvas(){

    const scene = useRef();

    const engine = useRef(Engine.create({ gravity: { y: 0.25 * 10}, enableSleeping: true}))
    const runner = useRef(Runner.create());
    const itemQueued = useRef(false);
    const timer = useRef(0);
    const barrier = useRef();

    useResizeEffect(
      ()=> {
        console.log('Running heros canvas resize');
      
        //Need to wake up all bodies that have become static due to sleeping
        engine.current.world.bodies.forEach((body)=>{
          Body.set(body,'isSleeping',false);
        })

        // Scale barrier to new size
        const scaleX = scene.current.clientWidth / (barrier.current.bounds.max.x-barrier.current.bounds.min.x);
        Body.scale(barrier.current, scaleX, 1);

        // Set position of barrier
        const [x,y] = normalizedPosition(scene.current, 0.5,1);
        Body.setPosition(barrier.current, {x, y:y + 0.5*(barrier.current.bounds.max.y-barrier.current.bounds.min.y)});
      },
      ()=>{}, // No cleanup needed
      [scene, barrier, engine], // TODO: These dependencies probably not needed
      {debounce: 100, runInitial: true} // Throttle the function call
    )

    useEffect(()=>{
        const currEngine = engine.current;

        //Add a barrier at the bottom
        const [x,y] = normalizedPosition(scene.current, 0.5,1);
        const thickness = 50;
        barrier.current = Bodies.rectangle(x,y+thickness/2,scene.current.clientWidth, thickness,{isStatic: true})
        Composite.add(currEngine.world, barrier.current);

        // Add falling snow effect
        const particlesActive = []
        Events.on(currEngine, 'afterUpdate',()=>{
          // Add particles
          if(!itemQueued.current){
            const [x] = normalizedPosition(scene.current, Math.random(),Math.random())
            const randomSize = Math.random()*10+2;
            const particleSides = Math.random()*3+3;
            const particle = Bodies.polygon(x,-30,particleSides,randomSize, {isStatic: false, render: {fillStyle: 'transparent', strokeStyle: COLORS.grey, lineWidth: 1,}, airFriction: 0.5, timeScale: 0.125});
            particlesActive.push(particle);

            Composite.add(currEngine.world, particle);
            itemQueued.current = true;
          }

            //Iterate through active particles and delete the ones that are no longer existing
            for(let i = particlesActive.length-1; i>=0; i-=1){
              if(particlesActive[i].position.y > scene.current.clientHeight+10){
                Composite.remove(currEngine.world, particlesActive[i]);
                particlesActive.splice(i,1);
              }
            }
            timer.current += 1;
            if(timer.current < 30) return;

            itemQueued.current = false;
            timer.current = 0;
        })

        return () => {
          Events.off(currEngine);
        }
    },[]);
    return (<MatterCanvas engine={engine.current} runner={runner.current} ref={scene}/>)
}

