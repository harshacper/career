import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Briefcase, Code2, Sparkles, TrendingUp, BookOpen, AlertCircle, ArrowRight, CheckCircle2, Brain } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const SkillGapAnalysis = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    currentRole: user?.targetRole || '',
    targetRole: '',
    currentSkills: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!formData.targetRole || !formData.currentSkills) {
      setError('Please fill in both target role and current skills.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const prompt = `Perform a skill gap analysis for a professional transitioning from "${formData.currentRole}" to "${formData.targetRole}". Their current skills are: ${formData.currentSkills}. 
    Return ONLY a valid JSON object without any markdown formatting, code blocks, or extra text. It MUST strictly match this structure:
    {
      "matchPercentage": 65,
      "missingSkills": ["List", "of", "Missing", "Skills"],
      "solutions": [
        { "title": "Resource Name", "description": "Brief explanation of why it helps.", "duration": "Estimated time" }
      ]
    }`;

    try {
      const response = await api.post('/agent/chat', { message: prompt, provider: 'gemini' });
      // The response.data.reply should be a JSON string. We might need to clean it if the AI added markdown.
      let replyText = response.data.reply;
      replyText = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const parsed = JSON.parse(replyText);
      setAnalysis(parsed);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze skill gap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gray-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px]" />
        <div className="absolute top-40 -left-40 w-96 h-96 bg-emerald-400/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mx-auto mb-4"
          >
            <TrendingUp size={32} />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Skill Gap <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Analysis</span></h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover the missing link between your current abilities and your dream job, along with a personalized learning roadmap to bridge the gap.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4"
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Target className="text-blue-500" /> Your Profile
              </h2>
              
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-start gap-2 mb-6 text-sm border border-red-100">
                  <AlertCircle size={16} className="mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleAnalyze} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Current Role (Optional)</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      name="currentRole"
                      value={formData.currentRole}
                      onChange={handleChange}
                      placeholder="e.g. Junior Developer"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Target Role</label>
                  <div className="relative">
                    <Sparkles className="absolute left-3 top-3 text-indigo-400" size={18} />
                    <input 
                      type="text" 
                      name="targetRole"
                      value={formData.targetRole}
                      onChange={handleChange}
                      placeholder="e.g. Senior Full Stack Engineer"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Current Skills</label>
                  <div className="relative">
                    <Code2 className="absolute left-3 top-3 text-emerald-400" size={18} />
                    <textarea 
                      name="currentSkills"
                      value={formData.currentSkills}
                      onChange={handleChange}
                      placeholder="e.g. React, Node.js, HTML, CSS"
                      rows="3"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none resize-none"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Separate skills with commas.</p>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>Analyze Gap <ArrowRight size={18} /></>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Results Section */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {!analysis && !loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center bg-white rounded-3xl p-12 border border-gray-100 shadow-xl shadow-gray-200/50 text-center"
                >
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                    <Target size={48} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Awaiting Input</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">Fill out your current skills and target role to generate a real-time AI-powered skill gap analysis.</p>
                </motion.div>
              )}

              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center bg-white rounded-3xl p-12 border border-blue-100 shadow-xl shadow-blue-500/10"
                >
                  <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-blue-500">
                      <Brain size={32} className="animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-blue-800 mb-2">Analyzing Profile...</h3>
                  <p className="text-blue-600/70 text-sm">Our AI is computing your skill gap and preparing a personalized roadmap.</p>
                </motion.div>
              )}

              {analysis && !loading && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Top Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-lg shadow-gray-200/50 flex items-center gap-6">
                      <div className="relative w-24 h-24 shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <path className="text-gray-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          <path className={`${analysis.matchPercentage >= 70 ? 'text-emerald-500' : analysis.matchPercentage >= 40 ? 'text-yellow-500' : 'text-red-500'}`} strokeDasharray={`${analysis.matchPercentage}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <span className="text-2xl font-bold text-gray-800">{analysis.matchPercentage}%</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">Profile Match</h3>
                        <p className="text-sm text-gray-500">How well your current skills align with the {formData.targetRole} position.</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-lg shadow-gray-200/50">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <AlertCircle className="text-orange-500" size={20} /> Missing Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.missingSkills.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-100 rounded-lg text-sm font-semibold">
                            {skill}
                          </span>
                        ))}
                        {analysis.missingSkills.length === 0 && (
                          <span className="text-emerald-600 text-sm font-medium flex items-center gap-1"><CheckCircle2 size={16}/> You have all the core skills!</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <BookOpen className="text-indigo-500" size={24} /> Recommended Solutions
                    </h3>
                    
                    <div className="space-y-4">
                      {analysis.solutions.map((solution, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all group">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                            <h4 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{solution.title}</h4>
                            <span className="inline-block px-3 py-1 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-full whitespace-nowrap">
                              ⏱ {solution.duration}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{solution.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SkillGapAnalysis;
