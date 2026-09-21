import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import NavBar from './NavBar.jsx'
import ImageSlider from './ImageSlider.jsx'
import HomeCard from './HomeCard.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <NavBar></NavBar>
    <ImageSlider></ImageSlider>
    <HomeCard></HomeCard>
  </StrictMode>,
)
