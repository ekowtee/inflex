/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react'
import vidmin from "../assets/about/vidmin.png"
import { Play } from 'lucide-react'

const Banner = () => {
    const [showVideo, setShowVideo] = useState(false)
    const videoRef = useRef(null)

    const handlePlayClick = () => {
        setShowVideo(true)
        // once the video element is mounted, trigger playback
        setTimeout(() => {
            if (videoRef.current) {
                videoRef.current.play()
            }
        }, 0)
    }

    return (
        <div className="relative w-full h-[400px] overflow-hidden">
            {/* IMAGE + PLAY BUTTON */}
            {!showVideo && (
                <>
                    <img
                        src={vidmin}
                        alt="Cloud technology interface"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <button
                            onClick={handlePlayClick}
                            className="bg-black rounded-md p-3 shadow-lg transition-colors hover:bg-gray-800"
                        >
                            <Play className="w-8 h-8 text-white" />
                        </button>
                    </div>
                </>
            )}

            {/* VIDEO (hidden until clicked) */}
            {showVideo && (
                <video
                    ref={videoRef}
                    src="https://samplelib.com/lib/preview/mp4/sample-5s.mp4"
                    controls
                    className="w-full h-full object-cover"
                />
            )}
        </div>
    )
}

export default Banner
