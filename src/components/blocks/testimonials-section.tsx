"use client";
import React from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    text: "This Instagram automation tool transformed how we handle customer inquiries. Our response time went from hours to seconds!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    name: "Sarah Johnson",
    role: "E-commerce Store Owner",
  },
  {
    text: "The AI-powered responses feel incredibly natural. Our customers can't even tell they're talking to a bot!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    name: "Michael Chen",
    role: "Social Media Manager",
  },
  {
    text: "We've seen a 300% increase in engagement since implementing this automation. It's a game-changer for our brand.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    name: "Emily Rodriguez",
    role: "Digital Marketing Director",
  },
  {
    text: "Setting up was incredibly easy. Within minutes, we had our first automation running. The interface is so intuitive!",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    name: "David Park",
    role: "Startup Founder",
  },
  {
    text: "The analytics dashboard gives us insights we never had before. Now we can optimize our strategy based on real data.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    name: "Jessica Williams",
    role: "Growth Marketer",
  },
  {
    text: "Managing multiple Instagram accounts has never been easier. This tool saves us 20+ hours every week.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    name: "Alex Thompson",
    role: "Agency Owner",
  },
  {
    text: "Our customer satisfaction scores went up by 45% after we started using automated replies. It's been incredible!",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
    name: "Maria Garcia",
    role: "Customer Success Lead",
  },
  {
    text: "The smart triggers are brilliant. We can customize responses based on keywords and user behavior. Highly recommend!",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    name: "James Anderson",
    role: "Product Manager",
  },
  {
    text: "Best investment we've made for our Instagram strategy. The ROI is incredible and setup was painless.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    name: "Lisa Kumar",
    role: "Business Owner",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

function TestimonialCard({ text, image, name, role }: typeof testimonials[0]) {
  return (
    <div className="group relative p-6 rounded-xl overflow-hidden transition-all duration-300 border border-gray-100/80 dark:border-white/10 bg-white dark:bg-black hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_2px_12px_rgba(255,255,255,0.03)] max-w-sm w-full">
      {/* Dot pattern background */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
      </div>

      <div className="relative">
        {/* Quote Icon */}
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/5 dark:bg-white/10 mb-4">
          <Quote className="w-4 h-4 text-foreground" />
        </div>

        {/* Testimonial Text */}
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-snug mb-5">
          {text}
        </p>

        {/* Author Info */}
        <div className="flex items-center gap-3">
          <img
            src={image}
            alt={name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-white/10"
          />
          <div>
            <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
              {name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {role}
            </div>
          </div>
        </div>
      </div>

      {/* Gradient border effect */}
      <div className="absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-gray-100/50 to-transparent dark:via-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}

function TestimonialColumn({ 
  testimonials, 
  className = "",
  reverse = false 
}: { 
  testimonials: typeof firstColumn; 
  className?: string;
  reverse?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div 
        className={`flex flex-col gap-4 animate-scroll-${reverse ? 'up' : 'down'}`}
        style={{
          animation: `scroll-${reverse ? 'up' : 'down'} ${reverse ? 17 : 15}s linear infinite`,
        }}
      >
        {[...testimonials, ...testimonials].map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]">
      <style jsx>{`
        @keyframes scroll-down {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        @keyframes scroll-up {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/10 bg-background/50 backdrop-blur-sm mb-6">
            <Quote className="w-3.5 h-3.5 text-foreground" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Testimonials
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            What our users say
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            See what our customers have to say about transforming their Instagram automation.
          </p>
        </div>

        {/* Testimonials Columns with Gradient Mask */}
        <div className="relative">
          <div className="flex justify-center gap-4 max-h-[600px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
            <TestimonialColumn testimonials={firstColumn} reverse={false} />
            <TestimonialColumn testimonials={secondColumn} className="hidden md:flex" reverse={true} />
            <TestimonialColumn testimonials={thirdColumn} className="hidden lg:flex" reverse={false} />
          </div>

          {/* Gradient Overlays */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}