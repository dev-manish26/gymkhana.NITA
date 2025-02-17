

import Image from "next/image";
import React from "react";
import { Navbar } from "~/components";

const cards = [
  {
    image: "/btc-logo.png",
    title: "GYMKHANA TECHNICAL",
    description:
      "Gymkhana Technical fosters innovation and technical excellence among students through hands-on workshops, interdisciplinary projects, and high-stakes competitions. It serves as a hub for aspiring engineers and tech enthusiasts to develop their skills, explore emerging technologies, and collaborate on groundbreaking solutions. By bridging the gap between theoretical knowledge and real-world applications, Gymkhana Technical ensures students are industry-ready and equipped to tackle complex challenges in the ever-evolving world of technology. Regular hackathons, coding bootcamps, and robotics initiatives further amplify learning opportunities and career growth for students."
  },
  {
    image: "/btc-logo.png",
    title: "GYMKHANA CULTURAL",
    description:
      "Gymkhana Cultural is a celebration of artistic expression, bringing together students from diverse backgrounds to showcase their talents in music, dance, drama, literature, and fine arts. Through annual fests, cultural nights, and workshops, it provides a vibrant platform for students to nurture their creativity and develop a deeper appreciation for different art forms. From theater performances and film screenings to classical music recitals and street art exhibits, Gymkhana Cultural fosters a sense of community, encouraging self-expression and storytelling through various mediums."
  },
  {
    image: "/btc-logo.png",
    title: "GYMKHANA SPORTS",
    description:
      "Gymkhana Sports is the heartbeat of athletic excellence and physical fitness on campus. With dedicated training programs, inter-college tournaments, and expert coaching sessions, it encourages students to develop discipline, teamwork, and resilience. The facility offers a variety of sports ranging from football, basketball, and cricket to niche activities like rock climbing and martial arts. Gymkhana Sports plays a vital role in fostering a competitive yet sportsmanlike spirit, ensuring that students embrace a healthy and active lifestyle while honing their strategic and leadership skills."
  },
  {
    image: "/btc-logo.png",
    title: "GYMKHANA ALUMNI",
    description:
      "Gymkhana Alumni serves as a bridge between past and present students, creating a strong network of professionals who mentor, guide, and inspire the next generation. Through career development programs, networking events, and interactive sessions, it helps students gain industry insights, internship opportunities, and career guidance. Alumni from various fields regularly engage with students through webinars, guest lectures, and panel discussions, sharing their experiences and offering valuable advice on navigating the professional world. This initiative strengthens lifelong bonds, ensuring continued collaboration and support among graduates."
  }
];

const AboutPage: React.FC = () => {
  return (
    <div>
        <Navbar />
        <div className="mx-auto w-full p-2 sm:p-4">
        {cards.map((card, index) => (
            <div key={index} className="rounded-xl border p-4 sm:p-10 shadow-sm m-2 sm:m-4">
            <div className="flex flex-col items-center gap-4 md:flex-row p-2 sm:p-6">
                {index % 2 === 0 ? (
                <Image
                    src={card.image}
                    alt={card.title}
                    width={200}
                    height={200}
                    className="h-42 w-50 object-contain"
                />
                ) : null}
                <div className={`flex-1 space-y-2 m-2 sm:m-4 ${index % 2 !== 0 ? "order-2 md:order-1 lg:text-right" : ""}`}>
                <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
                    {card.title}
                </h1>
                <p className="leading-relaxed text-gray-600 text-xs sm:text-sm">
                    {card.description}
                </p>
                <button className="bg-black px-4 py-3 text-xs font-medium text-white transition-colors hover:bg-gray-800 rounded-sm cursor-pointer">
                    READ MORE
                </button>
                </div>
                {index % 2 !== 0 ? (
                <Image
                    src={card.image}
                    alt={card.title}
                    width={200}
                    height={200}
                    className="h-42 w-50 object-contain order-1 md:order-2"
                />
                ) : null}
            </div>
            </div>
        ))}
        </div>
    </div>
    
  );
};

export default AboutPage;
