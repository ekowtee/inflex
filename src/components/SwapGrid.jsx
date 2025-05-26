// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react"

export default function SwapGrid() {
    const initialCards = [
        {
            id: 1,
            title: "Network Infrastructure",
            subtitle: "Accept payment across all networks",
            description: "Receive payments from all networks via a shortcode. It's quick, easy, and no internet is needed.",
            image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
            size: "large",
            theme: "red",
        },
        {
            id: 2,
            title: "Data-science",
            subtitle: "Advanced Analytics",
            description: "Powerful data processing and machine learning capabilities.",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
            size: "medium",
            theme: "dark",
        },
        {
            id: 3,
            title: "Cloud Services",
            subtitle: "Scalable Solutions",
            description: "Enterprise-grade cloud infrastructure and services.",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop",
            size: "medium",
            theme: "blue",
        },
        {
            id: 4,
            title: "Data centre Solutions",
            subtitle: "Enterprise Infrastructure",
            description: "Robust data center solutions for mission-critical applications.",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=300&fit=crop",
            size: "large",
            theme: "tech",
        },
    ]

    const shuffleOnce = (arr) => [...arr].sort(() => Math.random() - 0.5)

    const [cards, setCards] = useState(() => shuffleOnce(initialCards))
    const [hoveredIndex, setHoveredIndex] = useState(null)

    const handleCardHover = (index) => {
        setHoveredIndex(index)
        const newCards = [...cards]
        const randomIndex = Math.floor(Math.random() * cards.length)

        if (randomIndex !== index) {
            const temp = newCards[index]
            newCards[index] = newCards[randomIndex]
            newCards[randomIndex] = temp
            setCards(newCards)
        }
    }

    const handleMouseLeave = () => setHoveredIndex(null)

    const getCardClasses = (card) => {
        const baseClasses =
            "relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 ease-in-out transform hover:scale-[1.02] hover:shadow-2xl"
        const sizeClasses = card.size === "large" ? "col-span-2" : ""
        const themeClasses = {
            red: "bg-gradient-to-r from-red-600 to-red-700",
            dark: "bg-gradient-to-r from-gray-900 to-red-900",
            blue: "bg-gradient-to-r from-blue-600 to-blue-700",
            tech: "bg-gradient-to-r from-slate-800 to-slate-900",
        }

        return `${baseClasses} ${sizeClasses} ${themeClasses[card.theme]} h-full flex flex-col group`
    }

    return (
        <div className="w-full h-[600px] overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-4 h-full">
                {cards.map((card, index) => (
                    <div
                        key={`${card.id}-${index}`}
                        style={{ transitionDelay: `${index * 50}ms` }}
                        className={`transition-all duration-500 ${getCardClasses(card)}`}
                        onMouseEnter={() => handleCardHover(index)}
                        onMouseLeave={handleMouseLeave}
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <img
                                src={card.image || "/placeholder.svg"}
                                alt={card.title}
                                className="w-full h-full object-cover opacity-30 transition-all duration-500 group-hover:opacity-40"
                                onError={(e) => {
                                    e.target.src = "/placeholder.svg?height=400&width=600"
                                }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        {/* Content (only visible on hover) */}
                        <div className="relative z-10 p-4 flex-grow flex flex-col justify-center text-white space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <h2 className="text-sm md:text-base font-semibold leading-snug">{card.title}</h2>
                            <h3 className="text-xs md:text-sm opacity-80">{card.subtitle}</h3>
                            {card.size === "large" && (
                                <p className="text-[11px] opacity-70 leading-tight max-h-[3.5rem] overflow-hidden text-ellipsis">
                                    {card.description}
                                </p>
                            )}
                        </div>

                        {/* Hover animated indicator */}
                        {hoveredIndex === index && (
                            <div className="absolute -top-3 -right-3 w-6 h-6 bg-red-400 rounded-full animate-bounce shadow-lg z-20">
                                <div className="w-full h-full bg-red-300 rounded-full animate-pulse"></div>
                            </div>
                        )}

                        {/* Decorative corner accent */}
                        <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/10 rounded-tl-full transform translate-x-8 translate-y-8 transition-transform duration-500 hover:translate-x-6 hover:translate-y-6"></div>
                    </div>
                ))}
            </div>
        </div>
    )
}
