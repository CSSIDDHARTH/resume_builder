import {
    FilePenLineIcon, PencilIcon, PlusIcon, TrashIcon,
    UploadCloudIcon, XIcon, LoaderCircleIcon, FileText,
    Sparkles, Clock, TrendingUp, FolderOpen
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import { toast } from 'react-hot-toast'
import pdfToText from 'react-pdftotext'

/* ─── Color palette for resume cards ─── */
const CARD_PALETTES = [
    { color: '#818cf8', glow: 'rgba(129,140,248,0.25)', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.25)' },
    { color: '#a78bfa', glow: 'rgba(167,139,250,0.25)', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.25)' },
    { color: '#34d399', glow: 'rgba(52,211,153,0.25)', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)' },
    { color: '#60a5fa', glow: 'rgba(96,165,250,0.25)', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)' },
    { color: '#f472b6', glow: 'rgba(244,114,182,0.25)', bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.25)' },
]

/* ─── Modal backdrop ─── */
const Modal = ({ onClose, children }) => (
    <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
    >
        <div onClick={e => e.stopPropagation()} className="relative w-full max-w-md rounded-2xl p-7"
            style={{
                background: '#0d1526',
                border: '1px solid rgba(99,102,241,0.2)',
                boxShadow: '0 0 60px rgba(99,102,241,0.15)',
            }}>
            {children}
        </div>
    </div>
)

/* ─── Stat card ─── */
const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="rounded-2xl p-5 flex items-center gap-4"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
            <Icon size={18} color={color} />
        </div>
        <div>
            <p className="text-xl font-bold" style={{ color: '#e2e8f0' }}>{value}</p>
            <p className="text-xs" style={{ color: '#475569' }}>{label}</p>
        </div>
    </div>
)

const Dashboard = () => {
    const { user, token } = useSelector(state => state.auth)
    const [allResumes, setAllResumes] = useState([])
    const [showCreateResume, setShowCreateResume] = useState(false)
    const [showUploadResume, setShowUploadResume] = useState(false)
    const [title, setTitle] = useState('')
    const [resume, setResume] = useState(null)
    const [editResumeId, setEditResumeId] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const navigate = useNavigate()

    const loadAllResumes = async () => {
        try {
            const { data } = await api.get('/api/users/resumes', { headers: { Authorization: token } })
            setAllResumes(data.resumes)
        } catch (error) {
            setAllResumes([])
            if (error.response?.status === 401) toast.error("Session expired. Please log in again.")
            else if (!error.response) toast.error("Unable to connect to the server.")
        } finally {
            setIsLoading(false)
        }
    }

    const createResume = async (e) => {
        try {
            e.preventDefault()
            const { data } = await api.post('/api/resumes/create', { title }, { headers: { Authorization: token } })
            setAllResumes([...allResumes, data.resume])
            setTitle('')
            setShowCreateResume(false)
            navigate(`/app/builder/${data.resume._id}`)
        } catch (error) {
            let message = "Unable to create your resume. Please try again."
            if (!error.response) message = "Unable to connect to the server."
            else if (error.response.status === 401) message = "Session expired. Please log in again."
            else if (error.response.status === 400) message = error.response.data?.message || message
            toast.error(message)
        }
    }

    const uploadResume = async (e) => {
        e.preventDefault()
        setUploading(true)
        try {
            const resumeText = await pdfToText(resume)
            const { data } = await api.post('/api/ai/upload-resume', { title, resumeText }, { headers: { Authorization: token } })
            setTitle("")
            setResume(null)
            setShowUploadResume(false)
            navigate(`/app/builder/${data.resumeId}`)
        } catch (error) {
            toast.error("Unable to process your resume. Please try again.")
        } finally {
            setUploading(false)
        }
    }

    const editTitle = async (e) => {
        try {
            e.preventDefault()
            const { data } = await api.put('/api/resumes/update', { resumeId: editResumeId, resumeData: { title } }, { headers: { Authorization: token } })
            setAllResumes(allResumes.map(r => r._id === editResumeId ? { ...r, title } : r))
            setTitle('')
            setEditResumeId('')
            toast.success(data.message)
        } catch (error) {
            toast.error("Unable to update the resume title.")
        }
    }

    const deleteResume = async (resumeId) => {
        try {
            const confirm = window.confirm('Are you sure you want to delete this resume?')
            if (confirm) {
                const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, { headers: { Authorization: token } })
                setAllResumes(allResumes.filter(r => r._id !== resumeId))
                toast.success(data.message)
            }
        } catch (error) {
            toast.error("Unable to delete the resume.")
        }
    }

    useEffect(() => { loadAllResumes() }, [])

    /* ── Shared input styles ── */
    const inputClass = {
        width: '100%',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '0.625rem',
        padding: '0.625rem 0.875rem',
        color: '#f0f4ff',
        outline: 'none',
        fontSize: '0.875rem',
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 60px)', background: '#070b14', padding: '2rem 1.5rem' }}>
            {/* Subtle background */}
            <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                <div style={{
                    position: 'absolute', top: 0, right: 0, width: 500, height: 500,
                    background: 'rgba(99,102,241,0.05)', filter: 'blur(100px)', borderRadius: '50%',
                }} />
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, width: 400, height: 400,
                    background: 'rgba(168,85,247,0.04)', filter: 'blur(100px)', borderRadius: '50%',
                }} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">

                {/* ── Header ── */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                            style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>
                            Dashboard
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black mb-1" style={{ color: '#f0f4ff', letterSpacing: '-0.02em' }}>
                        Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
                    </h1>
                    <p className="text-sm" style={{ color: '#475569' }}>
                        Manage your resumes and continue building your career story.
                    </p>
                </div>

                {/* ── Stats ── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                    <StatCard icon={FolderOpen} label="Total Resumes" value={allResumes.length} color="#818cf8" />
                    <StatCard icon={Clock} label="Last Updated" value={
                        allResumes.length > 0
                            ? new Date(Math.max(...allResumes.map(r => new Date(r.updatedAt)))).toLocaleDateString()
                            : '—'
                    } color="#34d399" />
                    <StatCard icon={TrendingUp} label="AI Enhanced" value={allResumes.length > 0 ? `${allResumes.length} ✓` : '0'} color="#f472b6" />
                </div>

                {/* ── Action Buttons ── */}
                <div className="grid grid-cols-2 sm:flex gap-4 mb-8">
                    <button
                        onClick={() => setShowCreateResume(true)}
                        className="flex flex-col items-center justify-center gap-3 h-32 sm:w-40 rounded-2xl transition-all duration-300 group cursor-pointer"
                        style={{
                            background: 'rgba(99,102,241,0.05)',
                            border: '1px dashed rgba(99,102,241,0.3)',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(99,102,241,0.1)'
                            e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'
                            e.currentTarget.style.boxShadow = '0 0 20px rgba(99,102,241,0.15)'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(99,102,241,0.05)'
                            e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'
                            e.currentTarget.style.boxShadow = 'none'
                        }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 0 16px rgba(99,102,241,0.4)' }}>
                            <PlusIcon size={18} color="white" />
                        </div>
                        <p className="text-xs font-medium" style={{ color: '#818cf8' }}>Create Resume</p>
                    </button>

                    <button
                        onClick={() => setShowUploadResume(true)}
                        className="flex flex-col items-center justify-center gap-3 h-32 sm:w-40 rounded-2xl transition-all duration-300 cursor-pointer"
                        style={{
                            background: 'rgba(168,85,247,0.05)',
                            border: '1px dashed rgba(168,85,247,0.3)',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(168,85,247,0.1)'
                            e.currentTarget.style.borderColor = 'rgba(168,85,247,0.5)'
                            e.currentTarget.style.boxShadow = '0 0 20px rgba(168,85,247,0.15)'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(168,85,247,0.05)'
                            e.currentTarget.style.borderColor = 'rgba(168,85,247,0.3)'
                            e.currentTarget.style.boxShadow = 'none'
                        }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', boxShadow: '0 0 16px rgba(168,85,247,0.4)' }}>
                            <UploadCloudIcon size={18} color="white" />
                        </div>
                        <p className="text-xs font-medium" style={{ color: '#a78bfa' }}>Upload PDF</p>
                    </button>
                </div>

                {/* ── Divider ── */}
                {allResumes.length > 0 && (
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
                        <span className="text-xs font-medium" style={{ color: '#334155' }}>
                            YOUR RESUMES ({allResumes.length})
                        </span>
                        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
                    </div>
                )}

                {/* ── Resume Cards Grid ── */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <LoaderCircleIcon className="animate-spin" size={32} style={{ color: '#6366f1' }} />
                    </div>
                ) : allResumes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                            <FileText size={28} color="#6366f1" />
                        </div>
                        <p className="font-semibold mb-2" style={{ color: '#e2e8f0' }}>No resumes yet</p>
                        <p className="text-sm" style={{ color: '#475569' }}>Create your first resume to get started</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {allResumes.map((r, index) => {
                            const pal = CARD_PALETTES[index % CARD_PALETTES.length]
                            return (
                                <div
                                    key={r._id}
                                    onClick={() => navigate(`/app/builder/${r._id}`)}
                                    className="relative h-40 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer group"
                                    style={{
                                        background: pal.bg,
                                        border: `1px solid ${pal.border}`,
                                        transition: 'all 0.3s ease',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.boxShadow = `0 0 25px ${pal.glow}`
                                        e.currentTarget.style.transform = 'translateY(-3px)'
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.boxShadow = 'none'
                                        e.currentTarget.style.transform = 'translateY(0)'
                                    }}
                                >
                                    <FilePenLineIcon size={22} style={{ color: pal.color }} />
                                    <p className="text-xs font-semibold text-center px-3 leading-tight"
                                        style={{ color: pal.color }}>
                                        {r.title}
                                    </p>
                                    <p className="absolute bottom-2 text-[10px] px-3 text-center"
                                        style={{ color: `${pal.color}80` }}>
                                        {new Date(r.updatedAt).toLocaleDateString()}
                                    </p>

                                    {/* Action buttons on hover */}
                                    <div
                                        onClick={e => e.stopPropagation()}
                                        className="absolute top-2 right-2 hidden group-hover:flex items-center gap-1"
                                    >
                                        <button
                                            onClick={() => deleteResume(r._id)}
                                            className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
                                            style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.3)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                                        >
                                            <TrashIcon size={11} />
                                        </button>
                                        <button
                                            onClick={() => { setEditResumeId(r._id); setTitle(r.title) }}
                                            className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
                                            style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.3)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.15)'}
                                        >
                                            <PencilIcon size={11} />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* ── Create Resume Modal ── */}
            {showCreateResume && (
                <Modal onClose={() => setShowCreateResume(false)}>
                    <button onClick={() => { setShowCreateResume(false); setTitle('') }}
                        className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                        style={{ background: 'rgba(255,255,255,0.06)', color: '#64748b' }}>
                        <XIcon size={14} />
                    </button>

                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                            <PlusIcon size={15} color="white" />
                        </div>
                        <h2 className="text-lg font-bold" style={{ color: '#f0f4ff' }}>Create New Resume</h2>
                    </div>

                    <form onSubmit={createResume} className="space-y-4">
                        <div>
                            <label className="block mb-2 text-xs font-medium" style={{ color: '#64748b' }}>Resume Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="e.g., Software Engineer Resume"
                                required
                                style={inputClass}
                            />
                        </div>
                        <button type="submit"
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white mt-2"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
                            <Sparkles size={14} />
                            Create Resume
                        </button>
                    </form>
                </Modal>
            )}

            {/* ── Upload Resume Modal ── */}
            {showUploadResume && (
                <Modal onClose={() => setShowUploadResume(false)}>
                    <button onClick={() => { setShowUploadResume(false); setTitle('') }}
                        className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.06)', color: '#64748b' }}>
                        <XIcon size={14} />
                    </button>

                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}>
                            <UploadCloudIcon size={15} color="white" />
                        </div>
                        <h2 className="text-lg font-bold" style={{ color: '#f0f4ff' }}>Upload Existing Resume</h2>
                    </div>

                    <form onSubmit={uploadResume} className="space-y-4">
                        <div>
                            <label className="block mb-2 text-xs font-medium" style={{ color: '#64748b' }}>Resume Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="e.g., My Engineering Resume"
                                required
                                style={inputClass}
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-xs font-medium" style={{ color: '#64748b' }}>PDF File</label>
                            <label htmlFor="resume-input" className="block cursor-pointer">
                                <div
                                    className="flex flex-col items-center justify-center gap-3 py-8 rounded-xl border-2 border-dashed transition-all"
                                    style={{
                                        borderColor: resume ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.1)',
                                        background: resume ? 'rgba(168,85,247,0.07)' : 'rgba(255,255,255,0.02)',
                                    }}>
                                    {resume ? (
                                        <>
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                                style={{ background: 'rgba(168,85,247,0.2)' }}>
                                                <FileText size={16} color="#a855f7" />
                                            </div>
                                            <p className="text-sm font-medium" style={{ color: '#a78bfa' }}>{resume.name}</p>
                                        </>
                                    ) : (
                                        <>
                                            <UploadCloudIcon size={28} style={{ color: '#475569' }} />
                                            <p className="text-sm" style={{ color: '#475569' }}>Click to upload PDF</p>
                                        </>
                                    )}
                                </div>
                            </label>
                            <input type="file" id="resume-input" accept=".pdf" hidden onChange={e => setResume(e.target.files[0])} />
                        </div>

                        <button type="submit" disabled={uploading}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white"
                            style={{
                                background: uploading ? 'rgba(168,85,247,0.4)' : 'linear-gradient(135deg, #a855f7, #6366f1)',
                                boxShadow: uploading ? 'none' : '0 0 20px rgba(168,85,247,0.4)',
                                cursor: uploading ? 'not-allowed' : 'pointer',
                            }}>
                            {uploading ? (
                                <><LoaderCircleIcon size={16} className="animate-spin" /> Processing with AI...</>
                            ) : (
                                <><Sparkles size={14} /> Upload & Extract with AI</>
                            )}
                        </button>
                    </form>
                </Modal>
            )}

            {/* ── Edit Title Modal ── */}
            {editResumeId && (
                <Modal onClose={() => setEditResumeId('')}>
                    <button onClick={() => { setEditResumeId(''); setTitle('') }}
                        className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.06)', color: '#64748b' }}>
                        <XIcon size={14} />
                    </button>

                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: 'rgba(99,102,241,0.2)' }}>
                            <PencilIcon size={15} color="#818cf8" />
                        </div>
                        <h2 className="text-lg font-bold" style={{ color: '#f0f4ff' }}>Rename Resume</h2>
                    </div>

                    <form onSubmit={editTitle} className="space-y-4">
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Enter new title"
                            required
                            style={inputClass}
                        />
                        <button type="submit"
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
                            Save Changes
                        </button>
                    </form>
                </Modal>
            )}
        </div>
    )
}

export default Dashboard