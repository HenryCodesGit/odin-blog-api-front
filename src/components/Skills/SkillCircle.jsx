import { PropTypes } from 'prop-types'

import MatterOverlayPassenger from "../../utilities/matter-react-utils/MatterOverlayPassenger";
import MatterAttractor from "../../utilities/matter-react-utils/MatterAttractor";
import MatterBody from "../../utilities/matter-react-utils/MatterBody";

SkillCircle.propTypes = {
    attractorID: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        ]).isRequired,
    link: PropTypes.string,
    imageSRC: PropTypes.string,
    MatterBodyParams: PropTypes.object.isRequired,
    className: PropTypes.string
}
export default function SkillCircle({link, imageSRC, attractorID, MatterBodyParams, className}){
    return(
      <MatterOverlayPassenger elementHTML={(<li className={className}><a href={link}><img src={imageSRC} style={{height: '100%'}}/></a></li>)}>
        <MatterAttractor attractorID={attractorID} isMain={false} constraintOptions={{render: {visible: false}}}>
            <MatterBody {...MatterBodyParams}/>
        </MatterAttractor>
      </MatterOverlayPassenger>
    );
}