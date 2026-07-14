import { Job, Course, UserProfile, Notification } from './types';

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Frontend Developer',
    company: 'Tech Solutions',
    location: 'Msila, DZ',
    type: 'Full-time',
    salary: '22k - 28k',
    verified: true,
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcdAXr_9laoddX_9yX3__m97PKXFmBNa4DbmuEbVlb_YAQ_ejuWe1S73LsxMzw4UuYqYn-0t80SGzXLDZLAuRBe0IAH1teT303tRhA2lMw6BT71NRifROU4dLa5spBrMNvF4PuXHFlUinCuXXKgZhTbIgcNR06_R5r-jSN5Cnvn_JH1tGn0CHOf_XoqKAGGmuFJ3xMYFq1mu9cc2doJkBcRqkbD9gAnGdjQ2i5MK9cDepOrAneDvdA',
    category: 'Software Development'
  },
  {
    id: 'job-2',
    title: 'UX/UI Designer',
    company: 'Creative Studio',
    location: 'Alger, DZ',
    type: 'Remote',
    salary: '15k - 18k',
    verified: false,
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgiDWAVN645i703hSvbZfbV57Xh1jYWKOV0Q6Dgh1i6iwV0iBXPVjY4sThwCWjj8rAAq3yTmLTCIq7rc7KfwF4zWzRljWg_KruWRa6khcEibEGPZ4GbqNR6z6QS3H3pvowh6ONtYIMv5R_L6MVLGYDy2hxPBkbcLqlzuqbF35_VwiQ21L1FQivuib80JTjkhHmBd0BUJv_JO5JWNzb4n7bDIsnuXLx8kNvbXMbcyekgjdC7hQ8Qrbm',
    category: 'Design'
  },
  {
    id: 'job-3',
    title: 'Digital Marketing Manager',
    company: 'Marketing Pro',
    location: 'Amman, Jordan',
    type: 'Part-time',
    salary: '10k - 12k',
    verified: true,
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLPOp__dsaS_NxP3Fe-Ftes7O5GhI417ZdjjPZ1o36JMZpS-sLsrtrRM5AzKjVGPSW6YfEyChjMj1w7tqeXw1SYN2vdLWn-7zsOehjgVOBjjQSFE2tJrwffh-Sh63FEV3vpHpseRg13-hfZVHfMgZUL3g5pxKQOUBQL1rnmxuxQCm0c90DQKVqTROi72qKjKqn_TKDq05HKJeEthquZNkdepHfhjRR1pqbVfqxCrWPFRjYocI0tUNe',
    category: 'Marketing'
  },
  {
    id: 'job-4',
    title: 'Financial Data Analyst',
    company: 'FinCorp',
    location: 'Oran, DZ',
    type: 'Full-time',
    salary: '14k - 17k',
    verified: false,
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDW0_B455urHfb5hQX9LYCmDkOaetAVpJ2yX8rpc4z6WzlmtzoY2S93zbeD4xBYURdZs9wIjWbneQRS1gCn-qnbUNc64JkxyQlGsp9lGPTL3IIZhZpOTRAIIVR1Uv6OwyWe2zKIWai_sttATZgjK2cSTZu6FL4f7XMqhmCpjhguiEYSbw_KN8m2njOCsdAktKrnHCChCjDBPESMgDfgQy18Co12y97kMpjgbIfoWBLOApUJy4Ty-oTv',
    category: 'Finance'
  },
  {
    id: 'job-5',
    title: 'Senior UX Designer',
    company: 'Tech Solutions',
    location: 'Remote',
    type: 'Full-time',
    salary: '25k - 30k',
    verified: true,
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcdAXr_9laoddX_9yX3__m97PKXFmBNa4DbmuEbVlb_YAQ_ejuWe1S73LsxMzw4UuYqYn-0t80SGzXLDZLAuRBe0IAH1teT303tRhA2lMw6BT71NRifROU4dLa5spBrMNvF4PuXHFlUinCuXXKgZhTbIgcNR06_R5r-jSN5Cnvn_JH1tGn0CHOf_XoqKAGGmuFJ3xMYFq1mu9cc2doJkBcRqkbD9gAnGdjQ2i5MK9cDepOrAneDvdA',
    category: 'Design'
  },
  {
    id: 'job-6',
    title: 'JavaScript Developer',
    company: 'Afaq Platform',
    location: 'Alger, DZ',
    type: 'Contract',
    salary: '18k - 22k',
    verified: false,
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgiDWAVN645i703hSvbZfbV57Xh1jYWKOV0Q6Dgh1i6iwV0iBXPVjY4sThwCWjj8rAAq3yTmLTCIq7rc7KfwF4zWzRljWg_KruWRa6khcEibEGPZ4GbqNR6z6QS3H3pvowh6ONtYIMv5R_L6MVLGYDy2hxPBkbcLqlzuqbF35_VwiQ21L1FQivuib80JTjkhHmBd0BUJv_JO5JWNzb4n7bDIsnuXLx8kNvbXMbcyekgjdC7hQ8Qrbm',
    category: 'Software Development'
  },
  {
    id: 'job-7',
    title: 'Creative Director',
    company: 'Design Agency',
    location: 'Msila, DZ',
    type: 'Full-time',
    salary: '35k - 45k',
    verified: true,
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDW0_B455urHfb5hQX9LYCmDkOaetAVpJ2yX8rpc4z6WzlmtzoY2S93zbeD4xBYURdZs9wIjWbneQRS1gCn-qnbUNc64JkxyQlGsp9lGPTL3IIZhZpOTRAIIVR1Uv6OwyWe2zKIWai_sttATZgjK2cSTZu6FL4f7XMqhmCpjhguiEYSbw_KN8m2njOCsdAktKrnHCChCjDBPESMgDfgQy18Co12y97kMpjgbIfoWBLOApUJy4Ty-oTv',
    category: 'Design'
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Project Management Fundamentals',
    description: 'Learn how to lead teams and manage resources with high efficiency in the modern workplace.',
    category: 'Business Management',
    hours: 24,
    rating: 4.9,
    reviewCount: '1.2k',
    price: 299,
    instructor: 'Dr. Ahmed Khaled',
    instructorInitials: 'AK',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBloEPYVodg-edualC9aiMxmROpWZcv_PaHuvnwG6XnFOxI4m6QbxosoWoW5n0ghtLYHD3JRYaAoIlBKJTOqI4aNOVpO20usmeMePww7kGSfL6eKI-qjLObVaRTqn6t_UKYKltO1LgPsSPaRD35iM4xrV7Rg7qbQut2QNTcmB_b_U3Sm4nYOubD77-4pGAlv9likE8X4HEdzSc0QZTMpwyrxHieEPQtFqhRui0dX4c6rasTFN4nrPWC',
    bestseller: true,
    level: 'Intermediate',
    language: 'English'
  },
  {
    id: 'course-2',
    title: 'Data Science for Beginners',
    description: 'Start your journey into the world of data using Python and SQL in a practical and simplified way.',
    category: 'Data Science',
    hours: 32,
    rating: 4.8,
    reviewCount: '850',
    price: 450,
    instructor: 'Tech University',
    instructorInitials: 'TU',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXXhSlT_yEEapyjHWYWHAaCGv6i_wMaHCO1ut2e08X9fA9ZGFzVVRHAIjZXnqxczPddHgadary4XHmvFAh6lXoRDmFcAE3in3-kgG6Nrl62zpHWbqCxdC1v7QX01RW_uJPq7h6LHJU5DRgANY6B5J9Y09uX7DJeAk1lwCtPFISTA3AL_WTPr6cdwALGZLa43oigfVvbkY4BEl_zT2MnL8DptpztAcQjfXZLzrIz23ehv4AR88WYgRp',
    bestseller: false,
    level: 'Beginner',
    language: 'English'
  },
  {
    id: 'course-3',
    title: 'AI in Business',
    description: 'How to utilize AI tools to improve productivity and make smart decisions.',
    category: 'Software Development',
    hours: 20,
    rating: 5.0,
    reviewCount: '420',
    price: 380,
    instructor: 'Tech University',
    instructorInitials: 'TU',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ-FJ7F2OPL0APSd3Xs1EwPQzWrAfrlgAYeuptTB73Uud4olodbl3Ak1dADWR4FfAN-9juWQlY_WI-1eBV2ald6H-Keb8T1DaYlQYGd9hpmi5bYKGoniPakHZ-lGhuf8AC0vTLqu5ciPwrBK-w0mhybzbha7s9nCekBS9C2ynK6aiGCT91ra19v2C99NAp-2B-SN3VTph7tuP3rL37RbUv1Q9nqbAJIbgnJs4sATQLXjiRFImByZK6',
    bestseller: false,
    level: 'Beginner',
    language: 'English'
  },
  {
    id: 'course-4',
    title: 'Front-End Development Essentials with React',
    description: 'Master the fundamentals of React and modern web architectures with highly interactive hands-on projects.',
    category: 'Software Development',
    hours: 45,
    rating: 4.9,
    reviewCount: '2.4k',
    price: 746, // $199 approx
    instructor: 'Sami Ali',
    instructorInitials: 'SA',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhxbLOcGJT00CWEFmwicK5eCpCPbPu_6lt77NPMmIGV0YZvIF5wHV-3nMxjmtzCvYUYCG5ySVS7IgXD9z7Z1GSiYjJzdyYucH6PLeC3PAYnONs77SgrsglIxNjwGth_0WJthlTuspYCwmCUwbaSuhLzWAVIeLcF4TDCKAzqa4z7O7Z2HZjnk5g_sqQtHMD7EvGo11DJD1WbYriIgjn-IjggD_uVC1GF8YZJOHcrSidioy7rXmcIwct',
    bestseller: true,
    level: 'Intermediate',
    language: 'English'
  },
  {
    id: 'course-5',
    title: 'User Experience (UX) Design for Beginners',
    description: 'Learn how to map user journeys, create high-fidelity wireframes, and design highly engaging software interfaces.',
    category: 'Digital Design',
    hours: 12,
    rating: 4.8,
    reviewCount: '1.8k',
    price: 334, // $89 approx
    instructor: 'Noura Mansour',
    instructorInitials: 'NM',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9BZBIscHb9C0GhlpEzM5bzdmGTn-gJ3JuwWbTrfsaC0l_U_S-EzdXulqRfM1-sZWhFMBbIhap0v1dzMu4JQE1Pn4TIsEZtAcvz41EqwbEhL8aN5FAY9w8HcSj9rLC4HXGubl0ur64653jpqF7FnCF189TNMpQzuPA8gPXDi1pIKlm7LnONt0FrlqZknYFYBP539yq72b6x0Cn5VNEK2KAN8Sj4RmHjMCmY3FBuGXfzXwevDerhddq',
    bestseller: false,
    level: 'Beginner',
    language: 'English'
  },
  {
    id: 'course-6',
    title: 'Professional Project Management (PMP) - Exam Prep',
    description: 'Get ready to pass the globally recognized PMP exam with full confidence, extensive study guides and practice quizzes.',
    category: 'Business Management',
    hours: 28,
    rating: 4.7,
    reviewCount: '920',
    price: 937, // $250 approx
    instructor: 'Fahd Khalid',
    instructorInitials: 'FK',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjKHxdwrlLuT2Vg99-ZQRMvIFsLrKgtKc-eK4m5JfcWoBXohL4Lr6-NhfBwjyn3Rrn2YD3gY-oYnGQHr-1LcYD6wz3qw4wvjPHxIh7YJI7xvcNt-P1MFxeBP_H9BezKkb7RHz3jVbeuriQluCDXBm7a3f1LKxkjjnTZGI31xe0ysp4IWTvdG-j3DUoKdk1oMFxv4dZ7iTcM19BULaHArd6Z3kqO2f0YKdSOd4wdXizNvDmRQqjuSyx',
    bestseller: false,
    level: 'Advanced',
    language: 'English'
  },
  {
    id: 'course-7',
    title: 'Data Analysis with Python and SQL',
    description: 'Discover how to manipulate, query, and visualize structured dataset collections using standard scientific packages.',
    category: 'Data Science',
    hours: 34,
    rating: 4.9,
    reviewCount: '1.4k',
    price: 559, // $149 approx
    instructor: 'Lina Saeed',
    instructorInitials: 'LS',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEKycflDsMo0zB_wpF2D4nr9wF0PjZhKLUC5vDzfk_czIf7Txd4Pvo09plM4HxP2NANSos1RaDoXn44tkrduGfHO48HTmd3wOgrJh7CDpzeeBd4PfJQNK5HdvAQWco3Kr_FbmidHaFwlsyt3QBp4AV8cfCD1yV-5S5glxlj-usJhJoKOzjqmtHZ-hkQWMOrpY12_OGYQF5Y1TqTq6x22qyrtKu6nuAv8GXhfm30bFkZPfDseQf_5HX',
    bestseller: false,
    level: 'Intermediate',
    language: 'English'
  },
  {
    id: 'course-8',
    title: 'Mastering Photography and Filmmaking',
    description: 'Take stunning high-contrast captures and produce cinema-grade documentary streams using custom DSLR profiles.',
    category: 'Visual Production',
    hours: 18,
    rating: 4.6,
    reviewCount: '650',
    price: 450, // $120 approx
    instructor: 'Majed Rashid',
    instructorInitials: 'MR',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDboPDW50ivAZaXOoT8JvUMBVuQhtXMMjMFZL7GpQuZzOmN1Mo00qOVFtbsZPXWKNa-NhM3r_lKhojVXPjp8xk2M7m335mCxSDSlNPgOSQ0VQi23QA5EKBrW1V-IgbVX3bi8P_jHQ9epVPRxVXJP9Th3-2aotKBEzCTVUyqgEuNeCa6r_LUA1n6R2JlVdzSET7hh8ktcZ_isIF_LsYopOeeTkCkKvqnMTYl-LK9peb2X4BgHKULbLZp',
    bestseller: false,
    level: 'Intermediate',
    language: 'English'
  },
  {
    id: 'course-9',
    title: 'Social Media Marketing Strategies',
    description: 'Learn how to generate viral hooks, run targeted ad campaigns and analyze audience retention profiles.',
    category: 'Digital Marketing',
    hours: 22,
    rating: 4.8,
    reviewCount: '1.1k',
    price: 431, // $115 approx
    instructor: 'Reham Abdullah',
    instructorInitials: 'RA',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXWYS6afc4OJXpevHIzql-VhJOFxZGUOptKCsXQJOxuYhjxKhXsra3g8x3DjgvBaleX7Ig9s5oorQUlz76FL7lj0d09JZauP5FHVFoGdRPCHHOjRa8GbHbgvrNKzep7O0gg4of4fdurkzXb4ipFIVHizSpEtdlk_zLpc0jRWXeL8WtvFHzojKZPZet5mDquZoNycDOB67ba5Ou5SNAuTMt9J3mVwWcYBSLdQsZ8-siTeh2-aaU1WLE',
    bestseller: false,
    level: 'Beginner',
    language: 'Arabic'
  },
  {
    id: 'course-10',
    title: 'Advanced UI Design Principles',
    description: 'Learn complex visual rhythms, micro-interaction feedback triggers, and robust component architecture in Figma.',
    category: 'Digital Design',
    hours: 12,
    rating: 4.9,
    reviewCount: '780',
    price: 375,
    instructor: 'Dr. Ahmed Khaled',
    instructorInitials: 'AK',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBloEPYVodg-edualC9aiMxmROpWZcv_PaHuvnwG6XnFOxI4m6QbxosoWoW5n0ghtLYHD3JRYaAoIlBKJTOqI4aNOVpO20usmeMePww7kGSfL6eKI-qjLObVaRTqn6t_UKYKltO1LgPsSPaRD35iM4xrV7Rg7qbQut2QNTcmB_b_U3Sm4nYOubD77-4pGAlv9likE8X4HEdzSc0QZTMpwyrxHieEPQtFqhRui0dX4c6rasTFN4nrPWC',
    level: 'Intermediate',
    language: 'English'
  },
  {
    id: 'course-11',
    title: 'Data Science Fundamentals',
    description: 'Get a quick, solid grounding on key mathematical equations, probability matrices, and simple regression fits.',
    category: 'Data Science',
    hours: 24,
    rating: 4.7,
    reviewCount: '520',
    price: 399,
    instructor: 'Tech University',
    instructorInitials: 'TU',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXXhSlT_yEEapyjHWYWHAaCGv6i_wMaHCO1ut2e08X9fA9ZGFzVVRHAIjZXnqxczPddHgadary4XHmvFAh6lXoRDmFcAE3in3-kgG6Nrl62zpHWbqCxdC1v7QX01RW_uJPq7h6LHJU5DRgANY6B5J9Y09uX7DJeAk1lwCtPFISTA3AL_WTPr6cdwALGZLa43oigfVvbkY4BEl_zT2MnL8DptpztAcQjfXZLzrIz23ehv4AR88WYgRp',
    level: 'Beginner',
    language: 'English'
  }
];

export const INITIAL_USER_PROFILES: { sarah: UserProfile; alex: UserProfile } = {
  sarah: {
    fullName: 'Sarah Al-Ahmed',
    email: 'sarah.ahmed@skillbridge.org',
    jobTitle: 'Frontend Developer',
    location: 'Msila, DZ',
    bio: 'Passionate UI architect seeking specialized full-time or contract roles. Experienced with building accessible responsive systems.',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgSJTJyzr3Xv1Kuvf1XiUa2PY-XfGx0hjfh1bBUkvIdmbgzmavft77y-zJyKyc_9ze0Ifb13H0F3LBr5FNpJvluUo7By3DBIx1r1PtgkWPOHcu6Zqpi-rG6BeQCh7Eibv-6m-qkYyZykghf82TwwWZdoSZJBRESb7M8Xj1AeNw_gdQn6xrssGn5-cskdxvk2i9p8s1xjtZYO9X0dhzm0EF3PJypfcqNLfluH9GBvjFkpWh-X8xIfqU',
    verified: true,
    coursesDone: 4,
    jobsApplied: 3,
    isPro: false
  },
  alex: {
    fullName: 'Alex Rivera',
    email: 'alex.rivera@design.co',
    jobTitle: 'Senior Product Designer',
    location: 'New York, NY',
    bio: 'Experienced designer passionate about creating accessible digital experiences. Currently focusing on the intersection of AI and human-centered design in the fintech space.',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgNdHJTtTeDo1FHXyNF7j6tFdKOUk4d8WypLGlnrkxpOI_s3GOQI2Vz-3R43Fovdxoy93ALYdIzBSfhBkndEGAtKmPFxnLovisa1YuXEbW7hARK1bNZv6xlyTBmSEJLVbq_ihMKGjO6IE5M3Dpq1vjMHMxLiYBsGGzJkxUFYU5uAytp_JkPshRdcfo8oDgYfl-6x19FvYRYm5SBrU1DhjoInl05WZxYVCt3zhWEsEyuMFjD93HWNRf',
    verified: true,
    coursesDone: 12,
    jobsApplied: 8,
    isPro: true
  }
};

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    title: 'Application status update',
    message: 'Your application for "Senior Frontend Developer" at Tech Solutions has been updated to "Under Review". Developers are looking forward to reviewing your skills!',
    time: '2 hours ago',
    isRead: false,
    type: 'application',
    linkToView: 'favorites'
  },
  {
    id: 'notif-2',
    title: 'New course recommendation',
    message: 'Based on your interest in Frontend Development, we highly recommend trying the "Advanced React & State Architecture" course. It aligns perfectly with top Msila jobs.',
    time: '1 day ago',
    isRead: false,
    type: 'recommendation',
    linkToView: 'courses'
  },
  {
    id: 'notif-3',
    title: 'Weekly profile performance',
    message: 'Awesome! Your profile views increased by 35% this week. Adding new certifications from SkillBridge is proving highly effective!',
    time: '3 days ago',
    isRead: true,
    type: 'alert',
    linkToView: 'settings'
  },
  {
    id: 'notif-4',
    title: 'Welcome to SkillBridge!',
    message: 'Your career platform is fully configured. Start exploring tailored remote and local job roles and matching certification courses.',
    time: '5 days ago',
    isRead: true,
    type: 'system',
    linkToView: 'home'
  }
];
