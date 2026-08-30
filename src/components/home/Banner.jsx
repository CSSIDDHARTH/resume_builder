import React from 'react'
import { Sparkles } from 'lucide-react'

const Banner = () => {
    return (
        <div className="w-full py-2.5 text-center relative overflow-hidden"
            style={{
                background: 'linear-gradient(90deg, #070b14 0%, #1e1b4b 30%, #312e81 50%, #1e1b4b 70%, #070b14 100%)',
                borderBottom: '1px solid rgba(99, 102, 241, 0.2)'
            }}
        >
            {/* Animated shimmer line */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '200%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.15) 50%, transparent 100%)',
                    animation: 'shimmer 3s linear infinite'
                }} />
            </div>

            <div className="flex items-center justify-center gap-2.5 relative z-10">
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                    <Sparkles size={10} />
                    NEW
                </div>
                <p className="text-xs font-medium" style={{ color: '#c7d2fe' }}>
                    AI-Powered Resume Enhancement is now live —&nbsp;
                    <a href="#features" className="underline underline-offset-2 hover:text-white transition-colors" style={{ color: '#818cf8' }}>
                        Explore features ↗
                    </a>
                </p>
            </div>
        </div>
    )
}

export default Banner