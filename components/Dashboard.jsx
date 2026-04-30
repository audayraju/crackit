"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '../utils/supabase/client';

export default function Dashboard({ onLaunch }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      // Get user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.full_name?.split(' ')[0] || user.email.split('@')[0]);
      }

      // Get recent profiles
      const { data } = await supabase
        .from('interview_profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (data) setProfiles(data);
      setLoading(false);
    }
    fetchData();
  }, []);
  return (
    <div className="flex-1 p-8 bg-slate-50 min-h-screen text-slate-800 flex flex-col" style={{ paddingTop: '60px' }}>
      
      {/* Greeting Banner */}
      <div className="w-full bg-gradient-to-br from-indigo-50 to-purple-100 border border-purple-200 rounded-3xl p-8 mb-8 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-2">
            <span className="text-2xl">👋</span> Welcome back, {userName || 'User'}!
          </h1>
          <p className="text-slate-600 font-medium text-sm">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} • Ready to crush your next interview?
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
            <h2 className="text-lg font-bold text-slate-800">Recent Interview Profiles</h2>
            <button className="text-sm font-semibold text-purple-600 hover:text-purple-800">View all</button>
          </div>

          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="p-4 text-slate-400 text-sm">Loading recent profiles...</div>
            ) : profiles.length === 0 ? (
              <div className="p-4 border border-dashed border-slate-300 rounded-2xl text-center text-slate-500 bg-slate-50">
                You haven't created any interview profiles yet.<br/>
                Click <span className="font-bold text-purple-600">Start Interview Copilot</span> to create one!
              </div>
            ) : (
              profiles.map(profile => (
                <div key={profile.id} className="flex items-center justify-between p-4 border border-slate-100 hover:border-purple-200 rounded-2xl transition bg-slate-50 hover:bg-white cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm text-xl font-bold text-slate-700">
                      {profile.company_name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-800 text-base">{profile.company_name}</span>
                        <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-semibold max-w-[150px] truncate">{profile.position_title}</span>
                      </div>
                      <div className="text-xs text-slate-400 font-medium">Created: {new Date(profile.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                  <button className="text-sm font-semibold text-slate-500 bg-white border border-slate-200 px-4 py-2 rounded-lg group-hover:bg-purple-50 group-hover:text-purple-700 group-hover:border-purple-200 transition">
                    Use Profile ↗
                  </button>
                </div>
              ))
            )}
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
