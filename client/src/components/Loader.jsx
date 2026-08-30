import React from 'react'
import { FileText } from 'lucide-react'

const Loader = () => {
    return (
        <div
            className="flex flex-col items-center justify-center h-screen gap-4"
            style={{ background: '#070b14' }}
        >
            <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center animate-pulse-glow"
                style={{
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    boxShadow: '0 0 30px rgba(99,102,241,0.5)',
                }}
            >
                <FileText size={22} color="white" />
            </div>
            <div
                className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'rgba(99,102,241,0.3)', borderTopColor: '#818cf8' }}
            />
            <p className="text-sm font-medium" style={{ color: '#475569' }}>Loading...</p>
        </div>
    )
}

export default Loader