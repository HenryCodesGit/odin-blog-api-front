import { PropTypes } from "prop-types"

import MatterOverlayDriver from "../../utilities/matter-react-utils/MatterOverlayDriver"
import MatterAttractor from "../../utilities/matter-react-utils/MatterAttractor"
import MatterBody from "../../utilities/matter-react-utils/MatterBody"

SkillHeader.propTypes={
    attractorID: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        ]).isRequired,
    matterBodyParams: PropTypes.object.isRequired,
    className: PropTypes.string,
    text: PropTypes.string,
}

export default function SkillHeader({text, attractorID, matterBodyParams, className}){
    return(
        <MatterOverlayDriver elementHTML={(<p className={className}>{text}</p>)}>
            <MatterAttractor attractorID={attractorID} isMain={true}  constraintOptions={{render: {visible: false}}}>
                <MatterBody {...matterBodyParams} />
            </MatterAttractor>
        </MatterOverlayDriver>
    )
}