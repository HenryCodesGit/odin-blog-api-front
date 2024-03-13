// React
import { Outlet } from 'react-router-dom';
// Styling
import '../styles/globals.css'; // Global CSS File between the routes
import style from '../styles/routes/app.module.css' // Module specific CSS file
// Component
import NavExpanding from '../components/NavExpanding';

function App() {

  const makeLink = (id, title, url) => {return {id, title, url}};
  const linkArray = [
    makeLink(1,'HOME','/'),
    makeLink(2,'ABOUT','/about'),
    makeLink(3,'PORTFOLIO','/portfolio'),
    makeLink(4,'BLOG','/blog'),
    makeLink(5,'CONTACT','/contact'),
  ];

  return (
    <div className={style.container}>
      <div className={style.gridLines} />
      <header className={style.header}><NavExpanding className={style.navExpanding} links = {linkArray} /></header>
      <Outlet />
    </div>
  );
}

export default App;