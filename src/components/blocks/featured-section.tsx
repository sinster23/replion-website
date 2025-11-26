import React from "react";
import { Rocket, Bot, BarChart3, Grid3x3 } from "lucide-react";

const features = [
  {
    title: "Automated Cold DMs",
    description: "Reach new followers or leads instantly with intelligent automation that feels personal and authentic.",
    icon: <Rocket className="w-4 h-4 text-blue-500" />,
    status: "Live",
    tags: ["Automation", "Outreach"],
    meta: "Active now",
    colSpan: 2,
    hasPersistentHover: true,
  },
  {
    title: "Smart Replies (AI)",
    description: "Automatically answer customer messages 24/7 with AI-powered responses that maintain your brand voice.",
    icon: <Bot className="w-4 h-4 text-emerald-500" />,
    status: "Active",
    tags: ["AI", "Support"],
    meta: "24/7",
  },
  {
    title: "Analytics Dashboard",
    description: "Track engagement, reply rate, and ROI with comprehensive insights to optimize your strategy.",
    icon: <BarChart3 className="w-4 h-4 text-purple-500" />,
    status: "Updated",
    tags: ["Analytics", "Reports"],
    meta: "Real-time",
    colSpan: 2,
  },
  {
    title: "Multi-Account Support",
    description: "Manage multiple Instagram accounts easily from one unified dashboard with seamless switching.",
    icon: <Grid3x3 className="w-4 h-4 text-sky-500" />,
    status: "Beta",
    tags: ["Management", "Teams"],
    meta: "Unlimited",
  },
];

function cn(...classes: (string | boolean | undefined | Record<string, boolean | undefined>)[]) {
  return classes
    .map(cls => {
      if (typeof cls === 'object' && cls !== null) {
        return Object.entries(cls)
          .filter(([, value]) => value)
          .map(([key]) => key)
          .join(' ');
      }
      return cls;
    })
    .filter(Boolean)
    .join(' ');
}

export function FeaturesSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]">
      
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Everything you need to scale
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Powerful features designed to help you automate, engage, and grow your Instagram presence effortlessly.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "group relative p-6 rounded-xl overflow-hidden transition-all duration-300",
                "border border-gray-100/80 dark:border-white/10 bg-white dark:bg-black",
                "hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_2px_12px_rgba(255,255,255,0.03)]",
                "hover:-translate-y-0.5 will-change-transform",
                feature.colSpan === 2 ? "md:col-span-2" : "col-span-1",
                {
                  "shadow-[0_2px_12px_rgba(0,0,0,0.03)] -translate-y-0.5":
                    feature.hasPersistentHover,
                  "dark:shadow-[0_2px_12px_rgba(255,255,255,0.03)]":
                    feature.hasPersistentHover,
                }
              )}
            >
              {/* Dot pattern background */}
              <div
                className={`absolute inset-0 ${
                  feature.hasPersistentHover
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                } transition-opacity duration-300`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
              </div>

              <div className="relative flex flex-col space-y-3">
                {/* Header with icon and status */}
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/5 dark:bg-white/10 group-hover:bg-gradient-to-br transition-all duration-300">
                    {feature.icon}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-1 rounded-lg backdrop-blur-sm",
                      "bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300",
                      "transition-colors duration-300 group-hover:bg-black/10 dark:group-hover:bg-white/20"
                    )}
                  >
                    {feature.status}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 tracking-tight text-[15px]">
                    {feature.title}
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-normal">
                      {feature.meta}
                    </span>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-snug font-[425]">
                    {feature.description}
                  </p>
                </div>

                {/* Tags and CTA */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    {feature.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-md bg-black/5 dark:bg-white/10 backdrop-blur-sm transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/20"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore →
                  </span>
                </div>
              </div>

              {/* Gradient border effect */}
              <div
                className={`absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-gray-100/50 to-transparent dark:via-white/10 ${
                  feature.hasPersistentHover
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                } transition-opacity duration-300`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}