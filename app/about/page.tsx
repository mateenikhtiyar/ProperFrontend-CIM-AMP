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
            <motion.section 
                className="bg-gradient-to-b from-gray-50/30 to-white relative overflow-hidden"
                style={{ opacity: heroOpacity, y: heroTranslateY }}
            >
                <div className="absolute inset-0 flex items-center justify-center opacity-80">
                    <motion.div
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.8 }}
                        transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }} // Increased duration from 1.5 to 2
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
                        className="h-[500px] mx-auto relative flex items-center justify-center mt-8"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }} // Increased duration from 1 to 1.5
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
                            Another Company?!
                        </motion.span>
                    </motion.h1>

                    <motion.div 
                        className="max-w-5xl mx-auto mb-10 section-reveal"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ margin: "-100px" }} // Removed once: true
                    >
                        <motion.p 
                            variants={itemVariants}
                            className="text-lg text-gray-600 leading-relaxed mb-8"
                        >
                            Greetings, John Martinez, a lifelong entrepreneur. From childhood ventures like lemonade stands to movies
                            and selling books to successfully establishing and selling two major companies, entrepreneurship has
                            always been my driving force. Even though CIM Amplify is my idea, I am supported by an excellent team that
                            is excited to help business owners to sell their companies.
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
                            onClick={()=>router.push("/seller/register")}
                                className="bg-primary hover:bg-teal-700 text-white px-8 py-4 text-lg font-semibold rounded-md"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Let's do some deals!
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

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
                            Months 1-10 Successes
                        </motion.h2>
                        <motion.p 
                            variants={itemVariants}
                            className="text-gray-600 text-lg max-w-3xl mx-auto"
                        >
                            Fantastic launch in October 2024 with the help of many friends in EO and YPO as buyers and M&A Advisors.
                        </motion.p>
                    </motion.div>

                    <motion.div 
                        className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-12"
                        variants={containerVariants}
                    >
                        {[
                            { value: "$3B", text: "In great deals, not<br />completed deals." },
                            { value: "$1.1B", text: "Sold M&A deals out<br />in the world." },
                            { value: "22M", text: "In average<br />company revenue." },
                            { value: "200+", text: "Buyers<br />onboard." }
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
                            Originally, CIM Amplify was a simple deal platform for M&A Advisors to showcase deals over $1 Million in
                            EBITDA.
                        </p>
                    </motion.div>
                </div>
            </motion.section>

            {/* Case Study */}
            <motion.section 
                className="py-20 bg-white section-reveal"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ margin: "-100px" }} // Removed once: true
            >
                <div className="container mx-auto px-6">
                    <motion.div 
                        className="max-w-5xl mx-auto card-reveal"
                        variants={itemVariants}
                    >
                        <Card className="overflow-hidden shadow-lg">
                            <CardContent className="p-0">
                                <div className="grid lg:grid-cols-2">
                                    <motion.div 
                                        className="relative h-80 lg:h-full"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }} // Increased duration from 0.8 to 1
                                        viewport={{ margin: "-100px" }} // Removed once: true
                                    >
                                        <Image src="/pic2.png" alt="Ferris wheel family attraction" fill className="object-cover image-scale" />
                                    </motion.div>
                                    <motion.div 
                                        className="p-8 lg:p-12"
                                        variants={containerVariants}
                                    >
                                        <motion.div 
                                            variants={itemVariants}
                                            className="bg-primary text-white px-4 py-2 rounded-md text-sm font-bold mb-6 inline-block"
                                        >
                                            ATTRACTION
                                        </motion.div>
                                        <motion.h3 
                                            variants={itemVariants}
                                            className="text-2xl font-bold text-gray-900 mb-6 leading-tight"
                                        >
                                            Opportunity to acquire a premier family attraction park in New England
                                        </motion.h3>
                                        <motion.div 
                                            variants={containerVariants}
                                            className="space-y-3 text-gray-700"
                                        >
                                            <motion.p variants={itemVariants}>
                                                <span className="font-semibold">Industry:</span> Media and Entertainment
                                            </motion.p>
                                            <motion.p variants={itemVariants}>
                                                <span className="font-semibold">Additional Industry Information:</span>
                                            </motion.p>
                                            <motion.p variants={itemVariants}>
                                                Family attraction park (zoo, amusement rides, etc.) and a fine dining restaurant
                                            </motion.p>
                                            <motion.p variants={itemVariants}>
                                                <span className="font-semibold">Country of Headquarters:</span> United States of America
                                            </motion.p>
                                            <motion.p variants={itemVariants}>
                                                <span className="font-semibold">Revenue:</span> $7.5 Million EBITDA: $1.5-2 Million
                                            </motion.p>
                                        </motion.div>
                                        <motion.div 
                                            variants={itemVariants}
                                            className="mt-8 pt-6 border-t border-gray-200"
                                        >
                                            <p className="text-xs text-gray-500">Note: An original deal dropped from CIM Amplify v1</p>
                                        </motion.div>
                                    </motion.div>
                                </div>
                            </CardContent>
                        </Card>
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
                                    "I can't post many deals here because I classify have to get pre-approval from my client for all
                                    postings."
                                </p>
                            </motion.div>
                            <motion.div variants={itemVariants} className="flex items-start">
                                <XCircle className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                                <p className="text-gray-700">"The brokers are ruining my business."</p>
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
                                <p className="text-gray-700">"There are great deals—have I seen them before?"</p>
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
                viewport={{ margin: "-100px" }} // Removed once: true
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
                                We <span className="text-primary">Listened</span>
                            </motion.h2>
                            <motion.div 
                                variants={containerVariants}
                                className="space-y-6"
                            >
                                <motion.div variants={itemVariants}>
                                    <p className="text-gray-900 font-semibold text-lg mb-2">What you can today - launched July 2025</p>
                                </motion.div>
                                <motion.p variants={itemVariants} className="text-gray-700 text-lg">
                                    Sellers input deal details and then choose matched buyers
                                </motion.p>
                                <motion.p variants={itemVariants} className="text-gray-700 text-lg">
                                    Buyers only get deals matched to their criteria on an exclusive or first look basis
                                </motion.p>
                            </motion.div>
                        </motion.div>
                        <motion.div 
                            variants={itemVariants}
                            className="relative"
                            whileHover={{ scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 300, duration: 0.5 }} // Added duration for consistency
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

            {/* Footer */}
            <motion.footer 
                className="bg-gray-100 py-16 section-reveal"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ margin: "-100px" }} // Removed once: true
            >
                <div className="container mx-auto px-6">
                    <motion.div 
                        className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto"
                        variants={containerVariants}
                    >
                        <motion.div 
                            variants={itemVariants}
                            className="md:col-span-2"
                        >
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
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <h4 className="font-semibold text-lg mb-4 ">Quick Links</h4>
                          <ul className="space-y-3">
  <motion.li>
    <ul className="space-y-4"> {/* Apply spacing between buttons */}
      <li>
        <a onClick={(e) => {
                        e.preventDefault();
                        router.push("/landing#benefits");
                    }}  className="text-gray-400 hover:text-primary transition-colors cursor-pointer">
          Benefits
        </a>
      </li>
      <li>
        <a onClick={(e) => {
                        e.preventDefault();
                        router.push("/landing#how-it-works");
                    }}  className="text-gray-400 hover:text-primary transition-colors cursor-pointer">
          How it Works
        </a>
      </li>
      <li>
        <a onClick={(e) => {
                        e.preventDefault();
                        router.push("/landing#guidelines");
                    }}  className="text-gray-400 hover:text-primary transition-colors cursor-pointer">
          Guidelines
        </a>
      </li>
      <li>
        <a onClick={(e) => {
                        e.preventDefault();
                        router.push("/about");
                    }}  className="text-gray-400 hover:text-primary transition-colors cursor-pointer">
          About
        </a>
      </li>
    </ul>
  </motion.li>
</ul>

                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <h4 className="font-semibold text-lg mb-4">Actions</h4>
                            <ul className="space-y-3">
                                <motion.li 
                                    variants={itemVariants}
                                    onClick={() => router.push("/select-role")}
                                >
                                    <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                        Member Login
                                    </a>
                                </motion.li>
                                <motion.li 
                                    variants={itemVariants}
                                    onClick={() => router.push("/seller/login")}
                                >
                                    <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                        Start Selling
                                    </a>
                                </motion.li>
                            </ul>
                            <h4 className="font-semibold text-lg mb-4 mt-8">Support</h4>
                            <ul className="space-y-3">
                                <motion.li variants={itemVariants}>
                                    <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                        Contact Us
                                    </a>
                                </motion.li>
                            </ul>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.footer>
        </div>
    )
}