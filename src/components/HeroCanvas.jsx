// TODO: A Canvas element where i can enter in array of skills and it will create a canvas of floating orbs.
// Each orb will float around with initial momentum and elastically collide with other orbs
// Orbs of similar categories will have an attractive force
// Orbs of differing categories will have a repulsive force
// Make sure there's a maximum speed so that things don't get out of hand
// The mouse will serve as a repulsive force

/* See matter.js */
// https://brm.io/matter-js/

/*  Format of data input will be array of json objects [...Object]
    Objects will be in the following format 
    {
        Description: HTML
        ImageURL: https://example.com
        Category: Webdev
    }
*/

import { useEffect, useRef, useMemo } from 'react'
import { Engine, Render, Runner, Bodies, Composite, World, Events } from 'matter-js'

import style from '../styles/components/HeroCanvas.module.css'

import debounce from '../utilities/debounce'

const COLORS = {
    black: '#14110F',
    darkGrey: '#333333',
    grey: '#7E7F83',
    lightGrey: '#DDD',
    beige: '#D9C5B2',
    white: '#F3F3F4',
    green: '#3B6D45',
}

function Component(props){
    const scene = useRef()
    const engine = useRef(Engine.create({ gravity: { y: 0.25 } }))
    const runner = useRef(Runner.create());
    const render = useRef(null)
    
    const itemQueued = useRef(false);
    const timer = useRef(0);

    // Function to check size of window and see if need to re-render the elements. 
    const resize = useMemo( // useMemo needed to cache function definition between renders
        () => debounce(()=>{ 
            const width = scene.current.parentNode.clientWidth;
            const height = scene.current.parentNode.clientHeight;

            render.current.bounds.max.x = width;
            render.current.bounds.max.y = height;
            render.current.options.width = width;
            render.current.options.height = height;
            render.current.canvas.width = width;
            render.current.canvas.height = height;
            Render.setPixelRatio(render.current, window.devicePixelRatio); // added this
        },30),//Debounce called with interval 30ms delay before firing
        []
    )
  
    useEffect(() => {

      const currEngine = engine.current;
      const currRunner = runner.current;

      const cw = scene.current.parentNode.clientWidth
      const ch = scene.current.parentNode.clientHeight
  
      const currRender = Render.create({
        element: scene.current,
        engine: engine.current,
        options: {
          width: scene.current.parentNode.clientWidth,
          height: scene.current.parentNode.clientHeight,
          wireframes: false,
          background: 'transparent',
          pixelRatio: window.devicePixelRatio,
        }});
      render.current = currRender;
  
      //Create bodies
      const [x, y] = normPosition(currRender, 0.5,0.5);
      console.log(x,y);
      /* Format is.. (centerPositionX, centerPositionY, Width, Height) */
      const items = [
        // Bodies.rectangle(x,y,200,200, {isStatic: false, render: {fillStyle: COLORS.grey}}), 
        // Bodies.rectangle(450,50,80,80, {isStatic: false, render: {fillStyle: 'transparent', strokeStyle: COLORS.beige, lineWidth: '5'}}), 
        // Bodies.rectangle(450,50,80,80, {isStatic: false, render: {fillStyle: 'white'}}), 
        // Bodies.rectangle(0,ch,cw*2,50, {isStatic: true, render: {fillStyle: 'white'}})
      ]

      Events.on(currEngine, 'afterUpdate',()=>{
        if(!itemQueued.current){
            const [x] = normPosition(currRender, Math.random(),Math.random())
            Composite.add(currEngine.world, Bodies.rectangle(x,0,15,15, {isStatic: false, render: {fillStyle: COLORS.grey}}));
            itemQueued.current = true;
        }
        timer.current = timer.current+1;

        if(timer.current === 30){
            itemQueued.current = false;
            timer.current = 0;
        }

      })

      //Add bodies to world
      Composite.add(currEngine.world, items);

      //Render the bodies
      Render.run(currRender);
  
    //   /* Provides the game loop and continuously updates the engine */
      Runner.run(currRunner, currEngine);

    //   update();

    //   function update(){
    //     Engine.update(currEngine,1000/60);
    //     requestAnimationFrame(update);
    //   }

      /* Add event listener */
      window.addEventListener('resize',resize)
  
      return () => {
        Render.stop(currRender);
        World.clear(currEngine.world);
        Runner.stop(currRunner);
        Engine.clear(currEngine);
        currRender.canvas.remove();
        currRender.canvas = null;
        currRender.context = null;
        currRender.textures = {};
        window.removeEventListener('resize',resize);
        Events.off();
      }
    }, [])
  
    return (
        <div ref={scene} className={style.heroCanvas}/>
    )
}

function normPosition(render,x,y){
    //Given a scene and a normalized position within it, returns the new co-ordinate
    const width = render.options.width;
    const height = render.options.height;
    return [width*x, height*y];
}
// Component.propTypes = {
// };

// Component.defaultProps = {
// };

export default Component;