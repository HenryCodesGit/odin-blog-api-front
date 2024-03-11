import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect, useCallback } from 'react';

import style from '../styles/components/NavExpanding.module.css'

import NavDropdown from '../components/NavDropdown'

import useResizeEffect from '../utilities/react-utils/useResizeEffect';

// TODO: Nav bar currently requires serial ids starting from 1.
// Refactor with object reference instead of array reference for listItemsHTML and iterate through collection
NavExpanding.propTypes = {
    links: // Array of links to be generated into the nav bar
        PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            url: PropTypes.string,
        })),
        className: PropTypes.string,
};

NavExpanding.defaultProps = {
    links: [],
    className: ''
  };

function NavExpanding({ links, className }){

    // Factor of safety for when the elements start hiding. Makes elements hide slightly earlier than they actually would
    const FOS = 1.10;

    // useRef to get HTML components
    const buttonHTML = useRef();
    const listItemsHTML = useRef([]);
    const navHTML = useRef(null);

    // State for what items belong in the dropdown menu
    const [dropdownItems, setDropdownItems] = useState([]);
    
    // TODO: Set visibility as a toggle-able class instead of hardcoding below.
    const checkForResize = useCallback(function(){ // Callback function
        
        // Get total width of Nav
        const navWidth = navHTML.current.scrollWidth;

        // Iterate through the hidden elements setting each to visibility: visible, unless the element results in overflow
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
            // Initial values for reduce
            // Initial width is set to the buttons's just in case it is visible.
            // Results in elements hiding  earlier if the button is not currently shown
            {   
                initialValue: buttonHTML.current.clientWidth,
                elementsShown: 0 
            } 
        );
    
        // Compared to the length of listItemsHTML, a lower elementsShown value means the reset of items in listitemsHTML will overflow the container
        // Therefore hide them and remove them from document flow.
        const dropdown = [];
        for(let i = elementsShown; i < listItemsHTML.current.length; i+=1){
            listItemsHTML.current[i].style.visibility = 'hidden';
            listItemsHTML.current[i].style.position = 'absolute';
            dropdown.push(links[i]);
        }

        //Set button visibility depending on if there are items, and then update state to populate the navbar
        buttonHTML.current.style.visibility = dropdown.length ? 'visible' : 'hidden'
        buttonHTML.current.style.position = dropdown.length ? 'static' : 'absolute'
        
        // Set the state of items to go into the dropdown menu.
        // Run this recursively by looping the useEffect until the break condition is hit (the new state is the same as existing)
        if(dropdown.length === dropdownItems.length) return; 
        setDropdownItems(dropdown);

    },[dropdownItems,links])
    
    useResizeEffect(
        checkForResize,
        ()=>{}, // Cleanup
        [links], // Additional Dependencies
        {debounce: 50, runInitial: false} // Options
    );

    useEffect(()=>{
        checkForResize();
    },[checkForResize])

    const listComponents = links.map(({id, title, url}) => (
        <li className = {style.li} key={ id } ref={(e) => {if(e) listItemsHTML.current[id-1] = e;}} data-key={ id } style={{visibility: 'hidden', position: 'absolute'}}>
            <Link key= {id} to={url}>{title}</Link>
        </li>
    ))

    return(
        <nav className = {`${style.nav} ${className}`}>
            <ul className = {style.ul} ref={navHTML}>
                {listComponents}
                <NavDropdown links={dropdownItems} ref={buttonHTML}/>
            </ul> 
        </nav>
    );
}


export default NavExpanding;