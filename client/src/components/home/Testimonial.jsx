import React from 'react'
import { Star, Quote } from 'lucide-react'

const testimonials = [
    { avatar: 'https://i.pravatar.cc/80?img=11', name: 'Priya Sharma', handle: '@priya_dev', role: 'Frontend Engineer', text: 'ResumeAI rewrote my summary in seconds and I got 3 interview calls within a week. Absolute game-changer!', stars: 5 },
    { avatar: 'https://i.pravatar.cc/80?img=32', name: 'Marcus Chen', handle: '@marcus_builds', role: 'Product Manager', text: 'The AI enhancement feature is genuinely incredible. My job descriptions now sound 10x more compelling.', stars: 5 },
    { avatar: 'https://i.pravatar.cc/80?img=47', name: 'Sofia Ramirez', handle: '@sofia_ux', role: 'UX Designer', text: "I uploaded my old PDF resume and ResumeAI auto-filled everything perfectly. Saved me hours of work.", stars: 5 },
    { avatar: 'https://i.pravatar.cc/80?img=65', name: 'Arjun Mehta', handle: '@arjun_swe', role: 'Software Engineer', text: 'Clean templates, ATS-friendly output, and the PDF export looks flawless. Best free resume tool out there.', stars: 5 },
    { avatar: 'https://i.pravatar.cc/80?img=22', name: 'Zoe Williams', handle: '@zoewrites', role: 'Data Analyst', text: 'The color picker and template options made it so easy to create a professional-looking resume that feels uniquely mine.', stars: 5 },
    { avatar: 'https://i.pravatar.cc/80?img=58', name: 'Liam O\'Brien', handle: '@liamtech', role: 'DevOps Engineer', text: 'I love how it syncs everything in real time. The live preview kept me confident in every edit I made.', stars: 5 },
    { avatar: 'https://i.pravatar.cc/80?img=15', name: 'Amara Johnson', handle: '@amara_codes', role: 'ML Engineer', text: 'Sharing a public link with recruiters is such a smart feature. My resume got noticed because of how polished it looked.', stars: 5 },
    { avatar: 'https://i.pravatar.cc/80?img=40', name: 'Raj Patel', handle: '@rajpatel_io', role: 'Full Stack Dev', text: 'Switching from Google Docs to ResumeAI was the best decision. My resume instantly looked 10x more professional.', stars: 5 },
]

const Card = ({ t }) => (
    <div className="mx-3 shrink-0 w-72 rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', transition: 'all 0.3s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(99,102,241,0.15)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none' }}>
        <Quote size={18} style={{ color: '#6366f1', opacity: 0.6, marginBottom: 8 }} />
        <div className="flex gap-0.5 mb-3">
            {Array.from({ length: t.stars }).map((_, i) => <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />)}
        </div>
        <p className="text-sm leading-relaxed mb-4" style={{ color: '#94a3b8' }}>"{t.text}"</p>
        <div className="flex items-center gap-3">
            <div className="rounded-full p-0.5" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover block" />
            </div>
            <div>
                <p className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>{t.name}</p>
                <p className="text-xs" style={{ color: '#475569' }}>{t.role}</p>
            </div>
        </div>
    </div>
)

const Testimonial = () => {
    const row1 = testimonials.slice(0, 4)
    const row2 = testimonials.slice(4)
    return (
        <section id="testimonial" className="relative py-28 overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #070b14 0%, #0b1020 100%)' }}>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
                style={{ background: 'rgba(99,102,241,0.07)', filter: 'blur(80px)' }} />
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center mb-12">
                    <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-semibold"
                        style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc' }}>
                        <Star size={11} fill="#a5b4fc" color="#a5b4fc" />Loved by Users
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black mb-4" style={{ letterSpacing: '-0.02em', color: '#e2e8f0' }}>
                        Don't take our word for it
                    </h2>
                    <p className="max-w-md text-base" style={{ color: '#64748b' }}>
                        Thousands of job seekers have already used ResumeAI to land their dream roles.
                    </p>
                </div>
            </div>
            <div className="relative w-full overflow-hidden mb-4">
                <div className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, #070b14, transparent)' }} />
                <div className="marquee-inner flex" style={{ width: 'max-content' }}>
                    {[...row1, ...row1, ...row1].map((t, i) => <Card key={i} t={t} />)}
                </div>
                <div className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none"
                    style={{ background: 'linear-gradient(270deg, #070b14, transparent)' }} />
            </div>
            <div className="relative w-full overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, #070b14, transparent)' }} />
                <div className="marquee-inner marquee-reverse flex" style={{ width: 'max-content' }}>
                    {[...row2, ...row2, ...row2].map((t, i) => <Card key={i} t={t} />)}
                </div>
                <div className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none"
                    style={{ background: 'linear-gradient(270deg, #070b14, transparent)' }} />
            </div>
        </section>
    )
}

export default Testimonial