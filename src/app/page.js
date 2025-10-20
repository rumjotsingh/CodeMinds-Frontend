"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import AnnouncementsList from "@/Component/AnnouncementsList";

// LOGOS (use your real paths!)
const faangLogos = [
  { name: "Adidas", src: "/images/adidas-2-logo-svgrepo-com.svg" },
  { name: "Apple", src: "/images/apple-black-logo-svgrepo-com.svg" },
  { name: "AirBnb", src: "/images/airbnb-2-logo-svgrepo-com.svg" },
  {
    name: "MasterCard",
    src: "/images/mastercard-6-logo-svgrepo-com.svg",
  },
  { name: "PayPal", src: "/images/paypal-logo-svgrepo-com.svg" },
  { name: "NetFlix", src: "/images/netflix-2-logo-svgrepo-com.svg" },

  { name: "Google", src: "/images/google-icon-logo-svgrepo-com.svg" },
];

const testimonials = [
  {
    id: 1,
    name: "Sarah J.",
    role: "Software Engineer",
    quote:
      "CodeMinds helped me sharpen my problem-solving skills with real-world style challenges. The community and contests are amazing!",
  },
  {
    id: 2,
    name: "Alex P.",
    role: "Computer Science Student",
    quote:
      "I love how intuitive and user-friendly CodeMinds is. The platform keeps me motivated and ready for my technical interviews!",
  },
  {
    id: 3,
    name: "Maria G.",
    role: "Full-Stack Developer",
    quote:
      "The variety of problems and helpful hints make CodeMinds my go-to place for daily coding practice and improvement.",
  },
];

// ---- CIRCULAR LOGO CAROUSEL COMPONENT ----

// ---- MAIN PAGE ----
export default function HomePage() {
  return (
    <main className="max-w-7xl mx-auto bg-background text-foreground pb-36 px-6 sm:px-10 md:px-20 lg:px-24 xl:px-32 py-20 overflow-x-hidden">
      {/* HERO */}
      <motion.section
        className="max-w-4xl mx-auto text-center "
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        <h1 className="text-6xl md:text-7xl font-extrabold text-primary tracking-tight leading-tight drop-shadow-glow animate-fadeIn">
          Welcome to CodeMinds
        </h1>
        <motion.p
          className="text-muted-foreground max-w-3xl mx-auto mb-16 text-xl md:text-2xl leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <span className="font-semibold text-foreground">
            India’s most vibrant coding community
          </span>{" "}
          and platform to ace <b className="text-yellow-400">FAANG</b>{" "}
          interviews, get placed at top Indian IT and startups, and grow your
          skills with premium coding challenges{" "}
        </motion.p>
      </motion.section>

      {/* CIRCULAR LOGOS */}
      <section className="mb-24">
        <h2 className="text-4xl font-bold text-primary mb-16 text-center tracking-wide drop-shadow">
          Used & loved by talent at
        </h2>
        <motion.div
          className="flex gap-16 min-w-max px-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        >
          {[...faangLogos, ...faangLogos].map((logo, index) => (
            <div key={index} className="flex-shrink-0">
              <Image
                src={logo.src}
                alt={logo.name}
                width={100}
                height={100}
                layout="intrinsic"
                className="transition duration-300 bg-card rounded-full p-2 border border-border"
              />
            </div>
          ))}
        </motion.div>
      </section>

      {/* DETAILED FEATURES */}
      <motion.section
        className="mb-24 text-center max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 70 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold text-primary mb-16">
          Why is CodeMinds Your #1 Interview & Coding Companion?
        </h2>
        <div className="grid grid-cols-1 gap-12 text-left">
          {[
            {
              title: "FAANG-Level Questions",
              points: [
                "Curated by experts and top coders",
                "Difficulty levels from beginner to advanced",
                "Exact company-specific topics for Facebook, Google, Amazon, and more",
              ],
            },
            {
              title: "Real Indian & Startup Patterns",
              points: [
                "Popular TCS/Infosys, Flipkart/Oyo, Zomato-style questions",
                "Campus placement, coding rounds, and hackathon archives",
                "Tons of language support (C++, Java, Python, JS...)",
              ],
            },
            {
              title: "Vibrant Community & Growth",
              points: [
                "Weekly contests, rank ladders, and advanced analytics",
                "100,000+ active users and mentors",
                "Peer review, hints, and solution discussion",
              ],
            },
          ].map(({ title, points }) => (
            <Card
              key={title}
              className="bg-card border-primary border-opacity-60 shadow-xl hover:shadow-2xl p-8 rounded-lg transition-transform transform hover:-translate-y-1 duration-300 text-foreground"
            >
              <CardHeader>
                <CardTitle className="text-primary text-2xl font-bold">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-6 text-muted-foreground text-lg">
                <ul className="list-disc ml-6 space-y-2">
                  {points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* EXTRA LARGE ABOUT SECTION */}
      <motion.section
        className="mb-24 max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold text-primary mb-10">
          How CodeMinds is Different
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed tracking-wide">
          <strong>CodeMinds</strong> combines the{" "}
          <strong>rigor of FAANG prep</strong>, the patterns of Indian tech &
          startup interviews, and the support of a thriving community. Every
          coder—from beginners to ICPC medalists—finds their place. Our platform
          is powered by modern technology and an ever-improving library to keep
          you a step ahead, always!
        </p>
      </motion.section>

      {/* TESTIMONIALS */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold text-primary mb-14 text-center tracking-wide drop-shadow">
          What Our Users Say
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4  animate-slideUp">
          {testimonials.map(({ id, name, role, quote }) => (
            <Card
              key={id}
              className="bg-card border-primary border-opacity-60 p-8 flex flex-col justify-between shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 text-foreground"
            >
              <CardContent className="flex-grow">
                <p className="italic text-muted-foreground text-lg  leading-relaxed">
                  “{quote}”
                </p>
              </CardContent>
              <div className="">
                <p className="font-semibold text-primary text-xl">{name}</p>
                <p className="text-muted-foreground text-sm">{role}</p>
              </div>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* MISSION & VISION */}
      <motion.section
        className="mt-32 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold text-primary mb-16 text-center tracking-wide">
          Our Mission & Vision
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto">
          {[
            {
              title: "Our Mission",
              text: "To empower developers with accessible, world-class coding education, powerful practice tools, and a motivating community so everyone can achieve their software career dreams, globally and locally.",
            },
            {
              title: "Our Vision",
              text: "To be the go-to destination for aspiring engineers, students, and professionals preparing for coding jobs—regardless of background. We believe in real skill, endless learning, and community success.",
            },
          ].map(({ title, text }) => (
            <Card
              key={title}
              className="bg-card border-primary border-opacity-60 p-8 rounded-lg shadow-lg text-foreground"
            >
              <CardHeader>
                <CardTitle className="text-primary text-2xl font-bold">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-xl mt-4">
                {text}
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>
    </main>
  );
}
