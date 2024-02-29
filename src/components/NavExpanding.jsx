import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';

import style from '../styles/components/NavExpanding.module.css'

import NavDropdown from '../components/NavDropdown'

//import debounce from '../utilities/debounce'


// TODO: 
// Bar expands horizontally with items when there is space. 
//As space runs out, things get hidden and hamburger menu is shown with hidden items, until everything is hidden

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

function Component({ links }){
    const listHTML = useRef(null);
    const buttonHTML = useRef();

    const listHTMLChildren = useRef([]); //Ref needed for the useEffect, calculating component width

    const listComponents = links;
    
    const [expanding, setExpanding] = useState(listComponents);
    const [lastKnownWidths, setLastKnownWidths] = useState({}); //Keep track of last known width of the object before de-rendering

    function debounce(func, interval){
        let timer;
        return (params) => {
            if(timer) clearTimeout(timer);
            timer = setTimeout(func, interval, params);
        }
    }

    // Check size of window and see if need to re-render the elements. Debounce is used as a low-pass filter to prevent many function calls in succession
    // Note: Suppressing the eslint rule below, but only because I tested it with inline and there were no warnings.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const resizeCheck = useCallback(debounce(()=>{
        console.log('Running resize check');
        console.log(listComponents);
        console.log(expanding);
        console.log(lastKnownWidths);

        // Iterate through array and populate 'newExpanding' array for items that do not overflow
        const newExpanding = [];
        const newLastknownWidth = {...lastKnownWidths};
        const navWidth = listHTML.current.scrollWidth;
        let itemWidths = listHTMLChildren.current.reduce((sum,item)=> {
            const itemWidth = item.clientWidth + parseInt(getComputedStyle(item).marginLeft) + parseInt(getComputedStyle(item).marginRight);
            const currentSum = sum + itemWidth;


            if(currentSum * (1.10) < navWidth - buttonHTML.current.clientWidth){             // Extra 10% to be sure
                const foundEntry = expanding.find((entry)=>entry.id.toString()===item.dataset.key);
                if(foundEntry) newExpanding.push(foundEntry)
            } else {
                newLastknownWidth[item.dataset.key] = itemWidth;
            }
            return currentSum;
        },0);

        let isDifferentArrays = !(newExpanding.length === expanding.length && newExpanding.every((element, index) =>  element === expanding[index]))
        if(isDifferentArrays) {
            listHTMLChildren.current = []; // Reset the listHTMLChildren array (it is repopulated by the render)
            setExpanding(newExpanding);
            setLastKnownWidths(newLastknownWidth);
            return;
        }

        // If it gets this far, then instead of shrinking, the window might be expanding, check to see if we can put one of the items back in
        // Iterate through the lastKnownWidth array and see if we can put back the elements
        for(const item in newLastknownWidth){
            const newItemWidth = newLastknownWidth[item] + itemWidths;
            const canFitInsideNavBar = newItemWidth * (1.10) < navWidth; //Extra 10% to be sure
            if(!canFitInsideNavBar) break;
            
            itemWidths = newItemWidth;

            const foundEntry = listComponents.find((entry)=>entry.id.toString()===item)
            if(foundEntry){ 
                delete newLastknownWidth[item];
                newExpanding.push(foundEntry) 
            }
        }

        isDifferentArrays = !(newExpanding.length === expanding.length && newExpanding.every((element, index) =>  element === expanding[index]))
        if(isDifferentArrays) {
            listHTMLChildren.current = []; // Reset the listHTMLChildren array (it is repopulated by the render)
            setExpanding(newExpanding);
            setLastKnownWidths(newLastknownWidth);
            return;
        }

    },100),[expanding, lastKnownWidths, listComponents]);


    useEffect(()=>{

        window.addEventListener('resize', resizeCheck);

        resizeCheck();

        // Cleanup
        return ()=>{
            console.log('Cleaning up useEffect because re-render is triggered')
            window.removeEventListener('resize', resizeCheck)
        }
    }, [resizeCheck])

    return(
        <nav className = {style.nav}>
            <ul className = {style.ul} ref={listHTML}>
                {expanding.map(({id, title, url}) => (<li key={ id } ref={(e) => { 
                    if(e) listHTMLChildren.current.push(e);
                }} data-key={ id }><Link key= {id} to={url}>{title}</Link></li>))}
                <NavDropdown links={links} ref={buttonHTML}/>
            </ul> 
        </nav>
    );
}


export default Component;