import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import { toast } from 'react-hot-toast'
import { ArrowLeftIcon, Sparkles, Target, AlertCircle, BookOpen, Briefcase, RefreshCw, LoaderCircleIcon, Compass } from 'lucide-react'

const Analysis = () => {
    const { resumeId } = useParams()
    const { token } = useSelector(state => state.auth)
    const [resume, setResume] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [targetRole, setTargetRole] = useState('')

    const loadResume = async () => {
        try {
            const { data } = await api.get(`/api/resumes/get/${resumeId}`, { headers: { Authorization: token } })
            if (data.resume) {
                setResume(data.resume)
            }
        } catch (error) {
            console.log(error.message)
            toast.error("Failed to load resume data.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadResume()
    }, [resumeId])

    const runAnalysis = async (e) => {
        e?.preventDefault()
        setIsAnalyzing(true)
        try {
            const { data } = await api.post('/api/ai/analyze-resume', { resumeId, targetRole }, { headers: { Authorization: token } })
            setResume(prev => ({ ...prev, analysis: data.analysis }))
            toast.success("Analysis complete!")
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to analyze resume.")
        } finally {
            setIsAnalyzing(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-60px)]" style={{ background: '#070b14' }}>
                <LoaderCircleIcon className="animate-spin" size={32} style={{ color: '#6366f1' }} />
            </div>
        )
    }

    if (!resume) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] text-center px-6" style={{ background: '#070b14' }}>
                <AlertCircle size={48} style={{ color: '#ef4444' }} className="mb-4" />
                <h2 className="text-xl font-bold mb-2" style={{ color: '#f0f4ff' }}>Resume Not Found</h2>
                <Link to="/app" className="text-sm" style={{ color: '#818cf8' }}>Return to Dashboard</Link>
            </div>
        )
    }

    const hasAnalysis = resume.analysis && (resume.analysis.skillGaps?.length > 0 || resume.analysis.careerPaths?.length > 0)

    return (
        <div style={{ minHeight: 'calc(100vh - 60px)', background: '#070b14', padding: '2rem 1.5rem' }}>
            <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                <div style={{ position: 'absolute', top: 0, left: '20%', width: 500, height: 500, background: 'rgba(99,102,241,0.05)', filter: 'blur(100px)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: 0, right: '20%', width: 400, height: 400, background: 'rgba(168,85,247,0.04)', filter: 'blur(100px)', borderRadius: '50%' }} />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                <Link to="/app" className="inline-flex gap-2 items-center mb-6 text-sm font-medium transition-all" style={{ color: '#64748b' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#818cf8'}
                    onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
                    <ArrowLeftIcon size={15} />Back to Dashboard
                </Link>

                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                                <Compass size={16} color="white" />
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>Career Insights</span>
                        </div>
                        <h1 className="text-3xl font-black" style={{ color: '#f0f4ff', letterSpacing: '-0.02em' }}>
                            Analysis for: <span className="gradient-text">{resume.title}</span>
                        </h1>
                    </div>

                    <form onSubmit={runAnalysis} className="flex gap-2 w-full md:w-auto">
                        <input type="text" value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder="Target Role (optional)" 
                            className="flex-1 md:w-64"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '0.625rem 1rem', color: '#f0f4ff', outline: 'none', fontSize: '0.875rem' }} />
                        <button type="submit" disabled={isAnalyzing}
                            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-all whitespace-nowrap"
                            style={{ background: isAnalyzing ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: isAnalyzing ? 'none' : '0 0 20px rgba(99,102,241,0.4)', cursor: isAnalyzing ? 'not-allowed' : 'pointer' }}>
                            {isAnalyzing ? <><LoaderCircleIcon size={16} className="animate-spin" /> Analyzing...</> : <><RefreshCw size={14} /> {hasAnalysis ? 'Re-Analyze' : 'Analyze Now'}</>}
                        </button>
                    </form>
                </div>

                {!hasAnalysis && !isAnalyzing && (
                    <div className="rounded-3xl p-12 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(99,102,241,0.3)' }}>
                        <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                            <Sparkles size={28} color="#818cf8" />
                        </div>
                        <h2 className="text-xl font-bold mb-2" style={{ color: '#e2e8f0' }}>No Analysis Yet</h2>
                        <p className="text-sm max-w-md mx-auto mb-6" style={{ color: '#64748b' }}>Run an AI analysis on this resume to discover your skill gaps, see recommended career paths, and find targeted learning resources.</p>
                        <button onClick={runAnalysis} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
                            <Sparkles size={16} /> Generate Insights
                        </button>
                    </div>
                )}

                {hasAnalysis && (
                    <div className="space-y-6">
                        {/* Skill Gaps */}
                        <div className="rounded-2xl p-6 md:p-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                                    <Target size={20} color="#f87171" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold" style={{ color: '#f0f4ff' }}>Identified Skill Gaps</h2>
                                    <p className="text-xs" style={{ color: '#64748b' }}>Skills you should acquire for your target career level.</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {resume.analysis.skillGaps.map((skill, i) => (
                                    <div key={i} className="px-4 py-2 rounded-lg text-sm font-medium"
                                        style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', color: '#fca5a5' }}>
                                        {skill}
                                    </div>
                                ))}
                                {resume.analysis.skillGaps.length === 0 && (
                                    <p className="text-sm" style={{ color: '#34d399' }}>No major skill gaps identified! You have a strong profile.</p>
                                )}
                            </div>
                        </div>

                        {/* Career Paths */}
                        <div className="rounded-2xl p-6 md:p-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
                                    <Briefcase size={20} color="#34d399" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold" style={{ color: '#f0f4ff' }}>Recommended Career Paths</h2>
                                    <p className="text-xs" style={{ color: '#64748b' }}>Roles that align with your current experience and skills.</p>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                {resume.analysis.careerPaths.map((path, i) => (
                                    <div key={i} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-bold text-lg" style={{ color: '#e2e8f0' }}>{path.title}</h3>
                                            <div className="px-2.5 py-1 rounded-md text-xs font-bold" style={{ background: 'rgba(52,211,153,0.15)', color: '#6ee7b7' }}>
                                                {path.matchPercentage}% Match
                                            </div>
                                        </div>
                                        <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>{path.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Learning Resources */}
                        <div className="rounded-2xl p-6 md:p-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)' }}>
                                    <BookOpen size={20} color="#60a5fa" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold" style={{ color: '#f0f4ff' }}>Recommended Resources</h2>
                                    <p className="text-xs" style={{ color: '#64748b' }}>Courses and materials to bridge your skill gaps.</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {resume.analysis.learningResources.map((res, i) => (
                                    <a key={i} href={res.link} target="_blank" rel="noopener noreferrer" 
                                        className="block rounded-xl p-4 transition-all duration-300"
                                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(96,165,250,0.05)'; e.currentTarget.style.borderColor = 'rgba(96,165,250,0.2)' }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)' }}>
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="font-semibold text-base mb-1" style={{ color: '#bfdbfe' }}>{res.title}</h3>
                                                <p className="text-sm mb-2" style={{ color: '#94a3b8' }}>{res.description}</p>
                                                <span className="text-xs px-2 py-1 rounded-md" style={{ background: 'rgba(255,255,255,0.1)', color: '#cbd5e1' }}>
                                                    {res.type}
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Analysis
