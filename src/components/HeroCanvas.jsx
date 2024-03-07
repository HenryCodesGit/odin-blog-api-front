
import MatterCanvas from '../utilities/matter-react-utils/MatterCanvas';
import MatterBody from '../utilities/matter-react-utils/MatterBody';
import MatterEmitter from '../utilities/matter-react-utils/MatterEmitter';

export default function HeroCanvas(){
    return (
      <MatterCanvas backgroundColor={'transparent'}>
        <MatterBody 
          bodyType='rectangle' 
          bodyParams={{
            scaleOnResize: true,
            normalized:{
              pos: {x: 0.5, y: 1.05},
              width: 1,
              height: 0.1,
            },
            options: { isStatic: true }
          }}
        />
        <MatterEmitter />
      </MatterCanvas>
    )
}