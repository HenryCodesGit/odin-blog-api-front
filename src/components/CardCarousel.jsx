import style from '../styles/components/CardCarousel.module.css'

import melona from '../assets/img/pets/melona.png'
import aslan from '../assets/img/pets/aslan.png'
import lia from '../assets/img/pets/lia.png'
import chester from '../assets/img/pets/chester.png'

import Card from '../components/Card'

// TODO: Simple carousel that shows a grid of cards
function Component(){

    return(<ul className={style.container}>
        <Card imgURL={melona} description='MY DOG, MELONA'/>
        <Card imgURL={lia} description="MARK'S CAT, LIA"/>
        <Card imgURL={aslan} description="JENNY'S CAT, ASLAN"/>
        <Card imgURL={chester} description="DENZEL'S RABBIT, CHESTER"/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
    </ul>);
}

Component.propTypes = {
};

Component.defaultProps = {
};

export default Component;