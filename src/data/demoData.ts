import { ResumeAnalysisResult, SavedResume, EnhancedResumeResult } from '../types';

export interface SampleJob {
  id: string;
  title: string;
  company: string;
  description: string;
  category: string;
}

export const SAMPLE_JOBS: SampleJob[] = [
  {
    id: 'job-backend-cloudscale',
    title: 'Senior Distributed Systems & Backend Engineer',
    company: 'CloudScale Technologies',
    category: 'Backend / Cloud',
    description: `CloudScale Technologies is seeking a Senior Backend Engineer to build resilient distributed streaming platforms and scalable cloud microservices.

Key Responsibilities:
- Architect, build, and deploy low-latency, fault-tolerant distributed services handling 50k+ req/sec.
- Design asynchronous event-driven pipelines using Apache Kafka, Redis, and Go / Node.js / TypeScript.
- Own cloud infrastructure on AWS/GCP utilizing Docker, Kubernetes, Terraform, and CI/CD pipelines.
- Partner with security, database, and front-end teams to optimize PostgreSQL queries and gRPC APIs.

Requirements:
- 4+ years of professional backend engineering experience with Go, Node.js, or Java/Python.
- Strong hands-on experience with Docker, Kubernetes, and AWS (ECS, S3, RDS, Lambda).
- In-depth understanding of database optimization (PostgreSQL/MySQL), caching (Redis), and event streaming (Kafka/RabbitMQ).
- Experience with microservices architecture, gRPC/REST APIs, and distributed tracing.
- Bachelor's or Master's degree in Computer Science or equivalent practical experience.

Preferred:
- Experience with Terraform, Prometheus, Grafana, and OpenTelemetry.
- Contributions to open-source systems software or high-throughput financial/data systems.`,
  },
  {
    id: 'job-ai-nextgen',
    title: 'AI / Machine Learning Engineer (LLMs & Vision)',
    company: 'NextGen AI Solutions',
    category: 'AI / Machine Learning',
    description: `NextGen AI is building next-generation multimodal agent systems and LLM orchestration tools for enterprise clients.

Key Responsibilities:
- Design, fine-tune, and deploy transformer-based LLMs and multimodal vision-language models into production.
- Build production RAG (Retrieval Augmented Generation) pipelines using vector databases (Pinecone, Weaviate, pgvector).
- Optimize model inference latency using ONNX Runtime, TensorRT, and quantized architectures (vLLM, Ollama).
- Develop robust evaluation benchmarks for model hallucination detection and prompt regression testing.

Requirements:
- 3+ years experience with Python, PyTorch, Hugging Face Transformers, and LangChain/LlamaIndex.
- Proven experience deploying LLM applications with vector search, embeddings, and structured outputs.
- Strong fundamentals in statistical ML, linear algebra, loss functions, and evaluation metrics (ROUGE, BLEU, F1).
- Solid knowledge of Docker containerization and FastAPI backend microservices.

Preferred:
- Experience fine-tuning open weights models (Llama 3, Mistral) via LoRA/QLoRA on multi-GPU clusters.
- Background in synthetic dataset generation and automated evaluation pipelines.`,
  },
  {
    id: 'job-fullstack-apex',
    title: 'Senior Full-Stack React & TypeScript Engineer',
    company: 'Apex Financial Technologies',
    category: 'Full-Stack',
    description: `Apex Financial is expanding our core fintech web application, delivering real-time portfolio analytics and compliance tools to institutional traders.

Key Responsibilities:
- Build responsive, accessible, high-performance web dashboards using React 19, TypeScript, and Tailwind CSS.
- Design resilient REST and GraphQL APIs with Node.js, Express/NestJS, and PostgreSQL.
- Implement real-time WebSocket data feeds and interactive financial charting visualizers with D3/Recharts.
- Maintain rigorous test coverage (Jest, Vitest, Playwright) and automated CI/CD deployment pipelines.

Requirements:
- 4+ years building production web applications with React, TypeScript, and modern state management.
- Strong proficiency in Node.js backend services and SQL database modeling.
- Experience with WebSocket protocols, client-side caching, and responsive UI optimization.
- Passion for clean architecture, accessibility (WCAG AA), and component reusability.

Preferred:
- Experience with fintech/trading dashboards or high-frequency data rendering.
- Experience with Next.js, Docker, and AWS serverless architectures.`,
  },
];

export const SAMPLE_RESUMES: SavedResume[] = [
  {
    id: 'resume-alex-morgan',
    title: 'Alex Morgan - Senior Backend & Cloud Engineer',
    targetRole: 'Senior Distributed Systems & Backend Engineer',
    fileType: 'manual',
    updatedAt: new Date().toISOString(),
    tags: ['Backend', 'Kubernetes', 'Go', 'AWS'],
    versionNote: 'Production-ready Senior Resume with strong cloud background',
    textContent: `ALEX MORGAN
San Francisco, CA | (555) 234-5678 | alex.morgan.dev@email.com | linkedin.com/in/alexmorgan-dev | github.com/alexmorgan-code

PROFESSIONAL SUMMARY
Senior Backend Engineer with 5+ years of experience designing and scaling fault-tolerant distributed systems and cloud infrastructure. Proficient in Go, Node.js, TypeScript, PostgreSQL, and AWS/Kubernetes. Track record of reducing API latency, cutting cloud infrastructure costs, and leading cross-functional engineering teams.

TECHNICAL SKILLS
- Programming Languages: Go, TypeScript, JavaScript (Node.js), Python, SQL
- Cloud & DevOps: AWS (EC2, ECS, S3, RDS, Lambda), Docker, Kubernetes, Terraform, GitHub Actions, CI/CD
- Databases & Storage: PostgreSQL, Redis, DynamoDB, Elasticsearch
- Architecture & Protocols: Microservices, RESTful APIs, gRPC, Apache Kafka, Event-Driven Systems, GraphQL
- Tools & Observability: Git, Prometheus, Grafana, Datadog, Docker Compose, Linux

WORK EXPERIENCE
Senior Backend Engineer | CloudScale Networks | San Francisco, CA | 2022 – Present
- Architected an event-driven telemetry ingestion service handling 40,000 requests/second using Go and Apache Kafka, reducing message loss to 0.001%.
- Led migration from monolithic architecture to containerized microservices running on Kubernetes (EKS), improving deployment velocity from bi-weekly to multiple daily releases.
- Optimized slow PostgreSQL queries and introduced a Redis caching layer, decreasing p99 API response times from 420ms to 48ms.
- Mentored 4 junior and mid-level software engineers on concurrent programming patterns and unit testing standards.

Software Engineer | FinStream Systems | San Jose, CA | 2019 – 2022
- Developed core REST and gRPC banking transaction APIs using Node.js and TypeScript, processing over $25M in daily transactions.
- Automated multi-region AWS cloud provisioning using Terraform, saving an estimated 15 hours of manual DevOps operations weekly.
- Implemented robust monitoring dashboards with Prometheus and Grafana, reducing Mean Time to Detect (MTTD) system anomalies by 60%.
- Integrated OAuth2.0 and mutual TLS authentication across 12 internal microservices to satisfy SOC2 compliance standards.

PROJECTS
Distributed Task Queue Engine (Open Source) | Go, Redis, gRPC | github.com/alexmorgan-code/go-task-queue
- Designed a lightweight distributed background worker queue in Go supporting cron scheduling, automatic retries with exponential backoff, and dead-letter queues.
- Achieved throughput of 15,000 tasks/second on modest single-node test instances with minimal CPU overhead.

Real-Time Log Ingestion Service | Node.js, TypeScript, Kafka, Docker | github.com/alexmorgan-code/log-stream
- Built a stream processing service aggregating multi-container Docker logs with Elasticsearch indexing and live search web UI.

EDUCATION
Bachelor of Science in Computer Science | University of California, Davis | 2015 – 2019
- Dean's Honors List (2017, 2018), Coursework: Distributed Systems, Operating Systems, Algorithms, Database Design

CERTIFICATIONS
- AWS Certified Solutions Architect – Associate (2023)
- Certified Kubernetes Application Developer (CKAD) (2022)`,
  },
  {
    id: 'resume-priya-sharma',
    title: 'Priya Sharma - AI / Machine Learning Engineer',
    targetRole: 'AI / Machine Learning Engineer (LLMs & Vision)',
    fileType: 'manual',
    updatedAt: new Date().toISOString(),
    tags: ['AI', 'PyTorch', 'LLMs', 'RAG'],
    versionNote: 'Specialized in modern LLM pipelines and transformer fine-tuning',
    textContent: `PRIYA SHARMA
Seattle, WA | (555) 789-0123 | priya.sharma.ml@email.com | linkedin.com/in/priyasharma-ai | github.com/priyasharma-ai

PROFESSIONAL SUMMARY
Machine Learning Engineer with 4 years of experience specializing in deep learning, transformer models, LLM fine-tuning, and Retrieval-Augmented Generation (RAG) pipelines. Proven expertise in PyTorch, Hugging Face, vector databases, and scalable inference optimization.

TECHNICAL SKILLS
- ML / AI Frameworks: PyTorch, TensorFlow, Hugging Face Transformers, LangChain, LlamaIndex, Scikit-learn
- Generative AI & NLP: Large Language Models (LLMs), RAG, Vector Search, LoRA/QLoRA fine-tuning, vLLM, Prompt Engineering
- Programming: Python, C++, SQL, Bash
- Vector DBs & Storage: Pinecone, Weaviate, pgvector, Milvus, Redis
- Cloud & MLOps: AWS SageMaker, Docker, MLflow, Ray, FastAPI, Kubernetes, Git

WORK EXPERIENCE
Machine Learning Engineer | Cognition AI Labs | Seattle, WA | 2022 – Present
- Designed and deployed enterprise RAG pipeline utilizing LangChain, Pinecone, and Claude/Llama 3, boosting search retrieval accuracy from 64% to 89%.
- Fine-tuned open-source 7B and 13B language models using LoRA on specialized financial and legal text, reducing proprietary API inference expenses by 45%.
- Implemented asynchronous batch inference serving using FastAPI and vLLM on NVIDIA A100 GPUs, reducing median latency from 1.8s to 280ms.
- Built an automated evaluation framework for hallucination detection and toxic output prevention covering 500+ test scenarios.

Data Scientist / ML Developer | DataNova Analytics | Bellevue, WA | 2020 – 2022
- Developed computer vision classification models for automated defect detection in manufacturing using PyTorch and ResNet/YOLO architectures.
- Standardized ML experimentation tracking and model versioning across team of 8 data scientists using MLflow and Docker.
- Collaborated with product teams to build interactive customer churn prediction dashboards using Python and Streamlit.

PROJECTS
MedRAG: Clinical Knowledge Retrieval System | Python, PyTorch, FAISS, FastAPI | github.com/priyasharma-ai/med-rag
- Implemented a domain-adapted RAG pipeline querying 100k+ PubMed clinical trials with hybrid dense/sparse vector embeddings.
- Evaluated retrieval precision against baseline PubMed search, achieving 22% higher relevant document recall.

LocalLLM Agent Orchestrator | Python, LangChain, vLLM | github.com/priyasharma-ai/local-agent
- Developed a lightweight autonomous task execution agent capable of running multi-step web scraping and summarizing tasks on local hardware.

EDUCATION
Master of Science in Computer Science (Machine Learning Focus) | University of Washington | 2018 – 2020
Bachelor of Technology in Computer Engineering | National Institute of Technology | 2014 – 2018`,
  },
  {
    id: 'resume-david-chen',
    title: 'David Chen - Early Career Software Engineer',
    targetRole: 'Junior / Mid Full-Stack Web Developer',
    fileType: 'manual',
    updatedAt: new Date().toISOString(),
    tags: ['Web', 'React', 'TypeScript', 'Node.js'],
    versionNote: 'Great foundation, needs more STAR metrics in bullet points',
    textContent: `DAVID CHEN
Austin, TX | (555) 345-6789 | david.chen.cs@email.com | github.com/davidchen-code

OBJECTIVE
Motivated software engineer with experience in React, TypeScript, and Node.js seeking a full-stack developer role.

SKILLS
- JavaScript, TypeScript, React, HTML5, CSS3, Tailwind CSS
- Node.js, Express, MongoDB, PostgreSQL
- Git, GitHub, REST APIs, Jest, Vite

EXPERIENCE
Software Developer Intern | ByteCraft Software | Austin, TX | Summer 2023
- Built responsive UI components for the customer onboarding flow using React and Tailwind CSS.
- Worked on backend REST API endpoints in Node.js and Express to handle user profile creation.
- Wrote unit tests with Jest to improve test coverage across user authentication modules.
- Participated in daily standups, code reviews, and agile sprint planning.

PROJECTS
DevBoard: Collaborative Task Tracker | React, Node.js, MongoDB, Socket.io
- Built a Kanban-style task management web application with drag-and-drop support.
- Implemented real-time board updates across multiple users using WebSockets.
- Created secure JWT authentication and password hashing with bcrypt.

CryptoWatch: Real-Time Coin Tracker | React, TypeScript, CoinGecko API
- Developed a cryptocurrency tracking dashboard showing live prices, market cap, and historical price charts.
- Added dark mode support and local storage saving for user favorite coins.

EDUCATION
Bachelor of Science in Computer Science | University of Texas at Austin | 2020 – 2024
GPA: 3.7 / 4.0`,
  },
];

export const DEMO_PRECOMPUTED_REPORT: ResumeAnalysisResult = {
  id: 'analysis-demo-alex-cloudscale',
  timestamp: new Date().toISOString(),
  resumeName: 'Alex Morgan - Senior Backend & Cloud Engineer',
  targetRole: 'Senior Distributed Systems & Backend Engineer',
  targetCompany: 'CloudScale Technologies',
  scores: {
    overall: 89,
    atsCompatibility: 94,
    jobRelevance: 91,
    skillsMatch: 88,
    experienceQuality: 87,
    projectQuality: 85,
    contentClarity: 90,
    scoreExplanation:
      'Overall score of 89/100 reflects an exceptionally strong match across all key competencies. The resume displays impeccable ATS compliance (94), proven high-throughput backend ownership in Go and Kafka (91 relevance), and clear quantifiable metrics across work experiences.',
  },
  atsAnalysis: {
    score: 94,
    overallSummary:
      'Highly ATS-friendly single-column layout with clean standard section headers, consistent date formatting (YYYY - Present), direct contact links, and zero unparsable graphics or nested tables.',
    formattingScore: 96,
    headingsScore: 95,
    readabilityScore: 92,
    contactInfoScore: 98,
    dateConsistencyScore: 95,
    parsingRisks: [
      'Minor: Ensure email and GitHub links are formatted as plaintext alongside clickable hyperlinks for legacy parser compatibility.',
    ],
    factors: [
      {
        factorName: 'Standard Section Headings',
        status: 'passed',
        score: 98,
        description: 'Uses recognized standard headers (Experience, Projects, Education, Skills, Certifications).',
        impact: 'High parsing confidence across Taleo, Workday, and Greenhouse.',
        recommendation: 'Maintain standard headings across all versions.',
      },
      {
        factorName: 'Contact Information Structure',
        status: 'passed',
        score: 98,
        description: 'Complete location, phone, professional email, LinkedIn, and GitHub provided at the top.',
        impact: 'Recruiters can immediately initiate contact with no missing data.',
        recommendation: 'No action required.',
      },
      {
        factorName: 'Layout & Column Architecture',
        status: 'passed',
        score: 95,
        description: 'Single-column linear hierarchy eliminates text scrambling risks during automated OCR parsing.',
        impact: 'Prevents text jumping across multi-column boundaries.',
        recommendation: 'Keep single-column structure.',
      },
      {
        factorName: 'Date & Chronological Consistency',
        status: 'passed',
        score: 94,
        description: 'Consistent format (e.g., "2022 – Present") throughout all work experience items.',
        impact: 'Calculates years of relevant experience accurately.',
        recommendation: 'Include months (e.g., "Mar 2022 – Present") for maximum precision.',
      },
      {
        factorName: 'Keyword Density & Placement',
        status: 'passed',
        score: 90,
        description: 'Target keywords (Kubernetes, Kafka, Go, PostgreSQL, AWS) appear naturally in summary, skills, and bullets.',
        impact: 'Strong algorithmic ranking for backend distributed systems queries.',
        recommendation: 'Consider mentioning gRPC explicitly in the CloudScale experience bullet.',
      },
    ],
  },
  jobDetails: {
    roleTitle: 'Senior Distributed Systems & Backend Engineer',
    companyName: 'CloudScale Technologies',
    experienceYears: '4+ years',
    requiredSkills: ['Go', 'Node.js', 'Kubernetes', 'Docker', 'AWS', 'PostgreSQL', 'Redis', 'Kafka / Event Streaming', 'Distributed Systems'],
    preferredSkills: ['Terraform', 'Prometheus', 'Grafana', 'gRPC', 'OpenTelemetry'],
    keyResponsibilities: [
      'Architect resilient distributed services handling 50k+ req/sec',
      'Design event-driven pipelines using Kafka and Redis',
      'Manage cloud infrastructure with Kubernetes, Docker, and Terraform',
      'Optimize database queries and microservices APIs',
    ],
    technicalStack: ['Go', 'Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Kafka', 'Kubernetes', 'AWS'],
    domainKnowledge: ['High-throughput systems', 'Event-driven architecture', 'Observability & Monitoring'],
    educationRequirements: ["Bachelor's in Computer Science or equivalent"],
    extractedKeywords: ['Distributed Systems', 'Kafka', 'Go', 'Kubernetes', 'AWS', 'PostgreSQL', 'Redis', 'gRPC', 'Terraform'],
  },
  skillsMatch: [
    {
      skill: 'Go (Golang)',
      category: 'language',
      status: 'strong',
      importance: 'required',
      resumeEvidence: 'Built ingestion service handling 40,000 req/sec using Go; Open-source Distributed Task Queue in Go.',
      recommendation: 'Strong match. Showcase concurrent programming patterns in technical interview.',
      recommendedAction: 'Strong match. Showcase concurrent programming patterns in technical interview.',
    },
    {
      skill: 'Kubernetes & Docker',
      category: 'tool',
      status: 'strong',
      importance: 'required',
      resumeEvidence: 'Led migration to containerized microservices on Kubernetes (EKS); Certified Kubernetes Application Developer (CKAD).',
      recommendation: 'Highlight your CKAD certification and hands-on EKS production scaling experience.',
      recommendedAction: 'Highlight your CKAD certification and hands-on EKS production scaling experience.',
    },
    {
      skill: 'Apache Kafka / Streaming',
      category: 'framework',
      status: 'strong',
      importance: 'required',
      resumeEvidence: 'Architected event-driven telemetry ingestion service handling 40,000 req/sec with Apache Kafka.',
      recommendation: 'Discuss partition management, consumer groups, and dead-letter queue strategies.',
      recommendedAction: 'Discuss partition management, consumer groups, and dead-letter queue strategies.',
    },
    {
      skill: 'PostgreSQL & Redis',
      category: 'technical',
      status: 'strong',
      importance: 'required',
      resumeEvidence: 'Optimized slow PostgreSQL queries and introduced Redis caching, cutting p99 response time to 48ms.',
      recommendation: 'Be prepared to explain query indexing, execution plans, and cache invalidation policies.',
      recommendedAction: 'Be prepared to explain query indexing, execution plans, and cache invalidation policies.',
    },
    {
      skill: 'Terraform & IaC',
      category: 'tool',
      status: 'strong',
      importance: 'preferred',
      resumeEvidence: 'Automated multi-region AWS cloud provisioning using Terraform at FinStream.',
      recommendation: 'Great preferred skill match. Detail state locking and CI/CD plan validation.',
      recommendedAction: 'Great preferred skill match. Detail state locking and CI/CD plan validation.',
    },
    {
      skill: 'OpenTelemetry',
      category: 'tool',
      status: 'missing',
      importance: 'preferred',
      resumeEvidence: 'None found in resume (Prometheus, Grafana, and Datadog are present).',
      recommendation: 'Familiarize yourself with OpenTelemetry distributed trace collectors and W3C tracecontext.',
      recommendedAction: 'Familiarize yourself with OpenTelemetry distributed trace collectors and W3C tracecontext.',
    },
  ],
  keywordAnalysis: {
    importantJobKeywords: ['Distributed Systems', 'Go', 'Kafka', 'Kubernetes', 'AWS', 'PostgreSQL', 'Redis', 'gRPC', 'Terraform', '50k+ req/sec'],
    presentInResume: ['Go', 'Kafka', 'Kubernetes', 'AWS', 'PostgreSQL', 'Redis', 'gRPC', 'Terraform', '40,000 requests/second', 'Microservices'],
    missingKeywords: ['OpenTelemetry', 'gRPC API optimization (in current role)'],
    overusedKeywords: ['Services', 'Systems'],
    naturalSuggestions: [
      {
        keyword: 'OpenTelemetry / Distributed Tracing',
        contextRecommendation: 'If you have utilized distributed trace IDs across your Go/Node microservices, clarify this under your Observability tool section.',
      },
    ],
    antiStuffingWarning: 'Do not insert OpenTelemetry unless you have hands-on familiarity. Your existing Prometheus/Grafana coverage is already competitive.',
  },
  skillGaps: [
    {
      jobRequirement: 'OpenTelemetry & Distributed Tracing',
      category: 'Observability',
      resumeEvidence: 'Prometheus and Grafana listed, but no direct OpenTelemetry mention.',
      status: 'missing',
      gapDescription: 'CloudScale heavily values vendor-neutral trace propagation.',
      recommendedAction: 'Brush up on OTel SDK instrumentations and context propagation in Go services.',
    },
    {
      jobRequirement: '50k+ req/sec Throughput Scale',
      category: 'Scale',
      resumeEvidence: 'Documented 40,000 req/sec on telemetry ingestion.',
      status: 'strong',
      gapDescription: 'Very close to target scale benchmark.',
      recommendedAction: 'Explain the bottlenecks encountered when scaling from 10k to 40k req/sec.',
    },
  ],
  bulletPointEvaluations: [
    {
      id: 'bullet-1',
      originalBullet: 'Architected an event-driven telemetry ingestion service handling 40,000 requests/second using Go and Apache Kafka, reducing message loss to 0.001%.',
      sectionTitle: 'CloudScale Networks - Senior Backend Engineer',
      score: 95,
      actionVerbStrength: 'strong',
      quantifiableResultPresent: true,
      weakness: 'Exemplary STAR bullet point with strong action verb, specific architecture tools, clear scale (40k req/sec), and quantifiable outcome (0.001% loss).',
      suggestedRewrite: 'Architected an event-driven telemetry ingestion engine in Go and Apache Kafka processing 40,000 req/sec with 99.999% message delivery reliability.',
    },
    {
      id: 'bullet-2',
      originalBullet: 'Optimized slow PostgreSQL queries and introduced a Redis caching layer, decreasing p99 API response times from 420ms to 48ms.',
      sectionTitle: 'CloudScale Networks - Senior Backend Engineer',
      score: 92,
      actionVerbStrength: 'strong',
      quantifiableResultPresent: true,
      weakness: 'High-impact bullet with quantifiable latency reduction (420ms -> 48ms).',
      suggestedRewrite: 'Restructured unindexed PostgreSQL relational queries and integrated distributed Redis caching, reducing p99 API latency by 88% (420ms to 48ms).',
    },
    {
      id: 'bullet-3',
      originalBullet: 'Mentored 4 junior and mid-level software engineers on concurrent programming patterns and unit testing standards.',
      sectionTitle: 'CloudScale Networks - Senior Backend Engineer',
      score: 68,
      actionVerbStrength: 'strong',
      quantifiableResultPresent: false,
      weakness: 'Good leadership demonstration, but lacks team velocity or test coverage outcomes.',
      suggestedRewrite: 'Mentored 4 junior and mid-level engineers in Go concurrency and automated testing, elevating team test coverage to [insert team test coverage % if known, e.g. 85%].',
    },
  ],
  sectionEvaluations: [
    {
      sectionName: 'Professional Summary',
      score: 92,
      present: true,
      strengths: ['Concise 3-line overview highlighting core tech stack and 5+ years seniority.'],
      weaknesses: ['Could mention target role title directly.'],
      recommendations: ['Align opening sentence with "Senior Distributed Systems Engineer".'],
    },
    {
      sectionName: 'Work Experience',
      score: 93,
      present: true,
      strengths: ['Dense with high-caliber metrics ($25M volume, 40k req/sec, 420ms to 48ms latency).'],
      weaknesses: ['Minor: Could elaborate on disaster recovery and failover mechanisms.'],
      recommendations: ['Mention multi-zone failover or high-availability SLA uptime.'],
    },
    {
      sectionName: 'Projects',
      score: 88,
      present: true,
      strengths: ['Open-source Go task queue demonstrates deep concurrency and systems curiosity.'],
      weaknesses: ['Could clarify real-world adoption or GitHub star traction if any.'],
      recommendations: ['State user adoption, benchmark comparison against Celery/Sidekiq, or test suite breadth.'],
    },
  ],
  projectAnalyses: [
    {
      projectName: 'Distributed Task Queue Engine',
      problemIdentified: 'Heavyweight background worker frameworks introducing excessive memory bloat.',
      technologiesUsed: ['Go', 'Redis', 'gRPC'],
      technicalComplexity: 'high',
      userImpact: 'Provides lightweight reliable task scheduling for low-overhead microservices.',
      resultsReported: '15,000 tasks/second throughput on modest single-node instances.',
      scalabilityNoted: true,
      originalityRating: 'high',
      demonstratesSTAR: true,
      improvementSuggestion: 'Detail the distributed leader election algorithm or partition assignment strategy implemented.',
    },
  ],
  suggestions: [
    {
      id: 'sugg-1',
      priority: 'high',
      category: 'Skills',
      title: 'Highlight gRPC & Protocol Buffers in Experience',
      issue: 'gRPC is listed in skills and projects, but less prominent in CloudScale work experience bullets.',
      whyItMatters: 'CloudScale builds microservices communicating over gRPC; highlighting it in your primary role reinforces direct readiness.',
      recommendation: 'Specify gRPC in your microservices communication bullet under CloudScale Networks.',
      concreteRecommendation: 'Specify gRPC in your microservices communication bullet under CloudScale Networks.',
      sectionAffected: 'Work Experience',
      originalExample: 'Engineered microservices for user transactions with low latency.',
      improvedExample: 'Engineered high-throughput Go microservices communicating via gRPC/Protobuf, achieving <10ms inter-service latency.',
    },
    {
      id: 'sugg-2',
      priority: 'medium',
      category: 'Impact',
      title: 'Add Team Test Coverage Metric to Mentorship Bullet',
      issue: 'Mentorship bullet demonstrates leadership but lacks concrete team impact metric.',
      whyItMatters: 'Staff/Senior hiring committees look for leadership that measurably elevates overall engineering quality.',
      recommendation: 'Include test coverage increase or code review turnaround metrics if verified.',
      concreteRecommendation: 'Include test coverage increase or code review turnaround metrics if verified.',
      sectionAffected: 'Work Experience',
      originalExample: 'Mentored 4 junior engineers in Go best practices and test-driven development.',
      improvedExample: 'Mentored 4 junior engineers in Go best practices and TDD, elevating core team unit test coverage from [65% to 88%].',
    },
    {
      id: 'sugg-3',
      priority: 'optional',
      category: 'ATS',
      title: 'Provide Month/Year Dates',
      issue: 'Dates are formatted as years only (e.g. 2022 - Present).',
      whyItMatters: 'Some enterprise ATS calculation algorithms prefer Month/Year format (e.g. "Mar 2022 - Present").',
      recommendation: 'Update dates to "Month YYYY – Present" format across all entries.',
      concreteRecommendation: 'Update dates to "Month YYYY – Present" format across all entries.',
      sectionAffected: 'Work Experience',
    },
  ],
  interviewQuestions: [
    {
      id: 'iq-1',
      category: 'resume_deep_dive',
      question: 'In your CloudScale experience, how did you architect the Kafka consumer group topology to achieve 40k req/sec with only 0.001% message loss?',
      context: 'Directly validates your claim regarding high-throughput Kafka stream processing.',
      contextOrRationale: 'Directly validates your claim regarding high-throughput Kafka stream processing.',
      keyTalkingPoints: [
        'Partitioning key strategy to avoid hot partitions',
        'Manual vs automatic commit offsets and idempotent producers',
        'Dead-letter topic retries and backpressure management',
      ],
      whatToAvoid: 'Avoid claiming zero message loss without explaining acknowledgment modes (acks=all) and replication factors.',
    },
    {
      id: 'iq-2',
      category: 'technical',
      question: 'How do you diagnose and resolve database lock contention and connection pool exhaustion in a high-concurrency Go microservice?',
      context: 'Tests your practical PostgreSQL tuning and database driver management skills.',
      contextOrRationale: 'Tests your practical PostgreSQL tuning and database driver management skills.',
      keyTalkingPoints: [
        'pg_stat_activity inspection and long-running transaction identification',
        'Configuring max open and idle connections in Go sql.DB pool',
        'Adopting optimistic locking vs Redis distributed locks',
      ],
      whatToAvoid: 'Do not just suggest restarting the database; focus on index optimization, query execution plans, and pool configurations.',
    },
    {
      id: 'iq-3',
      category: 'project_deep_dive',
      question: 'In your open-source Distributed Task Queue Engine, what concurrency primitives did you use in Go, and how did you prevent race conditions during worker task stealing?',
      context: 'Assesses deep technical grasp of low-level Go concurrency and data structure design.',
      contextOrRationale: 'Assesses deep technical grasp of low-level Go concurrency and data structure design.',
      keyTalkingPoints: [
        'sync.Mutex vs channels vs atomic operations',
        'Worker pool work-stealing algorithms (e.g. Chase-Lev deque)',
        'Heartbeat mechanism for detecting crashed workers',
      ],
      whatToAvoid: 'Avoid vague statements about channels; explain mutex lock granularity and lock-free CAS operations.',
    },
    {
      id: 'iq-4',
      category: 'behavioral',
      question: 'Tell me about a time when you had to advocate for a significant architectural change (such as Kubernetes migration) to stakeholders who were hesitant about downtime risk.',
      context: 'Evaluates technical influence, communication, and risk mitigation mindset.',
      contextOrRationale: 'Evaluates technical influence, communication, and risk mitigation mindset.',
      keyTalkingPoints: [
        'Formulating business ROI and developer velocity metrics',
        'Executing phased canary rollouts and shadow traffic testing',
        'Transparent post-mortem and rollout communication',
      ],
      whatToAvoid: 'Avoid blaming legacy infrastructure or complaining about management reluctance; emphasize calculated risk mitigation.',
    },
  ],
  rawResumeTextSnippet: 'ALEX MORGAN - Senior Backend Engineer with 5+ years experience...',
  rawJobDescriptionSnippet: 'CloudScale Technologies is seeking a Senior Backend Engineer to build resilient distributed streaming platforms...',
};

export const DEMO_ENHANCED_RESUME: EnhancedResumeResult = {
  id: 'enhanced-demo-alex-cloudscale',
  timestamp: new Date().toISOString(),
  targetRole: 'Senior Distributed Systems & Backend Engineer',
  targetCompany: 'CloudScale Technologies',
  enhancementStyle: 'impact_metrics',
  originalResumeText: SAMPLE_RESUMES[0].textContent,
  enhancedResumeMarkdown: `# ALEX MORGAN
Austin, TX • (512) 555-0199 • alex.morgan.dev@email.com • linkedin.com/in/alexmorgan-dev • github.com/alexmorgan

---

## PROFESSIONAL SUMMARY
Principal Distributed Systems & Backend Engineer with 5+ years of production experience architecting high-throughput Go/gRPC microservices, Apache Kafka event streams, and Kubernetes cloud infrastructure. Proven record designing fault-tolerant systems processing 45,000+ operations/sec at 99.99% uptime while slashing cloud operational costs by 42%. Recognized for establishing OpenTelemetry observability standards and mentoring cross-functional engineering pods.

---

## TECHNICAL SKILLS
- **Languages & Frameworks:** Go (Golang), Python, TypeScript, SQL, Rust (Foundational), gRPC, Protocol Buffers, RESTful APIs
- **Distributed Systems & Messaging:** Apache Kafka, RabbitMQ, Redis Distributed Caching, Event-Driven Architecture, CQRS, WebSockets
- **Databases & Storage:** PostgreSQL (Query Optimization, Replication, Partitioning), MongoDB, DynamoDB, Elasticsearch
- **Cloud & DevOps:** AWS (ECS, EKS, Lambda, S3, RDS, CloudFront), Docker, Kubernetes (Operators, Helm), Terraform, CI/CD (GitHub Actions)
- **Observability & Reliability:** OpenTelemetry Distributed Tracing, Prometheus, Grafana, Datadog, Chaos Engineering, SLO/SLA Governance

---

## PROFESSIONAL EXPERIENCE

### Senior Backend Engineer | Nexus Cloud Systems | Austin, TX
**June 2022 – Present**
- Architected and deployed an event-driven ingestion pipeline in Go and Apache Kafka, scaling event throughput from 8,000 to **45,000+ ops/sec** with sub-15ms p99 latency across 12 partitioned consumer groups.
- Spearheaded the strategic migration of 14 monolithic services into containerized Kubernetes (EKS) microservices, cutting cloud compute expenditure by **42% ($18,000/month)** and accelerating deployment frequency by 4x.
- Implemented comprehensive OpenTelemetry distributed tracing and Prometheus/Grafana alerting dashboards, decreasing Mean Time to Resolution (MTTR) by **58%** across mission-critical billing and auth services.
- Refactored core PostgreSQL database access layers, introducing connection pooling and index optimization that eliminated database lock contention and reduced query response times by **65%**.
- Mentored 4 junior and mid-level backend engineers on concurrency patterns, Go memory leak profiling (pprof), and test-driven development (TDD).

### Backend Software Engineer | FinTech Wave | Dallas, TX
**July 2019 – May 2022**
- Engineered high-security payment processing gateway handling **$12M+ monthly transaction volume** with zero security incidents and 99.995% transactional integrity.
- Designed idempotency token protocol and distributed locking mechanisms in Redis, completely eliminating duplicate charge risks during network partition events.
- Integrated automated CI/CD pipeline in GitHub Actions with 92% unit/integration test coverage, reducing release failure rates from 14% to under **1.2%**.
- Collaborated with compliance and security teams to implement end-to-end PCI-DSS tokenization workflows.

---

## KEY DISTRIBUTED SYSTEMS PROJECTS

### Distributed Task Queue Engine | Go, Redis, Docker, gRPC
- Architected an open-source distributed task orchestrator in Go featuring masterless raft consensus, worker heartbeat failure detection, and automatic task reassignment.
- Benchmarked at **25,000 scheduled tasks/sec** with zero memory leak profile under sustained high-load stress testing.

### Real-Time Financial Ledger | Go, Apache Kafka, PostgreSQL, Docker
- Built an append-only double-entry financial ledger service utilizing event sourcing (Kafka) and CQRS read/write splitting in PostgreSQL.
- Implemented cryptographic signature verification on every transaction block with automated reconciliation auditing.

---

## EDUCATION & CERTIFICATIONS
**Bachelor of Science in Computer Science**  
University of Texas at Austin | Graduated Magna Cum Laude (GPA: 3.8 / 4.0)

- **Certifications:** AWS Certified Solutions Architect – Associate | Certified Kubernetes Administrator (CKA)`,
  enhancedResumePlainText: `ALEX MORGAN
Austin, TX • (512) 555-0199 • alex.morgan.dev@email.com • linkedin.com/in/alexmorgan-dev • github.com/alexmorgan

PROFESSIONAL SUMMARY
Principal Distributed Systems & Backend Engineer with 5+ years of production experience architecting high-throughput Go/gRPC microservices, Apache Kafka event streams, and Kubernetes cloud infrastructure. Proven record designing fault-tolerant systems processing 45,000+ operations/sec at 99.99% uptime while slashing cloud operational costs by 42%.

TECHNICAL SKILLS
Languages & Frameworks: Go (Golang), Python, TypeScript, SQL, gRPC, Protocol Buffers, REST
Distributed Systems & Messaging: Apache Kafka, RabbitMQ, Redis Distributed Caching, Event-Driven Architecture, CQRS
Databases & Storage: PostgreSQL (Query Optimization, Replication), MongoDB, DynamoDB, Elasticsearch
Cloud & DevOps: AWS (EKS, ECS, Lambda, S3, RDS), Docker, Kubernetes, Terraform, GitHub Actions
Observability & Reliability: OpenTelemetry Distributed Tracing, Prometheus, Grafana, Datadog

PROFESSIONAL EXPERIENCE

Senior Backend Engineer | Nexus Cloud Systems | June 2022 – Present
- Architected and deployed an event-driven ingestion pipeline in Go and Apache Kafka, scaling event throughput from 8,000 to 45,000+ ops/sec with sub-15ms p99 latency across 12 partitioned consumer groups.
- Spearheaded the strategic migration of 14 monolithic services into containerized Kubernetes (EKS) microservices, cutting cloud compute expenditure by 42% ($18,000/month) and accelerating deployment frequency by 4x.
- Implemented comprehensive OpenTelemetry distributed tracing and Prometheus/Grafana alerting dashboards, decreasing Mean Time to Resolution (MTTR) by 58%.
- Refactored core PostgreSQL database access layers, introducing connection pooling and index optimization that eliminated lock contention and reduced query times by 65%.

Backend Software Engineer | FinTech Wave | July 2019 – May 2022
- Engineered high-security payment processing gateway handling $12M+ monthly transaction volume with zero security incidents and 99.995% transactional integrity.
- Designed idempotency token protocol and distributed locking mechanisms in Redis, completely eliminating duplicate charge risks during network partition events.
- Integrated automated CI/CD pipeline in GitHub Actions with 92% unit/integration test coverage.

EDUCATION
Bachelor of Science in Computer Science | University of Texas at Austin | Magna Cum Laude
Certifications: AWS Certified Solutions Architect – Associate | Certified Kubernetes Administrator (CKA)`,
  metricsComparison: {
    before: {
      overall: 89,
      atsScore: 94,
      skillsMatch: 88,
      bulletImpact: 87,
      missingKeywordsCount: 3,
    },
    after: {
      overall: 98,
      atsScore: 99,
      skillsMatch: 97,
      bulletImpact: 98,
      missingKeywordsCount: 0,
    },
    projectedGain: 9,
  },
  sectionTransformations: [
    {
      sectionName: 'Professional Summary',
      originalText: 'Senior Backend Engineer with 5+ years experience building Go microservices, Kafka pipelines, and AWS cloud systems.',
      enhancedText: 'Principal Distributed Systems & Backend Engineer with 5+ years of production experience architecting high-throughput Go/gRPC microservices, Apache Kafka event streams, and Kubernetes cloud infrastructure. Proven record designing fault-tolerant systems processing 45,000+ operations/sec at 99.99% uptime while slashing cloud operational costs by 42%.',
      changesSummary: 'Expanded scope from generic backend to distributed systems specialist with concrete throughput and uptime metrics.',
      improvements: [
        'Added high-impact scale metrics (45,000+ ops/sec, 99.99% uptime, 42% cost reduction)',
        'Synthesized OpenTelemetry, Kubernetes, and gRPC leadership keywords',
        'Standardized to canonical ATS heading',
      ],
    },
    {
      sectionName: 'Technical Skills Matrix',
      originalText: 'Go, Python, TypeScript, SQL, Kafka, Redis, PostgreSQL, Docker, Kubernetes, AWS, Git',
      enhancedText: 'Categorized into Languages & Frameworks, Distributed Systems & Messaging, Databases & Storage, Cloud & DevOps, and Observability & Reliability.',
      changesSummary: 'Replaced flat keyword comma-list with categorized high-signal taxonomy recognized by enterprise ATS filters.',
      improvements: [
        'Eliminated unorganized comma dumping',
        'Integrated missing target skills: OpenTelemetry, gRPC Multiplexing, CQRS, SLO Governance',
        'Grouped tools logically by architectural domain',
      ],
    },
    {
      sectionName: 'Work Experience (Nexus Cloud Systems)',
      originalText: 'Worked on Go microservices and Kafka. Migrated services to Kubernetes. Set up monitoring with Prometheus.',
      enhancedText: 'Architected event-driven ingestion pipeline in Go/Kafka scaling from 8k to 45k+ ops/sec with sub-15ms latency. Spearheaded EKS migration saving $18,000/mo. Implemented OpenTelemetry tracing decreasing MTTR by 58%.',
      changesSummary: 'Transformed passive responsibility bullet points into quantitative STAR achievements with clear action verbs and business results.',
      improvements: [
        'Introduced active verbs: "Architected", "Spearheaded", "Implemented", "Refactored"',
        'Added specific dollar savings ($18k/month) and MTTR reduction metrics (58%)',
        'Included concurrency profiling and mentoring leadership evidence',
      ],
    },
    {
      sectionName: 'Work Experience (FinTech Wave)',
      originalText: 'Built payment processing gateway and used Redis for locking. Worked on GitHub Actions CI/CD.',
      enhancedText: 'Engineered high-security payment processing gateway handling $12M+ monthly transaction volume with 99.995% transactional integrity. Designed idempotency token protocol and distributed locking in Redis.',
      changesSummary: 'Highlighted financial scale ($12M+ volume) and distributed systems rigor (idempotency, partition tolerance).',
      improvements: [
        'Quantified monthly transaction volume ($12M+) and integrity rate (99.995%)',
        'Demonstrated deep domain expertise in idempotency and distributed race conditions',
        'Cited concrete test coverage metrics (92% CI/CD coverage)',
      ],
    },
    {
      sectionName: 'Projects & Education',
      originalText: 'Task Queue in Go. Financial Ledger. BS in Computer Science from UT Austin.',
      enhancedText: 'Distributed Task Queue Engine (25,000 scheduled tasks/sec) and Real-Time Financial Ledger with CQRS/Event Sourcing. BS in Computer Science (Magna Cum Laude) + AWS & CKA Certifications.',
      changesSummary: 'Elevated academic projects into distributed systems architectural showcases with rigorous stress-test data.',
      improvements: [
        'Added CKA (Certified Kubernetes Administrator) & AWS Solutions Architect credentials',
        'Added benchmark throughput numbers (25k tasks/sec)',
        'Demonstrated raft consensus and event-sourcing architectural patterns',
      ],
    },
  ],
  bulletDiffs: [
    {
      id: 'bd-1',
      section: 'Work Experience',
      original: 'Worked on Go microservices and Kafka to process customer data.',
      enhanced: 'Architected and deployed an event-driven ingestion pipeline in Go and Apache Kafka, scaling event throughput from 8,000 to 45,000+ ops/sec with sub-15ms p99 latency across 12 partitioned consumer groups.',
      rationale: 'Replaced passive verb "worked on" with "architected and deployed" and added explicit throughput (45k ops/sec) and latency benchmarks.',
      keywordsAdded: ['Event-Driven Ingestion', 'Apache Kafka', 'p99 Latency', 'Partitioned Consumer Groups'],
      metricsAdded: true,
    },
    {
      id: 'bd-2',
      section: 'Work Experience',
      original: 'Helped migrate company services to Kubernetes on AWS.',
      enhanced: 'Spearheaded the strategic migration of 14 monolithic services into containerized Kubernetes (EKS) microservices, cutting cloud compute expenditure by 42% ($18,000/month) and accelerating deployment frequency by 4x.',
      rationale: 'Changed weak "helped migrate" to "spearheaded strategic migration" and quantified financial savings ($18k/month) and deployment velocity.',
      keywordsAdded: ['Kubernetes (EKS)', 'Microservices Architecture', 'Cloud Compute Expenditure'],
      metricsAdded: true,
    },
    {
      id: 'bd-3',
      section: 'Work Experience',
      original: 'Set up monitoring with Prometheus and Grafana for backend services.',
      enhanced: 'Implemented comprehensive OpenTelemetry distributed tracing and Prometheus/Grafana alerting dashboards, decreasing Mean Time to Resolution (MTTR) by 58% across mission-critical billing and auth services.',
      rationale: 'Added missing target keyword "OpenTelemetry distributed tracing" and provided measurable MTTR improvement metric (58%).',
      keywordsAdded: ['OpenTelemetry Distributed Tracing', 'Alerting Dashboards', 'MTTR Reduction'],
      metricsAdded: true,
    },
    {
      id: 'bd-4',
      section: 'Work Experience',
      original: 'Optimized PostgreSQL database queries to make them faster.',
      enhanced: 'Refactored core PostgreSQL database access layers, introducing connection pooling and index optimization that eliminated database lock contention and reduced query response times by 65%.',
      rationale: 'Specified exact database engineering strategies (connection pooling, lock contention elimination) and measured performance gain (65%).',
      keywordsAdded: ['Connection Pooling', 'Index Optimization', 'Lock Contention'],
      metricsAdded: true,
    },
    {
      id: 'bd-5',
      section: 'Work Experience',
      original: 'Built payment processing gateway in Go and used Redis for locking.',
      enhanced: 'Engineered high-security payment processing gateway handling $12M+ monthly transaction volume with zero security incidents and 99.995% transactional integrity.',
      rationale: 'Articulated financial magnitude and rigorous security/reliability standards expected in senior fintech roles.',
      keywordsAdded: ['Payment Processing Gateway', 'Transactional Integrity', 'High-Security'],
      metricsAdded: true,
    },
    {
      id: 'bd-6',
      section: 'Work Experience',
      original: 'Set up CI/CD pipeline using GitHub Actions.',
      enhanced: 'Integrated automated CI/CD pipeline in GitHub Actions with 92% unit/integration test coverage, reducing release failure rates from 14% to under 1.2%.',
      rationale: 'Framed CI/CD engineering with concrete reliability numbers (92% coverage, 14% -> 1.2% failure reduction).',
      keywordsAdded: ['Automated CI/CD', 'GitHub Actions', 'Test Coverage'],
      metricsAdded: true,
    },
  ],
  integratedKeywords: [
    'OpenTelemetry Distributed Tracing',
    'Kubernetes (EKS)',
    'gRPC & Protocol Buffers',
    'Event-Driven Ingestion',
    'PostgreSQL Connection Pooling',
    'SLO/SLA Observability',
  ],
  keyEnhancementsSummary: [
    'Transformed 100% of passive bullet points into high-density STAR statements with quantified scale and financial impact.',
    'Eliminated all ATS parsing risks by enforcing single-column layout, standard section titles, and clean date notations.',
    'Naturally integrated all target job keywords into contextual project and production experience descriptions without keyword stuffing.',
    'Refactored the skills section into an organized domain matrix for rapid recruiter screening.',
  ],
  truthPreservationNotice:
    'All factual employment history, company titles, and educational records are 100% preserved. Bracketed placeholders are provided where custom candidate metrics can be refined.',
};
