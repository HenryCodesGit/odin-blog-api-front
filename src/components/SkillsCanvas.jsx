
import MatterCanvas from '../utilities/matter-react-utils/MatterCanvas';
import { normalizedPosition } from '../utilities/matter-react-utils/MatterCanvasUtils';

import { useRef, useEffect } from 'react';
import { Engine, Runner, Bodies, Composite, Events} from 'matter-js';

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

    const engine = useRef(Engine.create({ gravity: { y: 1 } }))
    const runner = useRef(Runner.create());
    const itemQueued = useRef(false);
    const timer = useRef(0);

    useEffect(()=>{
        const currEngine = engine.current;

        // Add falling snow effect
        const particlesActive = []
        Events.on(currEngine, 'afterUpdate',()=>{
          // Add particles
          if(!itemQueued.current){
            const [x] = normalizedPosition(scene.current, Math.random(),Math.random())
            const randomSize = Math.random()*10+2;
            const particle = Bodies.rectangle(x,-30,randomSize,randomSize, {isStatic: false, render: {fillStyle: COLORS.grey}});
            particlesActive.push(particle);

            Composite.add(currEngine.world, particle);
            itemQueued.current = true;
          }

            //Iterate through active particles and delete the ones that are no longer existing
            for(let i = particlesActive.length-1; i>=0; i-=1){
              if(particlesActive[i].position.y > scene.current.clientHeight){
                Composite.remove(currEngine.world, particlesActive[i]);
                particlesActive.splice(i,1);
              }
            }
            timer.current += 1;
            if(timer.current < 5) return;

            itemQueued.current = false;
            timer.current = 0;
        })

        return () => {
          Events.off(currEngine);
        }
    },[]);
    return (<MatterCanvas engine={engine.current} runner={runner.current} ref={scene}/>)
}

