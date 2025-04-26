/* eslint-disable no-unused-vars */
import React from 'react'
import blog1 from "../assets/blog/blog1.png"
import blog2 from "../assets/blog/blog2.png"
import blog3 from "../assets/blog/blog3.png"

const blog = [
    {
        id: 1,
        image: blog1,
        title: 'Maecenas accumsan lacus vel facilisis volutpat est',
        description:
            'Non consectetur a erat nam at. Sit amet risus nullam eget felis eget nunc lobortis.',
        link: '/cases/1',
    },
    {
        id: 2,
        image: blog2,
        title: 'Maecenas accumsan lacus vel facilisis volutpat est',
        description:
            'Non consectetur a erat nam at. Sit amet risus nullam eget felis eget nunc lobortis.',
        link: '/cases/2',
    },
    {
        id: 3,
        image: blog3,
        title: 'Maecenas accumsan lacus vel facilisis volutpat est',
        description:
            'Non consectetur a erat nam at. Sit amet risus nullam eget felis eget nunc lobortis.',
        link: '/cases/3',
    },
]

export default function Blog() {
    return (
        <section className="container mx-auto px-4 sm:px-6 lg:px-[200px] 4xl:px-[250px] py-16 bg-white">
            {/* Section Heading */}
            <h2 className="
          text-xl        /* mobile */
          sm:text-2xl    /* sm+ */
          font-medium
          text-gray-800
          text-center
          mb-12
        ">
                Recent Case studies
            </h2>

            {/* Cards Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {blog.map(({ id, image, title, description, link }) => (
                    <div
                        key={id}
                        className="bg-[#F6F6F6] rounded-2xl shadow-md overflow-hidden flex flex-col"
                    >
                        {/* Image */}
                        <img
                            src={image}
                            alt={title}
                            className="
                w-full
                h-40     /* mobile */
                md:h-48  /* md+ matches your original */
                object-cover
                rounded-t-2xl
              "
                        />

                        {/* Content */}
                        <div className="py-6 px-4 flex-1 flex flex-col">
                            <h3 className="
                  text-base      /* mobile */
                  md:text-lg     /* md+ matches original  */
                  font-medium
                  text-gray-800
                  mb-2
                ">
                                {title}
                            </h3>
                            <p className="
                  text-sm       /* mobile */
                  md:text-base  /* md+ matches original */
                  text-gray-600
                  mb-4
                  flex-1
                  leading-relaxed
                ">
                                {description}
                            </p>

                            {/* Read More */}
                            <a
                                href={link}
                                className="mt-auto inline-flex items-center text-red-600 font-medium hover:underline"
                            >
                                READ MORE <span className="ml-1">&rarr;</span>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
