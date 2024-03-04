import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useState, forwardRef, useEffect, useRef, useCallback } from 'react';

import style from '../styles/components/NavDropdown.module.css'

// Requires  Install material icons 
// npm install @mui/icons-material @mui/material @emotion/styled @emotion/react
import MenuIcon from '@mui/icons-material/Menu';

const Component = forwardRef(function Component({ links }, ref){
    const [isMenuShown, setMenuShown] = useState(false);
    const toggleMenu = () => setMenuShown(!isMenuShown);

    const buttonHTML = useRef(null);

    // Function to hides the menu if it loses focus
    const checkHideMenu = useCallback((event) => {
        // No point hiding menu if its already hidden
        // Also don't hide the menu if clicking button. 
        // The reason why is clicking the button will run 'toggleMenu' after this event runs which would then immediately turn on the menu again
        if (!isMenuShown || event.target === buttonHTML.current || event.target === buttonHTML.current.querySelector('svg')) return;

        setMenuShown(false) 
    }, [isMenuShown]);

    // Subscribe the hide menu function on every mouseUp click on the document
    useEffect(()=>{
        document.addEventListener('mouseup', checkHideMenu);

        return ()=>{ document.removeEventListener('mouseup',checkHideMenu); }
    }, [checkHideMenu]);
    
    // Map list items to components
    const listComponents = links.map(({id, title, url}) =>
        <li key={ id } tabIndex='-1'>
            <Link to={ url } tabIndex={isMenuShown ? 0 : -1}>
                { title }
            </Link>
        </li>
    );

    return(
        <div className={style.floatingContainer} ref={ref}>
            <nav className={style.nav}>
                <button className={style.button} onClick={ toggleMenu } ref={buttonHTML} aria-expanded={isMenuShown} aria-haspopup="true">
                    <MenuIcon />
                </button>
                <ul className={ `${style.ul} ${isMenuShown ? '' : style.visuallyHidden}` } tabIndex='-1'>
                    { listComponents }
                </ul>
            </nav>
        </div>
    );
});

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