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
    <main
      className=" max-w-7xl mx-auto bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 pb-32 px-6 sm:px-10 md:px-20 lg:px-40 xl:px-60 py-20"
      style={{ overflowX: "hidden" }}
    >
      {/* HERO */}
      <motion.section
        className="text-center mb-24"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        <h1 className="text-7xl md:text-8xl font-extrabold text-yellow-400 mb-8 tracking-tight leading-tight drop-shadow-glow animate-fadeIn">
          Welcome to CodeMinds
        </h1>
        <motion.p
          className="text-gray-200 max-w-4xl mx-auto mb-12 text-2xl md:text-3xl leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <span className="font-semibold text-white">
            India’s most vibrant coding community
          </span>{" "}
          and platform to ace <b className="text-yellow-400">FAANG</b>{" "}
          interviews, get placed at top Indian IT and startups, and grow your
          skills with premium coding challenges{" "}
          <span className="inline-block animate-bounce">🚀</span>
        </motion.p>
        <div className="flex justify-center gap-8">
          <Link href="/problem">
            <Button
              size="lg"
              className="transition-transform hover:scale-110 shadow-yellow-500/40 font-semibold text-lg"
            >
              Start Coding
            </Button>
          </Link>
          <Link href="/contest">
            <Button
              variant="outline"
              size="lg"
              className="transition-transform hover:scale-110 shadow-yellow-500/20 border-yellow-400 font-semibold text-lg"
            >
              Join Contests
            </Button>
          </Link>
        </div>
      </motion.section>

      {/* CIRCULAR LOGOS */}
      <section className="mb-24">
        <h2 className="text-4xl font-bold text-white mb-10 text-center tracking-wide drop-shadow">
          Used & loved by talent at
        </h2>
        <motion.div
          className="flex gap-16 min-w-max px-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        >
          {[...faangLogos, ...faangLogos].map((logo, index) => (
            <div key={index} className="flex-shrink-0">
              <Image
                src={logo.src}
                alt={logo.name}
                width={100}
                height={60}
                className="transition duration-300"
              />
            </div>
          ))}
        </motion.div>
      </section>

      <Separator className="my-20 border-yellow-600" />

      {/* DETAILED FEATURES */}
      <motion.section
        className="mb-24 text-center"
        initial={{ opacity: 0, y: 70 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold text-white mb-12">
          Why is CodeMinds Your #1 Interview & Coding Companion?
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 text-left">
          <Card className="bg-gray-800 border-yellow-500 border-opacity-60 shadow-2xl hover:scale-105 duration-300">
            <CardHeader>
              <CardTitle className="text-yellow-400 text-2xl font-bold">
                FAANG-Level Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-4 text-gray-200 text-lg">
              <ul className="list-disc ml-4">
                <li>Curated by experts and top coders</li>
                <li>Difficulty levels from beginner to advanced</li>
                <li>
                  Exact company-specific topics for Facebook, Google, Amazon,
                  and more
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-yellow-500 border-opacity-60 shadow-2xl hover:scale-105 duration-300">
            <CardHeader>
              <CardTitle className="text-yellow-400 text-2xl font-bold">
                Real Indian & Startup Patterns
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-4 text-gray-200 text-lg">
              <ul className="list-disc ml-4">
                <li>
                  Popular TCS/Infosys, Flipkart/Oyo, Zomato-style questions
                </li>
                <li>Campus placement, coding rounds, and hackathon archives</li>
                <li>Tons of language support (C++, Java, Python, JS...)</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-yellow-500 border-opacity-60 shadow-2xl hover:scale-105 duration-300">
            <CardHeader>
              <CardTitle className="text-yellow-400 text-2xl font-bold">
                Vibrant Community & Growth
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-4 text-gray-200 text-lg">
              <ul className="list-disc ml-4">
                <li>Weekly contests, rank ladders, and advanced analytics</li>
                <li>100,000+ active users and mentors</li>
                <li>Peer review, hints, and solution discussion</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Extra Large About Section */}
      <motion.section
        className="mb-24 max-w-5xl mx-auto text-center"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold text-yellow-400 mb-8">
          How CodeMinds is Different
        </h2>
        <div className="text-lg md:text-2xl text-gray-200 mb-8 leading-relaxed">
          <p>
            <b>CodeMinds</b> combines the <b>rigor of FAANG prep</b>, the
            patterns of Indian tech & startup interviews, and the support of a
            thriving community. Every coder—from beginners to ICPC
            medalists—finds their place. Our platform is powered by modern
            technology and an ever-improving library to keep you a step ahead,
            always!
          </p>
        </div>
        <Button size="lg">
          <Link className="text-yellow-400" href="/register">
            Sign Up Free
          </Link>
        </Button>
      </motion.section>

      <Separator className="my-20 border-yellow-600" />

      {/* Testimonials */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold text-white mb-12 text-center tracking-wide drop-shadow">
          What Our Users Say
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 animate-slideUp">
          {testimonials.map(({ id, name, role, quote }) => (
            <Card
              key={id}
              className="bg-gray-800 border-yellow-600 border-opacity-60 p-8 flex flex-col justify-between shadow-2xl hover:shadow-3xl transition-shadow duration-300 transform hover:-translate-y-2"
            >
              <CardContent className="flex-grow">
                <p className="italic text-gray-300 text-xl leading-relaxed">
                  “{quote}”
                </p>
              </CardContent>
              <div className="mt-8">
                <p className="font-semibold text-yellow-400 text-xl">{name}</p>
                <p className="text-gray-400 text-sm">{role}</p>
              </div>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Mission & Vision */}
      <motion.section
        className="mt-32 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold text-white mb-14 text-center tracking-wide">
          Our Mission & Vision
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <Card className="bg-gray-800 border-yellow-600 border-opacity-60 p-8">
            <CardHeader>
              <CardTitle className="text-yellow-400 text-2xl font-bold">
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 text-xl mt-4">
              To empower developers with accessible, world-class coding
              education, powerful practice tools, and a motivating community so
              everyone can achieve their software career dreams, globally and
              locally.
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-yellow-600 border-opacity-60 p-8">
            <CardHeader>
              <CardTitle className="text-yellow-400 text-2xl font-bold">
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 text-xl mt-4">
              To be the go-to destination for aspiring engineers, students, and
              professionals preparing for coding jobs—regardless of background.
              We believe in real skill, endless learning, and community success.
            </CardContent>
          </Card>
        </div>
      </motion.section>
    </main>
  );
}
