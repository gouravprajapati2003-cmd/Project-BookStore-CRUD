import Carousel from 'react-bootstrap/Carousel'

import slide1 from './assets/slide1.webp'
import slide2 from './assets/slide2.webp'
import slide3 from './assets/slide3.webp'
import slide4 from './assets/slide4.webp'

function ImageSlider () {
  const slides = [
    {
      image: slide1,
      alt: 'G.K.P BookStore book collection',
      eyebrow: 'Welcome to G.K.P BookStore',
      title: 'Discover Your Next Favourite Book',
      description:
        'Explore amazing stories, timeless classics and exciting new reads.',
      button: 'Explore Books',
      icon: 'bi-book-half'
    },
    {
      image: slide2,
      alt: 'Fiction and educational books',
      eyebrow: 'Stories That Inspire',
      title: 'Every Book Opens a New World',
      description: 'Find inspiration, imagination and knowledge in every page.',
      button: 'Discover Stories',
      icon: 'bi-stars'
    },
    {
      image: slide3,
      alt: 'Programming and technology books',
      eyebrow: 'Learn. Build. Grow.',
      title: 'Turn Your Ideas Into Reality',
      description:
        'Discover programming, technology and computer science books.',
      button: 'Explore Learning',
      icon: 'bi-code-slash'
    },
    {
      image: slide4,
      alt: 'Books and learning resources',
      eyebrow: 'Knowledge For Everyone',
      title: 'Your Learning Journey Starts Here',
      description:
        'Read more, learn more and take your next step towards success.',
      button: 'Start Exploring',
      icon: 'bi-lightbulb'
    }
  ]

  return (
    <>
      <style>
        {`
          .home-slider {
            border-radius: 18px;
            overflow: hidden;
            background: #173d3a;
            box-shadow: 0 10px 30px rgba(23, 61, 58, 0.15);
          }

          .home-slider .carousel-item {
            position: relative;
          }

          .slider-image {
            width: 100%;
            height: 340px;
            object-fit: cover;
            display: block;
          }

          .slider-overlay {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            padding: 30px 9%;
            background: linear-gradient(
              90deg,
              rgba(12, 42, 39, 0.88) 0%,
              rgba(12, 42, 39, 0.65) 45%,
              rgba(12, 42, 39, 0.05) 100%
            );
          }

          .slider-content {
            max-width: 390px;
            color: white;
          }

          .slider-eyebrow {
            display: inline-block;
            color: #d6f0df;
            background: rgba(255,255,255,0.15);
            border: 1px solid rgba(255,255,255,0.25);
            border-radius: 25px;
            padding: 7px 14px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 17px;
            font-family: Arial, sans-serif;
          }

          .slider-title {
            color: #fff;
            font-size: clamp(24px, 3vw, 37px);
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 13px;
            letter-spacing: -0.7px;
          }

          .slider-description {
            color: #e5eee9;
            font-size: 13px;
            line-height: 1.8;
            margin-bottom: 22px;
            font-family: Arial, sans-serif;
          }

          .slider-button {
            background: #e5f1e9 !important;
            color: #087b70 !important;
            border: none !important;
            border-radius: 25px !important;
            padding: 10px 20px !important;
            font-size: 12px !important;
            font-weight: 700 !important;
            font-family: Arial, sans-serif;
            transition: all 0.3s ease !important;
          }

          .slider-button:hover {
            background: #fff !important;
            transform: translateY(-2px);
          }

          .home-slider .carousel-indicators {
            margin-bottom: 13px;
            z-index: 3;
          }

          .home-slider .carousel-indicators button {
            width: 24px;
            height: 4px;
            border-radius: 10px;
            border: none;
            margin: 0 4px;
          }

          .home-slider .carousel-control-prev,
          .home-slider .carousel-control-next {
            width: 7%;
            z-index: 4;
          }

          @media (max-width: 768px) {
            .slider-image {
              height: 260px;
            }

            .slider-overlay {
              padding: 20px 8%;
            }

            .slider-content {
              max-width: 310px;
            }

            .slider-title {
              font-size: 26px;
            }

            .slider-description {
              font-size: 12px;
            }
          }

          @media (max-width: 480px) {
            .home-slider {
              border-radius: 12px;
            }

            .slider-image {
              height: 220px;
            }

            .slider-overlay {
              padding: 15px 10%;
              background: linear-gradient(
                90deg,
                rgba(12, 42, 39, 0.9),
                rgba(12, 42, 39, 0.45)
              );
            }

            .slider-eyebrow {
              font-size: 9px;
              padding: 5px 9px;
              margin-bottom: 10px;
            }

            .slider-title {
              font-size: 22px;
              margin-bottom: 8px;
            }

            .slider-description {
              font-size: 11px;
              line-height: 1.5;
              margin-bottom: 12px;
            }

            .slider-button {
              padding: 8px 14px !important;
              font-size: 10px !important;
            }

            .home-slider .carousel-control-prev,
            .home-slider .carousel-control-next {
              width: 8%;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .home-slider .carousel-item,
            .slider-button {
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
            <img src={slide.image} alt={slide.alt} className='slider-image' />

            <div className='slider-overlay'>
              <div className='slider-content'>
                <span className='slider-eyebrow'>{slide.eyebrow}</span>

                <h2 className='slider-title'>{slide.title}</h2>

                <p className='slider-description'>{slide.description}</p>

                <button
                  className='slider-button'
                  onClick={() => {
                    document
                      .getElementById('collection')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  <i className={`bi ${slide.icon} me-2`}></i>
                  {slide.button}
                  <i className='bi bi-arrow-right ms-2'></i>
                </button>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  )
}

export default ImageSlider
