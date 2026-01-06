"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Code2, Trophy, Users, Target, ArrowRight, Star } from "lucide-react";

const companyLogos = [
  { name: "Google", src: "/images/google-icon-logo-svgrepo-com.svg" },
  { name: "Apple", src: "/images/apple-black-logo-svgrepo-com.svg" },
  { name: "Netflix", src: "/images/netflix-2-logo-svgrepo-com.svg" },
  { name: "Airbnb", src: "/images/airbnb-2-logo-svgrepo-com.svg" },
  { name: "PayPal", src: "/images/paypal-logo-svgrepo-com.svg" },
  { name: "MasterCard", src: "/images/mastercard-6-logo-svgrepo-com.svg" },
];

const stats = [
  { value: "3000+", label: "Coding Problems" },
  { value: "100K+", label: "Active Users" },
  { value: "500+", label: "Weekly Contests" },
  { value: "50+", label: "Companies" },
];

const features = [
  {
    icon: Code2,
    title: "Practice Problems",
    desc: "Master algorithms and data structures with our curated problem sets.",
    color: "#00b8a3",
  },
  {
    icon: Trophy,
    title: "Weekly Contests",
    desc: "Compete globally and climb the leaderboard rankings.",
    color: "#ffc01e",
  },
  {
    icon: Users,
    title: "Community",
    desc: "Learn from solutions and discuss with fellow developers.",
    color: "#3b82f6",
  },
  {
    icon: Target,
    title: "Interview Prep",
    desc: "Company-specific questions from FAANG and top startups.",
    color: "#ff375f",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer @ Google",
    quote:
      "CodeMinds helped me crack my Google interview. The problem quality is exceptional.",
    avatar: "S",
  },
  {
    name: "Alex Chen",
    role: "CS Student @ MIT",
    quote:
      "The best platform for competitive programming. Weekly contests keep me sharp.",
    avatar: "A",
  },
  {
    name: "Maria Garcia",
    role: "Full-Stack Developer",
    quote:
      "From beginner to confident coder in 6 months. The community support is amazing.",
    avatar: "M",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#eff1f6]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00b8a3]/10 via-transparent to-[#3b82f6]/10"></div>
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-32 relative">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#282828] border border-[#303030] text-sm mb-8">
              <span className="w-2 h-2 bg-[#00b8a3] rounded-full animate-pulse"></span>
              <span className="text-[#eff1f6bf]">
                Join 100,000+ developers worldwide
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Level Up Your
              <span className="block bg-gradient-to-r from-[#00b8a3] via-[#3b82f6] to-[#00b8a3] bg-clip-text text-transparent">
                Coding Skills
              </span>
            </h1>

            <p className="text-xl text-[#eff1f6bf] max-w-2xl mx-auto mb-10 leading-relaxed">
              Master algorithms, ace technical interviews, and compete with
              developers globally. Your journey to becoming a better programmer
              starts here.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/problem">
                <button className="px-8 py-3.5 bg-[#00b8a3] hover:bg-[#00a392] text-white font-semibold rounded-lg transition flex items-center gap-2">
                  Start Practicing
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/contest">
                <button className="px-8 py-3.5 bg-[#282828] hover:bg-[#303030] border border-[#404040] rounded-lg transition font-medium">
                  View Contests
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="text-center p-6 rounded-xl bg-[#282828]/50 border border-[#303030]"
              >
                <div className="text-3xl md:text-4xl font-bold text-[#00b8a3] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[#eff1f6bf]">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Company Logos */}
      <section className="py-16 border-y border-[#303030] bg-[#282828]/30">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-sm text-[#eff1f6bf] mb-8 uppercase tracking-wider">
            Trusted by engineers at top companies
          </p>
          <div className="flex items-center justify-center gap-12 flex-wrap opacity-60">
            {companyLogos.map((logo, idx) => (
              <div
                key={idx}
                className="grayscale hover:grayscale-0 transition-all duration-300"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={48}
                  height={48}
                  className="invert"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-[#eff1f6bf] max-w-xl mx-auto">
              From learning fundamentals to acing FAANG interviews, we&apos;ve
              got you covered.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="p-6 rounded-xl bg-[#282828] border border-[#303030] hover:border-[#404040] transition group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <feature.icon
                    className="w-6 h-6"
                    style={{ color: feature.color }}
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-[#eff1f6bf]">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-[#282828]/30">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Your Journey
            </h2>
            <p className="text-[#eff1f6bf]">
              Three simple steps to becoming a better developer
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Choose a Problem",
                desc: "Browse 3000+ problems sorted by difficulty and topic",
              },
              {
                step: "02",
                title: "Write & Test Code",
                desc: "Use our powerful editor with real-time feedback",
              },
              {
                step: "03",
                title: "Track Progress",
                desc: "Monitor your growth with detailed analytics",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
              >
                <div className="text-6xl font-bold text-[#303030] mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-[#eff1f6bf]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by Developers
            </h2>
            <p className="text-[#eff1f6bf]">
              See what our community has to say
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                className="p-6 rounded-xl bg-[#282828] border border-[#303030]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#ffc01e] text-[#ffc01e]"
                    />
                  ))}
                </div>
                <p className="text-[#eff1f6bf] mb-6 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00b8a3] to-[#3b82f6] flex items-center justify-center font-semibold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-medium">{t.name}</div>
                    <div className="text-sm text-[#eff1f6bf]">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            className="text-center p-12 rounded-2xl bg-gradient-to-br from-[#282828] to-[#1a1a1a] border border-[#303030]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Coding?
            </h2>
            <p className="text-[#eff1f6bf] mb-8 max-w-lg mx-auto">
              Join thousands of developers improving their skills every day.
              It&apos;s free to get started.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/register">
                <button className="px-8 py-3.5 bg-[#00b8a3] hover:bg-[#00a392] text-white font-semibold rounded-lg transition flex items-center gap-2">
                  Create Free Account
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/problem">
                <button className="px-8 py-3.5 bg-[#282828] hover:bg-[#303030] border border-[#404040] rounded-lg transition font-medium">
                  Explore Problems
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
