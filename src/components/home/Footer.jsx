import React from 'react'
import { FileText } from 'lucide-react'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'

const Footer = () => {
    const links = {
        Product: ['Features', 'Templates', 'AI Enhancement', 'PDF Export'],
        Resources: ['FAQ', 'Blog', 'Changelog', 'Support'],
        Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
    }

    return (
        <footer
            id="contact"
            className="relative overflow-hidden border-t"
            style={{
                background: 'linear-gradient(180deg, #070b14 0%, #040810 100%)',
                borderColor: 'rgba(255,255,255,0.05)',
            }}
        >
            {/* Grid pattern */}
            <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

            {/* Top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)' }} />

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 relative z-10">

                {/* Top row */}
                <div className="grid md:grid-cols-4 gap-12 mb-16">

                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                                <FileText size={16} color="white" />
                            </div>
                            <span className="font-bold text-lg" style={{ color: '#f0f4ff' }}>
                                Resume<span style={{ color: '#818cf8' }}>AI</span>
                            </span>
                        </div>

                        <p className="text-sm leading-relaxed mb-6" style={{ color: '#475569' }}>
                            Build modern, ATS-friendly resumes in minutes with AI-powered
                            writing assistance and beautiful templates.
                        </p>

                        <div className="flex gap-3">
                            {[
                                { icon: FaGithub, href: '#' },
                                { icon: FaLinkedin, href: '#' },
                                { icon: FaTwitter, href: '#' },
                            ].map(({ icon: Icon, href }, i) => (
                                <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300"
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        color: '#64748b',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = 'rgba(99,102,241,0.15)'
                                        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'
                                        e.currentTarget.style.color = '#818cf8'
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                                        e.currentTarget.style.color = '#64748b'
                                    }}>
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(links).map(([group, items]) => (
                        <div key={group}>
                            <h3 className="font-semibold text-sm mb-5" style={{ color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                {group}
                            </h3>
                            <ul className="space-y-3">
                                {items.map(item => (
                                    <li key={item}>
                                        <a href="#"
                                            className="text-sm transition-colors"
                                            style={{ color: '#475569' }}
                                            onMouseEnter={e => e.target.style.color = '#818cf8'}
                                            onMouseLeave={e => e.target.style.color = '#475569'}>
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
                    style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <p className="text-xs" style={{ color: '#334155' }}>
                        © 2026 <span style={{ color: '#6366f1' }}>ResumeAI</span>. All rights reserved.
                    </p>
                    <p className="text-xs" style={{ color: '#334155' }}>
                        Built with ❤️ using React · Node.js · OpenAI · MongoDB
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer