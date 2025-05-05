// Leaders.jsx
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React from 'react';
import "./Global.css";
import ekow from "../assets/about/ekow.jpg";
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

const Leaders = () => {
    return (
        <div className='overflow-hidden'>
            <div className="contain">
                <div className='box'>
                    <div className='imgBx'>
                        <img src={ekow} alt='leader' loading='lazy' />
                    </div>
                    <div className='content'>
                        <h3 className="text-[16px] font-normal text-[#1E3161]">Ekow M. Thompson</h3>
                        <p className="text-[#464646] text-[14px]">Director, Business Development</p>
                        <div className="flex space-x-4 mt-4">
                            <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center border border-red-600 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition">
                                <FaFacebookF size={16} />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center border border-red-600 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition">
                                <FaInstagram size={16} />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center border border-red-600 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition">
                                <FaTwitter size={16} />
                            </a>
                        </div>
                        <span className="text-[12px] text-gray-700 text-justify mt-2">
                            Ekow Thompson is a visionary business leader with over 18 years of executive experience in technology, media, and telecommunications across Africa. As Managing Director of Inflexions, he brings a proven track record of driving digital transformation and substantial growth. His strategic leadership was instrumental in transforming Interactive Digital into one of Ghana's most respected digital agencies (achieving 750% revenue growth) and co-founding Blu Telecommunications, Ghana's innovative 4G network. Ekow excels at aligning technological capabilities with business objectives, ensuring clients receive solutions that create lasting competitive advantage. He holds a Bachelor's degree in Electrical / Electronic Engineering and is dedicated to continuous learning in leadership and digital innovation.
                        </span>
                    </div>
                </div>

                <div className='box'>
                    <div className='imgBx'>
                        <img src={ekow} alt='leader' loading='lazy' />
                    </div>
                    <div className='content'>
                        <h3 className="text-[16px] font-normal text-[#1E3161]">Jade Appiah-Lartey</h3>
                        <p className="text-[#464646] text-[14px]">Director – Marketing</p>
                        <div className="flex space-x-4 mt-4">
                            <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center border border-red-600 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition">
                                <FaFacebookF size={16} />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center border border-red-600 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition">
                                <FaInstagram size={16} />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center border border-red-600 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition">
                                <FaTwitter size={16} />
                            </a>
                        </div>
                        <span className="text-[12px] text-gray-700 text-justify mt-2">
                            Dr. Jade Appiah-Lartey is a results-driven executive spearheading Inflexions' strategic growth initiatives, brand development, and digital transformation efforts. Leading the company's revitalization and strategic relaunch, she brings over 15 years of experience from the technology, telecommunications, and digital marketing sectors. Dr. Appiah-Lartey excels at identifying high-value market opportunities, crafting effective go-to-market strategies, and building strategic partnerships. Her background includes roles as Brand Strategy Consultant at Interactive Digital, Customer Experience Design Manager at Millicom, and Product Manager, providing her with multifaceted expertise to design customer-centric technology solutions and maximize revenue potential for Inflexions and its clients.
                        </span>
                    </div>
                </div>

                <div className='box'>
                    <div className='imgBx'>
                        <img src={ekow} alt='leader' loading='lazy' />
                    </div>
                    <div className='content'>
                        <h3 className="text-[16px] font-normal text-[#1E3161]">Anthony Getor</h3>
                        <h4 className="text-[#464646] ">Executive Director, Business Solutions</h4>
                        <div className="flex space-x-4 mt-4">
                            <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center border border-red-600 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition">
                                <FaFacebookF size={16} />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center border border-red-600 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition">
                                <FaInstagram size={16} />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center border border-red-600 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition">
                                <FaTwitter size={16} />
                            </a>
                        </div>
                        <span className="text-[12px] text-gray-700 text-justify mt-2">
                            Anthony Getor is a technology leader delivering innovative solutions that fuel business growth, leveraging over 15 years of experience in digital transformation across Africa. His expertise spans information security, enterprise architecture, cloud infrastructure (design, migration, optimization), and telecommunications. He holds an M.Sc. in Cyber Security & Digital Forensics (KNUST), an M.Sc. in Information Technology (Nottingham), and industry certifications including CHFI and CEH.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaders;
