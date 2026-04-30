"use client";
import React, { useState } from 'react';
import { createClient } from '../utils/supabase/client';

export default function CreateProfileModal({ onClose, onProfileCreated }) {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    companyDescription: '',
    positionTitle: '',
    jobDescription: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const supabase = createClient();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!file) {
      setError("Please select a resume file.");
      setLoading(false);
      return;
    }

    try {
      // 1. Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      // 2. Upload resume to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL for the uploaded resume
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      // 3. Save interview profile to Database
      const { error: dbError } = await supabase
        .from('interview_profiles')
        .insert([
          {
            user_id: user.id,
            resume_url: publicUrl,
            resume_name: file.name,
            company_name: formData.companyName,
            company_description: formData.companyDescription,
            position_title: formData.positionTitle,
            job_description: formData.jobDescription
          }
        ]);

      if (dbError) throw dbError;

      // Success! Close modal and refresh UI if needed
      if (onProfileCreated) onProfileCreated();
      onClose();

    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10010] flex items-center justify-center bg-slate-800/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-start p-6 pb-2">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Create an interview profile</h2>
            <p className="text-slate-500 text-sm mt-1">
              Tell us a bit about yourself and the interview so we can help you better.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full transition">
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 overflow-y-auto max-h-[65vh] custom-scrollbar">
            
            <div className="flex flex-col gap-2 mb-6">
              <label className="block text-xs font-bold text-slate-700">Select Resume (PDF or DOCX) *</label>
              <div className="flex items-center gap-3">
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] flex-1 bg-slate-200"></div>
              <span className="text-[10px] font-bold text-slate-400 tracking-widest">INTERVIEW CONTEXT</span>
              <div className="h-[1px] flex-1 bg-slate-200"></div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Name *</label>
                <input 
                  type="text" 
                  name="companyName"
                  required
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="e.g. Google, Stripe" 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Description</label>
                <textarea 
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleInputChange}
                  placeholder="Enter company information, mission, values..." 
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Position / Job Title *</label>
                <input 
                  type="text" 
                  name="positionTitle"
                  required
                  value={formData.positionTitle}
                  onChange={handleInputChange}
                  placeholder="e.g. Senior Frontend Engineer" 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Job Description *</label>
                <textarea 
                  name="jobDescription"
                  required
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  placeholder="Paste the full job description here..." 
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition resize-none"
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 bg-slate-50 border-t border-slate-200">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-md transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Profile & Uploading..." : "Create Profile"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
