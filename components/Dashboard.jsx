"use client";
import React from 'react';

export default function Dashboard({ onLaunch }) {
  return (
    <div className="flex-1 p-8 bg-slate-50 min-h-screen text-slate-800 flex flex-col" style={{ paddingTop: '60px' }}>
      
      {/* Greeting Banner */}
      <div className="w-full bg-gradient-to-br from-indigo-50 to-purple-100 border border-purple-200 rounded-3xl p-8 mb-8 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-2">
            <span className="text-2xl">🌙</span> Good night, Uday!
          </h1>
          <p className="text-slate-600 font-medium text-sm">
            Thursday, Apr 16 • Welcome back to Crack AI
          </p>
        </div>
        <button 
          onClick={onLaunch}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all hover:-translate-y-0.5 flex items-center gap-2"
        >
          🚀 Start Interview Copilot
        </button>
      </div>

      <div className="flex gap-6 flex-1">
        {/* Recent Interviews (Left Column) */}
        <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">Recent Interviews</h2>
            <button className="text-sm font-semibold text-purple-600 hover:text-purple-800">View all</button>
          </div>

          <div className="flex flex-col gap-4">
            {/* Interview Item 1 */}
            <div className="flex items-center justify-between p-4 border border-slate-100 hover:border-purple-200 rounded-2xl transition bg-slate-50 hover:bg-white cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm text-xl font-bold text-slate-700">
                  JP
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-800 text-base">JP Morgan</span>
                    <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-semibold">Associate</span>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">Mock</span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium">4/14/2026, 8:35:38 PM</div>
                </div>
              </div>
              <button className="text-sm font-semibold text-slate-500 bg-white border border-slate-200 px-4 py-2 rounded-lg group-hover:bg-purple-50 group-hover:text-purple-700 group-hover:border-purple-200 transition">
                View Report ↗
              </button>
            </div>

            {/* Interview Item 2 */}
            <div className="flex items-center justify-between p-4 border border-slate-100 hover:border-purple-200 rounded-2xl transition bg-slate-50 hover:bg-white cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm text-xl font-bold text-slate-700">
                  JP
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-800 text-base">JP Morgan</span>
                    <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-semibold">Associate</span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">Copilot</span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium">4/14/2026, 8:29:51 PM</div>
                </div>
              </div>
              <button className="text-sm font-semibold text-slate-500 bg-white border border-slate-200 px-4 py-2 rounded-lg group-hover:bg-purple-50 group-hover:text-purple-700 group-hover:border-purple-200 transition">
                View Report ↗
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions (Right Column) */}
        <div className="w-80 flex flex-col gap-4">
          <ActionCard 
            icon="🚀" 
            title="How to Get Started" 
            description="Learn how to land your dream job with Crack AI" 
          />
          <ActionCard 
            icon="📰" 
            title="What's New" 
            description="Check out the latest updates and features" 
          />
          <ActionCard 
            icon="💬" 
            title="Chat with Us" 
            description="Still have questions? We've got answers!" 
          />
        </div>
      </div>
    </div>
  );
}

function ActionCard({ icon, title, description }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-left hover:shadow-md hover:border-purple-200 cursor-pointer transition flex flex-col group relative overflow-hidden">
      <div className="flex justify-between items-start mb-3">
        <span className="text-2xl bg-slate-50 border border-slate-100 w-10 h-10 rounded-lg flex items-center justify-center group-hover:bg-purple-50">{icon}</span>
        <span className="text-slate-400 font-bold text-xl group-hover:text-purple-600 transition -mt-1 group-hover:translate-x-1 group-hover:-translate-y-1 block">↗</span>
      </div>
      <h3 className="font-bold text-slate-800 text-base mb-1">{title}</h3>
      <p className="text-slate-500 text-sm leading-snug">{description}</p>
    </div>
  );
}
