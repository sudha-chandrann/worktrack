"use client"
import { IoCheckmarkDoneCircle, IoStatsChart, IoCalendarClear } from "react-icons/io5";
import { FaUsers, FaChevronRight, FaPlay } from "react-icons/fa6";
import { Montserrat, Playfair_Display } from 'next/font/google';
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "./_components/Footer";
import CTASection from "./_components/CTASection";

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export default function Home() {
  const router = useRouter();
  
  return (
    <div className={`${montserrat.variable} ${playfair.variable} font-sans bg-gray-950 text-gray-100`}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-playfair text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            WorkTrack
          </h1>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-cyan-400 transition-colors">Features</a>
            <a href="#testimonials" className="text-gray-300 hover:text-cyan-400 transition-colors">Testimonials</a>
            <a href="#pricing" className="text-gray-300 hover:text-cyan-400 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/login")}
              className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors"
            >
              Log in
            </button>
            <button
              onClick={() => router.push("/register")}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-5 py-2 rounded-full hover:from-cyan-400 hover:to-purple-500 transition-all shadow-lg shadow-cyan-900/30"
            >
              Start free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-gray-900 via-gray-950 to-black relative overflow-hidden">
        {/* Abstract glow effects */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0 md:pr-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 font-playfair bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Master your workflow, unleash your potential.
              </h1>
              <p className="text-lg text-gray-400 mb-8 max-w-lg">
              WorkTrack empowers teams to break through productivity barriers with AI-enhanced task management, seamless collaboration, and powerful analytics.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => router.push("/register")}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-cyan-400 hover:to-purple-500 transition-all shadow-lg shadow-cyan-900/30 flex items-center justify-center group"
                >
                  Get started for free <FaChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="bg-gray-800 text-white px-8 py-3 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors shadow-md flex items-center justify-center">
                  <FaPlay className="mr-2 text-cyan-400" /> Watch demo
                </button>
              </div>
              <div className="mt-8 flex items-center text-sm text-gray-400">
                <IoCheckmarkDoneCircle className="text-cyan-400 mr-2" />
                No credit card required
                <span className="mx-3">•</span>
                <IoCheckmarkDoneCircle className="text-cyan-400 mr-2" />
                Free 14-day trial
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-800 transform hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 z-10"></div>
                <Image
                  src="/dashboard.png"
                  alt="FlowTask Dashboard"
                  width={600}
                  height={400}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEggJ4YszgAAAAAElFTkSuQmCC"
                  className="w-full h-auto relative z-0"
                />
              </div>
            </div>
          </div>

          {/* Trusted by */}
          <div className="mt-20">
            <p className="text-center text-gray-500 mb-8">Trusted by forward-thinking teams worldwide</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50">
              <span className="text-xl font-medium text-gray-400">Accenture</span>
              <span className="text-xl font-medium text-gray-400">Deloitte</span>
              <span className="text-xl font-medium text-gray-400">Microsoft</span>
              <span className="text-xl font-medium text-gray-400">Shopify</span>
              <span className="text-xl font-medium text-gray-400">Airbnb</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Powerful features that adapt to your workflow</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Our intelligent platform evolves with your needs, providing the right tools at the right time
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-cyan-900/20 transition-shadow border border-gray-800 hover:border-cyan-900/50 group">
              <div className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white rounded-full w-14 h-14 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <IoCalendarClear className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">AI-Powered Task Management</h3>
              <p className="text-gray-400">
                Our intelligent system learns from your habits, automatically prioritizes tasks, and suggests optimal workflows to maximize your productivity.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-purple-900/20 transition-shadow border border-gray-800 hover:border-purple-900/50 group">
              <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-full w-14 h-14 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaUsers className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Advanced Team Collaboration</h3>
              <p className="text-gray-400">
                Break down silos with real-time collaborative spaces, contextual communication, and seamless file sharing that keeps everyone aligned.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-cyan-900/20 transition-shadow border border-gray-800 hover:border-cyan-900/50 group">
              <div className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white rounded-full w-14 h-14 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <IoStatsChart className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Predictive Analytics</h3>
              <p className="text-gray-400">
                Transform data into actionable insights with customizable dashboards that forecast potential bottlenecks and suggest process improvements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gradient-to-br from-gray-950 to-black relative overflow-hidden">
        {/* Abstract glow effects */}
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-purple-700/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Transform your workflow in three steps</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Get started in minutes with our intuitive onboarding process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 relative border border-gray-800 hover:border-cyan-900/50 transition-colors">
              <div className="absolute -top-5 -left-5 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg shadow-cyan-900/30">
                1
              </div>
              <h3 className="text-xl font-bold mb-3 mt-4 text-white">Create your workspace</h3>
              <p className="text-gray-400">
                Sign up in seconds and customize your workspace with our intuitive templates designed for your specific workflow.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 relative border border-gray-800 hover:border-purple-900/50 transition-colors">
              <div className="absolute -top-5 -left-5 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg shadow-purple-900/30">
                2
              </div>
              <h3 className="text-xl font-bold mb-3 mt-4 text-white">Connect your team</h3>
              <p className="text-gray-400">
                Invite team members, assign roles, and establish automated workflows that adapt to your team&apos;s unique processes.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 relative border border-gray-800 hover:border-cyan-900/50 transition-colors">
              <div className="absolute -top-5 -left-5 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold shadow-lg shadow-cyan-900/30">
                3
              </div>
              <h3 className="text-xl font-bold mb-3 mt-4 text-white">Accelerate your progress</h3>
              <p className="text-gray-400">
                Watch as our AI learns your patterns, automates routine tasks, and provides insights that drive continuous improvement.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => router.push("/register")}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-cyan-400 hover:to-purple-500 transition-all shadow-lg shadow-cyan-900/30 font-medium"
            >
              Start your free trial
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Trusted by industry leaders</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              See how organizations are achieving exceptional results with FlowTask
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-800 rounded-2xl p-8 shadow-md hover:shadow-cyan-900/20 transition-shadow border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-400 rounded-full mr-4 flex items-center justify-center text-white font-bold">SJ</div>
                <div>
                  <h4 className="font-bold text-white">Sarah Johnson</h4>
                  <p className="text-gray-400 text-sm">CMO at TechVision</p>
                </div>
              </div>
              <p className="text-gray-300">
                &ldquo;WorkTrack&lsquo;s predictive analytics transformed our marketing strategy. We&rsquo;ve reduced campaign planning time by 60% and increased our ROI by 35%.&quot;
              </p>
              <div className="flex text-cyan-400 mt-4">
                ★★★★★
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-800 rounded-2xl p-8 shadow-md hover:shadow-purple-900/20 transition-shadow border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-500 rounded-full mr-4 flex items-center justify-center text-white font-bold">MC</div>
                <div>
                  <h4 className="font-bold text-white">Michael Chen</h4>
                  <p className="text-gray-400 text-sm">CTO at InnovateCorp</p>
                </div>
              </div>
              <p className="text-gray-300">
                &quot;Our development cycles have shortened by 40% since implementing WorkTrack. The AI-powered insights have eliminated bottlenecks we didn&lsquo;t even know existed.&quot;
              </p>
              <div className="flex text-cyan-400 mt-4">
                ★★★★★
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gray-800 rounded-2xl p-8 shadow-md hover:shadow-cyan-900/20 transition-shadow border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-400 rounded-full mr-4 flex items-center justify-center text-white font-bold">ER</div>
                <div>
                  <h4 className="font-bold text-white">Emma Rodriguez</h4>
                  <p className="text-gray-400 text-sm">Founder at DesignLab</p>
                </div>
              </div>
              <p className="text-gray-300">
                &ldquo;As my agency scaled from 3 to 25 designers, WorkTrack maintained our creative excellence while tripling client capacity. It&lsquo;s been instrumental to our growth.&quot;
              </p>
              <div className="flex text-cyan-400 mt-4">
                ★★★★★
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-2xl bg-gray-900/50 backdrop-blur-md border border-gray-800">
              <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent mb-2">350,000+</p>
              <p className="text-gray-400">Active users worldwide</p>
            </div>
            <div className="p-6 rounded-2xl bg-gray-900/50 backdrop-blur-md border border-gray-800">
              <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 to-purple-400 bg-clip-text text-transparent mb-2">4.9/5</p>
              <p className="text-gray-400">Average user rating</p>
            </div>
            <div className="p-6 rounded-2xl bg-gray-900/50 backdrop-blur-md border border-gray-800">
              <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">98%</p>
              <p className="text-gray-400">Customer retention rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
       <CTASection/>

      {/* Footer */}
      <Footer/>
    </div>
  );
}