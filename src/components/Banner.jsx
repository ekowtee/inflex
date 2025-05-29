/* eslint-disable no-unused-vars */
import React from 'react'
import vidmin from "../assets/about/vidmin.png"

const Banner = () => {

    return (
        <div className="relative w-full h-[400px] overflow-hidden">
            <>
                <img
                    src={vidmin}
                    alt="Cloud technology interface"
                    className="w-full h-full object-cover"
                />

            </>


        </div>
    )
}

export default Banner
