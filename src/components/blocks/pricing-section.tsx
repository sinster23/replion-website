import React from "react";
import { Check, Zap, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Free Plan",
    price: "₹0",
    period: "forever",
    description: "Perfect for individuals getting started with Instagram automation",
    features: [
      {
        title: "Basic automation",
        description: "Set up simple automated responses for common queries",
      },
      {
        title: "1 Instagram account",
        description: "Connect and manage one Instagram business account",
      },
      {
        title: "100 DMs per month",
        description: "Automated responses for up to 100 direct messages",
      },
      {
        title: "Basic analytics",
        description: "Track your engagement and response rates",
      },
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro Plan",
    price: "₹299",
    period: "per month",
    description: "For professionals and businesses ready to scale their Instagram presence",
    features: [
      {
        title: "Smart AI replies",
        description: "Advanced AI-powered responses that match your brand voice",
      },
      {
        title: "Unlimited Instagram accounts",
        description: "Manage multiple accounts from one dashboard",
      },
      {
        title: "Unlimited DMs",
        description: "No limits on automated direct messages",
      },
      {
        title: "Advanced analytics",
        description: "Comprehensive insights, ROI tracking, and performance metrics",
      },
      {
        title: "Priority support",
        description: "Get help fast with our dedicated priority support team",
      },
      {
        title: "Custom workflows",
        description: "Build complex automation sequences with our visual builder",
      },
    ],
    cta: "Upgrade Now",
    highlighted: true,
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

export default function PricingSection() {
  return (
    <section className="relative py-16 md:py-22 overflow-hidden [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]">
        
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Prices that make sense
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Start for free, upgrade when you're ready. No hidden fees, no surprises.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={cn(
                "group relative p-8 rounded-xl overflow-hidden transition-all duration-300",
                "border border-gray-100/80 dark:border-white/10 bg-white dark:bg-black",
                {
                  "shadow-[0_2px_12px_rgba(0,0,0,0.03)] -translate-y-0.5 dark:shadow-[0_2px_12px_rgba(255,255,255,0.03)]": plan.highlighted,
                  "hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_2px_12px_rgba(255,255,255,0.03)] hover:-translate-y-0.5 will-change-transform": !plan.highlighted,
                }
              )}
            >
              {/* Dot pattern background */}
              <div className={cn(
                "absolute inset-0 transition-opacity duration-300",
                plan.highlighted ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
              </div>

              <div className="relative flex flex-col space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-snug">
                      {plan.description}
                    </p>
                  </div>
                  {plan.highlighted && (
                    <span className="text-xs font-medium px-2 py-1 rounded-lg backdrop-blur-sm bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors duration-300 group-hover:bg-black/10 dark:group-hover:bg-white/20">
                      Popular
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900 dark:text-gray-100">
                    {plan.price}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    / {plan.period}
                  </span>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-black/5 dark:bg-white/10">
                        <Check className="w-3 h-3 text-gray-700 dark:text-gray-300" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {feature.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-snug">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  className={cn(
                    "w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 group/btn mt-2",
                    plan.highlighted
                      ? "bg-foreground text-background hover:opacity-90 shadow-lg"
                      : "border border-gray-200 dark:border-white/10 bg-background hover:bg-accent/50"
                  )}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
                </button>
              </div>

              {/* Gradient border effect */}
              {plan.highlighted && (
                <div className="absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-gray-100/50 to-transparent dark:via-white/10 opacity-100 transition-opacity duration-300" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom Text */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            All plans include 14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}