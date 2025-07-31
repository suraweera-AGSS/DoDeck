import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-black text-white py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Organize Your <span className="text-yellow-500">Work & Life</span></h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              DoDeck helps you stay organized and focused on what matters most.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="accent">Get Started</Button>
              <Button variant="outline-dark">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-12 text-black">Features</h1>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Task Management',
                  description: 'Easily create, organize, and prioritize your tasks.'
                },
                {
                  title: 'Collaboration',
                  description: 'Share tasks and projects with your team members.'
                },
                {
                  title: 'Analytics',
                  description: 'Track your productivity with detailed insights.'
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white p-8 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-black">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
