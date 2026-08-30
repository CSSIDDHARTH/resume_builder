import React, { useState } from 'react'
import { Sparkles, LayoutTemplate, Download, Cpu, Shield, Zap } from 'lucide-react'

const features = [
    {
        icon: Sparkles,
        color: '#818cf8',
        glow: 'rgba(99, 102, 241, 0.3)',
        bg: 'rgba(99, 102, 241, 0.1)',
        title: 'AI Content Enhancement',
        desc: 'Supercharge your professional summary, job descriptions, and project details with GPT-4 powered suggestions — ATS-optimized and action-verb rich.',
    },
    {
        icon: LayoutTemplate,
        color: '#34d399',
        glow: 'rgba(52, 211, 153, 0.3)',
        bg: 'rgba(52, 211, 153, 0.08)',
        title: 'Professional Templates',
        desc: 'Choose from beautifully crafted, recruiter-approved templates that pass Applicant Tracking Systems and make your experience shine.',
    },
    {
        icon: Download,
        color: '#f59e0b',
        glow: 'rgba(245, 158, 11, 0.3)',
        bg: 'rgba(245, 158, 11, 0.08)',
        title: 'Export & Share',
        desc: 'One-click high-fidelity PDF download or share a public link directly with recruiters. Your resume, your way.',
    },
    {
        icon: Cpu,
        color: '#22d3ee',
        glow: 'rgba(34, 211, 238, 0.3)',
        bg: 'rgba(34, 211, 238, 0.08)',
        title: 'PDF Auto-Import',
        desc: 'Upload any existing resume as a PDF and AI instantly extracts all your data into a fully editable, structured format.',
    },
    {
        icon: Shield,
        color: '#a855f7',
        glow: 'rgba(168, 85, 247, 0.3)',
        bg: 'rgba(168, 85, 247, 0.08)',
        title: 'ATS Score Ready',
        desc: 'Every template and suggestion is crafted to maximize ATS compatibility, ensuring your resume reaches human eyes.',
    },
    {
        icon: Zap,
        color: '#fb923c',
        glow: 'rgba(251, 146, 60, 0.3)',
        bg: 'rgba(251, 146, 60, 0.08)',
        title: 'Real-Time Preview',
        desc: 'See your resume update live as you type. Instant visual feedback keeps you in control of every detail.',
    },
]

const Features = () => {
    const [hovered, setHovered] = useState(null)

    return (
        <section id="features" className="relative py-28 px-6 overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #070b14 0%, #0d1526 50%, #070b14 100%)' }}>

            {/* Background grid */}
            <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

            {/* Orb */}
            <div className="absolute top-20 right-0 w-96 h-96 rounded-full pointer-events-none"
                style={{ background: 'rgba(168, 85, 247, 0.08)', filter: 'blur(80px)' }} />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Section header */}
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-semibold"
                        style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.25)', color: '#a5b4fc' }}>
                        <Sparkles size={12} />
                        Packed With Power
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black mb-4 max-w-2xl" style={{ letterSpacing: '-0.02em' }}>
                        <span className="gradient-text">Everything you need</span>
                        <br />
                        <span style={{ color: '#e2e8f0' }}>to land your dream job</span>
                    </h2>
                    <p className="max-w-lg text-base leading-relaxed" style={{ color: '#64748b' }}>
                        From AI-assisted writing to pixel-perfect PDF export — every tool you need in one place.
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((feat, i) => {
                        const Icon = feat.icon
                        const isHov = hovered === i
                        return (
                            <div
                                key={i}
                                onMouseEnter={() => setHovered(i)}
                                onMouseLeave={() => setHovered(null)}
                                className="rounded-2xl p-6 cursor-default"
                                style={{
                                    background: isHov ? feat.bg : 'rgba(255,255,255,0.03)',
                                    border: `1px solid ${isHov ? feat.glow : 'rgba(255,255,255,0.06)'}`,
                                    boxShadow: isHov ? `0 0 30px ${feat.glow}` : 'none',
                                    transition: 'all 0.35s ease',
                                    transform: isHov ? 'translateY(-4px)' : 'translateY(0)',
                                }}
                            >
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                                    style={{ background: feat.bg, border: `1px solid ${feat.glow}` }}>
                                    <Icon size={20} color={feat.color} />
                                </div>
                                <h3 className="font-bold text-base mb-2" style={{ color: '#e2e8f0' }}>
                                    {feat.title}
                                </h3>
                                <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>
                                    {feat.desc}
                                </p>
                            </div>
                        )
                    })}
                </div>

                {/* Bottom CTA strip */}
                <div className="mt-16 rounded-2xl p-8 text-center relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.1) 100%)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                    }}>
                    <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
                    <p className="text-lg font-semibold mb-2 relative z-10" style={{ color: '#e2e8f0' }}>
                        Ready to build your standout resume?
                    </p>
                    <p className="text-sm mb-6 relative z-10" style={{ color: '#64748b' }}>
                        Join thousands who've already landed interviews with ResumeAI.
                    </p>
                    <a href="/app?state=register"
                        className="relative z-10 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white"
                        style={{
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            boxShadow: '0 0 24px rgba(99, 102, 241, 0.4)',
                            transition: 'all 0.3s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 40px rgba(99,102,241,0.6)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 24px rgba(99,102,241,0.4)'}>
                        <Zap size={15} />
                        Get Started — It's Free
                    </a>
                </div>
            </div>
        </section>
    )
}

export default Features