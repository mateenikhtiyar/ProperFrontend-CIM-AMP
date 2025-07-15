"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function HomePage() {
    const router = useRouter();
    const ref = useRef(null);
    
    
    // Scroll-based animations
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Parallax and fade animations
    const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
    const heroTranslateY = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
    const sectionOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
    const sectionTranslateY = useTransform(scrollYProgress, [0.2, 0.5], [50, 0]);

    // Variants for staggered animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3 // Increased for slower stagger
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8, // Increased from 0.6 for slower animation
                ease: [0.4, 0, 0.2, 1] // Smoother easing
            }
        }
    };

    // Enhanced button animation variants
    const buttonVariants = {
        initial: { 
            scale: 1, 
            boxShadow: "0 4px 14px 0 rgba(0, 118, 255, 0.15)" 
        },
        hover: { 
            scale: 1.05,
            boxShadow: "0 8px 25px 0 rgba(0, 118, 255, 0.25)",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
                mass: 1
            }
        },
        tap: { 
            scale: 0.98,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 25
            }
        }
    };
    const buttonY = useTransform(scrollYProgress, [0, 0.3], [0, -10]);
const buttonScale = useTransform(scrollYProgress, [0, 0.1, 0.3], [1, 1.05, 1.02]);
const buttonShadow = useTransform(
    scrollYProgress,
    [0, 0.2],
    ["0 4px 14px rgba(0, 0, 0, 0.1)", "0 8px 25px rgba(20, 184, 166, 0.3)"]
);

    return (
        <div className="min-h-screen bg-white" ref={ref}>
       <style jsx>{`
    /* Simplified navbar styles - removed animations */
    .navbar-link {
        padding: 10px 16px;
        border-radius: 8px;
        font-weight: 500;
        color: #4b5563;
        transition: color 0.3s ease;
    }
    
    .navbar-link:hover {
        color: #14b8a6;
    }
    
    .logo-container {
        /* Removed hover animations */
    }
    
    /* Smooth scroll for the entire page */
    html {
        scroll-behavior: smooth;
    }

    /* Enhanced animations */
    .section-reveal {
        opacity: 0;
        transform: translateY(50px);
        transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .section-reveal.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .image-scale {
        transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .image-scale:hover {
        transform: scale(1.03);
    }

    .card-reveal {
        opacity: 0;
        transform: translateY(30px);
        transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .card-reveal.visible {
        opacity: 1;
        transform: translateY(0);
    }

    /* Enhanced button styles */
    .hero-button {
        position: relative;
        overflow: hidden;
        background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
        border: none;
        border-radius: 12px;
        padding: 16px 32px;
        font-size: 18px;
        font-weight: 600;
        color: white;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .hero-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .hero-button:hover::before {
        left: 100%;
    }

    .hero-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 30px rgba(20, 184, 166, 0.4);
    }

    .hero-button:active {
        transform: translateY(0);
    }
`}</style>


<header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
    <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
            <div className="transition-all duration-500 ease-out hover:scale-105 hover:drop-shadow-lg">
                <Image 
                    src="/logo.svg" 
                    alt="CIM Amplify Logo" 
                    width={150} 
                    height={50} 
                    className="h-auto" 
                />
            </div>
            <nav className="hidden md:flex items-center gap-2" >
                <a
                    onClick={(e) => {
                        e.preventDefault();
                        router.push("/landing#benefits");
                    }}
                    className="relative px-4 py-2.5 cursor-pointer font-medium text-gray-600 rounded-lg transition-all duration-500 ease-out hover:text-teal-600 hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50 hover:-translate-y-0.5 before:absolute before:bottom-0 before:left-1/2 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-teal-600 before:to-teal-500 before:transition-all before:duration-500 before:ease-out before:-translate-x-1/2 hover:before:w-full"
                >
                    Benefits
                </a>
                <a  onClick={(e) => {
                        e.preventDefault();
                        router.push("/landing#how-it-works");
                    }} className="relative px-4 py-2.5 font-medium cursor-pointer text-gray-600 rounded-lg transition-all duration-500 ease-out hover:text-teal-600 hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50 hover:-translate-y-0.5 before:absolute before:bottom-0 before:left-1/2 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-teal-600 before:to-teal-500 before:transition-all before:duration-500 before:ease-out before:-translate-x-1/2 hover:before:w-full">
                    How it Works
                </a>
                <a  onClick={(e) => {
                        e.preventDefault();
                        router.push("/landing#marketplace");
                    }} className="relative px-4 py-2.5 cursor-pointer font-medium text-gray-600 rounded-lg transition-all duration-500 ease-out hover:text-teal-600 hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50 hover:-translate-y-0.5 before:absolute before:bottom-0 before:left-1/2 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-teal-600 before:to-teal-500 before:transition-all before:duration-500 before:ease-out before:-translate-x-1/2 hover:before:w-full">
                    Marketplace
                </a>
                <a  onClick={(e) => {
                        e.preventDefault();
                        router.push("/landing#faqs");
                    }} className="relative px-4 py-2.5 font-medium cursor-pointer text-gray-600 rounded-lg transition-all duration-500 ease-out hover:text-teal-600 hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50 hover:-translate-y-0.5 before:absolute before:bottom-0 before:left-1/2 before:w-0 before:h-0.5 before:bg-gradient-to-r before:from-teal-600 before:to-teal-500 before:transition-all before:duration-500 before:ease-out before:-translate-x-1/2 hover:before:w-full">
                    FAQs
                </a>
                <Button 
                    className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ml-4" 
                    onClick={() => router.push("/select-role")}
                >
                    Get Started
                </Button>
            </nav>
        </div>
    </div>
</header>

           
{/* Hero Section */}
{/* Hero Section */}
{/* <motion.section 
    className="bg-gradient-to-b from-gray-50/30 to-white relative overflow-hidden"
    style={{ opacity: heroOpacity, y: heroTranslateY }}
>
    <div className="absolute inset-0 flex items-center justify-center opacity-80">
        <motion.div
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
        >
            <Image
                src="/map.png"
                alt="World map background"
                width={1300}
                height={600}
                className="object-contain"
                priority
            />
        </motion.div>
    </div>

    <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div 
            className="h-[500px] mx-auto relative flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        >
            <Image
                src="/pic6.png"
                alt="Golden brass ring"
                width={500}
                height={400}
                className="object-contain drop-shadow-2xl image-scale"
                priority
            />
        </motion.div>

        <motion.h1 
            className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.span variants={itemVariants}>
                Seriously, John, You're Starting
            </motion.span>
            <motion.span variants={itemVariants}>
                <br />
                Another Company?
            </motion.span>
        </motion.h1>

        <motion.div 
            className="max-w-5xl mx-auto mb-10 section-reveal"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ margin: "-100px" }}
        >
            <motion.p 
                variants={itemVariants}
                className="text-lg text-gray-600 leading-relaxed mb-8"
            >
             Greetings! I'm John MacInnes, founder of CIM Amplify and a lifelong entrepreneur.
From childhood ventures like newspaper routes and selling books to successfully establishing and selling two major companies, entrepreneurship has always been my driving force.  I am supported by an excellent team that is excited to help business owners to sell their companies.

            </motion.p>

            <motion.div 
                variants={itemVariants}
                className="bg-teal-50 border border-teal-100 rounded-lg p-6 mb-8"
            >
                <p className="text-teal-800 font-semibold text-lg">
                    CIM Amplify was built with the singular mission of helping business owners get the "Brass Ring" of
                    selling their companies.
                </p>
            </motion.div>

            <motion.div variants={itemVariants}>
                <motion.button
                    onClick={() => router.push("/seller/register")}
                    className="bg-primary hover:bg-teal-700 text-white px-8 py-4 text-lg font-semibold rounded-md"
                    style={{
                        y: buttonY,
                        scale: buttonScale,
                        boxShadow: buttonShadow
                    }}
                    whileHover={{ 
                        scale: 1.08,
                        y: -5,
                        boxShadow: "0 12px 30px rgba(20, 184, 166, 0.4)",
                        transition: { 
                            duration: 0.3, 
                            ease: "easeOut",
                            type: "spring",
                            stiffness: 300
                        }
                    }}
                    whileTap={{ 
                        scale: 0.95,
                        transition: { 
                            duration: 0.1,
                            type: "spring",
                            stiffness: 400
                        }
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                        mass: 0.8
                    }}
                >
                    Let's do some deals!
                </motion.button>
            </motion.div>
        </motion.div>
    </div>
</motion.section> */}

            {/* Brass Ring Section */}
           
            {/* Brass Ring Section */}
            <motion.section 
                className="py-20 bg-white section-reveal mt-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ margin: "-100px" }} // Removed once: true
            >
                <div className="container mx-auto px-6">
                    <motion.h2 
                        variants={itemVariants}
                        className="text-4xl font-bold text-center text-gray-900 mb-16"
                    >
                        The "Brass Ring" of Business
                    </motion.h2>

                    <motion.div 
                        className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto"
                        variants={containerVariants}
                    >
                        <motion.div variants={itemVariants} className="space-y-6">
                            <p className="text-gray-700 text-lg leading-relaxed">
                                Selling is the <span className="font-bold text-primary">"Brass Ring"</span> of business ownership. Company builders
                                helped to build great companies that sustain a lot of great people but most of their net worth is tied up
                                in those companies. It's time to find some liquidity - maybe retire.
                            </p>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                Our team have worked extensively with both company buyers and advisors. Through that work we have become convinced that there are an enormous
                                amount of deals not being seen by potential buyers.
                            </p>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                So far, CIM Amplify has proven us right. We hear all the time from Advisors
                                <span className="font-bold"> "I haven't heard of that buyer before"</span> and from buyers{" "}
                                <span className="font-bold">"I can't believe I haven't seen that deal before"</span>.
                            </p>
                        </motion.div>

                        <motion.div 
                            variants={itemVariants}
                            className="relative"
                            whileHover={{ scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 300, duration: 0.5 }} // Added duration for consistency
                        >
                            <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-8">
                                <Image
                                    src="/pic4.png"
                                    alt="Business team collaboration illustration"
                                    width={400}
                                    height={300}
                                    className="w-full h-auto image-scale"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Success Metrics */}
            <motion.section 
                className="py-20 bg-gradient-to-r from-teal-50 via-blue-50 to-teal-50 section-reveal"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ margin: "-100px" }} // Removed once: true
            >
                <div className="container mx-auto px-6">
                    <motion.div 
                        className="text-center mb-12"
                        variants={containerVariants}
                    >
                        <motion.h2 
                            variants={itemVariants}
                            className="text-4xl font-bold text-gray-900 mb-4"
                        >
                            Our History - October 2024 to June 2025
                        </motion.h2>
                        <motion.p 
                            variants={itemVariants}
                            className="text-gray-600 text-lg max-w-3xl mx-auto"
                        >
                          In just 9 months, with the help of so many buyers and sellers, we achieved a lot with Version 1.
                        </motion.p>
                    </motion.div>

                    <motion.div 
                        className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12"
                        variants={containerVariants}
                    >
                        {[
                            { value: "$3B", text: "In great deals, not<br />scraped deals." },
                            { value: "$1.1B", text: "Sold" },
                            { value: "22M", text: "Average Revenue per Company" },
                            
                        ].map((item, index) => (
                            <motion.div 
                                key={index}
                                variants={itemVariants}
                                className="text-center"
                            >
                                <div className="text-5xl font-bold text-primary mb-3">{item.value}</div>
                                <p className="text-gray-600 font-medium" dangerouslySetInnerHTML={{ __html: item.text }} />
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div 
                        variants={itemVariants}
                        className="text-center"
                    >
                        <p className="text-gray-500 text-sm max-w-2xl mx-auto">
                           Below is a typical deal snippet from CIM Amplify Version 1.
                        </p>
                    </motion.div>
                </div>
            </motion.section>

            {/* Case Study */}

           {/* Case Study */}
{/* Case Study */}
 {/* Case Study */}
            <motion.section 
                className="py-20 bg-white section-reveal"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ margin: "-100px" }}
            >
                <div className="container mx-auto px-6">
                    <motion.div 
                        className="text-center mb-16"
                        variants={containerVariants}
                    >
                        <motion.h2 
                            variants={itemVariants}
                            className="text-4xl font-bold text-gray-900 mb-4"
                        >
                            Deal Example from Version 1
                        </motion.h2>
                        <motion.p 
                            variants={itemVariants}
                            className="text-gray-600 text-lg max-w-3xl mx-auto"
                        >
                            Below is a typical deal snippet from CIM Amplify Version 1.
                        </motion.p>
                    </motion.div>

                    <motion.div 
                        className="max-w-4xl mx-auto space-y-8"
                        variants={containerVariants}
                    >
                        {/* First Card */}
                        <motion.div 
                            variants={itemVariants}
                            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row"
                        >
                            {/* Left Image */}
                            <div className="w-full md:w-64 h-98 relative flex-shrink-0">
                                <img 
                                    src="/pic2.png"
                                    alt="Ferris wheel attraction"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            
                            {/* Right Content */}
                            <div className="flex-1 p-6 bg-gray-50">
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">ATTRACTION</h3>
                                <p className="text-gray-700 mb-4">
                                    Opportunity to acquire a premier family attraction park in New England
                                </p>
                                
                                <div className="space-y-2 mb-6">
                                    <div>
                                        <span className="font-semibold text-gray-900">Industry:</span>
                                        <span className="text-gray-700 ml-2">Media and Entertainment</span>
                                    </div>
                                    
                                    <div>
                                        <span className="font-semibold text-gray-900">Additional Industry Information:</span>
                                        <div className="text-gray-700 mt-1">
                                            Family attraction park (zoo, amusement rides, etc.) and a fine dining restaurant
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <span className="font-semibold text-gray-900">Country of Headquarters:</span>
                                        <span className="text-gray-700 ml-2">United States of America</span>
                                    </div>
                                    
                                    <div>
                                        <span className="font-semibold text-gray-900">Revenue:</span>
                                        <span className="text-gray-700 ml-2">$17.7 Million</span>
                                        <span className="font-semibold text-gray-900 ml-4">EBITDA:</span>
                                        <span className="text-gray-700 ml-2">$3.625 Million</span>
                                    </div>
                                </div>
                                
                                <button onClick={()=>router.push("/seller/login")} className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-6 rounded-md transition-colors">
                                    View Deal
                                </button>
                            </div>
                        </motion.div>

                        {/* Second Card - Optional scenic image */}
                   
                    </motion.div>
                </div>
            </motion.section>

            {/* Problems Section */}
          <motion.section 
    className="py-20 bg-gray-50 section-reveal"
    variants={containerVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ margin: "-100px" }}
>
    <div className="container mx-auto px-6">
        <motion.div 
            className="text-center mb-16"
            variants={containerVariants}
        >
            <motion.h2 
                variants={itemVariants}
                className="text-4xl font-bold text-gray-900"
            >
                Problems We <span className="text-primary">Discovered</span>
            </motion.h2>
        </motion.div>

        <motion.div 
            className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto"
            variants={containerVariants}
        >
            <motion.div variants={itemVariants} className="card-reveal h-full">
                <Card className="bg-white shadow-lg h-full">
                    <CardContent className="p-8 h-full flex flex-col">
                        <motion.div 
                            variants={itemVariants}
                            className="flex items-center mb-6"
                        >
                            <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mr-4">
                                <CheckCircle className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Sellers</h3>
                        </motion.div>
                        <motion.div 
                            variants={containerVariants}
                            className="space-y-4 mb-8 flex-grow"
                        >
                            <motion.div variants={itemVariants} className="flex items-start">
                                <XCircle className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                                <p className="text-gray-700">
                                    "I can't post many deals here because I usually have to get pre-approval from my client for all
                                    potential buyers."
                                </p>
                            </motion.div>
                            <motion.div variants={itemVariants} className="flex items-start">
                                <XCircle className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                                <p className="text-gray-700">"Tire Kickers are Ruining my business."</p>
                            </motion.div>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Button   onClick={()=>router.push("/seller/register")} className="bg-primary hover:bg-teal-700 text-white w-full py-3 font-semibold">
                                Start Selling
                            </Button>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="card-reveal h-full">
                <Card className="bg-white shadow-lg h-full">
                    <CardContent className="p-8 h-full flex flex-col">
                        <motion.div 
                            variants={itemVariants}
                            className="flex items-center mb-6"
                        >
                            <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mr-4">
                                <CheckCircle className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Buyers</h3>
                        </motion.div>
                        <motion.div 
                            variants={containerVariants}
                            className="space-y-4 mb-8 flex-grow"
                        >
                            <motion.div variants={itemVariants} className="flex items-start">
                                <XCircle className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                                <p className="text-gray-700">
                                    "I don't have time to scroll through deals—just send me the ones that meet my criteria."
                                </p>
                            </motion.div>
                            <motion.div variants={itemVariants} className="flex items-start">
                                <XCircle className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                                <p className="text-gray-700">"These are great deals—have I seen them before?"</p>
                            </motion.div>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Button   onClick={()=>router.push("/buyer/register")} className="bg-primary hover:bg-teal-700 text-white w-full py-3 font-semibold">
                                Start Exploring
                            </Button>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    </div>
</motion.section>
            {/* We Listened Section */}
          <motion.section 
  className="py-20 bg-white section-reveal"
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ margin: "-100px" }}
>
  <div className="container mx-auto px-6">
    <motion.div 
      className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <motion.h2 
          variants={itemVariants}
          className="text-4xl font-bold text-gray-900 mb-8"
        >
          Version 2 - We <span className="text-primary">Listened</span>
        </motion.h2>

        <motion.div variants={containerVariants} className="space-y-6">
          <motion.div variants={itemVariants}>
            <p className="text-gray-900 font-semibold text-lg mb-2">
              What you can see today - launched July 2025
            </p>
          </motion.div>

          {/* Bullet Line 1 */}
          <motion.div 
            variants={itemVariants}
            className="flex items-start gap-3"
          >
            <span className="w-2.5 h-2.5 mt-2 rounded-full bg-primary flex-shrink-0" />
            <p className="text-gray-700 text-lg">
              Sellers input deal details and then choose matched buyers
            </p>
          </motion.div>

          {/* Bullet Line 2 */}
          <motion.div 
            variants={itemVariants}
            className="flex items-start gap-3"
          >
            <span className="w-2.5 h-2.5 mt-2 rounded-full bg-primary flex-shrink-0" />
            <p className="text-gray-700 text-lg">
              Buyers only get deals matched to their criteria on an exclusive or first look basis
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="relative"
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300, duration: 0.5 }}
      >
        <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-8">
          <Image
            src="/pic3.png"
            alt="Business team collaboration illustration"
            width={400}
            height={300}
            className="w-full h-auto image-scale"
          />
        </div>
      </motion.div>
    </motion.div>
  </div>
</motion.section>

{/* Herosection */}
{/* Hero Section - Fixed version */}
<motion.section 
    className="bg-gradient-to-b from-gray-50/30 to-white relative overflow-hidden py-12"
    style={{ opacity: heroOpacity, y: heroTranslateY }}
>
    <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center opacity-80 pointer-events-none overflow-hidden">
        <motion.div
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
            className="w-full h-full flex items-center justify-center"
        >
            <Image
                src="/map.png"
                alt="World map background"
                width={1000}
                height={400}
                className="object-contain max-w-full max-h-full"
                priority
            />
        </motion.div>
    </div>

    <div className="container mx-auto px-6 text-center relative z-10">
        <motion.h1 
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.span variants={itemVariants}>
                Seriously, John, You're Starting
            </motion.span>
            <motion.span variants={itemVariants}>
                <br />
                Another Company?
            </motion.span>
        </motion.h1>

        <motion.div 
            className="max-w-5xl mx-auto mb-8 section-reveal"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ margin: "-100px" }}
        >
            <motion.p 
                variants={itemVariants}
                className="text-lg text-gray-600 leading-relaxed mb-6"
            >
             Greetings! I'm John MacInnes, founder of CIM Amplify and a lifelong entrepreneur.
From childhood ventures like newspaper routes and selling books to successfully establishing and selling two major companies, entrepreneurship has always been my driving force.  I am supported by an excellent team that is excited to help business owners to sell their companies.
            </motion.p>

            <motion.div 
                variants={itemVariants}
                className="bg-teal-50 border border-teal-100 rounded-lg p-6 mb-6"
            >
                <p className="text-teal-800 font-semibold text-lg">
                    CIM Amplify was built with the singular mission of helping business owners get the "Brass Ring" of
                    selling their companies.
                </p>
            </motion.div>

            <motion.div variants={itemVariants}>
                <motion.button
                    onClick={() => router.push("/seller/register")}
                    className="bg-primary hover:bg-teal-700 text-white px-8 py-4 text-lg font-semibold rounded-md"
                    style={{
                        y: buttonY,
                        scale: buttonScale,
                        boxShadow: buttonShadow
                    }}
                    whileHover={{ 
                        scale: 1.08,
                        y: -5,
                        boxShadow: "0 12px 30px rgba(20, 184, 166, 0.4)",
                        transition: { 
                            duration: 0.3, 
                            ease: "easeOut",
                            type: "spring",
                            stiffness: 300
                        }
                    }}
                    whileTap={{ 
                        scale: 0.95,
                        transition: { 
                            duration: 0.1,
                            type: "spring",
                            stiffness: 400
                        }
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                        mass: 0.8
                    }}
                >
                    Let's do some deals!
                </motion.button>
            </motion.div>
        </motion.div>
    </div>
</motion.section>

            {/* Footer */}
          {/* Footer */}
<footer className="bg-gray-100 py-10 mt-[100px]">
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
                    company. Our owner group have all sold significant companies which has changed our lives forever.
                </p>
            </div>
            <div>
                <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
                <ul className="space-y-3">
                    <li>
                        <ul className="space-y-4">
                            <li>
                                <a onClick={(e) => {
                                    e.preventDefault();
                                    router.push("/landing#benefits");
                                }} className="text-gray-700 hover:text-primary transition-colors cursor-pointer">
                                    Benefits
                                </a>
                            </li>
                            <li>
                                <a onClick={(e) => {
                                    e.preventDefault();
                                    router.push("/landing#how-it-works");
                                }} className="text-gray-700 hover:text-primary transition-colors cursor-pointer">
                                    How it Works
                                </a>
                            </li>
                            <li>
                                <a onClick={(e) => {
                                    e.preventDefault();
                                    router.push("/landing#guidelines");
                                }} className="text-gray-700 hover:text-primary transition-colors cursor-pointer">
                                    Guidelines
                                </a>
                            </li>
                            <li>
                                <a onClick={(e) => {
                                    e.preventDefault();
                                    router.push("/about");
                                }} className="text-gray-700 hover:text-primary transition-colors cursor-pointer">
                                    About
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div>
                <h4 className="font-semibold text-lg mb-4">Actions</h4>
                <ul className="space-y-3">
                    <li onClick={() => router.push("/select-role")}>
                        <a href="#" className="text-primary hover:text-shadow-2xs transition-colors">
                            Member Login
                        </a>
                    </li>
                    <li onClick={() => router.push("/seller/login")}>
                        <a href="#" className="text-primary  hover:text-shadow-2xs transition-colors">
                            Start Selling
                        </a>
                    </li>
                </ul>
                <h4 className="font-semibold text-lg mb-4 mt-8">Support</h4>
                <ul className="space-y-3">
                    <li>
                        <a href="#" className="text-gray-700 hover:text-shadow-2xs transition-colors">
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