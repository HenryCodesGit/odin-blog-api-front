import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useState, forwardRef, useEffect, useRef } from 'react';

import style from '../styles/components/NavDropdown.module.css'

// Requires  Install material icons 
// npm install @mui/icons-material @mui/material @emotion/styled @emotion/react
import MenuIcon from '@mui/icons-material/Menu'; 

const NavDropdown = forwardRef(function NavDropDownRef({ links }, ref){
    const [isMenuShown, setMenuShown] = useState(false);
       const buttonHTML = useRef(null);

    const toggleMenu = () => setMenuShown(!isMenuShown);
    const className = `${style.ul} ${isMenuShown ? '' : style.visuallyHidden}`

    // Initialize menu focus check
    useEffect(()=>{
        function checkHideMenu(event){
            // Hide menu if none of these are true
            if (!(!isMenuShown || // Menu is already hidden
                event.target === buttonHTML.current ||  // Mouseup on the button
                event.target === buttonHTML.current.querySelector('svg') // Mouseup on the svg
            )) setMenuShown(false) 
        }

        document.addEventListener('mouseup', checkHideMenu);
        return () => document.removeEventListener('mouseup',checkHideMenu)
    }, [isMenuShown, setMenuShown]);

    return(
        <div className={style.floatingContainer} ref={ref}>
            <nav className={style.nav}>
                <button className={style.button} onClick={ toggleMenu } ref={buttonHTML} aria-expanded={isMenuShown} aria-haspopup="true">
                    <MenuIcon />
                </button>
                <ul className={ className } tabIndex='-1'>
                    { links.map(({id, title, url}) =>
                        <li key={ id } tabIndex='-1'>
                            <Link to={ url } tabIndex={isMenuShown ? 0 : -1}>
                                { title }
                            </Link>
                        </li>
                    ) }
                </ul>
            </nav>
        </div>
    );
});

NavDropdown.propTypes = {
    links: // Array of links to be generated into the nav bar 
        PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            url: PropTypes.string,
        })),
};

NavDropdown.defaultProps = {
    links: [],
  };

export default NavDropdown;