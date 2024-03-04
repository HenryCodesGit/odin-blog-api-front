
import MatterCanvas from '../utilities/matter-react-utils/MatterCanvas';
import { normalizedPosition } from '../utilities/matter-react-utils/MatterCanvasUtils';

import { useRef, useEffect } from 'react';
import { Engine, Runner, Mouse, MouseConstraint, Events, Bodies, Composite} from 'matter-js';

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
    const engine = useRef(Engine.create({ gravity: { y: 0 } }))
    const runner = useRef(Runner.create());

    const mouse = useRef()
    const mouseConstraint = useRef()

    useEffect(()=>{
        console.log('Mounting SkillsCanvas');

        const canvas = scene.current.querySelector('canvas')
        window.canvas = canvas;

        //Mouse and its constraint has to initiate after the other refs are created
        mouse.current = Mouse.create(canvas);
        mouseConstraint.current = MouseConstraint.create(engine.current, { mouse: mouse.current });
        const currMouseConstraint = mouseConstraint.current; //Making it easier to type and paste the variable around

        // Creating the mouse prevents scroll events from occuring, so need to manually put it back in
        canvas.onmousewheel = (event) => {
          window.scrollBy(event.deltaX, event.deltaY);
        }
        
        // Creating the mouse prevents touch drag from occurring, so need to manually put it back in

        let lastY;
        function scroll(touchEvent){
          window.scrollBy({
            top: lastY-touchEvent.changedTouches[0].pageY,
            left: 0,
            behaviour: 'smooth'
          });
          lastY = touchEvent.changedTouches[0].pageY;
        }
        function update(touchEvent){
            lastY = touchEvent.changedTouches[0].pageY;
        }

        canvas.addEventListener('touchmove', scroll)
        canvas.addEventListener('touchstart', update)



        return () => {
          Events.off(currMouseConstraint);
          canvas.removeEventListener('touchmove',scroll);
          canvas.removeEventListener('touchstart', update);
        }
    },[]);
    return (<MatterCanvas engine={engine.current} runner={runner.current} ref={scene} backgroundColor='#444'/>)
}

