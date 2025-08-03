import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-black text-white py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Simply Deck<span className="text-yellow-500"> Your Busy Day.</span></h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">Turn busy days into organized wins.</p>
            <div className="flex justify-center space-x-4">
              <Link to="/register"><Button variant="accent">Get Started</Button></Link>
              <a 
                href="#about" 
                className="inline-block"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('about');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <Button variant="outline-dark">
                  Learn More
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-12 text-black">Features</h3>
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

        {/* About Section */}
        <section id="about" className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
                <h2 className="text-3xl font-bold text-black mb-6">About DoDeck</h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  DoDeck is a powerful yet simple task management application designed to help you stay organized and productive. 
                  Whether you're managing personal tasks or collaborating with a team, DoDeck provides the tools you need to 
                  streamline your workflow and achieve your goals efficiently.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                  Our intuitive interface makes it easy to create, organize, and prioritize tasks, set deadlines, and track 
                  your progress. With features like task categorization, priority levels, and due date tracking, you'll never 
                  miss an important deadline again.
                </p>
                <Button variant="accent">Get Started with DoDeck</Button>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <img 
                  src="/src/assets/Pic3.png" 
                  alt="Task Management with DoDeck" 
                  className="max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section id="contact" className="py-16 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-black">Contact Us</h2>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <form className="space-y-6" action="https://formspree.io/f/xanbdwkj" method="POST">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      placeholder="Your Email Address"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="How can we help you?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Your message here..."
                  ></textarea>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-yellow-500 text-black font-medium rounded-md hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
