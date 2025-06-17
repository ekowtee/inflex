/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet';
import careerbg from "../assets/career/careerbg.png"
import Placeholder from "../assets/blog/blogger.png"
import Placeholder2 from "../assets/blog/webinar1.png"
import Placeholder3 from "../assets/blog/webinar2.png"
import Placeholder4 from "../assets/blog/webinar3.png"

import AOS from 'aos';
import 'aos/dist/aos.css';

import Blog from '../components/Blog';
import Banner from '../components/Banner';


const Resources = () => {

    const [mounted, setMounted] = useState(false)

    // custom hook for intersection‐based inView tracking
    function useInView(threshold = 0.1) {
        const ref = useRef(null)
        const [inView, setInView] = useState(false)
        useEffect(() => {
            const obs = new IntersectionObserver(
                ([entry]) => setInView(entry.isIntersecting),
                { threshold }
            )
            if (ref.current) obs.observe(ref.current)
            return () => obs.disconnect()
        }, [threshold])
        return [ref, inView]
    }

    // network refs
    const [insightsTitleRef, insightsTitleIn] = useInView()
    const [insightsParaRef, insightsParaIn] = useInView()



    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        AOS.init({
            duration: 3000,
        });
        AOS.refresh();
    }, []);

    const base = "transform transition-all duration-[600ms] ease-out"

    // Sample data arrays (replace with real data or props)
    // const blogPosts = [
    //     {
    //         id: 1,
    //         title: 'Emerging Trends in Hybrid Cloud Architecture',
    //         excerpt: 'Discover the latest strategies for architecting a scalable and secure hybrid cloud environment.',
    //         imageUrl: 'https://images.unsplash.com/photo-1581091245321-cb5b07a4ebb3?auto=format&fit=crop&w=800&q=60',
    //         link: '/blog/hybrid-cloud',
    //     },
    //     {
    //         id: 2,
    //         title: 'Best Practices for DevOps Automation',
    //         excerpt: 'Streamline your deployment pipeline with these proven DevOps automation techniques.',
    //         imageUrl: 'https://images.unsplash.com/photo-1581091014602-2e9fbe9f1652?auto=format&fit=crop&w=800&q=60',
    //         link: '/blog/devops-automation',
    //     },
    // ];

    const whitepapers = [
        {
            id: 1,
            title: 'Architecting a Secure Hybrid Cloud Environment',
            description: 'In-depth whitepaper covering security foundations and deployment models for hybrid clouds.',
            coverUrl: 'https://techguru.co.in/wp-content/uploads/2024/12/cloud-computing.jpg',
            downloadLink: '/resources/whitepapers/hybrid-cloud',
        },
        {
            id: 2,
            title: 'Maximizing ROI with IT Service Management',
            description: 'Explore frameworks and metrics to measure and improve ROI on ITSM initiatives. In-depth work around to clock to deliver.',
            coverUrl: Placeholder4,
            downloadLink: '/resources/whitepapers/itsm-roi',
        },
    ];

    const webinars = [
        {
            id: 1,
            title: 'The Future of Network Infrastructure - SD-WAN Explained',
            description: 'On-demand webinar diving into the capabilities and benefits of SD-WAN for modern networks.',
            date: 'April 28, 2025',
            imageUrl: Placeholder2,
            recordingLink: '/webinars/sd-wan-explained',
        },
        {
            id: 2,
            title: 'Cybersecurity in the Age of Remote Work',
            description: 'Live session on best practices to secure remote workforces in 2025 and beyond.',
            date: 'May 15, 2025',
            imageUrl: Placeholder3,
            registerLink: '/contact',
        },
    ];
    return (
        <div>
            <div className="relative w-full h-[300px] md:h-[500px]">
                {/* Background image */}
                <img
                    src={careerbg}
                    alt="About NFLEXIONS-IT"
                    className="w-full h-full object-cover"
                    loading="lazy"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/30" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-4 md:px-8 lg:px-[238px] 4xl:px-[237px]">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8">

                            {/* Left column */}
                            <div className="w-full md:w-2/2 text-white space-y-4">
                                <h2 data-aos="fade-right" className="text-2xl md:text-4xl lg:text-5xl font-bold leading-snug md:leading-[76px]">
                                    Resources at Inflexions <br className="hidden lg:block" />
                                    | Shape the Future of Technology
                                </h2>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:pl-[240px] 4xl:pl-[240px] lg:pr-[160px]">
                <Helmet>
                    <title>Insights & Resources | Inflexions I.T. Services</title>
                </Helmet>

                {/* Page Header with Banner Image */}
                <header className="mb-12 ">
                    <div className="container mx-auto flex flex-col md:flex-row items-center py-8">
                        {/* Left: smaller image */}
                        <div className="flex-shrink-0 mb-6 md:mb-0 ">
                            <img
                                src={Placeholder}
                                alt="Insights & Resources"
                                data-aos="fade-right"
                                className="w-full h-full lg:w-[400px] md:h-[300px] rounded-lg object-cover"
                            />
                        </div>

                        {/* Right: text */}
                        <div className="md:ml-8 text-left">
                            <h1
                                ref={insightsTitleRef}
                                className={`
      ${base}
      ${insightsTitleIn
                                        ? "translate-y-0 opacity-100 delay-[800ms]"
                                        : "translate-y-[50px] opacity-0"
                                    }
      text-4xl font-bold mb-4 text-black
    `}
                            >
                                Stay Informed with Expert Insights and Analysis
                            </h1>
                            <p
                                ref={insightsParaRef}
                                className={`
      ${base}
      ${insightsParaIn
                                        ? "translate-y-0 opacity-100 delay-[1000ms]"
                                        : "translate-y-[50px] opacity-0"
                                    }
      text-lg text-gray-800 max-w-2xl
    `}
                            >
                                Explore our collection of resources designed to help you navigate the evolving technology landscape.
                                From industry trends and best practices to deep dives into specific solutions, gain valuable knowledge
                                from the experts at Inflexions.
                            </p>
                        </div>

                    </div>
                </header>


                {/* Blog Section */}
                {/* <section className="mb-16">
                    <h2 className="text-3xl font-semibold mb-6">Latest Articles & Insights</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map(post => (
                            <a
                                key={post.id}
                                href={post.link}
                                className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                                    <span className="text-red-600 font-medium">Read More →</span>
                                </div>
                            </a>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <a
                            href="/blog"
                            className="inline-block bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors"
                        >
                            Visit the Blog
                        </a>
                    </div>
                </section> */}

                {/* Whitepapers/Ebooks Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-semibold mb-6">In-Depth Guides & Reports</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {whitepapers.map(item => (
                            <a
                                key={item.id}
                                href={item.downloadLink}
                                className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <img src={item.coverUrl} alt={item.title} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                    <p className="text-gray-600 mb-4">{item.description}</p>
                                    <span className="text-red-600 font-medium">Download →</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </section>

                {/* Webinars Section */}
                <section>
                    <h2 className="text-3xl font-semibold mb-6">Learn from Our Experts</h2>
                    <div className="space-y-6">
                        {webinars.map(event => (
                            <div
                                key={event.id}
                                className="border rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-lg transition-shadow"
                            >
                                <img
                                    src={event.imageUrl}
                                    alt={event.title}
                                    className="w-full md:w-48 h-32 object-cover rounded mb-4 md:mb-0 md:mr-6"
                                />
                                <div className="flex-1">
                                    <h3 className="text-2xl font-semibold mb-2">{event.title}</h3>
                                    <p className="text-gray-600 mb-2">{event.description}</p>
                                    <p className="text-gray-500 text-sm">{event.date}</p>
                                </div>
                                <div className="mt-4 md:mt-0">
                                    {event.recordingLink ? (
                                        <a
                                            href={event.recordingLink}
                                            className="inline-block bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition-colors"
                                        >
                                            Watch Recording
                                        </a>
                                    ) : (
                                        <a
                                            href={event.registerLink}
                                            className="inline-block bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition-colors"
                                        >
                                            Register Now
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <Blog />

            <Banner />
        </div>
    )
}

export default Resources
