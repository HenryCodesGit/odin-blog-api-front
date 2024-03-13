// Styling
import '../styles/globals.css'; // Global CSS File between the routes
import style from '../styles/routes/app.module.css' // Module specific CSS file
//React
import { useEffect, useState } from 'react'
//MatterJS
import { Engine } from 'matter-js'
//React MatterJS Components
import MatterGravityMouse from '../utilities/matter-react-utils/MatterGravityMouse';
import MatterCanvas from '../utilities/matter-react-utils/MatterCanvas';
import MatterBody from '../utilities/matter-react-utils/MatterBody';
import MatterOverlay from '../utilities/matter-react-utils/MatterOverlay'
import MatterEmitter from '../utilities/matter-react-utils/MatterEmitter'
// Component
import HomeSign from '../components/Home/HomeSign';
import LoadScreen from '../components/Loading/LoadScreen';
import Loader from '../components/Loading/Loader';

function Home() {

  const [loaded, setLoaded] = useState(false);

  const [engine,setEngine] = useState(null);

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
  
  useEffect(()=>{
    if(!engine) return;

    //On spawn, fastforward the engine by 30 seconds 
    console.log('fast forwarding');
    let tick = 0;
    while (tick < 5000){
      Engine.update(engine, 15)
      tick+=15;
    }
    
  },[engine])

  return (
    <>
      <LoadScreen isLoaded={loaded}>
        <Loader onLoadHandler={()=>setLoaded(true)}>
          <MatterCanvas {...canvasParams}>
            <MatterGravityMouse />
            <MatterEmitter />
            <MatterBody {...groundPlane}/>
            <MatterOverlay>
                <HomeSign/>
            </MatterOverlay>
          </MatterCanvas>
        </Loader>
      </LoadScreen>
    </>
  );
}

export default Home;