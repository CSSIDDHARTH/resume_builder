import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Sparkles, ArrowRight } from 'lucide-react'

const CallToAction = () => {
    const { user } = useSelector(state => state.auth)

    return (
        <section id="cta" className="relative py-28 px-6 overflow-hidden"
            style={{ background: '#070b14' }}>

            {/* Animated mesh gradient background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0" style={{
                    background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 70%)',
                }} />
                <div className="absolute inset-0 grid-pattern opacity-20" />
            </div>

            {/* Glowing orbs */}
            <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full pointer-events-none"
                style={{ background: 'rgba(99,102,241,0.12)', filter: 'blur(80px)' }} />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full pointer-events-none"
                style={{ background: 'rgba(168,85,247,0.1)', filter: 'blur(80px)' }} />

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="rounded-3xl p-12 sm:p-16 text-center relative overflow-hidden"
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(99,102,241,0.2)',
                        backdropFilter: 'blur(20px)',
                    }}>

                    {/* Inner glow border */}
                    <div className="absolute inset-0 rounded-3xl pointer-events-none"
                        style={{
                            background: 'linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(168,85,247,0.05) 100%)',
                        }} />

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 text-xs font-semibold"
                        style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}>
                        <Sparkles size={11} />
                        Free Forever · No Credit Card Needed
                    </div>

                    <h2 className="text-3xl sm:text-5xl font-black mb-5 leading-tight"
                        style={{ letterSpacing: '-0.02em', color: '#e2e8f0' }}>
                        Your next interview is<br />
                        <span className="gradient-text">one resume away.</span>
                    </h2>

                    <p className="text-base sm:text-lg max-w-xl mx-auto mb-10" style={{ color: '#64748b' }}>
                        Build a professional, ATS-optimized resume in under 3 minutes. AI writes it.
                        You refine it. Recruiters notice it.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to={user ? '/app' : '/app?state=register'}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-white"
                            style={{
                                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                boxShadow: '0 0 30px rgba(99,102,241,0.4)',
                                transition: 'all 0.3s',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.boxShadow = '0 0 50px rgba(99,102,241,0.6)'
                                e.currentTarget.style.transform = 'translateY(-2px)'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.boxShadow = '0 0 30px rgba(99,102,241,0.4)'
                                e.currentTarget.style.transform = 'translateY(0)'
                            }}>
                            <Sparkles size={18} />
                            {user ? 'Go to Dashboard' : 'Start Building Free'}
                            <ArrowRight size={18} />
                        </Link>

                        <a href="#features"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm"
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#94a3b8',
                                transition: 'all 0.3s',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                                e.currentTarget.style.color = '#f0f4ff'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                                e.currentTarget.style.color = '#94a3b8'
                            }}>
                            Explore Features
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CallToAction