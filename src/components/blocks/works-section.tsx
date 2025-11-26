"use client";
import React, { useEffect, useRef, useState } from "react";
import { Instagram, Sparkles, Coffee } from "lucide-react";


// Simplified scroll progress hook
function useScrollProgress(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress based on container position
      const start = rect.top + window.scrollY - windowHeight * 0.1;
      const end = rect.top + window.scrollY + rect.height - windowHeight * 0.5;
      const current = window.scrollY;
      
      const progress = Math.max(0, Math.min(1, (current - start) / (end - start)));
      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [containerRef]);

  return scrollProgress;
}

interface TimelineEntry {
  icon: React.ElementType;
  number: string;
  title: string;
  description: string;
  highlight: string;
  content: React.ReactNode;
}

const steps: TimelineEntry[] = [
  {
    icon: Instagram,
    number: "01",
    title: "Connect Instagram",
    description: "Securely link your Instagram account via the official Meta API in seconds. Your credentials stay safe.",
    highlight: "via official API",
    content: (
      <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
          Connect your Instagram Business or Creator account seamlessly through Meta's official API. We prioritize security and never store your password.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <img
            src="/works1.png"
            alt="Instagram connection"
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
          />
          <img
            src="/works2.png"
            alt="Secure API"
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
          />
        </div>
      </div>
    ),
  },
  {
    icon: Sparkles,
    number: "02",
    title: "Create Automation Bot",
    description: "Choose your triggers and actions with our intuitive builder. Set up smart responses that match your brand voice.",
    highlight: "choose triggers & actions",
    content: (
      <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
          Build intelligent automation workflows with our drag-and-drop interface. Train AI responses to sound exactly like you.
        </p>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
          Customize triggers based on keywords, user behavior, and engagement patterns. Set up multiple automation rules for different scenarios.
        </p>
        <div className="mb-8">
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm mb-2">
            ✅ Smart keyword detection
          </div>
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm mb-2">
            ✅ AI-powered response generation
          </div>
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm mb-2">
            ✅ Custom workflow builder
          </div>
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm mb-2">
            ✅ Brand voice training
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img
            src="/works3.png"
            alt="Analytics dashboard"
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
          />
          <img
            src="/works4.png"
            alt="Automation workflow"
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
          />
        </div>
      </div>
    ),
  },
  {
    icon: Coffee,
    number: "03",
    title: "Sit Back & Relax",
    description: "Your bot handles DMs automatically 24/7. Watch engagement grow while you focus on creating great content.",
    highlight: "handles DMs automatically",
    content: (
      <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
          Once activated, your automation runs on autopilot. Monitor performance in real-time and adjust strategies based on insights.
        </p>
        <div className="mb-8">
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm mb-2">
            ✅ 24/7 automated responses
          </div>
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm mb-2">
            ✅ Real-time analytics dashboard
          </div>
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm mb-2">
            ✅ Engagement tracking
          </div>
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm mb-2">
            ✅ ROI measurement tools
          </div>
          <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm mb-2">
            ✅ Performance optimization tips
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img
            src="/works5.png"
            alt="Team collaboration"
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
          />
          <img
            src="/works6.png"
            alt="Growth metrics"
            className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
          />
        </div>
      </div>
    ),
  },
];

export default function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const scrollProgress = useScrollProgress(containerRef);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  return (
    <div
      className="w-full bg-white dark:bg-neutral-950 font-sans md:px-10"
      ref={containerRef}
    >
      {/* Header Section */}
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/10 bg-background/50 backdrop-blur-sm mb-6">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Simple Process
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-black dark:text-white">
            Get started in 3 simple steps
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 text-base md:text-lg max-w-2xl mx-auto">
            No technical knowledge required. Set up your Instagram automation in
            minutes and start growing your business today.
          </p>
        </div>
      </div>

      {/* Timeline Section */}
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {steps.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-5 md:pt-30 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center border-2 border-gray-200 dark:border-white/10">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  {React.createElement(item.icon, { className: "w-3 h-3 text-white" })}
                </div>
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-neutral-500 dark:text-neutral-500">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500">
                {item.title}
              </h3>

              {/* Card Content */}
              <div className="group relative p-6 rounded-xl overflow-hidden transition-all duration-300 border border-gray-100/80 dark:border-white/10 bg-white dark:bg-black hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_2px_12px_rgba(255,255,255,0.03)] mb-8">
                {/* Dot pattern background */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
                </div>

                <div className="relative flex flex-col space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-black/5 dark:bg-white/10 group-hover:bg-gradient-to-br transition-all duration-300">
                      {React.createElement(item.icon, { className: "w-5 h-5 text-foreground" })}
                    </div>
                    <span className="text-3xl font-bold text-gray-300 dark:text-gray-700">
                      {item.number}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-snug font-[425]">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/10 backdrop-blur-sm group-hover:bg-black/10 dark:group-hover:bg-white/20 transition-colors duration-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                        {item.highlight}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                {item.content}

                {/* Gradient border effect */}
                <div className="absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-gray-100/50 to-transparent dark:via-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>
        ))}

        {/* Animated Line */}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <div 
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full transition-all duration-300 ease-out"
            style={{
              height: `${scrollProgress * 100}%`,
              opacity: Math.min(scrollProgress * 2, 1),
            }}
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto pb-20 px-4 md:px-8 lg:px-10">
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <button className="px-8 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold hover:opacity-90 transition-opacity shadow-lg">
              Start Free Trial
            </button>
            <button className="px-8 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black text-black dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              Watch Demo
            </button>
          </div>
          <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}