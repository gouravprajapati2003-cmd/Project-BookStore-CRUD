import Carousel from 'react-bootstrap/Carousel'

import slide1 from './assets/slide1.webp'
import slide2 from './assets/slide2.webp'
import slide3 from './assets/slide3.webp'
import slide4 from './assets/slide4.webp'

function ImageSlider () {
  const slides = [
    { image: slide1, alt: 'G.K.P BookStore Collection - Slide 1' },
    { image: slide2, alt: 'G.K.P BookStore Collection - Slide 2' },
    { image: slide3, alt: 'G.K.P BookStore Collection - Slide 3' },
    { image: slide4, alt: 'G.K.P BookStore Collection - Slide 4' }
  ]

  return (
    <>
      <style>
        {`
          .home-slider {
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 8px 28px rgba(20, 45, 78, 0.12);
            background: #edf2f7;
          }

          .home-slider .carousel-item img {
            width: 100%;
            height: 310px;
            object-fit: cover;
            display: block;
          }

          .home-slider .carousel-indicators {
            margin-bottom: 12px;
          }

          .home-slider .carousel-control-prev,
          .home-slider .carousel-control-next {
            width: 8%;
          }

          @media (max-width: 768px) {
            .home-slider .carousel-item img {
              height: 190px;
            }
          }

          @media (max-width: 480px) {
            .home-slider {
              border-radius: 12px;
            }

            .home-slider .carousel-item img {
              height: 145px;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .home-slider .carousel-item {
              transition: none !important;
            }
          }
        `}
      </style>

      <Carousel
        className='home-slider'
        fade
        interval={4000}
        pause='hover'
        indicators
        controls
        touch
      >
        {slides.map((slide, index) => (
          <Carousel.Item key={index}>
            <img src={slide.image} alt={slide.alt} />
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  )
}

export default ImageSlider
