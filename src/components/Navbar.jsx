import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from "../app/features/authSlice"
import { FileText, LogOut, LayoutDashboard } from 'lucide-react'

const Navbar = () => {
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logoutUser = () => {
        navigate('/')
        dispatch(logout())
    }

    return (
        <nav
            className="sticky top-0 z-50 w-full"
            style={{
                background: 'rgba(7, 11, 20, 0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
            }}
        >
            <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-3.5">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 0 16px rgba(99,102,241,0.4)' }}
                    >
                        <FileText size={15} color="white" />
                    </div>
                    <span className="font-bold text-base" style={{ color: '#f0f4ff' }}>
                        Resume<span style={{ color: '#818cf8' }}>AI</span>
                    </span>
                </Link>

                {/* Right side */}
                <div className="flex items-center gap-4">

                    {/* User greeting */}
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white' }}>
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <span className="text-sm font-medium" style={{ color: '#94a3b8' }}>
                            {user?.name}
                        </span>
                    </div>

                    {/* Dashboard link */}
                    <Link
                        to="/app"
                        className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                        style={{ color: '#94a3b8' }}
                        onMouseEnter={e => {
                            e.currentTarget.style.color = '#f0f4ff'
                            e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.color = '#94a3b8'
                            e.currentTarget.style.background = 'transparent'
                        }}
                    >
                        <LayoutDashboard size={15} />
                        Dashboard
                    </Link>

                    {/* Logout button */}
                    <button
                        onClick={logoutUser}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                        style={{
                            background: 'rgba(239, 68, 68, 0.08)',
                            border: '1px solid rgba(239, 68, 68, 0.15)',
                            color: '#f87171',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(239,68,68,0.18)'
                            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)'
                            e.currentTarget.style.boxShadow = '0 0 12px rgba(239,68,68,0.15)'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(239,68,68,0.08)'
                            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.15)'
                            e.currentTarget.style.boxShadow = 'none'
                        }}
                    >
                        <LogOut size={14} />
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar