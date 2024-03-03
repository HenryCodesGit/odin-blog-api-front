import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';

import style from '../styles/components/NavExpanding.module.css'

import NavDropdown from '../components/NavDropdown'

import useResizeEffect from '../utilities/react-utils/useResizeEffect';


// TODO: Nav bar currently requires serial ids starting from 1. Refactor with object reference instead of array reference for listItemsHTML and iterate through collection

Component.propTypes = {
    links: // Array of links to be generated into the nav bar
        PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            url: PropTypes.string,
        })),
        className: PropTypes.string,
};

Component.defaultProps = {
    links: [],
    className: ''
  };

function Component({ links, className }){

    // Factor of safety for when the elements start hiding. Makes elements hide slightly earlier than they actually would
    const FOS = 1.10;

    // useRef to get HTML components
    const buttonHTML = useRef();
    const listItemsHTML = useRef([]);
    const navHTML = useRef(null);

    // State for what items belong in the dropdown menu
    const [dropdownItems, setDropdownItems] = useState([]);

    useResizeEffect(()=>{
        // Get total width of Nav
        const navWidth = navHTML.current.scrollWidth;

        // Iterate through the hidden elements setting each to visibility: visible, until possible overflow
        const {elementsShown} = listItemsHTML.current.reduce(
            ({initialValue, elementsShown},item) => {
                let currentSum = initialValue + item.clientWidth + parseInt(getComputedStyle(item).marginLeft) + parseInt(getComputedStyle(item).marginRight);
                if(currentSum * FOS <= navWidth){
                    item.style.visibility = 'visible'
                    item.style.position = 'static'
                    elementsShown += 1;
                }
                return {initialValue: currentSum, elementsShown};
            }, 
            /* Initial width is set to be width of the button in case it is currently visible.
            *  This also results in elements hiding slightly earlier if the button is not currently shown */
            {initialValue: buttonHTML.current.clientWidth, elementsShown: 0} 
        );
    
        // The remaining elements will overflow, so we hide them and set position to absolute to remove from document flow
        const dropdown = [];
        for(let i = elementsShown; i < listItemsHTML.current.length; i+=1){
            listItemsHTML.current[i].style.visibility = 'hidden';
            listItemsHTML.current[i].style.position = 'absolute';
            dropdown.push(links[i]);
        }

        //Set button visibility depending on if there are items, and then update state to populate the navbar
        buttonHTML.current.style.visibility = dropdown.length ? 'visible' : 'hidden'
        buttonHTML.current.style.position = dropdown.length ? 'static' : 'absolute'
        setDropdownItems(dropdown);

    }, [links],{debounce: 30})

    return(
        <nav className = {`${style.nav} ${className}`}>
            <ul className = {style.ul} ref={navHTML}>
                {links.map(({id, title, url}) => (<><li className = {style.li} key={ id } ref={(e) => { 
                    if(e) listItemsHTML.current[id-1] = e; //TODO: Currently expanding nav only accepts serial increasing ids starting from 1.
                }} data-key={ id } style={{visibility: 'hidden', position: 'absolute'}}><Link key= {id} to={url}>{title}</Link></li></>))}
                <NavDropdown links={dropdownItems} ref={buttonHTML}/>
            </ul> 
        </nav>
    );
}


export default Component;