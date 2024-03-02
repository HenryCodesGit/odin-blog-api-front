import styles from '../styles/index.module.css'

import NavExpanding from '../components/NavExpanding';
import CardCarousel from '../components/CardCarousel';

import heroImage from '../assets/img/table-top/andrej-lisakov-3A4XZUopCJA-unsplash.jpg'

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
    makeLink(8,'A REALLY LONG TEXT THAT IS ABSURDLY LONG AND MIGHT NOT FIT ON THE PAGE','/8'),
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
          <div className={styles.profile}>
              <p className={`${styles.title} ${styles.cornerBorderBox}`}>Henry Ma</p>
              <p className={styles.description}>This is where I normally put flavor-text, but I just wanted to mention that I love my dog</p>
          </div>
      </div>
      <div className={styles.section}>
        <h1 className={`${styles.title} ${styles.header1}`}>Portfolio</h1>
        <div className={styles.container}>
            <CardCarousel />
        </div>
      </div>
    </main>
  </>)
}

export default Index;
