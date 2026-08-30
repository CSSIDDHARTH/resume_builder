import React, { useState } from "react"
import { CircleHelp, ChevronDown, Plus, Minus } from "lucide-react"

const faqs = [
    {
        question: "Is ResumeAI free to use?",
        answer: "Yes! Create, edit, and download professional resumes completely free. AI enhancement, templates, and PDF export are all included at no cost.",
    },
    {
        question: "What is an ATS-friendly resume?",
        answer: "An ATS-friendly resume is optimized to pass Applicant Tracking Systems — the software recruiters use to filter candidates. Our templates use clean formatting, proper headings, and readable structure that ATS scanners love.",
    },
    {
        question: "Can I upload my existing resume?",
        answer: "Absolutely. Upload any PDF resume and our AI will instantly extract all your information into an editable, structured format — no manual re-typing needed.",
    },
    {
        question: "How does AI improve my resume?",
        answer: "Our GPT-4 powered AI enhances your professional summary, work experience, and project descriptions — improving grammar, clarity, and professional tone while keeping your information 100% accurate.",
    },
    {
        question: "Can I customize colors and templates?",
        answer: "Yes! Choose from multiple professionally designed templates, pick your accent color, reorder sections, and adjust content until your resume feels uniquely yours.",
    },
    {
        question: "Can I share my resume online?",
        answer: "Yes. You can make your resume public and share a direct link with recruiters. They can view a beautiful, rendered version of your resume in their browser.",
    },
    {
        question: "Is my data secure?",
        answer: "Your resume data is encrypted and securely stored. We never share your personal information with third parties and you can delete your data at any time.",
    },
    {
        question: "Can I create multiple resumes?",
        answer: "Yes! Create and manage multiple resumes tailored to different roles, companies, or industries — all organized neatly in your dashboard.",
    },
]

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0)

    return (
        <section
            id="faq"
            className="relative py-28 px-6 overflow-hidden"
            style={{ background: '#070b14' }}
        >
            {/* Background orb */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
                style={{ background: 'rgba(99,102,241,0.07)', filter: 'blur(100px)' }} />

            <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none" />

            <div className="max-w-3xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-14">
                    <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-semibold"
                        style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc' }}>
                        <CircleHelp size={12} />
                        Common Questions
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black mb-4" style={{ letterSpacing: '-0.02em', color: '#e2e8f0' }}>
                        Frequently Asked <span className="gradient-text">Questions</span>
                    </h2>
                    <p className="max-w-md text-base" style={{ color: '#64748b' }}>
                        Everything you need to know about building professional resumes with ResumeAI.
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-3">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index
                        return (
                            <div
                                key={index}
                                className="rounded-2xl overflow-hidden"
                                style={{
                                    background: isOpen ? 'rgba(99,102,241,0.07)' : 'rgba(255,255,255,0.03)',
                                    border: `1px solid ${isOpen ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.06)'}`,
                                    boxShadow: isOpen ? '0 0 20px rgba(99,102,241,0.1)' : 'none',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                                    className="w-full flex justify-between items-center px-6 py-5 text-left"
                                    style={{ cursor: 'pointer', background: 'transparent', border: 'none' }}
                                >
                                    <h3 className="font-semibold text-sm pr-4"
                                        style={{ color: isOpen ? '#c7d2fe' : '#e2e8f0' }}>
                                        {faq.question}
                                    </h3>
                                    <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                                        style={{
                                            background: isOpen ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)',
                                            transition: 'all 0.3s',
                                        }}>
                                        {isOpen
                                            ? <Minus size={12} color="#818cf8" />
                                            : <Plus size={12} color="#475569" />
                                        }
                                    </div>
                                </button>

                                <div
                                    className="overflow-hidden transition-all duration-300"
                                    style={{ maxHeight: isOpen ? '200px' : '0px' }}
                                >
                                    <p className="px-6 pb-6 text-sm leading-7" style={{ color: '#64748b' }}>
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default FAQ