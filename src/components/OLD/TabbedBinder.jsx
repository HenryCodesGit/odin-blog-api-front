//TODO: Component that can house pages inside of it, separated by colored tabs;
//Similar to binder dividers in real life:
// Example: https://www.uline.ca/Product/Detail/S-21763/Desk-Supplies/Binder-Dividers-8-Tab-Multi-Color?pricode=YE929&gadtype=pla&id=S-21763&gad_source=1&gclid=CjwKCAiAloavBhBOEiwAbtAJO51d9PWjnVlO6_b1qaXAtM1OVABBgXuKoTpDcVC5WjDXBgwlc3ttihoCvlQQAvD_BwE

// import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
// import { useState } from 'react';
// import { forwardRef } from 'react';

import style from '../styles/components/TabbedBinder.module.css'

const COLORS = {
    folder: '#f5e1c4',
    dividerBrown: '#D2B48C',
    dividerGreen: '#a1d3a2',
    dividerPeach: '#FFD699',
    dividerRed: '#dcb9b2',
    dividerGrey: '#B0B0B0',
}

// TODO: Dropdown hides if button loses focus
function Component(){

    return(<div className={style.container}>
        <ul className={style.tabs}>
            <li className={style.tab} style={{backgroundColor: COLORS.dividerBrown}}>Web</li>
            <li className={style.tab} style={{backgroundColor: COLORS.dividerGreen}}>Games</li>
            <li className={style.tab} style={{backgroundColor: COLORS.dividerPeach}}>Engineering</li>
            <li className={style.tab} style={{backgroundColor: COLORS.dividerGrey}}>-</li>
        </ul>
        <div className={style.content} style={{backgroundColor: COLORS.folder}}>
        </div>
    </div>);
}

Component.propTypes = {
};

Component.defaultProps = {
};

export default Component;