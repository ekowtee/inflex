/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import SWAP1 from "../assets/hero/swap1.jpg";
import SWAP2 from "../assets/hero/swap2.webp";
import SWAP3 from "../assets/hero/swap3.jpg";
import SWAP4 from "../assets/hero/swap4.jpg";


const initialImages = [
    {
        title: 'Network Infrastructure',
        photo: SWAP1,
    },
    {
        title: 'IT Hardware & Storage',
        photo: SWAP2,
    },
    {
        title: 'Cloud Services',
        photo: SWAP3,
    },
    {
        title: 'Data-centre Solutions',
        photo: SWAP4,
    },
];

export default function SwapGrid() {
    const [imgs, setImgs] = useState(initialImages);
    const timerRef = useRef(null);

    // Swap imgs[0] with imgs[idx]
    const swapToTop = (idx) => {
        setImgs((arr) => {
            const copy = [...arr];
            [copy[0], copy[idx]] = [copy[idx], copy[0]];
            return copy;
        });
    };

    // On hover start: clear any pending timer, then if not main, set a new one
    const scheduleSwap = (idx) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        if (idx !== 0) {
            timerRef.current = setTimeout(() => {
                swapToTop(idx);
                timerRef.current = null;
            }, 1000); // 2 seconds
        }
    };

    // On hover end: clear pending timer
    const cancelSwap = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    // Generic box that uses scheduleSwap / cancelSwap
    const Box = ({ idx, className }) => (
        <div
            className={`relative overflow-hidden group cursor-pointer ${className}`}
            onMouseEnter={() => scheduleSwap(idx)}
            onMouseLeave={cancelSwap}
        >
            <img
                src={imgs[idx].photo}
                alt={imgs[idx].title}
                className="w-full h-full object-cover"
            />

            {/* Red gradient overlay */}
            <div
                className="
          absolute inset-0
          pointer-events-none
          bg-gradient-to-b
          from-[#BD2E25]/70
          via-transparent
          to-red-900/60
          opacity-0
          group-hover:opacity-100
          transition-opacity
          duration-300
        "
            />

            {/* Title sliding up from bottom */}
            <div
                className="
          absolute bottom-0 left-0 w-full p-4
          transform translate-y-full opacity-0
          group-hover:translate-y-0 group-hover:opacity-100
          transition-all duration-300 ease-out
        "
            >
                <span className="text-white text-xl">{imgs[idx].title}</span>
            </div>
        </div>
    );

    Box.propTypes = {
        idx: PropTypes.number.isRequired,
        className: PropTypes.string,
    };

    return (
        <div className="max-w-4xl mx-auto space-y-4 p-4">
            {/* Box 1 */}
            <Box idx={0} className="w-full h-[200px] rounded-lg" />

            {/* Box 2 & 3 */}
            <div className="flex gap-8">
                <Box idx={1} className="h-[130px] w-[327px] rounded-lg" />
                <Box idx={2} className="h-[130px] w-[173px] rounded-lg ml-auto" />
            </div>

            {/* Box 4 */}
            <Box idx={3} className="w-full h-[200px] rounded-lg" />
        </div>
    );
}
