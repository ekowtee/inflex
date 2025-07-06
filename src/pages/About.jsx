                    </div>
                    <div className="flex flex-col">
                        <span className="text-[#16213E] text-[18px] font-normal leading-[26px]">
                            +233 208 889 270
                        </span>
                        <span className="text-[#16213E] text-[18px] font-normal leading-[26px]">
                            +233 205 179 937
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-[45px] h-[45px] bg-[#BD2E25] text-white">
                        <Mail size={24} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[#16213E] text-[18px] font-normal leading-[26px]">
                            info@inflexions.tech
                        </span>
                        <span className="text-[#16213E] text-[18px] font-normal leading-[26px]">
                            sales@inflexions.tech
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* absolute-card: centered & narrower on mobile, positioned with your offsets on md+ */}
        <div
            className="md:hidden flex absolute bg-white border-t-4 border-[#2A2A2A] z-10 w-[90%] sm:w-[480px] h-auto sm:h-[285px] left-1/2 sm:left-[240px] 
            top-[400px] sm:top-[350px] -translate-x-1/2 sm:translate-x-0 lg:flex items-center justify-center"
        >
            <div className="w-full sm:w-[390px] h-auto sm:h-[139px] flex flex-col p-4">
                <span>Company Address</span>
                <span className="text-[34px] leading-[38px] font-normal">
                    #2 Dei Close
                    East Legon
                    Accra, Ghana
                </span>
            </div>
        </div>
        <div className=''>
            <Banner />
        </div>
    </div>
</section>

        </>
    )
}

export default About
