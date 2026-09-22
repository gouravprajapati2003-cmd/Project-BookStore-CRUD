import 'bootstrap/dist/css/bootstrap.min.css'

import NavBar from './NavBar.jsx'
import ImageSlider from './ImageSlider.jsx'
import HomeCard from './HomeCard.jsx'
import Footer from './Footer.jsx'

function App () {
  return (
    <>
      <NavBar />

      <div className = 'mt-1'>
      <ImageSlider />
      </div>
      

      <HomeCard />

      <Footer />
    </>
  )
}

export default App
