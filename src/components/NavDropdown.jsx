import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useState, forwardRef, useEffect, useRef } from 'react';

import style from '../styles/components/NavDropdown.module.css'

// Requires  Install material icons 
// npm install @mui/icons-material @mui/material @emotion/styled @emotion/react
import MenuIcon from '@mui/icons-material/Menu';

const Component = forwardRef(function Component({ links }, ref){
    // State to keep track of the menu items and when they are shown.
    const [isMenuShown, setMenuShown] = useState(false);
    const toggleMenu = () => setMenuShown(!isMenuShown);

    const buttonRef = useRef(null);

    // Hides the menu if it loses focus
    const checkHideMenu = (event) => {
        if(event.target !== buttonRef.current && event.target !== buttonRef.current.querySelector('svg')){ 
            setMenuShown(false) 
        };
    }
    const listComponents = links.map(({id, title, url}) => <Link key= { id } to={ url }><li key={ id }>{ title }</li></Link>)

    useEffect(()=>{
        document.addEventListener('mouseup', checkHideMenu);
        return ()=>{
            document.removeEventListener('mouseup',checkHideMenu)
        }
    }, []);
    
    return(<div className={style.floatingContainer} ref={ref}><nav className={style.nav}>
        <button className={style.button} onClick={ toggleMenu } ref={buttonRef}><MenuIcon /></button>
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