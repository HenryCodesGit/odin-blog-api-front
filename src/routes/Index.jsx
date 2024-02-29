import css from '../styles/index.module.css'

import { useState } from "react";
import { useParams } from "react-router-dom"; // Parameters from page query

import NavExpanding from '../components/NavExpanding';
import NavDropDown from '../components/NavDropdown';

function Index() {
  const [heading, setHeading] = useState("Magnificient monkeys d");
  const params = useParams()

  const clickHandler = () => {setHeading("Radical Rhinos");}

  // return (<>
  //   <h1>{heading}</h1>
  //   <button type="button" onClick={clickHandler}>Click me</button>
  // </>);

  const makeLink = (id, title, url) => {return {id, title, url}};
  const linkArray = [
    makeLink(1,'Home','/'),
    makeLink(2,'Blog','/'),
    makeLink(3,'Portfolio','/'),
    makeLink(4,'About Me','/'),
    makeLink(5,'Contact','/'),
    makeLink(6,'Really long list element','/')
  ];
  return (<>
    <header className='nav-container'>
      {/* <div className='logo'>Logo Here</div> */}
      <NavExpanding links = {linkArray}></NavExpanding>
    </header>
  </>)
}

export default Index;
