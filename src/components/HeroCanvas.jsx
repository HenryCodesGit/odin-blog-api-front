
import MatterCanvas from '../utilities/matter-react-utils/MatterCanvas';
import MatterBody from '../utilities/matter-react-utils/MatterBody';
import MatterOverlay from'../utilities/matter-react-utils/MatterOverlay';
import MatterOverlayDriver from '../utilities/matter-react-utils/MatterOverlayDriver';
import MatterOverlayPassenger from '../utilities/matter-react-utils/MatterOverlayPassenger';
import MatterAttractor from '../utilities/matter-react-utils/MatterAttractor';
import MatterEmitter from '../utilities/matter-react-utils/MatterEmitter';

export default function HeroCanvas(){

    const canvasParams = {
      backgroundColor: 'transparent',
      engineOptions: {
        gravity: { y : 0.25 * 10}
      }
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
        <MatterEmitter />
        <MatterBody {...particleParams}/>
      </MatterCanvas>
    )
}