-- ==============================================================================
-- SUPABASE COMPLETE PORTFOLIO SCHEMA, RLS, STORAGE & SEED SCRIPT
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. CREATE RELATIONAL TABLES
-- ==============================================================================

-- TABLE: profile
CREATE TABLE IF NOT EXISTS public.profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    bio TEXT NOT NULL,
    hero_headlines JSONB NOT NULL DEFAULT '[]'::jsonb,
    stats JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- TABLE: skills
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    display_order INTEGER NOT NULL DEFAULT 0
);

-- TABLE: projects
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    brief_detail TEXT,
    tags TEXT[] NOT NULL DEFAULT '{}',
    image_url TEXT,
    project_url TEXT DEFAULT '#',
    github_url TEXT DEFAULT '#',
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- TABLE: certifications
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    date_issued TEXT,
    description TEXT,
    image_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0
);

-- TABLE: experience
CREATE TABLE IF NOT EXISTS public.experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL DEFAULT 'Present',
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0
);

-- TABLE: links
CREATE TABLE IF NOT EXISTS public.links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    icon_name TEXT,
    display_order INTEGER NOT NULL DEFAULT 0
);

-- ==============================================================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS) & CONFIGURE POLICIES
-- ==============================================================================

-- Enable RLS on all 6 tables
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- ── Policies for 'profile' ──
DROP POLICY IF EXISTS "Public profile read access" ON public.profile;
CREATE POLICY "Public profile read access"
    ON public.profile FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated profile insert" ON public.profile;
CREATE POLICY "Authenticated profile insert"
    ON public.profile FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated profile update" ON public.profile;
CREATE POLICY "Authenticated profile update"
    ON public.profile FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated profile delete" ON public.profile;
CREATE POLICY "Authenticated profile delete"
    ON public.profile FOR DELETE
    TO authenticated
    USING (true);

-- ── Policies for 'skills' ──
DROP POLICY IF EXISTS "Public skills read access" ON public.skills;
CREATE POLICY "Public skills read access"
    ON public.skills FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated skills insert" ON public.skills;
CREATE POLICY "Authenticated skills insert"
    ON public.skills FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated skills update" ON public.skills;
CREATE POLICY "Authenticated skills update"
    ON public.skills FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated skills delete" ON public.skills;
CREATE POLICY "Authenticated skills delete"
    ON public.skills FOR DELETE
    TO authenticated
    USING (true);

-- ── Policies for 'projects' ──
DROP POLICY IF EXISTS "Public projects read access" ON public.projects;
CREATE POLICY "Public projects read access"
    ON public.projects FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated projects insert" ON public.projects;
CREATE POLICY "Authenticated projects insert"
    ON public.projects FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated projects update" ON public.projects;
CREATE POLICY "Authenticated projects update"
    ON public.projects FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated projects delete" ON public.projects;
CREATE POLICY "Authenticated projects delete"
    ON public.projects FOR DELETE
    TO authenticated
    USING (true);

-- ── Policies for 'certifications' ──
DROP POLICY IF EXISTS "Public certifications read access" ON public.certifications;
CREATE POLICY "Public certifications read access"
    ON public.certifications FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated certifications insert" ON public.certifications;
CREATE POLICY "Authenticated certifications insert"
    ON public.certifications FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated certifications update" ON public.certifications;
CREATE POLICY "Authenticated certifications update"
    ON public.certifications FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated certifications delete" ON public.certifications;
CREATE POLICY "Authenticated certifications delete"
    ON public.certifications FOR DELETE
    TO authenticated
    USING (true);

-- ── Policies for 'experience' ──
DROP POLICY IF EXISTS "Public experience read access" ON public.experience;
CREATE POLICY "Public experience read access"
    ON public.experience FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated experience insert" ON public.experience;
CREATE POLICY "Authenticated experience insert"
    ON public.experience FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated experience update" ON public.experience;
CREATE POLICY "Authenticated experience update"
    ON public.experience FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated experience delete" ON public.experience;
CREATE POLICY "Authenticated experience delete"
    ON public.experience FOR DELETE
    TO authenticated
    USING (true);

-- ── Policies for 'links' ──
DROP POLICY IF EXISTS "Public links read access" ON public.links;
CREATE POLICY "Public links read access"
    ON public.links FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated links insert" ON public.links;
CREATE POLICY "Authenticated links insert"
    ON public.links FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated links update" ON public.links;
CREATE POLICY "Authenticated links update"
    ON public.links FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated links delete" ON public.links;
CREATE POLICY "Authenticated links delete"
    ON public.links FOR DELETE
    TO authenticated
    USING (true);

-- ==============================================================================
-- 4. CONFIGURE SUPABASE STORAGE BUCKET & POLICIES
-- ==============================================================================

-- Create bucket 'portfolio-media' if it does not exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'portfolio-media',
    'portfolio-media',
    true,
    52428800, -- 50 MB
    ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS: Public Read Access
DROP POLICY IF EXISTS "Public Media Read" ON storage.objects;
CREATE POLICY "Public Media Read"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'portfolio-media');

-- Storage RLS: Authenticated Upload Access
DROP POLICY IF EXISTS "Authenticated Media Upload" ON storage.objects;
CREATE POLICY "Authenticated Media Upload"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'portfolio-media');

-- Storage RLS: Authenticated Update Access
DROP POLICY IF EXISTS "Authenticated Media Update" ON storage.objects;
CREATE POLICY "Authenticated Media Update"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'portfolio-media')
    WITH CHECK (bucket_id = 'portfolio-media');

-- Storage RLS: Authenticated Delete Access
DROP POLICY IF EXISTS "Authenticated Media Delete" ON storage.objects;
CREATE POLICY "Authenticated Media Delete"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'portfolio-media');

-- ==============================================================================
-- 5. SEED INITIAL PORTFOLIO DATA
-- ==============================================================================

-- Clean previous seed entries to prevent duplicate rows
TRUNCATE TABLE public.profile, public.skills, public.projects, public.certifications, public.experience, public.links;

-- ── 5.1 SEED: profile ──
INSERT INTO public.profile (name, title, bio, hero_headlines, stats)
VALUES (
    'Your Name',
    'Creative Developer & AI/Vision Engineer',
    'I''m a creative developer with a deep passion for crafting digital experiences that merge cutting-edge technology with thoughtful design. With expertise spanning full-stack development, AI/ML, and cloud infrastructure, I build systems that scale. My approach combines clean code architecture with a keen eye for user experience, ensuring every project not only works flawlessly but feels intuitive and polished.',
    '[
        {
            "eyebrow": "Hi, I''m Your Name",
            "lines": ["Creative", "Developer"],
            "fontSize": "text-5xl sm:text-6xl md:text-7xl lg:text-[4.75rem] xl:text-[5.75rem] 2xl:text-[6.5rem]",
            "lineHeight": "leading-[0.92]",
            "tagline": "// Turning Ideas Into Reality",
            "desc": "Available for hire. Building fast, responsive web applications using modern tech stacks."
        },
        {
            "eyebrow": "Systems & Architecture",
            "lines": ["Scalable", "Systems"],
            "fontSize": "text-5xl sm:text-6xl md:text-7xl lg:text-[4.75rem] xl:text-[5.75rem] 2xl:text-[6.5rem]",
            "lineHeight": "leading-[0.92]",
            "tagline": "// High-Performance Engineering",
            "desc": "Designing robust data pipelines, scalable cloud infrastructure, and low-latency systems."
        },
        {
            "eyebrow": "Intelligent Interfaces",
            "lines": ["AI &", "Vision", "Engineer"],
            "fontSize": "text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.75rem] 2xl:text-[5.5rem]",
            "lineHeight": "leading-[0.95]",
            "tagline": "// Next-Gen AI Applications",
            "desc": "Integrating state-of-the-art vision models and generative AI into fluid web experiences."
        }
    ]'::jsonb,
    '{
        "years_experience": "5+",
        "projects_completed": "50+",
        "happy_clients": "30+",
        "certifications_count": "10+"
    }'::jsonb
);

-- ── 5.2 SEED: skills ──
INSERT INTO public.skills (name, category, display_order)
VALUES
    ('Generative AI', 'AI & Machine Learning', 1),
    ('LLMs', 'AI & Machine Learning', 2),
    ('Computer Vision', 'AI & Machine Learning', 3),
    ('Prompt Engineering', 'AI & Machine Learning', 4),
    ('Machine Learning', 'AI & Machine Learning', 5),
    ('NLP', 'AI & Machine Learning', 6),
    ('Deep Learning', 'AI & Machine Learning', 7),
    ('Data Science', 'Data & Analytics', 8),
    ('Neural Networks', 'AI & Machine Learning', 9),
    ('Model Fine-Tuning', 'AI & Machine Learning', 10),
    ('RAG Systems', 'AI & Machine Learning', 11),
    ('Vector Databases', 'Databases & Storage', 12);

-- ── 5.3 SEED: projects ──
INSERT INTO public.projects (title, description, brief_detail, tags, project_url, github_url, display_order)
VALUES
    (
        'AI Content Generator',
        'An AI-powered content generation platform with natural language processing capabilities.',
        'Next-generation generative text platform with automated multi-modal drafting, tone calibration, and real-time streaming inference.',
        ARRAY['Next.js', 'OpenAI', 'Tailwind'],
        '#',
        'https://github.com/vedabrands/portfolio',
        1
    ),
    (
        'E-Commerce Dashboard',
        'Real-time analytics dashboard for e-commerce metrics and insights.',
        'High-throughput telemetry and transaction stream visualization platform powered by D3.js and WebSockets.',
        ARRAY['React', 'D3.js', 'Node.js'],
        '#',
        'https://github.com/vedabrands/portfolio',
        2
    ),
    (
        'Smart Home IoT',
        'IoT dashboard for monitoring and controlling smart home devices.',
        'Low-latency MQTT broker integration with interactive 3D floorplan telemetry and anomaly detection.',
        ARRAY['React', 'MQTT', 'Python'],
        '#',
        'https://github.com/vedabrands/portfolio',
        3
    ),
    (
        'Portfolio CMS',
        'Headless CMS-powered portfolio with dynamic content management.',
        'Dynamic headless content distribution network with live preview rendering and instant edge synchronization.',
        ARRAY['Next.js', 'Sanity', 'Vercel'],
        '#',
        'https://github.com/vedabrands/portfolio',
        4
    );

-- ── 5.4 SEED: certifications ──
INSERT INTO public.certifications (title, issuer, date_issued, description, image_url, display_order)
VALUES
    (
        'AWS Certified Solutions Architect',
        'Amazon Web Services',
        '2024',
        'Design resilient, high-performing, secure, and cost-optimized cloud architectures on AWS.',
        NULL,
        1
    ),
    (
        'Google Cloud Professional',
        'Google Cloud',
        '2024',
        'Architect and manage robust, secure, scalable, highly available, and dynamic GCP solutions.',
        NULL,
        2
    ),
    (
        'TensorFlow Developer Certificate',
        'Google',
        '2023',
        'Deep learning, convolutional neural networks, natural language processing, and sequence models in TensorFlow.',
        NULL,
        3
    ),
    (
        'Meta Frontend Developer',
        'Meta',
        '2023',
        'Comprehensive React frontend engineering, UX architecture, and modern web application development.',
        NULL,
        4
    ),
    (
        'Azure AI Fundamentals',
        'Microsoft',
        '2023',
        'Fundamental concepts of artificial intelligence and machine learning workloads on Azure.',
        NULL,
        5
    );

-- ── 5.5 SEED: experience ──
INSERT INTO public.experience (role, company, start_date, end_date, description, display_order)
VALUES
    (
        'Senior Full-Stack & AI Engineer',
        'Veda Brands',
        '2023',
        'Present',
        'Architecting generative AI interfaces, scalable full-stack web applications, and real-time data pipelines.',
        1
    ),
    (
        'Lead Frontend Engineer',
        'Tech Innovations',
        '2021',
        '2023',
        'Led design systems, interactive 3D web visualizations, and optimized performance across distributed apps.',
        2
    ),
    (
        'Software Engineer',
        'Cloud Matrix',
        '2019',
        '2021',
        'Developed scalable REST APIs, microservices, and automated CI/CD deployment pipelines.',
        3
    );

-- ── 5.6 SEED: links ──
INSERT INTO public.links (label, url, icon_name, display_order)
VALUES
    ('Email', 'mailto:unifiedram@gmail.com', 'mail', 1),
    ('GitHub', 'https://github.com/vedabrands/portfolio', 'github', 2),
    ('LinkedIn', 'https://linkedin.com', 'linkedin', 3),
    ('Twitter', 'https://twitter.com', 'twitter', 4),
    ('Home', '#hero', 'nav', 5),
    ('About', '#about', 'nav', 6),
    ('Expertise', '#expertise', 'nav', 7),
    ('Skills', '#skills', 'nav', 8),
    ('Projects', '#projects', 'nav', 9),
    ('Certifications', '#certifications', 'nav', 10),
    ('Contact', '#contact', 'nav', 11);
