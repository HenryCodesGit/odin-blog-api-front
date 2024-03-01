import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { forwardRef } from 'react';

import style from '../styles/components/NavDropdown.module.css'

// Requires  Install material icons 
// npm install @mui/icons-material @mui/material @emotion/styled @emotion/react
import MenuIcon from '@mui/icons-material/Menu';

// TODO: Dropdown hides if button loses focus
const Component = forwardRef(function Component({ links }, ref){
    // State to keep track of the menu items and when they are shown.
    const [isMenuShown, setMenuShown] = useState(false);
    const toggleMenu = () => setMenuShown(!isMenuShown);

    const listComponents = links.map(({id, title, url}) => <Link key= { id } to={ url }><li key={ id }>{ title }</li></Link>)
    
    return(<div className={style.floatingContainer} ref={ref}><nav className={style.nav}>
        <button className={style.button} onClick={ toggleMenu }><MenuIcon /></button>
        <ul className={ `${style.ul} ${isMenuShown ? '' : style.visuallyHidden}` }>
            {listComponents}
        </ul>
    </nav></div>);
})

Component.propTypes = {
    links: // Array of links to be generated into the nav bar 
        PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            url: PropTypes.string,
        })),
};

Component.defaultProps = {
    links: [],
  };

export default Component;