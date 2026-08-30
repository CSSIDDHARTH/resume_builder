import {
    ArrowLeftIcon,
    User, FileText, Briefcase, GraduationCap,
    FolderIcon, Sparkles, ChevronLeft, ChevronRight,
    Share2Icon, EyeIcon, EyeOffIcon, DownloadIcon, Trophy,
    Save, AlertTriangle
} from "lucide-react"

import { Link, useParams } from "react-router-dom"
import React, { useEffect, useState, useRef } from "react"
import { PersonalInfoForm } from "../components/PersonalInfoForm"
import ResumePreview from "../components/ResumePreview"
import TemplateSelector from "../components/TemplateSelector"
import ColorPicker from "../components/ColorPicker"
import ProfessionalSummary from "../components/ProfessionalSummary"
import ExperienceForm from "../components/ExperienceForm"
import EducationForm from "../components/EducationForm"
import ProjectForm from "../components/ProjectForm"
import SkillsForm from "../components/SkillsForm"
import { useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import api from '../configs/api'
import Achievements from "../components/Achievements"
import CertificationsForm from "../components/CertificationsForm"
import html2canvas from "html2canvas-pro"
import jsPDF from "jspdf"
import SectionOrder from "../components/SectionOrder"
import { fitResume, PAGE_HEIGHT } from "../utils/fitResume"

const ResumeBuilder = () => {
    const [isOverflowing, setIsOverflowing] = useState(false)
    const resumeRef = useRef(null)

    const checkResumeOverflow = () => {
        const resume = document.getElementById("resume-preview")
        if (!resume) return
        setIsOverflowing(resume.scrollHeight > resume.clientHeight)
    }

    const defaultSectionOrder = [
        { id: "summary", label: "Professional Summary" },
        { id: "experience", label: "Experience" },
        { id: "education", label: "Education" },
        { id: "projects", label: "Projects" },
        { id: "skills", label: "Skills" },
        { id: "achievements", label: "Achievements" },
        { id: "certifications", label: "Certifications" },
    ]

    const [sectionOrder, setSectionOrder] = useState(defaultSectionOrder)
    const { resumeId } = useParams()
    const { token } = useSelector(state => state.auth)

    const [resumeData, setResumeData] = useState({
        _id: "", title: "", personal_info: {},
        professional_summary: "", experience: [], education: [],
        project: [], skills: [], achievements: [], certifications: [],
        template: "classic", accent_color: "#3B82F6", public: false,
        sectionOrder: ["summary", "experience", "education", "projects", "skills", "achievements", "certifications"],
    })

    const [activeSectionIndex, setActiveSectionIndex] = useState(0)
    const [removeBackground, setRemoveBackground] = useState(false)

    const sections = [
        { id: "personal", name: "Personal Info", icon: User },
        { id: "summary", name: "Summary", icon: FileText },
        { id: "experience", name: "Experience", icon: Briefcase },
        { id: "education", name: "Education", icon: GraduationCap },
        { id: "projects", name: "Projects", icon: FolderIcon },
        { id: "skills", name: "Skills", icon: Sparkles },
        { id: "achievements", name: "Achievements", icon: Trophy },
        { id: "certifications", name: "Certifications", icon: Sparkles },
    ]

    const activeSection = sections[activeSectionIndex]

    const loadExistingResume = async () => {
        try {
            const { data } = await api.get('/api/resumes/get/' + resumeId, { headers: { Authorization: token } })
            if (data.resume) {
                setResumeData(data.resume)
                setSectionOrder(
                    data.resume.sectionOrder?.length ? data.resume.sectionOrder : defaultSectionOrder
                )
                document.title = data.resume.title
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => { loadExistingResume() }, [resumeId])

    useEffect(() => {
        const timer = setTimeout(() => checkResumeOverflow(), 100)
        return () => clearTimeout(timer)
    }, [resumeData])

    const changeResumeVisibility = async () => {
        try {
            const formData = new FormData()
            formData.append("resumeId", resumeId)
            formData.append("resumeData", JSON.stringify({ public: !resumeData.public }))
            const { data } = await api.put('/api/resumes/update', formData, { headers: { Authorization: token } })
            setResumeData({ ...resumeData, public: !resumeData.public })
            toast.success(data.message)
        } catch (error) {
            toast.error("Please Try Again")
        }
    }

    const handleShare = () => {
        const frontendUrl = window.location.href.split('/app/')[0]
        const resumeUrl = frontendUrl + '/view/' + resumeId
        if (navigator.share) {
            navigator.share({ url: resumeUrl, text: "My Resume" })
        } else {
            toast.error('Share not supported on this browser.')
        }
    }

    const tempDownload = async () => {
        try { window.print() }
        catch (error) { toast.error("Failed to download resume.") }
    }

    const downloadResume = async () => {
        try {
            const resume = document.getElementById("resume-preview")
            if (!resume) { toast.error("Resume preview not found."); return }
            const canvas = await html2canvas(resume, {
                scale: 3, useCORS: true, backgroundColor: "#fff",
                width: resume.scrollWidth, height: resume.scrollHeight,
                windowWidth: resume.scrollWidth, windowHeight: resume.scrollHeight,
            })
            const imgData = canvas.toDataURL("image/png")
            const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
            const pdfWidth = 210
            const imgWidth = pdfWidth
            const imgHeight = (canvas.height * imgWidth) / canvas.width
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
            if (isOverflowing) {
                const proceed = window.confirm("This resume exceeds one A4 page.\n\nIt will be downloaded as a 2-page PDF.\n\nContinue?")
                if (!proceed) return
            }
            pdf.save(`${resumeData.title || "Resume"}.pdf`)
            toast.success("Resume downloaded successfully!")
        } catch (error) {
            toast.error("Failed to download resume.")
        }
    }

    const saveResume = async () => {
        try {
            let updatedResumeData = structuredClone(resumeData)
            if (typeof resumeData.personal_info.image === 'object') {
                delete updatedResumeData.personal_info.image
            }
            const formData = new FormData()
            formData.append("resumeId", resumeId)
            formData.append("resumeData", JSON.stringify(updatedResumeData))
            removeBackground && formData.append("removeBackground", true)
            typeof resumeData.personal_info.image === 'object' && formData.append("image", resumeData.personal_info.image)
            const { data } = await api.put('/api/resumes/update', formData, { headers: { Authorization: token } })
            setResumeData(data.resume)
            toast.success(data.message)
        } catch (error) {
            toast.error("Unable to save your resume. Please try again.")
        }
    }

    const progressPct = (activeSectionIndex * 100) / (sections.length - 1)

    return (
        <div style={{ minHeight: 'calc(100vh - 60px)', background: '#070b14', padding: '1.5rem 1rem' }}>

            {/* Background orb */}
            <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
                style={{ background: 'rgba(99,102,241,0.05)', filter: 'blur(100px)', zIndex: 0 }} />

            <div className="max-w-7xl mx-auto relative z-10">

                {/* ── Back Button ── */}
                <Link
                    to="/app"
                    className="inline-flex gap-2 items-center mb-6 text-sm font-medium transition-all"
                    style={{ color: '#64748b' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#818cf8'}
                    onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
                >
                    <ArrowLeftIcon size={15} />
                    Back to Dashboard
                </Link>

                <div className="grid lg:grid-cols-12 gap-6">

                    {/* ── Left Panel — Editor ── */}
                    <div className="lg:col-span-5">
                        <div className="rounded-2xl overflow-hidden"
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(99,102,241,0.15)',
                                backdropFilter: 'blur(12px)',
                            }}>

                            {/* Progress bar */}
                            <div className="h-0.5 w-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                <div
                                    className="h-full transition-all duration-500"
                                    style={{
                                        width: `${progressPct}%`,
                                        background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                                    }}
                                />
                            </div>

                            <div className="p-6">
                                {/* Top controls */}
                                <div className="flex items-center justify-between mb-5 pb-5"
                                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

                                    {/* Template + Color */}
                                    <div className="flex items-center gap-2">
                                        <div style={{ filter: 'invert(1) hue-rotate(180deg) brightness(0.9) contrast(0.7)' }}>
                                            <TemplateSelector
                                                selectedTemplate={resumeData.template}
                                                onChange={template => setResumeData(prev => ({ ...prev, template }))}
                                            />
                                        </div>
                                        <ColorPicker
                                            selectedColor={resumeData.accent_color}
                                            onChange={color => setResumeData(prev => ({ ...prev, accent_color: color }))}
                                        />
                                    </div>

                                    {/* Section name */}
                                    <span className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>
                                        {activeSection.name}
                                    </span>

                                    {/* Prev / Next */}
                                    <div className="flex items-center gap-1">
                                        {activeSectionIndex > 0 && (
                                            <button
                                                onClick={() => setActiveSectionIndex(prev => Math.max(prev - 1, 0))}
                                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                                                style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b', border: '1px solid rgba(255,255,255,0.08)' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.color = '#818cf8' }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#64748b' }}>
                                                <ChevronLeft size={13} />
                                                Prev
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setActiveSectionIndex(prev => Math.min(prev + 1, sections.length - 1))}
                                            disabled={activeSectionIndex === sections.length - 1}
                                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                                            style={{
                                                background: activeSectionIndex === sections.length - 1 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                                                color: activeSectionIndex === sections.length - 1 ? '#334155' : '#64748b',
                                                border: '1px solid rgba(255,255,255,0.08)',
                                                cursor: activeSectionIndex === sections.length - 1 ? 'not-allowed' : 'pointer',
                                            }}
                                            onMouseEnter={e => { if (activeSectionIndex !== sections.length - 1) { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.color = '#818cf8' } }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#64748b' }}>
                                            Next
                                            <ChevronRight size={13} />
                                        </button>
                                    </div>
                                </div>

                                {/* Section nav pills */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {sections.map((sec, i) => {
                                        const Icon = sec.icon
                                        const active = i === activeSectionIndex
                                        return (
                                            <button
                                                key={sec.id}
                                                onClick={() => setActiveSectionIndex(i)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                                                style={{
                                                    background: active ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.03)',
                                                    border: `1px solid ${active ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.06)'}`,
                                                    color: active ? '#a5b4fc' : '#475569',
                                                }}
                                            >
                                                <Icon size={11} />
                                                {sec.name}
                                            </button>
                                        )
                                    })}
                                </div>

                                {/* Form content */}
                                <div className="space-y-4">
                                    {activeSection.id === "personal" && (
                                        <PersonalInfoForm
                                            data={resumeData.personal_info}
                                            onChange={data => setResumeData(prev => ({ ...prev, personal_info: data }))}
                                            removeBackground={removeBackground}
                                            setRemoveBackground={setRemoveBackground}
                                        />
                                    )}
                                    {activeSection.id === 'summary' && (
                                        <ProfessionalSummary
                                            data={resumeData.professional_summary}
                                            onChange={data => setResumeData(prev => ({ ...prev, professional_summary: data }))}
                                            setResumeData={setResumeData}
                                        />
                                    )}
                                    {activeSection.id === 'experience' && (
                                        <ExperienceForm
                                            data={resumeData.experience}
                                            onChange={data => setResumeData(prev => ({ ...prev, experience: data }))}
                                        />
                                    )}
                                    {activeSection.id === 'education' && (
                                        <EducationForm
                                            data={resumeData.education}
                                            onChange={data => setResumeData(prev => ({ ...prev, education: data }))}
                                        />
                                    )}
                                    {activeSection.id === 'projects' && (
                                        <ProjectForm
                                            data={resumeData.project}
                                            onChange={data => setResumeData(prev => ({ ...prev, project: data }))}
                                        />
                                    )}
                                    {activeSection.id === 'skills' && (
                                        <SkillsForm
                                            data={resumeData.skills}
                                            onChange={data => setResumeData(prev => ({ ...prev, skills: data }))}
                                        />
                                    )}
                                    {activeSection.id === 'achievements' && (
                                        <Achievements
                                            data={resumeData.achievements}
                                            onChange={data => setResumeData(prev => ({ ...prev, achievements: data }))}
                                        />
                                    )}
                                    {activeSection.id === 'certifications' && (
                                        <CertificationsForm
                                            data={resumeData.certifications}
                                            onChange={data => setResumeData(prev => ({ ...prev, certifications: data }))}
                                        />
                                    )}
                                </div>

                                {/* Section order */}
                                <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                    <SectionOrder sections={sectionOrder} setSections={setSectionOrder} />
                                </div>

                                {/* Save button */}
                                <button
                                    onClick={() => { toast.promise(saveResume(), { loading: 'Saving...', success: 'Saved!', error: 'Failed to save' }) }}
                                    className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white transition-all"
                                    style={{
                                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                        boxShadow: '0 0 20px rgba(99,102,241,0.35)',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 35px rgba(99,102,241,0.55)'}
                                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(99,102,241,0.35)'}
                                >
                                    <Save size={15} />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Right Panel — Preview ── */}
                    <div className="lg:col-span-7 max-lg:mt-4">

                        {/* Overflow warning */}
                        {isOverflowing && (
                            <div className="mb-3 flex items-center gap-3 rounded-xl px-4 py-3 text-sm"
                                style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24' }}>
                                <AlertTriangle size={15} style={{ color: '#f59e0b', shrink: 0 }} />
                                Your resume exceeds one A4 page — it will export as a 2-page PDF.
                            </div>
                        )}

                        {/* Action buttons row */}
                        <div className="flex items-center gap-2 justify-end mb-3">
                            {resumeData.public && (
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                                    style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)', color: '#22d3ee' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,211,238,0.15)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(34,211,238,0.08)'}>
                                    <Share2Icon size={13} />
                                    Share
                                </button>
                            )}

                            <button
                                onClick={changeResumeVisibility}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                                style={{
                                    background: resumeData.public ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.04)',
                                    border: `1px solid ${resumeData.public ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.08)'}`,
                                    color: resumeData.public ? '#818cf8' : '#64748b',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.15)'}
                                onMouseLeave={e => e.currentTarget.style.background = resumeData.public ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.04)'}>
                                {resumeData.public ? <EyeIcon size={13} /> : <EyeOffIcon size={13} />}
                                {resumeData.public ? 'Public' : 'Private'}
                            </button>

                            <button
                                onClick={tempDownload}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                                style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)', color: '#a78bfa' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(168,85,247,0.15)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(168,85,247,0.08)'}>
                                <DownloadIcon size={13} />
                                Download PDF
                            </button>
                        </div>

                        {/* Resume preview */}
                        <div className="rounded-2xl overflow-hidden"
                            style={{
                                border: '1px solid rgba(255,255,255,0.06)',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                            }}>
                            <ResumePreview
                                ref={resumeRef}
                                data={resumeData}
                                template={resumeData.template}
                                accentColor={resumeData.accent_color}
                                sectionOrder={sectionOrder}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResumeBuilder