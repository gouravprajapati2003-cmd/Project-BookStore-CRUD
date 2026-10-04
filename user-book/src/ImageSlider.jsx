import Carousel from 'react-bootstrap/Carousel'
import slide1 from './assets/slide1.webp'
import slide2 from './assets/slide2.webp'
import slide3 from './assets/slide3.webp'
import slide4 from './assets/slide4.webp'
function ImageSlider () {
  return (
    <Carousel>
      <Carousel.Item>
        <img src={slide1} className='d-block w-100'></img>
        <Carousel.Caption>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src={slide2} className='d-block w-100'></img>
        <Carousel.Caption>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src={slide3} className='d-block w-100'></img>
        <Carousel.Caption>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src={slide4} className='d-block w-100'></img>
        <Carousel.Caption>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  )
}

export default ImageSlider;

