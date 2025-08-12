import Header from "../components/Header"
import Navbar from "../components/Navbar"


const Home = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-[url('/bg_img.png')] bg-center bg-cover">
      <Navbar/>
      <Header/>
    </div>
  )
}

export default Home
