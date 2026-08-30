import React from 'react'
import { useDispatch } from 'react-redux'
import api from '../configs/api'
import { login } from "../app/features/authSlice"
import { toast } from 'react-hot-toast'
import { Mail, Lock, User2, ArrowRight, Sparkles, FileText, Zap, Shield } from 'lucide-react'

const PERKS = [
    { icon: Sparkles, text: 'AI-powered content enhancement' },
    { icon: FileText, text: 'Professional ATS-ready templates' },
    { icon: Zap, text: 'PDF export in one click' },
    { icon: Shield, text: 'Secure & private — always' },
]

const Login = () => {
    const dispatch = useDispatch()
    const query = new URLSearchParams(window.location.search)
    const urlstate = query.get('state')
    const [state, setState] = React.useState(urlstate || "login")

    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: ''
    })

    const [isLoading, setIsLoading] = React.useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await api.post(`/api/users/${state}`, formData)
            const { data } = response
            dispatch(login(data))
            localStorage.setItem('token', data.token)
            toast.success(data.message)
        } catch (error) {
            let message = `Unable to ${state}. Please try again.`
            if (error.code === "ECONNABORTED") message = "The request timed out. Please try again."
            else if (!error.response) message = "Unable to connect to the server."
            else if (error.response.status === 400) message = error.response.data?.message || message
            else if (error.response.status === 401) message = "Invalid email or password."
            else if (error.response.status === 409) message = "An account with this email already exists."
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: '#070b14', overflow: 'hidden' }}>

            {/* ── Left Panel (decorative) ── */}
            <div
                className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
                style={{
                    width: '45%',
                    background: 'linear-gradient(135deg, #0d1526 0%, #1e1b4b 50%, #0f172a 100%)',
                    borderRight: '1px solid rgba(99,102,241,0.15)',
                }}
            >
                {/* Orbs */}
                <div className="absolute top-0 left-0 w-80 h-80 rounded-full pointer-events-none"
                    style={{ background: 'rgba(99,102,241,0.15)', filter: 'blur(80px)' }} />
                <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full pointer-events-none"
                    style={{ background: 'rgba(168,85,247,0.12)', filter: 'blur(80px)' }} />
                <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

                {/* Logo */}
                <div className="flex items-center gap-2 relative z-10">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 0 16px rgba(99,102,241,0.5)' }}>
                        <FileText size={16} color="white" />
                    </div>
                    <span className="font-bold text-lg" style={{ color: '#f0f4ff' }}>
                        Resume<span style={{ color: '#818cf8' }}>AI</span>
                    </span>
                </div>

                {/* Main copy */}
                <div className="relative z-10">
                    <h2 className="text-4xl font-black mb-4 leading-tight" style={{ color: '#e2e8f0', letterSpacing: '-0.02em' }}>
                        Build resumes that<br />
                        <span className="gradient-text">get you hired.</span>
                    </h2>
                    <p className="text-base mb-10" style={{ color: '#64748b' }}>
                        Join thousands of professionals who've landed interviews using our AI-powered resume builder.
                    </p>

                    {/* Perks */}
                    <div className="space-y-4">
                        {PERKS.map(({ icon: Icon, text }, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                                    <Icon size={14} color="#818cf8" />
                                </div>
                                <span className="text-sm" style={{ color: '#94a3b8' }}>{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom social proof */}
                <div className="relative z-10 flex items-center gap-3 p-4 rounded-2xl"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex -space-x-2">
                        {[11, 22, 32, 47].map(n => (
                            <img key={n} src={`https://i.pravatar.cc/32?img=${n}`}
                                className="w-8 h-8 rounded-full border-2"
                                style={{ borderColor: '#070b14' }}
                                alt="user" />
                        ))}
                    </div>
                    <div>
                        <p className="text-xs font-semibold" style={{ color: '#e2e8f0' }}>10,000+ resumes built</p>
                        <div className="flex gap-0.5 mt-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} style={{ color: '#f59e0b', fontSize: 10 }}>★</span>
                            ))}
                            <span className="text-xs ml-1" style={{ color: '#64748b' }}>4.9/5 rating</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Right Panel (form) ── */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
                {/* Background orbs on mobile */}
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none lg:hidden"
                    style={{ background: 'rgba(99,102,241,0.1)', filter: 'blur(80px)' }} />

                <div className="w-full max-w-sm relative z-10">

                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-8 lg:hidden justify-center">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                            <FileText size={16} color="white" />
                        </div>
                        <span className="font-bold text-lg" style={{ color: '#f0f4ff' }}>
                            Resume<span style={{ color: '#818cf8' }}>AI</span>
                        </span>
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl p-8"
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(99,102,241,0.2)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 0 40px rgba(99,102,241,0.1)',
                        }}>

                        <h1 className="text-2xl font-black mb-1" style={{ color: '#f0f4ff', letterSpacing: '-0.02em' }}>
                            {state === "login" ? "Welcome back" : "Create account"}
                        </h1>
                        <p className="text-sm mb-7" style={{ color: '#64748b' }}>
                            {state === "login"
                                ? "Sign in to continue building your resume"
                                : "Join thousands of professionals using ResumeAI"}
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {state !== "login" && (
                                <div className="relative">
                                    <User2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        style={{ paddingLeft: '2.5rem' }}
                                    />
                                </div>
                            )}

                            <div className="relative">
                                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    style={{ paddingLeft: '2.5rem' }}
                                />
                            </div>

                            <div className="relative">
                                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    style={{ paddingLeft: '2.5rem' }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-300"
                                style={{
                                    background: isLoading
                                        ? 'rgba(99,102,241,0.4)'
                                        : 'linear-gradient(135deg, #6366f1, #a855f7)',
                                    boxShadow: isLoading ? 'none' : '0 0 20px rgba(99,102,241,0.4)',
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    marginTop: '0.25rem',
                                }}
                                onMouseEnter={e => !isLoading && (e.currentTarget.style.boxShadow = '0 0 35px rgba(99,102,241,0.6)')}
                                onMouseLeave={e => !isLoading && (e.currentTarget.style.boxShadow = '0 0 20px rgba(99,102,241,0.4)')}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        {state === "login" ? "Sign In" : "Create Account"}
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Toggle */}
                        <p className="text-center text-sm mt-6" style={{ color: '#475569' }}>
                            {state === "login" ? "Don't have an account?" : "Already have an account?"}
                            <button
                                onClick={() => setState(prev => prev === "login" ? "register" : "login")}
                                className="ml-1.5 font-semibold transition-colors"
                                style={{ color: '#818cf8', cursor: 'pointer', background: 'none', border: 'none' }}
                                onMouseEnter={e => e.target.style.color = '#a5b4fc'}
                                onMouseLeave={e => e.target.style.color = '#818cf8'}
                            >
                                {state === "login" ? "Sign up" : "Sign in"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login