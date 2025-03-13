import React from 'react'
import { FaChevronRight } from 'react-icons/fa6'

function CTASection() {
  return (
    <section id="pricing" className="py-20 bg-gray-950">
    <div className="container mx-auto px-6">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden shadow-2xl border border-gray-800 relative">
        {/* Abstract glow effects */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-700/20 rounded-full blur-3xl"></div>
        
        <div className="p-12 md:p-16 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-6 font-playfair">
            Ready to revolutionize your workflow?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join the thousands of teams who&apos;ve unlocked their full potential with WorkTrack&lsquo;s intelligent platform.
          </p>
          <button
            onClick={() => router.push("/register")}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-cyan-400 hover:to-purple-500 transition-all shadow-lg shadow-cyan-900/30 font-medium text-lg group"
          >
            Start your free 14-day trial <FaChevronRight className="ml-2 inline-block group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-gray-500 mt-4">No credit card required. Upgrade only when you&rsquo;re ready.</p>
        </div>
      </div>
    </div>
  </section>
  )
}

export default CTASection
