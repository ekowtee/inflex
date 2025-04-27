/* eslint-disable no-unused-vars */
import React from 'react'
import { Link } from 'react-router-dom'

// Replace these imports with your actual image paths
import manufacturingImg from '../assets/career/career2.png'
import cellTeamImg from '../assets/career/career3.png'
import autopilotImg from '../assets/career/career4.png'

const featuredJobs = [
    {
        id: 'manufacturing',
        title: 'Manufacturing',
        image: manufacturingImg,
        description:
            'Join a global team of expert engineers, production workers and safety professionals building some of the most exciting cars on the planet.',
        link: '/careers/manufacturing',
    },
    {
        id: 'cell-team',
        title: 'Cell Team',
        image: cellTeamImg,
        description:
            'Our vertically integrated Cell team works to solve the next generation of battery challenges to reach terawatt-scale battery production.',
        link: '/careers/cell-team',
    },
    {
        id: 'autopilot-ai',
        title: 'Autopilot AI',
        image: autopilotImg,
        description:
            'Apply cutting-edge research to advance a future of full self-driving, developing some of the world’s most sophisticated decision-making systems.',
        link: '/careers/autopilot-ai',
    },
]

export default function FeaturedJobs() {
    return (
        <section className="bg-gray-50">
            <div className="container mx-auto px-4 lg:px-[200px] py-12">
                <h2 className="text-3xl font-semibold text-center mb-8">
                    Featured Jobs
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {featuredJobs.map(job => (
                        <div
                            key={job.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
                        >
                            <img
                                src={job.image}
                                alt={job.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                                <p className="text-gray-600 flex-1">{job.description}</p>
                                <Link
                                    to={job.link}
                                    className="mt-4 text-gray-800 hover:text-[#BD2E25] underline"
                                >
                                    See Opportunities
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
