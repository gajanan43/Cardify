import React, { useEffect } from 'react'
import CardList from '../features/card/CardList'
import { useLocation } from 'react-router-dom'

function Home() {
  const location = useLocation();

  useEffect(() => {
    const message = location.state?.message;

    if (message) {
      alert(message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.message]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold mb-6 text-center">
        Card Gallery
      </h1>

      <CardList />
    </div>
  );
}

export default Home;