
"use client"

import { useRouter } from 'next/navigation';

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"

export default function HomePage() {
     const router = useRouter()
    
  return (
    
    <div className="min-h-screen bg-white">
          <style jsx>{`/* Enhanced navbar styles */
  .navbar-link {
    position: relative;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 10px 16px;
    border-radius: 8px;
    font-weight: 500;
  }
  
  .navbar-link:hover {
    color: #14b8a6;
    background: linear-gradient(135deg, #f0fdfa, #ccfbf1);
    transform: translateY(-2px);
  }
  
  .navbar-link::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #14b8a6, #0d9488);
    transition: width 0.3s ease;
  }
  
  .navbar-link:hover::after {
    width: 100%;
  }
  
  .logo-container {
    transition: all 0.3s ease;
  }
  
  .logo-container:hover {
    transform: scale(1.05);
    filter: drop-shadow(0 4px 8px rgba(20, 184, 166, 0.2));
  }
  
  /* Smooth scroll for the entire page */
  html {
    scroll-behavior: smooth;
  }
  `}</style>
      {/* Header */}
    <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
    <div className="container mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="logo-container">
          <Image 
            src="/logo.svg" 
            alt="CIM Amplify Logo" 
            width={150} 
            height={50} 
            className="h-auto" 
          />
        </div>
        <nav className="hidden md:flex items-center gap-2">
          <a href="#benefits" className="navbar-link text-gray-600">
            Benefits
          </a>
          <a href="#how-it-works" className="navbar-link text-gray-600">
            How it Works
          </a>
          <a href="#marketplace" className="navbar-link text-gray-600">
            Marketplace
          </a>
          <a href="#faqs" className="navbar-link text-gray-600">
            FAQs
          </a>

          <a>
          <Button 
          
        

            className="bg-gradient-to-r from-teal-500 to-primary hover:from-primary hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ml-4" 
      
          >
            Get Started
          </Button>
          </a>
        </nav>
      </div>
    </div>
  </header>

  <section className="py-20 bg-gradient-to-b from-gray-50/30 to-white relative overflow-hidden mt-[150px]">
        {/* World Map Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-60">
            <Image
                src="/map.png"
                alt="World map background"
                width={1600}
                height={800}
                className="object-contain"
                priority
            />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
            {/* Golden Ring */}
            <div className="mb-12">
                <div className=" mx-auto relative flex items-center justify-center">
                    <Image
                        src="/ring.png"
                        alt="Golden brass ring"
                        width={600}
                        height={600}
                        className="object-contain drop-shadow-2xl"
                        priority
                    />
                </div>
            </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Seriously, John, You're Starting
            <br />
            Another Company?!
          </h1>

          <div className="max-w-5xl mx-auto mb-10">
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Greetings, John Martinez, a lifelong entrepreneur. From childhood ventures like lemonade stands to movies
              and selling books to successfully establishing and selling two major companies, entrepreneurship has
              always been my driving force. Even though CIM Amplify is my idea, I am supported by an excellent team that
              is excited to help business owners to sell their companies.
            </p>

            <div className="bg-teal-50 border border-teal-100 rounded-lg p-6 mb-8">
              <p className="text-teal-800 font-semibold text-lg">
                CIM Amplify was built with the singular mission of helping business owners get the "Brass Ring" of
                selling their companies.
              </p>
            </div>
          </div>

          <Button className="bg-primary hover:bg-teal-700 text-white px-8 py-4 text-lg font-semibold rounded-md">
            Let's do some deals!
          </Button>
        </div>
      </section>

      {/* Brass Ring Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">The "Brass Ring" of Business</h2>

          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            <div className="space-y-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                Selling is the <span className="font-bold text-primary">"Brass Ring"</span> of business ownership. We
                helped to build great companies that sustain a lot of great people but most of our net worth is tied up
                in those companies. It's time to find some liquidity - maybe retire.
              </p>

              <p className="text-gray-700 text-lg leading-relaxed">
                Since my <span className="font-bold text-primary">"Brass Ring"</span> I have worked extensively with
                both company buyers and sellers. Through that work I have become convinced that there are an enormous
                amount of deals not being seen by potential buyers.
              </p>

              <p className="text-gray-700 text-lg leading-relaxed">
                So far, CIM Amplify has proven me right. I hear all the time from Advisors
                <span className="font-bold"> "I haven't heard of that buyer before"</span> and from buyers{" "}
                <span className="font-bold">"I can't believe I haven't seen that deal before"</span>.
              </p>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-8">
                <Image
                  src="/pic4.png"
                  alt="Business team collaboration illustration"
                  width={400}
                  height={300}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-20 bg-gradient-to-r from-teal-50 via-blue-50 to-teal-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Months 1-10 Successes</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Fantastic launch in October 2024 with the help of many friends in EO and YPO as buyers and M&A Advisors.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-12">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-3">$3B</div>
              <p className="text-gray-600 font-medium">
                In great deals, not
                <br />
                completed deals.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-3">$1.1B</div>
              <p className="text-gray-600 font-medium">
                Sold M&A deals out
                <br />
                in the world.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-3">22M</div>
              <p className="text-gray-600 font-medium">
                In average
                <br />
                company revenue.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-3">200+</div>
              <p className="text-gray-600 font-medium">
                Buyers
                <br />
                onboard.
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-500 text-sm max-w-2xl mx-auto">
              Originally, CIM Amplify was a simple deal platform for M&A Advisors to showcase deals over $1 Million in
              EBITDA.
            </p>
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2">
                  <div className="relative h-80 lg:h-full">
                    <Image src="/pic2.png" alt="Ferris wheel family attraction" fill className="object-cover" />
                  </div>
                  <div className="p-8 lg:p-12">
                    <div className="bg-primary text-white px-4 py-2 rounded-md text-sm font-bold mb-6 inline-block">
                      ATTRACTION
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 leading-tight">
                      Opportunity to acquire a premier family attraction park in New England
                    </h3>
                    <div className="space-y-3 text-gray-700">
                      <p>
                        <span className="font-semibold">Industry:</span> Media and Entertainment
                      </p>
                      <p>
                        <span className="font-semibold">Additional Industry Information:</span>
                      </p>
                      <p>Family attraction park (zoo, amusement rides, etc.) and a fine dining restaurant</p>
                      <p>
                        <span className="font-semibold">Country of Headquarters:</span> United States of America
                      </p>
                      <p>
                        <span className="font-semibold">Revenue:</span> $7.5 Million EBITDA: $1.5-2 Million
                      </p>
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <p className="text-xs text-gray-500">Note: An original deal dropped from CIM Amplify v1</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              Problems We <span className="text-primary">Discovered</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Sellers Card */}
            <Card className="bg-white shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mr-4">
                    <CheckCircle className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Sellers</h3>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700">
                      "I can't post many deals here because I classify have to get pre-approval from my client for all
                      postings."
                    </p>
                  </div>
                  <div className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700">"The brokers are ruining my business."</p>
                  </div>
                </div>
                <Button className="bg-primary hover:bg-teal-700 text-white w-full py-3 font-semibold">
                  Start Selling
                </Button>
              </CardContent>
            </Card>

            {/* Buyers Card */}
            <Card className="bg-white shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mr-4">
                    <CheckCircle className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Buyers</h3>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700">
                      "I don't have time to scroll through deals—just send me the ones that meet my criteria."
                    </p>
                  </div>
                  <div className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700">"There are great deals—have I seen them before?"</p>
                  </div>
                </div>
                <Button className="bg-primary hover:bg-teal-700 text-white w-full py-3 font-semibold">
                  Start Exploring
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* We Listened Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                We <span className="text-primary">Listened</span>
              </h2>
              <div className="space-y-6">
                <div>
                  <p className="text-gray-900 font-semibold text-lg mb-2">What you can today - launched July 2024</p>
                </div>
                <p className="text-gray-700 text-lg">Sellers input deal details and then choose matched buyers</p>
                <p className="text-gray-700 text-lg">
                  Buyers only get deals matched to their criteria on an exclusive or first look basis
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-8">
                <Image
                  src="/pic3.png"
                  alt="Business team collaboration illustration"
                  width={400}
                  height={300}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100  py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
              
                 <Image 
                         src="/logo.svg" 
                         alt="CIM Amplify Logo" 
                         width={150} 
                         height={50} 
                         className="h-auto" 
                       />
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                CIM Amplify's mission is to help entrepreneurs and advisors get the "Brass Ring" of selling their
                company. Our owner group have all sold significant companies which has and our lives forever.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Benefits
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Guidelines
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Actions</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Member Login
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Start Selling
                  </a>
                </li>
              </ul>
              <h4 className="font-semibold text-lg mb-4 mt-8">Support</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}