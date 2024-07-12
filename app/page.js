import React from 'react'
import backgroundImage from '../public/background.jpg';
import Header from './dashboard/_components/Header';

function Home() {
  return (
    <div>
    <Header/>
    <div style={{
      // use the src property of the image object
      backgroundImage: `url(${backgroundImage.src})`,
      // other styles
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      width: "100vw",
      height: "100vh",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }} className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      
      <h1 className="text-4xl font-bold mb-4">Your Personal AI Interview Coach</h1>
      <p className="text-lg text-gray-700 mb-6">Double your chances of landing that job offer with our AI-powered interview prep</p>
      <div className="flex space-x-4 mb-6">
        <a href="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Get Started</a>
        <a href="/sign-in" className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg">Watch video</a>
      </div>

    </div>
    </div>
  )
}

export default Home