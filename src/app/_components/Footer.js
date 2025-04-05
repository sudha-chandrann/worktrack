import React from 'react'

function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-gray-900">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-6 font-playfair">
            WorkTrack
          </h3>
          <p className="text-gray-400 mb-6">
            Transform how your team works with our AI-powered productivity platform. Streamline workflows, eliminate bottlenecks, and achieve more than you thought possible.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-500 hover:text-cyan-400 transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-cyan-400 transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-6 text-white">Product</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Features</a></li>
            <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Pricing</a></li>
            <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Integrations</a></li>
            <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Enterprise</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-6 text-white">Resources</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Blog</a></li>
            <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Help Center</a></li>
            <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Guides & Tutorials</a></li>
            <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">API Documentation</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-6 text-white">Company</h4>
          <ul className="space-y-3">
            <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">About Us</a></li>
            <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Careers</a></li>
            <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Contact</a></li>
            <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} WorkTrack. All rights reserved.</p>
      </div>
    </div>
  </footer>
  )
}

export default Footer
