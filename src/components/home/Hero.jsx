import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Sparkles, FileText, Zap, Menu, X } from 'lucide-react'

/* ─── Floating Orb ─── */
const Orb = ({ style }) => (
    <div
        className="absolute rounded-full pointer-events-none"
        style={{
            filter: 'blur(80px)',
            opacity: 0.25,
            ...style,
        }}
    />
)

/* ─── Particle Dot ─── */
const Particle = ({ style }) => (
    <div
        className="absolute rounded-full animate-pulse-glow pointer-events-none"
        style={{ width: 3, height: 3, background: 'rgba(99,102,241,0.7)', ...style }}
    />
)

const PARTICLES = [
    { top: '15%', left: '10%', animationDelay: '0s' },
    { top: '30%', left: '85%', animationDelay: '0.8s' },
    { top: '60%', left: '5%', animationDelay: '1.5s' },
    { top: '75%', left: '90%', animationDelay: '0.4s' },
    { top: '45%', left: '50%', animationDelay: '1.2s' },
    { top: '20%', left: '65%', animationDelay: '2s' },
    { top: '85%', left: '30%', animationDelay: '0.9s' },
    { top: '10%', left: '40%', animationDelay: '1.7s' },
    { top: '55%', left: '75%', animationDelay: '0.3s' },
    { top: '90%', left: '60%', animationDelay: '1.1s' },
    { top: '38%', left: '18%', animationDelay: '2.3s' },
    { top: '70%', left: '45%', animationDelay: '0.6s' },
]

const Hero = () => {
    const { user } = useSelector(state => state.auth)
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <>
            <style>{`
                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                @keyframes gradient-shift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .hero-gradient-text {
                    background: linear-gradient(135deg, #e0e7ff 0%, #818cf8 30%, #22d3ee 60%, #a855f7 100%);
                    background-size: 200% 200%;
                    animation: gradient-shift 5s ease infinite;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .nav-glass {
                    background: rgba(7, 11, 20, 0.7);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(99, 102, 241, 0.12);
                }
                .cta-btn {
                    background: linear-gradient(135deg, #6366f1, #a855f7);
                    color: white;
                    font-weight: 600;
                    font-size: 0.9rem;
                    padding: 0.75rem 2rem;
                    border-radius: 0.75rem;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    text-decoration: none;
                }
                .cta-btn:hover {
                    box-shadow: 0 0 35px rgba(99, 102, 241, 0.55);
                    transform: translateY(-2px);
                }
                .ghost-btn {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.12);
                    color: #94a3b8;
                    font-weight: 500;
                    font-size: 0.9rem;
                    padding: 0.75rem 2rem;
                    border-radius: 0.75rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    text-decoration: none;
                }
                .ghost-btn:hover {
                    background: rgba(255,255,255,0.09);
                    border-color: rgba(99, 102, 241, 0.4);
                    color: white;
                }
                .stat-card {
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 1rem;
                    padding: 1rem 1.5rem;
                    text-align: center;
                    backdrop-filter: blur(12px);
                    transition: all 0.3s;
                }
                .stat-card:hover {
                    border-color: rgba(99, 102, 241, 0.3);
                    box-shadow: 0 0 20px rgba(99, 102, 241, 0.15);
                }
                .badge-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(99, 102, 241, 0.1);
                    border: 1px solid rgba(99, 102, 241, 0.25);
                    border-radius: 100px;
                    padding: 0.4rem 1rem;
                    font-size: 0.78rem;
                    font-weight: 500;
                    color: #a5b4fc;
                }
                .scrolldown-icon {
                    animation: float 3s ease-in-out infinite;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
            `}</style>

            {/* ── Hero Section ── */}
            <header id="home" className="relative min-h-screen flex flex-col overflow-hidden"
                style={{ background: 'linear-gradient(180deg, #070b14 0%, #0d1526 60%, #070b14 100%)' }}>

                {/* Background Orbs */}
                <Orb style={{ width: 600, height: 600, top: -100, left: -150, background: 'rgba(99, 102, 241, 0.4)' }} />
                <Orb style={{ width: 500, height: 500, top: 200, right: -100, background: 'rgba(168, 85, 247, 0.35)' }} />
                <Orb style={{ width: 400, height: 400, bottom: 50, left: '30%', background: 'rgba(34, 211, 238, 0.18)' }} />

                {/* Grid Pattern */}
                <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />

                {/* Particles */}
                {PARTICLES.map((p, i) => (
                    <Particle key={i} style={{ top: p.top, left: p.left, animationDelay: p.animationDelay }} />
                ))}

                {/* ── Navbar ── */}
                <nav className="nav-glass sticky top-0 z-50 w-full">
                    <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
                        {/* Logo */}
                        <a href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                                <FileText size={16} color="white" />
                            </div>
                            <span className="font-bold text-lg" style={{ color: '#f0f4ff' }}>
                                Resume<span style={{ color: '#818cf8' }}>AI</span>
                            </span>
                        </a>

                        {/* Desktop Nav Links */}
                        <div className="hidden md:flex items-center gap-8 text-sm">
                            <a href="#features" className="transition-colors" style={{ color: '#94a3b8' }}
                                onMouseEnter={e => e.target.style.color = '#f0f4ff'}
                                onMouseLeave={e => e.target.style.color = '#94a3b8'}>
                                Features
                            </a>
                            <a href="#testimonial" className="transition-colors" style={{ color: '#94a3b8' }}
                                onMouseEnter={e => e.target.style.color = '#f0f4ff'}
                                onMouseLeave={e => e.target.style.color = '#94a3b8'}>
                                Testimonials
                            </a>
                            <a href="#faq" className="transition-colors" style={{ color: '#94a3b8' }}
                                onMouseEnter={e => e.target.style.color = '#f0f4ff'}
                                onMouseLeave={e => e.target.style.color = '#94a3b8'}>
                                FAQ
                            </a>
                        </div>

                        {/* CTA */}
                        <div className="hidden md:flex items-center gap-3">
                            {user ? (
                                <Link to="/app" className="cta-btn">
                                    <Zap size={15} />
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/app?state=login" className="ghost-btn">
                                        Sign In
                                    </Link>
                                    <Link to="/app?state=register" className="cta-btn">
                                        <Sparkles size={14} />
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile menu toggle */}
                        <button
                            className="md:hidden p-2 rounded-lg transition-colors"
                            style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileOpen && (
                        <div className="md:hidden border-t px-6 py-4 flex flex-col gap-4"
                            style={{ background: 'rgba(7,11,20,0.95)', borderColor: 'rgba(99,102,241,0.12)' }}>
                            <a href="#features" onClick={() => setMobileOpen(false)} style={{ color: '#94a3b8' }}>Features</a>
                            <a href="#testimonial" onClick={() => setMobileOpen(false)} style={{ color: '#94a3b8' }}>Testimonials</a>
                            <a href="#faq" onClick={() => setMobileOpen(false)} style={{ color: '#94a3b8' }}>FAQ</a>
                            <div className="flex flex-col gap-2 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                                <Link to="/app?state=login" className="ghost-btn justify-center" onClick={() => setMobileOpen(false)}>Sign In</Link>
                                <Link to="/app?state=register" className="cta-btn justify-center" onClick={() => setMobileOpen(false)}>
                                    <Sparkles size={14} /> Get Started
                                </Link>
                            </div>
                        </div>
                    )}
                </nav>

                {/* ── Hero Content ── */}
                <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 relative z-10">

                    {/* Badge */}
                    <div className="badge-pill mb-8">
                        <span className="w-2 h-2 rounded-full animate-pulse-glow"
                            style={{ background: '#4ade80', boxShadow: '0 0 8px #4ade80' }}
                        />
                        AI-Powered · ATS-Optimized · Free to Start
                    </div>

                    {/* Headline */}
                    <h1 className="hero-gradient-text text-4xl sm:text-6xl lg:text-7xl font-black leading-tight max-w-5xl mb-6"
                        style={{ letterSpacing: '-0.02em' }}>
                        Build Resumes That<br />
                        <span style={{ color: 'inherit' }}>Land Interviews</span>
                    </h1>

                    {/* Subline */}
                    <p className="max-w-xl text-base sm:text-lg leading-relaxed mb-10" style={{ color: '#94a3b8' }}>
                        Create, edit, and download AI-enhanced professional resumes in minutes.
                        Upload your existing PDF and let AI rewrite it for ATS success.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-16">
                        {!user && (
                            <Link to="/app?state=register" className="cta-btn">
                                <Sparkles size={16} />
                                Start Building Free
                            </Link>
                        )}
                        <Link to="/app?state=login" className="ghost-btn">
                            <FileText size={16} />
                            {user ? 'Go to Dashboard' : 'Try Demo'}
                        </Link>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4 max-w-lg w-full">
                        {[
                            { num: '10k+', label: 'Resumes Built' },
                            { num: '94%', label: 'ATS Pass Rate' },
                            { num: '3 min', label: 'Avg. Build Time' },
                        ].map((stat, i) => (
                            <div key={i} className="stat-card">
                                <p className="text-xl font-bold mb-0.5" style={{ color: '#818cf8' }}>{stat.num}</p>
                                <p className="text-xs" style={{ color: '#64748b' }}>{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Scroll down */}
                    <a href="#features" className="mt-16 flex flex-col items-center gap-2 scrolldown-icon" style={{ color: '#475569' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-xs">Scroll to explore</span>
                    </a>
                </div>
            </header>
        </>
    )
}

export default Hero