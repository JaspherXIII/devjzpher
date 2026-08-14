import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import {
    Github,
    Linkedin,
    ExternalLink,
    Send,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ArrowUpRight,
    Activity,
    BadgeCheck,
    Mail,
    Server,
    Shield,
    Maximize2,
    X
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

// Skill Schema
interface Skill {
    name: string;
    logoUrl?: string;
    customSvg?: React.ReactNode;
    glowClass: string;
}

// Project Schema
interface Project {
    id: string;
    title: string;
    objective: string;
    walkthrough: string;
    images: Array<{
        src: string;
        alt: string;
    }>;
    categories: string[];
    github?: string;
    demo?: string;
    rarity: string;
    scope: string;
    completion: string;
}

const SECTION_ORDER = ['01', '02', '03', '04'];
const PROJECTS_PER_PAGE = 3;
const SECTION_SLUGS: Record<string, string> = {
    '01': 'projects',
    '02': 'skills',
    '03': 'experience',
    '04': 'credentials',
};

export default function Welcome() {
    const [activeSection, setActiveSection] = useState('01');
    const [previousSection, setPreviousSection] = useState<string | null>(null);
    const [sectionDirection, setSectionDirection] = useState<'next' | 'previous'>('next');
    const [openProject, setOpenProject] = useState<string | null>('tapat');
    const [selectedProjectCategory, setSelectedProjectCategory] = useState('All');
    const [currentProjectPage, setCurrentProjectPage] = useState(1);
    const [projectImageIndexes, setProjectImageIndexes] = useState<Record<string, number>>({});
    const [lightbox, setLightbox] = useState<{ projectId: string; imageIndex: number } | null>(null);

    // Appearance State Integration (Observer)
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));

        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    // Section Refs for Scroll Spy
    const section1Ref = useRef<HTMLDivElement>(null);
    const section2Ref = useRef<HTMLDivElement>(null);
    const section4Ref = useRef<HTMLDivElement>(null);
    const section5Ref = useRef<HTMLDivElement>(null);
    const sectionTransitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Scroll Spy
    useEffect(() => {
        const refs = [section1Ref, section2Ref, section4Ref, section5Ref];
        let animationFrame: number | null = null;

        const updateActiveSection = () => {
            animationFrame = null;

            if (window.matchMedia('(min-width: 1024px)').matches) {
                return;
            }

            const activationLine = window.innerHeight * 0.25;
            let nextSection = '01';

            refs.forEach((ref) => {
                const section = ref.current;

                if (section && section.getBoundingClientRect().top <= activationLine) {
                    nextSection = section.dataset.sectionId ?? nextSection;
                }
            });

            setActiveSection((currentSection) => currentSection === nextSection ? currentSection : nextSection);
        };

        const scheduleUpdate = () => {
            if (animationFrame === null) {
                animationFrame = window.requestAnimationFrame(updateActiveSection);
            }
        };

        updateActiveSection();
        window.addEventListener('scroll', scheduleUpdate, { passive: true });
        window.addEventListener('resize', scheduleUpdate);

        return () => {
            window.removeEventListener('scroll', scheduleUpdate);
            window.removeEventListener('resize', scheduleUpdate);

            if (animationFrame !== null) {
                window.cancelAnimationFrame(animationFrame);
            }
        };
    }, []);

    useEffect(() => () => {
        if (sectionTransitionTimer.current) {
            clearTimeout(sectionTransitionTimer.current);
        }
    }, []);

    // Selected work from professional, capstone, and community projects
    const projects: Project[] = [
        {
            id: 'tapat',
            title: 'Project TAPAT (Tricycle Accountability, Passenger Assistance, and Traceability)',
            objective: 'Improve passenger safety, monitoring, and traceability for tricycle transportation in Santiago City.',
            walkthrough: 'Developed a QR code-based feedback and tracking system with real-time reporting, driver violation monitoring, license-status tracking, maps, and accountability features for tricycle owners and operators.',
            images: [
                {
                    src: '/images/projects/project%20tapat/3.png',
                    alt: 'Project TAPAT public website home page'
                },
                {
                    src: '/images/projects/project%20tapat/4.png',
                    alt: 'Project TAPAT public information and mission page'
                },
                {
                    src: '/images/projects/project%20tapat/5.png',
                    alt: 'Project TAPAT data subject rights request form'
                },
                {
                    src: '/images/projects/project%20tapat/6.png',
                    alt: 'Project TAPAT account sign-in screen'
                },
                {
                    src: '/images/projects/project%20tapat/7.png',
                    alt: 'Project TAPAT live dispatch and coverage map'
                },
                {
                    src: '/images/projects/project%20tapat/8.png',
                    alt: 'Project TAPAT owner and operator registration screen'
                }
            ],
            categories: ['Web Systems'],
            rarity: 'Community Project',
            scope: 'Santiago City',
            completion: 'Completed'
        },
        {
            id: 'nc-website',
            title: 'Northeastern College Website',
            objective: 'Provide Northeastern College with a modern, accessible website for institutional information, academic programs, admissions, research, sustainability, careers, and student services.',
            walkthrough: 'Built and maintained the public-facing college website and its administration portal, including institutional content management, career opportunities, analytics, support messages, news, events, research, and sustainability pages.',
            images: [
                {
                    src: '/images/projects/nc%20web/3.png',
                    alt: 'Northeastern College website home page'
                },
                {
                    src: '/images/projects/nc%20web/4.png',
                    alt: 'Northeastern College career opportunities page'
                },
                {
                    src: '/images/projects/nc%20web/5.png',
                    alt: 'Northeastern College website administration dashboard'
                },
                {
                    src: '/images/projects/nc%20web/6.png',
                    alt: 'Northeastern College sustainable development goals page'
                },
                {
                    src: '/images/projects/nc%20web/7.png',
                    alt: 'Northeastern College academic institute page'
                },
                {
                    src: '/images/projects/nc%20web/8.png',
                    alt: 'Northeastern College AI assistant embedded on the website'
                }
            ],
            categories: ['Websites'],
            demo: 'https://www.northeasterncollege.edu.ph/',
            rarity: 'Professional Work',
            scope: 'Northeastern College',
            completion: 'Live'
        },
        {
            id: 'nc-connect',
            title: 'NC Connect',
            objective: 'Bring Northeastern College website content and campus services into a convenient mobile experience.',
            walkthrough: 'Developed the mobile app companion to the Northeastern College website, providing access to campus portals, Navia, college news, events, updates, institutional information, contacts, feedback, notifications, and an integrated NC AI chat experience.',
            images: [
                {
                    src: '/images/projects/nc%20connect/1.png',
                    alt: 'NC Connect mobile app screens for home, events, AI chat, updates, and college information'
                }
            ],
            categories: ['Mobile Apps'],
            rarity: 'Professional Work',
            scope: 'Northeastern College',
            completion: 'Completed'
        },
        {
            id: 'nfc-bridge',
            title: 'NFC Bridge — USB & API',
            objective: 'Provide developers, system integrators, and businesses with a fast, lightweight way to connect NFC scans to their existing systems.',
            walkthrough: 'Developed a mobile NFC UID scanning tool that reads tag UIDs instantly and sends them directly to a backend API or to a connected PC through ADB in USB Connector mode. The app stores no scan data and acts only as a secure bridge between the NFC device and the receiving system.',
            images: [
                {
                    src: '/images/projects/nfc%20bridge/1.png',
                    alt: 'NFC Bridge mobile app showing Online API and USB Connector modes'
                }
            ],
            categories: ['Mobile Apps'],
            rarity: 'Developer Utility',
            scope: 'Independent Project',
            completion: 'Completed'
        },
        {
            id: 'navia',
            title: 'NC Virtual Assistant — Navia',
            objective: 'Help students and visitors quickly find Northeastern College programs, admission requirements, offices, and campus information through an interactive virtual assistant.',
            walkthrough: 'Developed a bilingual kiosk-style virtual assistant featuring an animated guide, conversational prompts, guided topic cards, course information, and visual directions to campus offices.',
            images: [
                {
                    src: '/images/projects/navia/3.png',
                    alt: 'Navia virtual assistant welcome screen'
                },
                {
                    src: '/images/projects/navia/4.png',
                    alt: 'Navia course offerings guided conversation'
                },
                {
                    src: '/images/projects/navia/5.png',
                    alt: 'Navia campus office location guidance'
                }
            ],
            categories: ['Web Systems'],
            demo: 'https://virtual-assistant.northeasterncollege.edu.ph/kiosk',
            rarity: 'Professional Work',
            scope: 'Northeastern College',
            completion: 'Live'
        },
        {
            id: 'skchecklist',
            title: 'SK Checklist',
            objective: 'Support transparent, accountable governance and organized project management for the Sangguniang Kabataan of Barangay San Isidro.',
            walkthrough: 'Created a management dashboard for youth records, point rankings and history, projects, events and attendance, notifications, picture galleries, account settings, and editable website content.',
            images: [
                {
                    src: '/images/projects/sk%20checklist/3.png',
                    alt: 'SK Checklist administrator dashboard'
                },
                {
                    src: '/images/projects/sk%20checklist/4.png',
                    alt: 'SK Checklist general settings screen'
                },
                {
                    src: '/images/projects/sk%20checklist/5.png',
                    alt: 'SK Checklist event creation form'
                },
                {
                    src: '/images/projects/sk%20checklist/6.png',
                    alt: 'SK Checklist notifications screen'
                },
                {
                    src: '/images/projects/sk%20checklist/7.png',
                    alt: 'SK Checklist youth account settings screen'
                },
                {
                    src: '/images/projects/sk%20checklist/8.png',
                    alt: 'SK Checklist youth dashboard and calendar'
                }
            ],
            categories: ['Web Systems'],
            rarity: 'Community Project',
            scope: 'SK Barangay San Isidro',
            completion: 'Completed'
        },
        {
            id: 'shapi',
            title: 'Shapi — E-commerce Platform',
            objective: 'Develop a commission-based e-commerce platform that earns a commission whenever a seller completes a product sale.',
            walkthrough: 'Contributed to this project during my OJT at Brain Network Japan, implementing product management, seller earnings and commission tracking, shipping workflows, chat, real-time notifications, and customizable interface colors.',
            images: [
                {
                    src: '/images/projects/shapi/3.png',
                    alt: 'Shapi administrator dashboard and interface settings'
                },
                {
                    src: '/images/projects/shapi/4.png',
                    alt: 'Shapi real-time chat screen'
                },
                {
                    src: '/images/projects/shapi/5.png',
                    alt: 'Shapi product management and notifications screen'
                },
                {
                    src: '/images/projects/shapi/6.png',
                    alt: 'Shapi commission management screen'
                },
                {
                    src: '/images/projects/shapi/7.png',
                    alt: 'Shapi seller dashboard and earnings overview'
                },
                {
                    src: '/images/projects/shapi/8.png',
                    alt: 'Shapi seller shop details and product listing'
                },
                {
                    src: '/images/projects/shapi/9.png',
                    alt: 'Shapi seller earnings and withdrawal screen'
                },
                {
                    src: '/images/projects/shapi/10.png',
                    alt: 'Shapi shipping management screen'
                }
            ],
            categories: ['Web Systems'],
            rarity: 'Professional Work',
            scope: 'Brain Network Japan — OJT',
            completion: 'Unfinished prototype'
        },
        {
            id: 'rsbsa',
            title: 'RSBSA Agriculture Resource Management System — Capstone',
            objective: 'Improve the fair allocation and tracking of agricultural resources for the farming community of San Isidro.',
            walkthrough: 'Built a web-based system for managing farmer records, allocating assistance and subsidies, generating reports and analytics, and mapping farmland through a geographic information system.',
            images: [
                {
                    src: '/images/projects/rsbsa/2.png',
                    alt: 'RSBSA administrator dashboard'
                },
                {
                    src: '/images/projects/rsbsa/3.png',
                    alt: 'RSBSA seed subsidy allocation screen'
                },
                {
                    src: '/images/projects/rsbsa/4.png',
                    alt: 'RSBSA farmer profiles and analytics screen'
                },
                {
                    src: '/images/projects/rsbsa/5.png',
                    alt: 'RSBSA geographic information system mapping screen'
                },
                {
                    src: '/images/projects/rsbsa/6.png',
                    alt: 'RSBSA farmer dashboard and farm map'
                },
                {
                    src: '/images/projects/rsbsa/7.png',
                    alt: 'RSBSA farmland management screen'
                }
            ],
            categories: ['Web Systems'],
            rarity: 'Capstone Project',
            scope: 'Municipality of San Isidro',
            completion: 'Completed'
        }
    ];

    const projectCategories = ['All', 'Web Systems', 'Websites', 'Mobile Apps'];
    const filteredProjects = selectedProjectCategory === 'All'
        ? projects
        : projects.filter((project) => project.categories.includes(selectedProjectCategory));
    const projectPageCount = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
    const projectPageStart = (currentProjectPage - 1) * PROJECTS_PER_PAGE;
    const visibleProjects = filteredProjects.slice(projectPageStart, projectPageStart + PROJECTS_PER_PAGE);

    const changeProjectPage = (page: number) => {
        setCurrentProjectPage(page);
        setOpenProject(null);

        window.requestAnimationFrame(() => {
            if (window.matchMedia('(min-width: 1024px)').matches) {
                section1Ref.current?.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                section1Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    };

    const lightboxProject = lightbox ? projects.find((project) => project.id === lightbox.projectId) : undefined;
    const lightboxImage = lightboxProject && lightbox ? lightboxProject.images[lightbox.imageIndex] : undefined;

    const moveProjectImage = (project: Project, direction: number) => {
        setProjectImageIndexes((current) => {
            const currentIndex = current[project.id] ?? 0;
            const nextIndex = (currentIndex + direction + project.images.length) % project.images.length;

            return { ...current, [project.id]: nextIndex };
        });
    };

    const moveLightboxImage = (direction: number) => {
        if (!lightbox || !lightboxProject) return;

        const nextIndex = (lightbox.imageIndex + direction + lightboxProject.images.length) % lightboxProject.images.length;
        setLightbox({ ...lightbox, imageIndex: nextIndex });
        setProjectImageIndexes((indexes) => ({ ...indexes, [lightboxProject.id]: nextIndex }));
    };

    useEffect(() => {
        if (!lightbox) return;

        const originalOverflow = document.body.style.overflow;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setLightbox(null);
            if (event.key === 'ArrowLeft') moveLightboxImage(-1);
            if (event.key === 'ArrowRight') moveLightboxImage(1);
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    });

    // Technical Stack (Updated with 24 skills, CDN references, and custom SVGs)
    const skills: Skill[] = [
        { 
            name: 'HTML5', 
            logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', 
            glowClass: 'hover:border-[#E34F26]/40 hover:shadow-[0_0_20px_rgba(227,79,38,0.15)]' 
        },
        { 
            name: 'CSS3', 
            logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', 
            glowClass: 'hover:border-[#1572B6]/40 hover:shadow-[0_0_20px_rgba(21,114,182,0.15)]' 
        },
        { 
            name: 'JavaScript', 
            logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', 
            glowClass: 'hover:border-[#F7DF1E]/40 hover:shadow-[0_0_20px_rgba(247,223,30,0.15)]' 
        },
        { 
            name: 'Bootstrap', 
            logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg', 
            glowClass: 'hover:border-[#7952B3]/40 hover:shadow-[0_0_20px_rgba(121,82,179,0.15)]' 
        },
        { 
            name: 'Tailwind', 
            logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg', 
            glowClass: 'hover:border-[#38BDF8]/40 hover:shadow-[0_0_20px_rgba(56,189,248,0.15)]' 
        },
        { 
            name: 'PHP', 
            logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg', 
            glowClass: 'hover:border-[#777BB4]/40 hover:shadow-[0_0_20px_rgba(119,123,180,0.15)]' 
        },
        { 
            name: 'CakePHP', 
            logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cakephp/cakephp-original.svg', 
            glowClass: 'hover:border-[#D33C43]/40 hover:shadow-[0_0_20px_rgba(211,60,67,0.15)]' 
        },
        { 
            name: 'Laravel', 
            logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg', 
            glowClass: 'hover:border-[#FF2D20]/40 hover:shadow-[0_0_20px_rgba(255,45,32,0.15)]' 
        },
        { 
            name: 'Blade', 
            customSvg: (
                <svg className="h-6 w-6 text-[#FF2D20]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M21 9H3" />
                    <path d="M9 21V9" />
                    <path d="M12 14l2 2-2 2" />
                </svg>
            ), 
            glowClass: 'hover:border-[#FF2D20]/40 hover:shadow-[0_0_20px_rgba(255,45,32,0.15)]' 
        },
        { 
            name: 'React', 
            logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', 
            glowClass: 'hover:border-[#61DAFB]/40 hover:shadow-[0_0_20px_rgba(97,218,251,0.15)]' 
        },
        { 
            name: 'Inertia', 
            customSvg: (
                <svg className="h-6 w-6 text-[#9553e6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 17l5-5-5-5" />
                    <path d="M11 17l5-5-5-5" />
                    <path d="M17 17l5-5-5-5" />
                </svg>
            ), 
            glowClass: 'hover:border-[#9553e6]/40 hover:shadow-[0_0_20px_rgba(149,83,230,0.15)]' 
        },
        { 
            name: 'JSON', 
            logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/json/json-original.svg', 
            glowClass: 'hover:border-slate-500/40 hover:shadow-[0_0_20px_rgba(100,100,100,0.15)]' 
        },
        { 
            name: 'Dart', 
            logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg', 
            glowClass: 'hover:border-[#00B4AB]/40 hover:shadow-[0_0_20px_rgba(0,180,171,0.15)]' 
        },
        { 
            name: 'Flutter', 
            logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg', 
            glowClass: 'hover:border-[#02569B]/40 hover:shadow-[0_0_20px_rgba(2,86,155,0.15)]' 
        },
        { 
            name: 'MySQL', 
            logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', 
            glowClass: 'hover:border-[#00758F]/40 hover:shadow-[0_0_20px_rgba(0,117,143,0.15)]' 
        },
        { 
            name: 'Supabase', 
            customSvg: (
                <svg className="h-6 w-6 text-[#3ECF8E]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.352 14.585l-7.79 6.273a.855.855 0 01-1.391-.659V10.155a.855.855 0 01.855-.855h5.457l-.872-4.887a.855.855 0 011.391-.659l7.79 6.273a.855.855 0 011.391.659v10.044a.855.855 0 01-.855.855H13.88l-.528-6.002z" />
                </svg>
            ), 
            glowClass: 'hover:border-[#3ECF8E]/40 hover:shadow-[0_0_20px_rgba(62,207,142,0.15)]' 
        },
        { 
            name: 'Firebase', 
            logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg', 
            glowClass: 'hover:border-[#FFCA28]/40 hover:shadow-[0_0_20px_rgba(255,202,40,0.15)]' 
        },
        { 
            name: 'React Native', 
            logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', 
            glowClass: 'hover:border-[#05A5D1]/40 hover:shadow-[0_0_20px_rgba(5,165,209,0.15)]' 
        },
        { 
            name: 'Git', 
            logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', 
            glowClass: 'hover:border-[#F05032]/40 hover:shadow-[0_0_20px_rgba(240,80,50,0.15)]' 
        },
        { 
            name: 'GitLab', 
            logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg', 
            glowClass: 'hover:border-[#FC6D26]/40 hover:shadow-[0_0_20px_rgba(252,109,38,0.15)]' 
        },
        { 
            name: 'GitHub', 
            logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', 
            glowClass: 'hover:border-slate-500/40 hover:shadow-[0_0_20px_rgba(100,100,100,0.15)]' 
        },
        { 
            name: 'Python', 
            logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', 
            glowClass: 'hover:border-[#3776AB]/40 hover:shadow-[0_0_20px_rgba(55,118,171,0.15)]' 
        },
        { 
            name: 'C++', 
            logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', 
            glowClass: 'hover:border-[#00599C]/40 hover:shadow-[0_0_20px_rgba(0,89,156,0.15)]' 
        },
        { 
            name: 'VB.NET', 
            logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg', 
            glowClass: 'hover:border-[#1486CD]/40 hover:shadow-[0_0_20px_rgba(20,134,205,0.15)]' 
        }
    ];

    // Color schema variables matching selected theme and mode
    const themeStyles = {
        bg: isDark ? 'bg-[#05070a]' : 'bg-[#f8fafc]',
        text: isDark ? 'text-slate-400' : 'text-slate-605',
        textHeading: isDark ? 'text-white' : 'text-slate-900',
        border: isDark ? 'border-white/[0.04]' : 'border-slate-200/80',
        borderHover: isDark 
            ? 'hover:border-indigo-500/20 hover:shadow-[0_8px_30px_rgba(99,102,241,0.02)]' 
            : 'hover:border-indigo-500/30 hover:shadow-[0_8px_30px_rgba(99,102,241,0.04)]',
        accentText: 'text-indigo-650 dark:text-indigo-400',
        activeLine: 'bg-indigo-600 dark:bg-indigo-500',
        activeIndicator: 'border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400',
        githubChartUrl: isDark 
            ? 'https://ghchart.rshah.org/6366f1/JaspherXIII' 
            : 'https://ghchart.rshah.org/4f46e5/JaspherXIII',
        dot: 'bg-indigo-600 dark:bg-indigo-500',
        cardBg: isDark ? 'bg-white/[0.015]' : 'bg-white',
        rowHover: isDark ? 'bg-white/[0.03]' : 'bg-slate-50',
        rowBg: isDark ? 'bg-black/20' : 'bg-slate-50/50',
        inputBg: isDark ? 'bg-black/40' : 'bg-slate-50',
        inputText: isDark ? 'text-white' : 'text-slate-900',
        divider: isDark ? 'border-white/[0.04]' : 'border-slate-100',
        subDivider: isDark ? 'border-white/[0.03]' : 'border-slate-200/60',
        inputBorder: isDark ? 'border-white/10 focus:border-white' : 'border-slate-200 focus:border-slate-900',
        btnMain: isDark ? 'bg-white text-black hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800',
        btnSub: isDark ? 'bg-white/[0.015] border-white/[0.04] text-white hover:bg-white/[0.03]' : 'bg-white border-slate-250 text-slate-900 hover:bg-slate-50',
        subcardBg: isDark ? 'bg-black/25 border-white/[0.03]' : 'bg-slate-50/50 border-slate-200/50',
        cardTitle: isDark ? 'text-white' : 'text-slate-800'
    };

    const showSection = (sectionId: string, direction?: 'next' | 'previous') => {
        if (sectionId === activeSection || previousSection !== null) {
            return;
        }

        if (sectionTransitionTimer.current) {
            clearTimeout(sectionTransitionTimer.current);
        }

        const resolvedDirection = direction ?? (
            SECTION_ORDER.indexOf(sectionId) > SECTION_ORDER.indexOf(activeSection) ? 'next' : 'previous'
        );

        setPreviousSection(activeSection);
        setSectionDirection(resolvedDirection);
        setActiveSection(sectionId);
        sectionTransitionTimer.current = setTimeout(() => {
            setPreviousSection(null);
            sectionTransitionTimer.current = null;
        }, 440);
    };

    const navigateToSection = (sectionId: string, direction?: 'next' | 'previous') => {
        if (window.matchMedia('(min-width: 1024px)').matches) {
            showSection(sectionId, direction);
            return;
        }

        const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
            '01': section1Ref,
            '02': section2Ref,
            '03': section4Ref,
            '04': section5Ref,
        };

        setActiveSection(sectionId);
        refs[sectionId]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const showNextSection = () => {
        const currentIndex = SECTION_ORDER.indexOf(activeSection);
        navigateToSection(SECTION_ORDER[(currentIndex + 1) % SECTION_ORDER.length], 'next');
    };

    const showPreviousSection = () => {
        const currentIndex = SECTION_ORDER.indexOf(activeSection);
        navigateToSection(SECTION_ORDER[(currentIndex - 1 + SECTION_ORDER.length) % SECTION_ORDER.length], 'previous');
    };

    useEffect(() => {
        const sectionFromHash = Object.entries(SECTION_SLUGS).find(([, slug]) => `#${slug}` === window.location.hash)?.[0];

        if (!sectionFromHash) return;

        setActiveSection(sectionFromHash);

        if (!window.matchMedia('(min-width: 1024px)').matches) {
            window.requestAnimationFrame(() => {
                const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
                    '01': section1Ref,
                    '02': section2Ref,
                    '03': section4Ref,
                    '04': section5Ref,
                };
                refs[sectionFromHash]?.current?.scrollIntoView({ block: 'start' });
            });
        }
    }, []);

    useEffect(() => {
        const slug = SECTION_SLUGS[activeSection];

        if (slug && window.location.hash !== `#${slug}`) {
            window.history.replaceState(null, '', `#${slug}`);
        }
    }, [activeSection]);

    useEffect(() => {
        const handleSectionKeys = (event: KeyboardEvent) => {
            if (!window.matchMedia('(min-width: 1024px)').matches || previousSection !== null) return;

            const target = event.target as HTMLElement | null;
            if (target?.matches('input, textarea, select, button, a, [contenteditable="true"]')) return;

            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                event.preventDefault();
                showNextSection();
            }

            if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                event.preventDefault();
                showPreviousSection();
            }
        };

        window.addEventListener('keydown', handleSectionKeys);
        return () => window.removeEventListener('keydown', handleSectionKeys);
    });

    const sectionPanelClasses = (sectionId: string) => {
        let animationClass = 'section-panel--idle';

        if (sectionId === activeSection) {
            animationClass = previousSection
                ? `section-panel--enter-${sectionDirection}`
                : 'section-panel--active';
        } else if (sectionId === previousSection) {
            animationClass = `section-panel--exit-${sectionDirection}`;
        }

        return `scroll-mt-16 section-panel custom-scroll ${animationClass}`;
    };

    return (
        <>
            <style>{`
                .sans-font {
                    font-family: 'Instrument Sans', sans-serif;
                }
                .title-font {
                    font-family: 'Outfit', sans-serif;
                }
                
                /* Custom scrollbars */
                .custom-scroll::-webkit-scrollbar {
                    width: 4px;
                    height: 4px;
                }
                .custom-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scroll::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 2px;
                }
                .custom-scroll::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }

                @keyframes section-shared-axis-in-next {
                    from {
                        opacity: 0;
                        filter: blur(2px);
                        transform: translate3d(0, 3.5rem, 0) scale(0.985);
                    }
                    to {
                        opacity: 1;
                        filter: blur(0);
                        transform: translate3d(0, 0, 0) scale(1);
                    }
                }
                @keyframes section-shared-axis-out-next {
                    from {
                        opacity: 1;
                        filter: blur(0);
                        transform: translate3d(0, 0, 0) scale(1);
                    }
                    to {
                        opacity: 0;
                        filter: blur(2px);
                        transform: translate3d(0, -2.75rem, 0) scale(0.985);
                    }
                }
                @keyframes section-shared-axis-in-previous {
                    from {
                        opacity: 0;
                        filter: blur(2px);
                        transform: translate3d(0, -3.5rem, 0) scale(0.985);
                    }
                    to {
                        opacity: 1;
                        filter: blur(0);
                        transform: translate3d(0, 0, 0) scale(1);
                    }
                }
                @keyframes section-shared-axis-out-previous {
                    from {
                        opacity: 1;
                        filter: blur(0);
                        transform: translate3d(0, 0, 0) scale(1);
                    }
                    to {
                        opacity: 0;
                        filter: blur(2px);
                        transform: translate3d(0, 2.75rem, 0) scale(0.985);
                    }
                }

                @media (min-width: 1024px) {
                    .section-panel {
                        position: absolute;
                        inset: 0;
                        overflow-y: auto;
                        padding: 2rem 2rem 6.75rem;
                        will-change: transform, opacity, filter;
                        backface-visibility: hidden;
                    }
                    .section-panel--active {
                        z-index: 1;
                        opacity: 1;
                        filter: blur(0);
                        transform: translate3d(0, 0, 0);
                        pointer-events: auto;
                    }
                    .section-panel--idle {
                        z-index: 0;
                        opacity: 0;
                        filter: blur(0);
                        transform: translate3d(0, 0, 0);
                        pointer-events: none;
                    }
                    .section-panel--enter-next {
                        z-index: 2;
                        animation: section-shared-axis-in-next 440ms cubic-bezier(0.22, 1, 0.36, 1) both;
                        pointer-events: auto;
                    }
                    .section-panel--exit-next {
                        z-index: 1;
                        animation: section-shared-axis-out-next 440ms cubic-bezier(0.4, 0, 0.2, 1) both;
                        pointer-events: none;
                    }
                    .section-panel--enter-previous {
                        z-index: 2;
                        animation: section-shared-axis-in-previous 440ms cubic-bezier(0.22, 1, 0.36, 1) both;
                        pointer-events: auto;
                    }
                    .section-panel--exit-previous {
                        z-index: 1;
                        animation: section-shared-axis-out-previous 440ms cubic-bezier(0.4, 0, 0.2, 1) both;
                        pointer-events: none;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .section-panel--enter-next,
                    .section-panel--exit-next,
                    .section-panel--enter-previous,
                    .section-panel--exit-previous {
                        animation-duration: 1ms;
                    }
                }
            `}</style>

            {/* EDITORIAL SPLIT CONTAINER */}
            <div className={`relative isolate flex min-h-screen w-full flex-col overflow-hidden ${themeStyles.bg} ${themeStyles.text} sans-font text-[13.5px] transition-colors duration-500`}>
                <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-24 z-0 h-[32rem] w-[32rem] rounded-full bg-indigo-500/10 blur-[140px] dark:bg-indigo-500/15" />
                <div aria-hidden="true" className="pointer-events-none absolute -left-52 bottom-0 z-0 h-96 w-96 rounded-full bg-cyan-400/5 blur-[120px] dark:bg-cyan-400/[0.07]" />
                
                <div className="relative z-10 mx-auto grid w-full max-w-[1320px] flex-1 grid-cols-1 items-start gap-8 px-6 py-8 md:py-16 lg:h-screen lg:grid-cols-12 lg:gap-16 lg:px-10 lg:overflow-hidden">
                    
                    {/* LEFT PANE: Sticky Editorial Cover (lg:col-span-5) */}
                    <header className="lg:col-span-5 lg:sticky lg:top-16 flex flex-col justify-between lg:h-[82vh] space-y-8 lg:space-y-0">
                        
                        {/* Upper Header Brand & Theme Controls */}
                        <div className="flex items-center justify-between select-none">
                            <span className={`font-extrabold text-[15px] tracking-tight ${themeStyles.textHeading} title-font`}>
                                DEVJZPHER
                            </span>
                            <AppearanceToggleDropdown className="text-slate-400 shrink-0" />
                        </div>

                        {/* Mid Cover Intro - Large display typography */}
                        <div className="space-y-6">
                            {/* Profile Picture Frame */}
                            <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-100 shadow-lg shadow-black/10 dark:border-white/[0.08] dark:bg-white/[0.02] dark:shadow-black/30">
                                <img 
                                    src="/images/pic.png"
                                    alt="Mark Jaspher Juan Profile" 
                                    width="112"
                                    height="112"
                                    fetchPriority="high"
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        const parent = e.currentTarget.parentElement;
                                        if (parent) {
                                            const fallback = document.createElement('div');
                                            fallback.className = 'text-base font-extrabold text-slate-500 dark:text-slate-400';
                                            fallback.innerText = 'MJ';
                                            parent.appendChild(fallback);
                                        }
                                    }}
                                />
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                                Web System Administrator at Northeastern College
                            </div>
                            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold ${themeStyles.textHeading} tracking-tight leading-[1.08] title-font`}>
                                Mark Jaspher Juan.<br />
                                Full-stack web developer.
                            </h1>
                            <p className="text-sm max-w-sm leading-relaxed">
                                Eager to build innovative, responsive web solutions while continuously expanding front-end and back-end technical capabilities.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <a
                                    href="mailto:devjzpher@northeasterncollege.edu.ph"
                                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-indigo-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#05070a]"
                                >
                                    <Send className="h-3.5 w-3.5" />
                                    Let&apos;s work together
                                </a>
                            </div>
                        </div>

                        {/* Section index indicator - Scroll Spy mapping */}
                        <nav className="hidden lg:flex flex-col gap-3 font-mono text-[10.5px] select-none text-slate-500">
                            {[
                                { id: '01', label: 'SELECTED WORK' },
                                { id: '02', label: 'TECHNICAL SKILLS' },
                                { id: '03', label: 'EXPERIENCE & EDUCATION' },
                                { id: '04', label: 'CERTIFICATIONS & AWARDS' },

                            ].map((sec) => (
                                <button
                                    key={sec.id}
                                    type="button"
                                    onClick={() => navigateToSection(sec.id)}
                                    aria-current={activeSection === sec.id ? 'true' : undefined}
                                    className={`group flex items-center gap-3.5 rounded-lg px-2 py-1.5 text-left outline-none transition-colors ${
                                        activeSection === sec.id ? 'bg-indigo-500/10' : 'hover:bg-slate-900/5 dark:hover:bg-white/[0.03]'
                                    }`}
                                >
                                    <span className={`w-6 h-[1px] transition-all duration-300 ${
                                        activeSection === sec.id ? themeStyles.activeLine + ' w-10 shadow-[0_0_12px_rgba(99,102,241,0.9)]' : 'bg-slate-200 dark:bg-white/10 group-hover:bg-slate-400'
                                    }`} />
                                    <span className={`transition-colors duration-300 ${
                                        activeSection === sec.id ? themeStyles.textHeading + ' font-bold' : 'group-hover:text-slate-700 dark:group-hover:text-slate-300'
                                    }`}>
                                        {sec.id} // {sec.label}
                                    </span>
                                </button>
                            ))}
                        </nav>

                        {/* Social linkages */}
                        <div className={`flex flex-wrap items-center gap-4 select-none pt-4 border-t ${themeStyles.border}`}>
                            <div className="flex gap-2">
                                <a 
                                    href="https://github.com/JaspherXIII" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`flex h-8.5 w-8.5 items-center justify-center rounded-lg border ${themeStyles.border} ${themeStyles.cardBg} ${themeStyles.textHeading} shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-100/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/60 dark:hover:bg-white/[0.04]`}
                                    title="GitHub"
                                    aria-label="View GitHub profile"
                                >
                                    <Github className="h-4 w-4" />
                                </a>
                                <a 
                                    href="https://www.linkedin.com/in/mark-jaspher-juan-0a84b3321/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`flex h-8.5 w-8.5 items-center justify-center rounded-lg border ${themeStyles.border} ${themeStyles.cardBg} ${themeStyles.textHeading} shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#0a66c2]/50 hover:bg-[#0a66c2]/10 hover:text-[#0a66c2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a66c2]/60`}
                                    title="LinkedIn"
                                    aria-label="View LinkedIn profile"
                                >
                                    <Linkedin className="h-4 w-4" />
                                </a>
                                <a
                                    href="https://www.credly.com/users/mark-jaspher-juan/edit/badges/credly"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex h-8.5 w-8.5 items-center justify-center rounded-lg border ${themeStyles.border} ${themeStyles.cardBg} ${themeStyles.textHeading} shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60`}
                                    title="Credly"
                                    aria-label="View Credly badges"
                                >
                                    <BadgeCheck className="h-4 w-4" />
                                </a>
                                <a
                                    href="mailto:devjzpher@northeasterncollege.edu.ph"
                                    className={`flex h-8.5 w-8.5 items-center justify-center rounded-lg border ${themeStyles.border} ${themeStyles.cardBg} ${themeStyles.textHeading} shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60`}
                                    title="Email"
                                    aria-label="Email devjzpher@northeasterncollege.edu.ph"
                                >
                                    <Mail className="h-4 w-4" />
                                </a>
                                <a
                                    href="https://www.facebook.com/jaspher.juan"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex h-8.5 w-8.5 items-center justify-center rounded-lg border ${themeStyles.border} ${themeStyles.cardBg} ${themeStyles.textHeading} shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1877f2]/50 hover:bg-[#1877f2]/10 hover:text-[#1877f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1877f2]/60`}
                                    title="Facebook"
                                    aria-label="View Facebook profile"
                                >
                                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                                        <path d="M13.5 22v-9h3l.5-3.5h-3.5V7.25c0-1.02.28-1.71 1.75-1.71H17.1V2.42c-.32-.04-1.42-.14-2.7-.14-2.67 0-4.5 1.63-4.5 4.63V9.5H7v3.5h2.9v9h3.6Z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                    </header>

                    {/* RIGHT PANE: Circular vertical section slider on desktop */}
                    <main className="relative space-y-16 lg:col-span-7 lg:h-[82vh] lg:space-y-0 lg:overflow-hidden lg:rounded-[2rem] lg:border lg:border-slate-200/80 lg:bg-white/55 lg:shadow-[0_32px_90px_-52px_rgba(15,23,42,0.5)] lg:backdrop-blur-xl dark:lg:border-white/[0.07] dark:lg:bg-white/[0.018] dark:lg:shadow-[0_32px_90px_-48px_rgba(0,0,0,0.8)]">
                        
                        {/* SECTION 01: Interactive Collapsible Projects Accordion */}
                        <section 
                            ref={section1Ref} 
                            data-section-id="01" 
                            className={`space-y-5 ${sectionPanelClasses('01')}`}
                        >
                            <div className="flex justify-between text-[11px] font-mono font-bold uppercase tracking-widest select-none">
                                <span>01 // SELECTED WORK</span>
                                <span className={themeStyles.accentText}>WORKLOAD ARCHIVES</span>
                            </div>

                            <div className="flex flex-wrap gap-2" aria-label="Filter selected work by category">
                                {projectCategories.map((category) => (
                                    <button
                                        key={category}
                                        type="button"
                                        onClick={() => {
                                            setSelectedProjectCategory(category);
                                            setOpenProject(null);
                                            setCurrentProjectPage(1);
                                        }}
                                        className={`rounded-full border px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wider transition ${
                                            selectedProjectCategory === category
                                                ? 'border-indigo-500 bg-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                                                : `${themeStyles.border} ${themeStyles.cardBg} text-slate-500 hover:border-indigo-500/40 hover:text-indigo-500`
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>

                            <div className={`border-t ${themeStyles.border} divide-y ${themeStyles.divider}`}>
                                {visibleProjects.map((proj, projectIndex) => {
                                    const isOpen = openProject === proj.id;
                                    const imageIndex = projectImageIndexes[proj.id] ?? 0;
                                    const activeImage = proj.images[imageIndex];
                                    return (
                                        <div key={proj.id} className="group/project rounded-xl py-5 transition-all duration-300 hover:bg-slate-900/[0.025] dark:hover:bg-white/[0.025]">
                                            
                                            {/* Row Header trigger */}
                                            <button
                                                type="button"
                                                onClick={() => setOpenProject(isOpen ? null : proj.id)}
                                                className="flex w-full items-center justify-between gap-4 px-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
                                                aria-expanded={isOpen}
                                            >
                                                <div className="space-y-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className={`title-font text-base font-bold ${themeStyles.textHeading} transition-colors group-hover/project:text-indigo-650 dark:group-hover/project:text-indigo-400`}>{proj.title}</h3>
                                                        {selectedProjectCategory === 'All' && currentProjectPage === 1 && projectIndex < 3 && (
                                                            <span className="rounded-full border border-indigo-500/25 bg-indigo-500/10 px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider text-indigo-500">
                                                                Featured
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-2.5 font-mono text-[10px] uppercase tracking-wider text-slate-500 select-none">
                                                        <span className={themeStyles.accentText}>{proj.categories.join(' + ')}</span>
                                                        <span aria-hidden="true">•</span>
                                                        <span className="font-bold text-amber-500">{proj.rarity}</span>
                                                        <span aria-hidden="true">•</span>
                                                        <span>{proj.scope}</span>
                                                        <span aria-hidden="true">•</span>
                                                        <span className="text-emerald-500">{proj.completion}</span>
                                                    </div>
                                                    <div className="hidden">
                                                        <span className={themeStyles.accentText}>{proj.categories.join(' + ')}</span>
                                                        <span>â€¢</span>
                                                        <span className="font-bold text-amber-500">{proj.rarity}</span>
                                                        <span>•</span>
                                                        <span>{proj.scope}</span>
                                                        <span>•</span>
                                                        <span className="text-emerald-500">{proj.completion}</span>
                                                    </div>
                                                </div>
                                                <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${themeStyles.cardBg} ${themeStyles.border} ${themeStyles.textHeading} transition-all group-hover/project:border-indigo-500/40 group-hover/project:bg-indigo-500/10 ${isOpen ? 'rotate-180' : ''}`}>
                                                    <ChevronDown className="h-4 w-4" />
                                                </div>
                                            </button>

                                            {/* Expandable details wrapper */}
                                            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 pointer-events-none'}`}>
                                                <div className="overflow-hidden space-y-4">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between gap-3 font-mono text-[9.5px] font-bold uppercase text-slate-500">
                                                            <span>Project preview</span>
                                                            <span>{imageIndex + 1} / {proj.images.length}</span>
                                                        </div>
                                                        <div className={`group/carousel relative h-40 overflow-hidden rounded-xl border sm:h-52 ${themeStyles.border} ${themeStyles.cardBg}`}>
                                                            <button
                                                                type="button"
                                                                onClick={() => setLightbox({ projectId: proj.id, imageIndex })}
                                                                className="h-full w-full cursor-zoom-in"
                                                                aria-label={`Enlarge image: ${activeImage.alt}`}
                                                            >
                                                                <img
                                                                    src={activeImage.src}
                                                                    alt={activeImage.alt}
                                                                    className="h-full w-full object-cover object-top transition duration-300 group-hover/carousel:scale-[1.015]"
                                                                    loading="lazy"
                                                                />
                                                                <span className="absolute right-2.5 bottom-2.5 inline-flex items-center gap-1.5 rounded-md bg-slate-950/80 px-2.5 py-1.5 font-mono text-[9px] font-bold text-white backdrop-blur-sm">
                                                                    <Maximize2 className="h-3 w-3" /> Enlarge
                                                                </span>
                                                            </button>

                                                            {proj.images.length > 1 && (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => moveProjectImage(proj, -1)}
                                                                        className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/75 text-white shadow-lg backdrop-blur-sm transition hover:bg-slate-950"
                                                                        aria-label={`Previous ${proj.title} image`}
                                                                    >
                                                                        <ChevronLeft className="h-4 w-4" />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => moveProjectImage(proj, 1)}
                                                                        className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/75 text-white shadow-lg backdrop-blur-sm transition hover:bg-slate-950"
                                                                        aria-label={`Next ${proj.title} image`}
                                                                    >
                                                                        <ChevronRight className="h-4 w-4" />
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3.5 text-[12.5px] leading-relaxed font-sans">
                                                        <p>
                                                            <strong className="font-mono text-[9.5px] text-slate-500 block mb-0.5 uppercase">[Mission Objective]</strong>
                                                            {proj.objective}
                                                        </p>
                                                        <p className="text-emerald-600 dark:text-emerald-400 font-normal">
                                                            <strong className="font-mono text-[9.5px] text-slate-500 block mb-0.5 uppercase">[Execution logs]</strong>
                                                            {proj.walkthrough}
                                                        </p>
                                                    </div>

                                                    {/* Link actions */}
                                                    <div className="flex gap-3 pt-2 select-none">
                                                        {proj.github && (
                                                            <a 
                                                                href={proj.github} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer" 
                                                                className={`inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider ${themeStyles.textHeading} hover:opacity-80 font-mono`}
                                                            >
                                                                Source code <ArrowUpRight className="h-3.5 w-3.5" />
                                                            </a>
                                                        )}
                                                        {proj.demo && (
                                                            <a
                                                                href={proj.demo}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={`inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider ${themeStyles.textHeading} hover:opacity-80 font-mono`}
                                                            >
                                                                Visit live site <ArrowUpRight className="h-3.5 w-3.5" />
                                                            </a>
                                                        )}
                                                    </div>

                                                </div>
                                            </div>

                                        </div>
                                    );
                                })}
                            </div>
                            {projectPageCount > 1 && (
                                <nav className="flex flex-wrap items-center justify-between gap-3 pt-1" aria-label="Selected work pagination">
                                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-500">
                                        Showing {projectPageStart + 1}–{Math.min(projectPageStart + PROJECTS_PER_PAGE, filteredProjects.length)} of {filteredProjects.length}
                                    </span>
                                    <div className={`flex items-center gap-1 rounded-full border p-1 ${themeStyles.border} ${themeStyles.cardBg}`}>
                                        <button
                                            type="button"
                                            onClick={() => changeProjectPage(currentProjectPage - 1)}
                                            disabled={currentProjectPage === 1}
                                            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-indigo-500/10 hover:text-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 disabled:cursor-not-allowed disabled:opacity-30"
                                            aria-label="Previous project page"
                                        >
                                            <ChevronLeft className="h-3.5 w-3.5" />
                                        </button>
                                        {Array.from({ length: projectPageCount }, (_, index) => index + 1).map((page) => (
                                            <button
                                                key={page}
                                                type="button"
                                                onClick={() => changeProjectPage(page)}
                                                className={`flex h-8 min-w-8 items-center justify-center rounded-full px-2 font-mono text-[9px] font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 ${currentProjectPage === page ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20' : 'text-slate-500 hover:bg-indigo-500/10 hover:text-indigo-500'}`}
                                                aria-label={`Show project page ${page}`}
                                                aria-current={currentProjectPage === page ? 'page' : undefined}
                                            >
                                                {page.toString().padStart(2, '0')}
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => changeProjectPage(currentProjectPage + 1)}
                                            disabled={currentProjectPage === projectPageCount}
                                            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-indigo-500/10 hover:text-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 disabled:cursor-not-allowed disabled:opacity-30"
                                            aria-label="Next project page"
                                        >
                                            <ChevronRight className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </nav>
                            )}
                        </section>

                        {/* SECTION 02: Combined Technical Stack Logos Grid */}
                        <section 
                            ref={section2Ref} 
                            data-section-id="02" 
                            className={`space-y-6 ${sectionPanelClasses('02')}`}
                        >
                            <div className="text-[10px] tracking-widest font-mono font-bold uppercase select-none flex justify-between">
                                <span>02 // TECHNICAL SKILLS</span>
                                <span className={themeStyles.accentText}>CAPABILITIES</span>
                            </div>

                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                                {skills.map((skill, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`group relative border ${themeStyles.border} ${themeStyles.cardBg} aspect-square rounded-2xl flex flex-col items-center justify-center p-3 transition-all duration-300 cursor-default select-none hover:scale-105 ${skill.glowClass}`}
                                    >
                                        <div className="h-8 w-8 flex items-center justify-center">
                                            {skill.customSvg ? (
                                                skill.customSvg
                                            ) : (
                                                <img 
                                                    src={skill.logoUrl} 
                                                    alt={`${skill.name} Logo`} 
                                                    loading="lazy"
                                                    decoding="async"
                                                    className={`h-full w-full object-contain filter group-hover:brightness-110 transition-all ${
                                                        skill.name === 'GitHub' && isDark ? 'dark:invert' : ''
                                                    }`}
                                                />
                                            )}
                                        </div>
                                        <span className="text-[8px] font-mono font-bold tracking-tight uppercase text-slate-500 mt-2 text-center group-hover:text-slate-900 dark:group-hover:text-white transition-colors truncate max-w-full leading-none">
                                            {skill.name}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-widest">
                                    <span>GitHub Contributions</span>
                                    <span className={themeStyles.accentText}>PAST 365 DAYS</span>
                                </div>
                                <div className={`flex flex-col items-center rounded-2xl border ${themeStyles.border} ${themeStyles.cardBg} p-4.5 shadow-sm`}>
                                {/* The calendar image wrapped in horizontal scroll */}
                                <div className="w-full overflow-x-auto custom-scroll pb-1.5">
                                    <div className="min-w-[650px] flex items-center justify-center select-none">
                                        <img 
                                            src={themeStyles.githubChartUrl} 
                                            alt="JaspherXIII GitHub Contributions Map" 
                                            loading="lazy"
                                            decoding="async"
                                            className="h-auto max-w-full opacity-85 hover:opacity-100 transition-opacity"
                                        />
                                    </div>
                                </div>
                                <div className="w-full mt-3 flex justify-between items-center text-[9px] text-slate-500 font-mono select-none">
                                    <span>Sync Status: Operational</span>
                                    <span>PAST 365 DAYS DEV HISTORY</span>
                                </div>
                                </div>
                            </div>
                        </section>

                        {/* SECTION 03: Experience Historical Logs */}
                        <section 
                            ref={section4Ref} 
                            data-section-id="03"
                            className={`space-y-6 ${sectionPanelClasses('03')}`}
                        >
                            <div className="text-[10px] tracking-widest font-mono font-bold uppercase select-none flex justify-between">
                                <span className="text-[11px]">03 // EXPERIENCE &amp; EDUCATION</span>
                                <span className={themeStyles.accentText}>MILESTONE ARCHIVE</span>
                            </div>

                            <div className={`relative space-y-7 before:absolute before:top-1.5 before:bottom-1.5 before:left-1.5 before:w-px ${isDark ? 'before:bg-white/[0.03]' : 'before:bg-slate-200'}`}>
                                
                                <div className="relative space-y-2.5 pl-6 font-sans">
                                    <div className={`absolute left-1 top-1.5 h-1.5 w-1.5 rounded-full ${themeStyles.dot}`} />
                                    <div className="font-mono text-[11px] font-bold text-slate-500">2024 (OJT TRAINEE)</div>
                                    <h4 className={`title-font text-sm font-bold ${themeStyles.cardTitle}`}>On-the-job Training Programmer @ Brain IT Consultancy</h4>
                                    <p className="text-[13.5px] leading-relaxed font-normal">
                                        Developed custom web applications and engineered relational database schemas. Formulated scripts and automated code deploys. Awarded Outstanding On-the-job Trainee.
                                    </p>
                                </div>

                                <div className="relative space-y-2.5 pl-6 font-sans">
                                    <div className="absolute left-1 top-1.5 h-1.5 w-1.5 rounded-full bg-slate-350 dark:bg-white/[0.15]" />
                                    <div className="font-mono text-[11px] font-bold text-slate-500">2020 - 2024 (BSIT DEGREE)</div>
                                    <h4 className={`title-font text-sm font-bold ${themeStyles.cardTitle}`}>Northeastern College — Bachelor of Science in Information Technology</h4>
                                    <p className="text-[13.5px] leading-relaxed font-normal">
                                        Earned BSIT degree with active honors (Dean's Lister, Outstanding Trainee). Participated in seminar blocks covering Cybersecurity and Capstone Project Leadership.
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 pt-1 font-mono text-[10.5px] text-slate-500 select-none">
                                        <span>[Credentials &amp; Training]:</span>
                                        <span className="text-indigo-500 font-bold">+ CSE Professional Level Passed</span>
                                        <span>•</span>
                                        <span className="text-emerald-500 font-bold">+ Cyber Security leadership</span>
                                    </div>
                                </div>

                                <div className="relative space-y-2.5 pl-6 font-sans">
                                    <div className="absolute left-1 top-1.5 h-1.5 w-1.5 rounded-full bg-slate-205 dark:bg-white/[0.1]" />
                                    <div className="font-mono text-[11px] font-bold text-slate-500">2020 (CSS CERTIFICATION)</div>
                                    <h4 className={`title-font text-sm font-bold ${themeStyles.cardTitle}`}>TESDA accredited Center — Computer System Servicing NC II</h4>
                                    <p className="text-[13.5px] leading-relaxed font-normal">
                                        Completed strict assessment parameters for network system servicing. Configured hardware allocations, local network topologies, and router configurations.
                                    </p>
                                </div>

                                <div className="relative space-y-2.5 pl-6 font-sans">
                                    <div className="absolute left-1 top-1.5 h-1.5 w-1.5 rounded-full bg-slate-205 dark:bg-white/[0.05]" />
                                    <div className="font-mono text-[11px] font-bold text-slate-500">2019 (HIGH SCHOOL IMMERSION)</div>
                                    <h4 className={`title-font text-sm font-bold ${themeStyles.cardTitle}`}>Work Immersion Trainee @ PhilHealth Office</h4>
                                    <p className="text-[13.5px] leading-relaxed font-normal">
                                        Assisted in data entry operations, hardware inspection logs, and basic office network support workflows.
                                    </p>
                                </div>

                            </div>
                        </section>

                        {/* SECTION 04: Certifications and Achievements */}
                        <section 
                            ref={section5Ref} 
                            data-section-id="04"
                            className={`space-y-6 ${sectionPanelClasses('04')}`}
                        >
                            <div className="text-[10px] tracking-widest font-mono font-bold uppercase select-none flex justify-between">
                                <span>04 // CERTIFICATIONS &amp; AWARDS</span>
                                <span className={themeStyles.accentText}>VERIFIED CREDENTIALS</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className={`border ${themeStyles.border} ${themeStyles.cardBg} p-4 rounded-xl space-y-2 hover:border-slate-300 dark:hover:border-white/10 transition-colors shadow-sm`}>
                                    <div className="flex items-center gap-2 text-indigo-650 dark:text-indigo-400 font-mono">
                                        <Shield className="h-4 w-4" />
                                        <span className="text-[9px] font-bold uppercase tracking-wider">CIVIL SERVICE ELIGIBILITY</span>
                                    </div>
                                    <h4 className={`font-bold text-xs ${themeStyles.cardTitle}`}>CSE (Professional Level)</h4>
                                    <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                        Passed the Career Service Examination Professional Level with official eligibility status issued by the Civil Service Commission (Region 2, 2024).
                                    </p>
                                </div>

                                <div className={`border ${themeStyles.border} ${themeStyles.cardBg} p-4 rounded-xl space-y-2 hover:border-slate-300 dark:hover:border-white/10 transition-colors shadow-sm`}>
                                    <div className="flex items-center gap-2 text-indigo-650 dark:text-indigo-400 font-mono">
                                        <Server className="h-4 w-4" />
                                        <span className="text-[9px] font-bold uppercase tracking-wider">NETWORK & SYSTEMS</span>
                                    </div>
                                    <h4 className={`font-bold text-xs ${themeStyles.cardTitle}`}>Computer System Servicing NC II</h4>
                                    <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                        TESDA Certified Competency in Computer System Servicing (2023). Competent in OS setup, hardware diagnostics, and network configuration.
                                    </p>
                                </div>

                                <div className={`border ${themeStyles.border} ${themeStyles.cardBg} p-4 rounded-xl space-y-2 hover:border-slate-300 dark:hover:border-white/10 transition-colors shadow-sm`}>
                                    <div className="flex items-center gap-2 text-indigo-650 dark:text-indigo-400 font-mono">
                                        <Activity className="h-4 w-4" />
                                        <span className="text-[9px] font-bold uppercase tracking-wider">INTERNSHIP PERFORMANCE</span>
                                    </div>
                                    <h4 className={`font-bold text-xs ${themeStyles.cardTitle}`}>Outstanding OJT Trainee</h4>
                                    <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                        Awarded Outstanding On-the-job Trainee by Northeastern College (2024) for excellent execution and programmer contribution at Brain IT Consultancy.
                                    </p>
                                </div>
                            </div>

                            {/* Verification Vault Links */}
                            <div className={`flex flex-wrap gap-3.5 pt-4 border-t ${themeStyles.subDivider} select-none font-mono text-[10px]`}>
                                <a 
                                    href="https://drive.google.com/drive/folders/1sDsiLl3uE2Ex0e_SeE0aXggvFJzfvSOs?usp=sharing" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border ${themeStyles.border} ${themeStyles.cardBg} hover:bg-slate-100/50 dark:hover:bg-white/[0.03] transition-all`}
                                >
                                    <ExternalLink className="h-3.5 w-3.5 text-indigo-650 dark:text-indigo-400" /> View Courses Vault
                                </a>
                                <a 
                                    href="https://drive.google.com/drive/folders/156auCwfEdiyKnUmZtTTzDcYQK4mg40OT?usp=drive_link" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border ${themeStyles.border} ${themeStyles.cardBg} hover:bg-slate-100/50 dark:hover:bg-white/[0.03] transition-all`}
                                >
                                    <ExternalLink className="h-3.5 w-3.5 text-indigo-650 dark:text-indigo-400" /> View Webinars Vault
                                </a>
                            </div>
                        </section>

                        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden items-end justify-between rounded-b-[2rem] bg-gradient-to-t from-white via-white/95 to-transparent px-6 pb-5 pt-16 dark:from-[#080a0e] dark:via-[#080a0e]/95 lg:flex">
                            <button
                                type="button"
                                onClick={showPreviousSection}
                                disabled={previousSection !== null}
                                className={`pointer-events-auto group flex items-center gap-3 rounded-full border ${themeStyles.border} ${themeStyles.cardBg} px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest ${themeStyles.textHeading} shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-500/60 hover:shadow-indigo-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 disabled:cursor-wait disabled:opacity-60`}
                                aria-label="Show previous portfolio section"
                            >
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-transform group-hover:-translate-x-0.5">
                                    <ChevronLeft className="h-4 w-4" />
                                </span>
                                Previous
                            </button>
                            <div className={`pointer-events-auto flex items-center gap-3 rounded-full border ${themeStyles.border} ${themeStyles.cardBg} px-4 py-3 shadow-lg`}>
                                <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-slate-500">
                                    {activeSection} / {SECTION_ORDER.length.toString().padStart(2, '0')}
                                </span>
                                <span className="h-3 w-px bg-slate-200 dark:bg-white/10" />
                                <div className="flex items-center gap-1.5" aria-label="Portfolio section progress">
                                    {SECTION_ORDER.map((sectionId) => (
                                        <button
                                            key={sectionId}
                                            type="button"
                                            onClick={() => navigateToSection(sectionId)}
                                            disabled={previousSection !== null}
                                            className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 ${activeSection === sectionId ? 'w-6 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.65)]' : 'w-1.5 bg-slate-300 hover:bg-indigo-400 dark:bg-white/15 dark:hover:bg-indigo-400'}`}
                                            aria-label={`Show portfolio section ${sectionId}`}
                                            aria-current={activeSection === sectionId ? 'step' : undefined}
                                        />
                                    ))}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={showNextSection}
                                disabled={previousSection !== null}
                                className={`pointer-events-auto group flex items-center gap-3 rounded-full border ${themeStyles.border} ${themeStyles.cardBg} px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest ${themeStyles.textHeading} shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-500/60 hover:shadow-indigo-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 disabled:cursor-wait disabled:opacity-60`}
                                aria-label="Show next portfolio section"
                            >
                                Next
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-transform group-hover:translate-x-0.5">
                                    <ChevronRight className="h-4 w-4" />
                                </span>
                            </button>
                        </div>

                    </main>

                </div>

                <nav
                    className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/90 p-2 shadow-2xl shadow-slate-950/15 backdrop-blur-xl dark:border-white/10 dark:bg-[#0a0c11]/90 lg:hidden"
                    aria-label="Mobile portfolio navigation"
                >
                    <button
                        type="button"
                        onClick={showPreviousSection}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 transition active:scale-95 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
                        aria-label="Previous portfolio section"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <div className="flex min-w-0 items-center gap-3 px-3">
                        <span className="font-mono text-[9px] font-bold tracking-widest text-indigo-500">
                            {activeSection} / {SECTION_ORDER.length.toString().padStart(2, '0')}
                        </span>
                        <span className="truncate font-mono text-[9px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                            {SECTION_SLUGS[activeSection]}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={showNextSection}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition active:scale-95"
                        aria-label="Next portfolio section"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </nav>

            </div>

            {lightboxProject && lightbox && lightboxImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${lightboxProject.title} image gallery`}
                >
                    <button
                        type="button"
                        onClick={() => setLightbox(null)}
                        className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]"
                        aria-label="Close image gallery"
                    />

                    <div className="relative z-10 flex max-h-[94vh] w-full max-w-6xl flex-col gap-3 overflow-hidden rounded-2xl border border-white/15 bg-slate-950/95 p-3 shadow-2xl sm:p-4">
                        <div className="flex items-center justify-between gap-4 px-1 text-white">
                            <div className="min-w-0">
                                <h3 className="truncate text-sm font-bold title-font">{lightboxProject.title}</h3>
                                <p className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
                                    Image {lightbox.imageIndex + 1} of {lightboxProject.images.length}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setLightbox(null)}
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10"
                                aria-label="Close image gallery"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl bg-black/40">
                            <img
                                src={lightboxImage.src}
                                alt={lightboxImage.alt}
                                className="max-h-[72vh] w-auto max-w-full object-contain"
                            />

                            {lightboxProject.images.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => moveLightboxImage(-1)}
                                        className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-slate-950/75 text-white shadow-lg backdrop-blur-sm transition hover:bg-slate-900 sm:left-4"
                                        aria-label="Previous gallery image"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveLightboxImage(1)}
                                        className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-slate-950/75 text-white shadow-lg backdrop-blur-sm transition hover:bg-slate-900 sm:right-4"
                                        aria-label="Next gallery image"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {lightboxProject.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-1 custom-scroll">
                                {lightboxProject.images.map((image, index) => (
                                    <button
                                        key={image.src}
                                        type="button"
                                        onClick={() => {
                                            setLightbox({ projectId: lightboxProject.id, imageIndex: index });
                                            setProjectImageIndexes((current) => ({ ...current, [lightboxProject.id]: index }));
                                        }}
                                        className={`h-14 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-16 sm:w-28 ${index === lightbox.imageIndex ? 'border-indigo-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-90'}`}
                                        aria-label={`View image ${index + 1}: ${image.alt}`}
                                    >
                                        <img src={image.src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
