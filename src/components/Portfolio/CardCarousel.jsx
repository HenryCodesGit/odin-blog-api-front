import style from '/src/styles/components/CardCarousel.module.css'

import melona from '/src/assets/img/pets/melona.png'
import aslan from '/src/assets/img/pets/aslan.png'
import lia from '/src/assets/img/pets/lia.png'
import chester from '/src/assets/img/pets/chester.png'

import Card from '/src/components/Portfolio/Card'

Carousel.propTypes = {
};

Carousel.defaultProps = {
};

// TODO: Simple carousel that shows a grid of cards
function Carousel(){

    return(<ul className={style.container}>
        <Card imgURL={melona} description='My dog, melona'/>
        <Card imgURL={lia} description="Mark's cat, Lia"/>
        <Card imgURL={aslan} description="Jenny's cat, Aslan"/>
        <Card imgURL={chester} description="Denzel's rabbit, Chester"/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
    </ul>);
}

export default Carousel;