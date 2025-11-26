import React from "react";
import { Bot, Shield, Zap } from "lucide-react";

const features = [
  {
    title: "AI Intent Detection",
    description: "Built with a high-performance neural engine with an obsessive focus on accuracy.",
    icon: Bot,
  },
  {
    title: "Natural Conversations",
    description: "Best-in-class natural language processing keeps your conversations authentic and human.",
    icon: Shield,
  },
  {
    title: "24/7 Automation",
    description: "Built for teams of all sizes. From early-stage startups to global enterprises.",
    icon: Zap,
  },
];

export default function SmartReplySection() {
  return (
    <section className="relative min-h-screen [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)] text-white overflow-hidden">
      
      <div className="relative max-w-7xl mx-auto py-20 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">

            {/* Headline */}
            <div className="space-y-4">
              <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
                Let AI reply for you — while you sleep
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
                Linear is so simple to use, it's easy to overlook the wealth of complex technologies packed under the hood that keep Linear robust, safe, and blazing fast.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-6 pt-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4 group">
                  <div className="flex-shrink-0 pt-1">
                    <h3 className="text-base font-medium mb-2 text-white">{feature.title}</h3>
                  </div>
                  <div className="flex-1 border-b border-zinc-900 pb-6">
                    <p className="text-sm text-gray-400 leading-relaxed pt-0.5">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-8">
              <button className="group relative px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
                <span className="relative z-10">Unlock Smart Replies → Upgrade to Pro</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
              </button>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            {/* Image container with subtle border and effects */}
            <div className="relative rounded-2xl overflow-hidden ">
              {/* Placeholder for the image - replace src with your actual image */}
              <img 
                src="/saas_image.png" 
                alt="Smart Reply Dashboard"
                className="w-full h-full object-cover"
              />
            
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-3xl -z-10" />
          </div>
        </div>
      </div>


    </section>
  );
}