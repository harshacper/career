import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Code2, Sparkles, TrendingUp, Search, Building2, CheckCircle2, XCircle, ArrowRight, Zap } from 'lucide-react';
import api from '../api/axios';

const JobMatch = () => {
  const [formData, setFormData] = useState({
    skills: '',
    experience: '0-2 years'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [matches, setMatches] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!formData.skills) {
      setError('Please enter your skills to get job matches.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const prompt = `Act as an expert technical recruiter. Based on the candidate's skills: "${formData.skills}" and experience level: "${formData.experience}", suggest 3 highly relevant, realistic tech job roles they are a strong fit for. 
    Return ONLY a valid JSON object without any markdown formatting or extra text. It MUST strictly match this structure:
    {
      "recommendedJobs": [
        { 
          "title": "Job Role Title", 
          "companyType": "e.g. FAANG, FinTech Startup, etc.", 
          "matchPercentage": 85, 
          "description": "Brief 1-sentence description of what this role entails.",
          "matchedSkills": ["Skill 1", "Skill 2"],
          "skillsToLearn": ["Skill A to improve chances"]
        }
      ]
    }`;

    try {
      const response = await api.post('/agent/chat', { message: prompt, provider: 'gemini' });
      let replyText = response.data.reply;
      replyText = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const parsed = JSON.parse(replyText);
      setMatches(parsed.recommendedJobs);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch job matches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gray-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 -left-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 mx-auto mb-4"
          >
            <Search size={32} />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">AI Job <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Matchmaker</span></h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Input your current skills and experience. Our AI will analyze the market and find the perfect job roles that align with your profile in real-time.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4"
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-28">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Briefcase className="text-purple-500" /> Your Profile
              </h2>
              
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-start gap-2 mb-6 text-sm border border-red-100">
                  <XCircle size={16} className="mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleAnalyze} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Skills</label>
                  <div className="relative">
                    <Code2 className="absolute left-3 top-3 text-emerald-500" size={18} />
                    <textarea 
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="e.g. React, Node.js, Python, AWS, SQL"
                      rows="4"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Experience Level</label>
                  <div className="relative">
                    <TrendingUp className="absolute left-3 top-3 text-indigo-400" size={18} />
                    <select 
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none appearance-none"
                    >
                      <option value="0-2 years">Junior (0-2 years)</option>
                      <option value="3-5 years">Mid-Level (3-5 years)</option>
                      <option value="5+ years">Senior (5+ years)</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>Find Matches <ArrowRight size={18} /></>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Results Section */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {!matches && !loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-3xl p-12 border border-gray-100 shadow-xl shadow-gray-200/50 text-center"
                >
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                    <Zap size={48} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Match</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">Enter your skills and experience to let our AI scan the market and find your perfect job matches.</p>
                </motion.div>
              )}

              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-3xl p-12 border border-purple-100 shadow-xl shadow-purple-500/10 text-center"
                >
                  <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 border-4 border-purple-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-purple-500">
                      <Sparkles size={32} className="animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-purple-800 mb-2">Finding Perfect Roles...</h3>
                  <p className="text-purple-600/70 text-sm">Matching your skills against industry demands.</p>
                </motion.div>
              )}

              {matches && !loading && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {matches.map((job, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white rounded-3xl p-6 border border-gray-100 shadow-lg shadow-gray-200/50 hover:border-purple-200 transition-all group"
                    >
                      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{job.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Building2 size={16} /> {job.companyType}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${job.matchPercentage >= 80 ? 'bg-emerald-50 text-emerald-600' : job.matchPercentage >= 60 ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'}`}>
                            {job.matchPercentage >= 80 ? <Sparkles size={16} /> : <TrendingUp size={16} />}
                            {job.matchPercentage}% Match
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                        {job.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-50 pt-6">
                        <div>
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Matched Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.matchedSkills.map((skill, i) => (
                              <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-1">
                                <CheckCircle2 size={12} /> {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Skills to Learn</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.skillsToLearn.map((skill, i) => (
                              <span key={i} className="px-2.5 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg text-xs font-medium">
                                {skill}
                              </span>
                            ))}
                            {job.skillsToLearn.length === 0 && (
                              <span className="text-sm text-gray-500 italic">You hit all the requirements!</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobMatch;
