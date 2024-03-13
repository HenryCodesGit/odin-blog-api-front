import { useEffect, useRef, useState, useCallback, createContext } from 'react';
import MatterContext from './MatterContext'
import PropTypes from 'prop-types';

import useResizeEffect from '../react-utils/useResizeEffect'

import style from './MatterCanvas.module.css';

import { Engine, Runner, Render, Composite, Body } from 'matter-js'

MatterCanvas.propTypes = {
  backgroundColor: PropTypes.string,
  gravity: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object)
  ]),
  setEngineHandler: PropTypes.func,
  engineOptions: PropTypes.object,
  onLoadHandler: PropTypes.func,
};

MatterCanvas.defaultProps = {
  setEngineHandler: ()=>{},
  backgroundColor: 'transparent',
  onLoadHandler: ()=>{},
};

const defaultEngineOptions = { 
  gravity: { y: 0.25 * 10 }, 
  enableSleeping: true
}

function MatterCanvas({ backgroundColor, children, setEngineHandler, engineOptions, onLoadHandler}) {

  // Set engine options and over-write defaults
  engineOptions = Object.assign({...defaultEngineOptions}, engineOptions)

  const scene = useRef();
  const render = useRef(null);

  const [engine] = useState(Engine.create(engineOptions))
  const [runner] = useState(Runner.create());
  const [renderRefState, setRenderRefState] = useState(null);

  const checkPauseEngine = useCallback(() => {
    const element = render.current.element.getBoundingClientRect();
    const elementTop = parseInt(element.top,10);
    const elementBot = parseInt(elementTop + element.height,10);
    const windowHeight = parseInt(window.innerHeight,10);

    const isCanvasShown = !(elementTop > windowHeight || elementBot < 0)

    runner.enabled = isCanvasShown;
  }, [runner])

  // Ensure the canvas is always the same size as its parent
  useResizeEffect(()=>{ 

    //Set all bodies to not sleeping because world is different now and physics might be different too
    engine.world.bodies.forEach((body)=>{
      Body.set(body,'isSleeping',false)
    })

    const width = render.current.element.parentNode.clientWidth;
    const height = render.current.element.parentNode.clientHeight;

    render.current.options.width = width;
    render.current.options.height = height
    render.current.bounds.max.x = width;
    render.current.bounds.max.y = height;
    render.current.canvas.width = width;
    render.current.canvas.height = height;
    
    Render.setPixelRatio(render.current, window.devicePixelRatio); 
    checkPauseEngine();
  },()=>{'Clearing resizeEffect'}, [],{debounce: 15, runInitial: true})

  useEffect(() => {
    render.current = Render.create({
        element: scene.current,
        engine: engine,
        options: {
        width: scene.current.parentNode.clientWidth,
        height: scene.current.parentNode.clientHeight,
        wireframes: false,
        background: backgroundColor,
        pixelRatio: window.devicePixelRatio,
        hasBounds: true,
    }});
    setRenderRefState(render.current);

    // Start the renderer
    Render.run(render.current);    

    //Run the Physics Engine /w matterJS default Runner
    Runner.run(runner, engine);

    /* Add a listener to the window to pause the engine if we scroll past the canvas */
    window.addEventListener('scroll', checkPauseEngine);

    //Pause engine if canvas is off screen
    checkPauseEngine();

    //Returns the engine for anyone that needs to use it
    setEngineHandler(engine)

    return () => {
      Render.stop(render.current);
      Composite.clear(engine.world);
      Runner.stop(runner);
      Engine.clear(engine);

      render.current.canvas.remove();
      render.current.canvas = null;
      render.current.context = null;
      render.current.textures = {};
      render.current = null
      
      window.removeEventListener('scroll', checkPauseEngine);
    }
  }, [scene, engine, runner, backgroundColor, checkPauseEngine, setEngineHandler])

  useEffect(()=>{
    if(scene && engine && runner) onLoadHandler()
  },[scene, engine, runner, onLoadHandler])

  return(
    <MatterContext.Provider value={
      {
        engine, 
        render: renderRefState, 
      }
    }>
      <div ref={scene} className={style.matterCanvas}>
        {children}
      </div>
    </MatterContext.Provider>
  )
}

/* ********************************************************** */

export default MatterCanvas;