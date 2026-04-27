"use client";
import { useState } from "react";

export default function CrackAIPage() {
  const [faqOpen, setFaqOpen] = useState(null);

  const FAQS = [
    { 
      q: "What is CrackAI?", 
      a: "CrackAI is an all-in-one AI interview assistant tool designed for both interview preparation and live performance support. It provides live interview guidance with tools like Interview Copilot, simulates real interview scenarios for mock interview practice, and provides detailed post-interview feedback." 
    },
    { 
      q: "How does CrackAI work?", 
      a: "Upload your resume and select your target role to personalize the interview context. You can customize response length, tone, and model preferences for tailored guidance. Use Stealth Mode for live interviews or practice with our AI Mock Interview system." 
    },
    { 
      q: "Is CrackAI detectable during interviews?", 
      a: "CrackAI's Stealth Mode is designed to operate discreetly during live interviews. It runs as a floating overlay and does not interfere with video conferencing platforms, screen sharing, audio, or camera functionality." 
    },
    { 
      q: "What types of interviews does CrackAI support?", 
      a: "CrackAI supports all interview types including behavioral interviews, coding interviews, system design interviews, one-way video interviews, mock interviews, and final round interviews. The AI provides tailored responses for different question types." 
    },
    { 
      q: "Can CrackAI help with coding interviews?", 
      a: "Yes, CrackAI supports coding interviews by listening to technical questions and providing coding solutions, algorithm explanations, and debugging help in real-time. It works with coding platforms like LeetCode, HackerRank, and live coding environments." 
    },
    { 
      q: "What is the pricing for CrackAI?", 
      a: "CrackAI offers a free plan and paid subscriptions starting at $25 per month. Pricing varies based on usage limits and advanced features." 
    },
  ];

  const testimonials = [
    { 
      name: "Alex Chen", 
      role: "Software Engineer at Google", 
      text: "CrackAI helped me prepare for my Google L5 interview. The mock interviews felt incredibly realistic and the feedback was spot-on.",
      rating: 5
    },
    { 
      name: "Sarah Johnson", 
      role: "Product Manager at Meta", 
      text: "Best learning experience to practice for interviews. The STAR method feedback transformed how I answer behavioral questions.",
      rating: 5
    },
    { 
      name: "Raj Patel", 
      role: "Data Scientist at Amazon", 
      text: "The coding interview practice with AI assistance is absolute gold. It helped me structure my answers and think out loud effectively.",
      rating: 5
    },
    { 
      name: "Emily Wang", 
      role: "Senior SWE at Microsoft", 
      text: "This tool reflects as a mirror of how you're performing. The detailed analysis helped me overcome my weak points. 10/10 recommend!",
      rating: 5
    },
  ];

  const industries = [
    { name: "Tech", icon: "ðŸ’»" },
    { name: "Consulting", icon: "ðŸ“Š" },
    { name: "Finance", icon: "ðŸ’°" },
    { name: "Marketing", icon: "ðŸ“¢" },
    { name: "Sales", icon: "ðŸ¤" },
    { name: "Healthcare", icon: "ðŸ¥" },
    { name: "Operations", icon: "âš™ï¸" },
  ];

  const companyLogos = ["Google", "Meta", "Amazon", "Microsoft", "Apple", "Netflix", "OpenAI", "Stripe"];

  return (
    <div className="bg-white text-slate-900 font-sans">

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full flex justify-between items-center px-6 md:px-10 py-4 bg-white/90 backdrop-blur-lg border-b border-gray-100 z-50">
        <div className="flex items-center gap-2 font-bold text-lg">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
            C
          </div>
          <span>Crack<span className="text-blue-600">AI</span></span>
        </div>

        <div className="hidden md:flex gap-8 text-gray-600 text-sm">
          <a href="#features" className="hover:text-blue-600 transition">Features</a>
          <a href="#how-it-works" className="hover:text-blue-600 transition">How it Works</a>
          <a href="#testimonials" className="hover:text-blue-600 transition">Testimonials</a>
          <a href="#pricing" className="hover:text-blue-600 transition">Pricing</a>
          <a href="#faq" className="hover:text-blue-600 transition">FAQ</a>
        </div>

        <div className="flex items-center gap-4">
          <a href="/dashboard" className="hidden sm:block text-sm text-gray-600 hover:text-blue-600 transition">
            Dashboard
          </a>
          <a href="/stealth" className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg text-sm font-medium transition">
            ðŸ¥· Stealth
          </a>
          <a href="/onboarding" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2 rounded-xl text-sm font-medium shadow-lg shadow-blue-500/25 transition">
            Get Started
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 bg-gradient-to-b from-slate-50 via-white to-blue-50/30">
        {/* Trust badge */}
        <div className="flex items-center gap-2 mb-8 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
          <span className="flex">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            ))}
          </span>
          <span className="text-sm text-gray-600">Trusted by <b>100K+</b> job seekers</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 max-w-4xl">
          Crack Every Interview with{" "}
          <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-green-500 bg-clip-text text-transparent">
            Real-Time AI
          </span>
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mb-10">
          Practice with AI-powered mock interviews, then get 100% undetectable real-time assistance during actual interviews. CrackAI supports you at every stage.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <a href="/onboarding" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:scale-105">
            Get Started Free
          </a>
          <a href="/stealth" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all hover:scale-105">
            ðŸ¥· Try Stealth Mode
          </a>
        </div>

        {/* Quick feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {["Mock Interviews", "Resume Builder", "Coding Practice", "Real-time Copilot", "Interview Reports"].map((feature, i) => (
            <span key={i} className="px-4 py-2 bg-white rounded-full border border-gray-200 text-sm text-gray-700 shadow-sm">
              âœ“ {feature}
            </span>
          ))}
        </div>

        {/* Company logos */}
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-4">Trusted by professionals from</p>
          <div className="flex flex-wrap justify-center gap-6 opacity-50">
            {companyLogos.map((company, i) => (
              <span key={i} className="text-lg font-bold text-gray-400">{company}</span>
            ))}
          </div>
        </div>
      </section>

      {/* KEY FEATURES */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Your Personal AI Copilot for Every Interview
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From preparation to performance, CrackAI has you covered
            </p>
          </div>

          {/* Main features grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                title: "100% Invisible Stealth Mode", 
                desc: "Interview Copilot runs quietly in the background during live interviews, even while screen sharing. Completely undetectable.", 
                icon: "ðŸ¥·",
                color: "purple",
                link: "/stealth"
              },
              { 
                title: "AI Mock Interviews", 
                desc: "Practice with realistic AI-powered interviews for behavioral, technical, system design and case study questions.", 
                icon: "ðŸŽ¯",
                color: "blue",
                link: "/mock"
              },
              { 
                title: "Coding Interview Copilot", 
                desc: "Get real-time coding solutions, algorithm explanations, and debugging help for LeetCode-style problems.", 
                icon: "ðŸ’»",
                color: "green",
                link: "/coding"
              },
              { 
                title: "Post-Interview Feedback", 
                desc: "See exactly what was asked, how you responded, and what to improve. Get detailed performance scores.", 
                icon: "ðŸ“Š",
                color: "orange",
                link: "/mock"
              },
              { 
                title: "AI Resume Builder", 
                desc: "Create ATS-optimized resumes with AI-powered bullet point improvements and professional summaries.", 
                icon: "ðŸ“„",
                color: "cyan",
                link: "/resume"
              },
              { 
                title: "Personalized Answers", 
                desc: "Responses are generated from your resume and job details so you sound specific, credible, and senior.", 
                icon: "âœ¨",
                color: "pink",
                link: "/onboarding"
              },
            ].map((f, i) => (
              <a 
                href={f.link}
                key={i} 
                className="p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-xl mb-3 group-hover:text-blue-600 transition">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get interview-ready in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: "Upload Resume", desc: "Share your experience and target role for personalized coaching", icon: "ðŸ“¤" },
              { step: 2, title: "Practice", desc: "Run mock interviews with AI feedback on your responses", icon: "ðŸŽ¯" },
              { step: 3, title: "Get Real-Time Help", desc: "Use Stealth Mode during actual interviews for live assistance", icon: "ðŸ¥·" },
              { step: 4, title: "Track Progress", desc: "Review detailed reports and continuously improve", icon: "ðŸ“ˆ" },
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-3xl shadow-lg shadow-blue-500/20">
                  {item.icon}
                </div>
                <div className="text-blue-600 font-bold text-sm mb-2">STEP {item.step}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-blue-200 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORKS FOR ALL INDUSTRIES */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Works For All Industries</h2>
          <p className="text-gray-600 mb-12">From first application to final offer, CrackAI empowers job seekers to succeed</p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {industries.map((ind, i) => (
              <div key={i} className="px-6 py-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition cursor-pointer">
                <span className="text-2xl mr-2">{ind.icon}</span>
                <span className="font-medium">{ind.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 px-6 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Proven Results with CrackAI
            </h2>
            <p className="text-xl text-gray-600">
              Used by candidates who want to perform better in interviews
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition">
                <div className="flex mb-3">
                  {[...Array(t.rating)].map((_, j) => (
                    <svg key={j} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 text-sm">{t.text}</p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-gray-500 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 text-gray-500">
            +100K users enjoy CrackAI
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade when you're ready
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free */}
            <div className="p-8 rounded-2xl border-2 border-gray-200 hover:border-blue-300 transition">
              <div className="mb-6">
                <h3 className="font-bold text-xl mb-2">Free</h3>
                <div className="text-4xl font-bold">$0</div>
                <p className="text-gray-500 text-sm">Forever free</p>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2"><span className="text-green-500">âœ“</span> 5 Mock Interviews/month</li>
                <li className="flex items-center gap-2"><span className="text-green-500">âœ“</span> Basic AI Feedback</li>
                <li className="flex items-center gap-2"><span className="text-green-500">âœ“</span> Interview Reports</li>
                <li className="flex items-center gap-2 text-gray-400"><span>âœ—</span> Stealth Mode</li>
                <li className="flex items-center gap-2 text-gray-400"><span>âœ—</span> Resume Builder</li>
              </ul>
              <a href="/onboarding" className="block text-center py-3 border-2 border-gray-200 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition">
                Get Started
              </a>
            </div>

            {/* Pro - Highlighted */}
            <div className="p-8 rounded-2xl border-2 border-blue-500 bg-gradient-to-b from-blue-50 to-white relative shadow-xl shadow-blue-500/10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-full">
                Most Popular
              </div>
              <div className="mb-6">
                <h3 className="font-bold text-xl mb-2 text-blue-600">Pro</h3>
                <div className="text-4xl font-bold">$25<span className="text-lg text-gray-500">/mo</span></div>
                <p className="text-gray-500 text-sm">Billed monthly</p>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2"><span className="text-green-500">âœ“</span> Unlimited Mock Interviews</li>
                <li className="flex items-center gap-2"><span className="text-green-500">âœ“</span> Advanced AI Feedback</li>
                <li className="flex items-center gap-2"><span className="text-green-500">âœ“</span> Stealth Mode</li>
                <li className="flex items-center gap-2"><span className="text-green-500">âœ“</span> Resume Builder</li>
                <li className="flex items-center gap-2"><span className="text-green-500">âœ“</span> Coding Interview AI</li>
              </ul>
              <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-lg shadow-blue-500/25">
                Upgrade to Pro
              </button>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-2xl border-2 border-gray-200 hover:border-blue-300 transition">
              <div className="mb-6">
                <h3 className="font-bold text-xl mb-2">Enterprise</h3>
                <div className="text-4xl font-bold">Custom</div>
                <p className="text-gray-500 text-sm">For teams & orgs</p>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2"><span className="text-green-500">âœ“</span> Everything in Pro</li>
                <li className="flex items-center gap-2"><span className="text-green-500">âœ“</span> Team Dashboard</li>
                <li className="flex items-center gap-2"><span className="text-green-500">âœ“</span> Custom AI Training</li>
                <li className="flex items-center gap-2"><span className="text-green-500">âœ“</span> Priority Support</li>
                <li className="flex items-center gap-2"><span className="text-green-500">âœ“</span> SSO & Security</li>
              </ul>
              <button className="w-full py-3 border-2 border-gray-200 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Still curious? Reach out anytime at support@crackai.com
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((f, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full text-left p-6 font-semibold flex justify-between items-center hover:bg-gray-50 transition"
                >
                  {f.q}
                  <span className={`ml-4 transition-transform ${faqOpen === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {faqOpen === i && (
                  <div className="px-6 pb-6 text-gray-600">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 text-white text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 max-w-3xl mx-auto">
          Ready to Crack Your Next Interview?
        </h2>
        <p className="text-xl opacity-90 mb-10 max-w-xl mx-auto">
          Join 100,000+ job seekers who've transformed their interview performance with CrackAI
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/onboarding" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition shadow-xl">
            Get Started Free
          </a>
          <a href="/mock" className="border-2 border-white/50 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition">
            Try Mock Interview
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 font-bold text-xl mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
                  C
                </div>
                CrackAI
              </div>
              <p className="text-gray-400 text-sm">
                Your AI-powered interview copilot for landing your dream job.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/mock" className="hover:text-white transition">Mock Interview</a></li>
                <li><a href="/stealth" className="hover:text-white transition">Stealth Mode</a></li>
                <li><a href="/coding" className="hover:text-white transition">Coding Copilot</a></li>
                <li><a href="/resume" className="hover:text-white transition">Resume Builder</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">Â© 2026 CrackAI. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white transition">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-white transition">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
