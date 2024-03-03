import styles from '../styles/index.module.css'

import NavExpanding from '../components/NavExpanding';
import CardCarousel from '../components/CardCarousel';
import HeroCanvas from '../components/HeroCanvas'
import SkillsCanvas from '../components/SkillsCanvas'

import MatterCanvas from '../utilities/matter-react-utils/MatterCanvas';

function Index() {

  const makeLink = (id, title, url) => {return {id, title, url}};
  const linkArray = [
    makeLink(1,'HOME','/1'),
    makeLink(2,'BLOG','/2'),
    makeLink(3,'PORTFOLIO','/3'),
    makeLink(4,'CONTACT','/4'),
    makeLink(5,'PICTURES OF MY DOG','/5'),
    makeLink(6,'SHOP?','/6'),
    makeLink(7,'GAMES','/7'),
  ];

  return (<>
    <header className={styles.header}>
      {/* <div className= {styles.logo}></div> */}
      <div className={styles.flexElement}>
        <NavExpanding className={styles.navExpanding} links = {linkArray}></NavExpanding>
      </div>
    </header>
    <main>
      <div className={`${styles.hero} ${styles.section}`}>
          <HeroCanvas />
          <div className={styles.profile}>
              <p className={`${styles.title} ${styles.cornerBorderBox}`}>Henry Ma</p>
              <p className={styles.description}>MOTIVATED // DILIGENT // VERSATILE // ..ALSO LOVES DOGS</p>
          </div>
      </div>
      <div className={styles.section}>
        <h1 className={`${styles.title} ${styles.header1}`}>Portfolio // Animal pictures</h1>
        <div className={styles.container}>
            <CardCarousel />
        </div>
      </div>
      <div className={styles.section}>
        <h1 className={`${styles.title} ${styles.header1}`}>Skills</h1>
        <div className={styles.container}>
          <MatterCanvas />
        </div>
      </div>
      <div className={styles.section}>
        <h1 className={`${styles.title} ${styles.header1}`}>Hobbies</h1>
        <div className={styles.container}>
        </div>
      </div>
      <div className={styles.section}>
        <h1 className={`${styles.title} ${styles.header1}`}>Contact Me</h1>
        <div className={styles.container}>
        </div>
      </div>
    </main>
  </>)
}

export default Index;
