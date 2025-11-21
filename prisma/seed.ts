import { PrismaClient, UserRole, MediaType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (optional - remove in production)
  await prisma.contactSubmission.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.legalDocument.deleteMany();
  await prisma.objective.deleteMany();
  await prisma.program.deleteMany();
  await prisma.aboutContent.deleteMany();
  await prisma.heroBanner.deleteMany();

  // Hero Banners
  await prisma.heroBanner.createMany({
    data: [
      {
        title: 'Empowering Women Through Education',
        subtitle: 'Building a brighter future for West Bengal',
        description: 'Agraani Welfare Foundation mobilizes communities for girls\' education and skill training in rural and educationally marginalized areas.',
        imageUrl: '/images/hero/hero-1.jpg',
        ctaText: 'Learn More',
        ctaLink: '/about',
        order: 1,
        isActive: true,
      },
      {
        title: 'Skill Training & Guaranteed Placement',
        subtitle: 'Transforming lives through vocational education',
        description: 'We provide comprehensive skill training followed by guaranteed employment opportunities.',
        imageUrl: '/images/hero/hero-2.jpg',
        ctaText: 'Our Programs',
        ctaLink: '/programs',
        order: 2,
        isActive: true,
      },
      {
        title: 'Supporting Rural Communities',
        subtitle: 'Healthcare, education, and development',
        description: 'Working extensively to improve quality education, healthcare access, and community development.',
        imageUrl: '/images/hero/hero-3.jpg',
        ctaText: 'Get Involved',
        ctaLink: '/contact',
        order: 3,
        isActive: true,
      },
    ],
  });

  // About Content
  await prisma.aboutContent.createMany({
    data: [
      {
        section: 'who-we-are',
        title: 'Who We Are',
        content: 'Agraani Welfare Foundation is an organization focused on Women and Child Education, Training & Development, and enabling self-dependence. We are committed to creating lasting positive impact in the lives of marginalized communities across West Bengal.',
        imageUrl: '/images/about/who-we-are.jpg',
      },
      {
        section: 'about-us',
        title: 'About Us',
        content: 'Agraani Welfare Foundation mobilizes communities for girls\' education and skill training in rural and educationally marginalized areas of West Bengal. We are aligned with Utkarsha Bangla Prakalpa, Samagra Shiksha, Skill India Mission, and the National Education Policy. Our work focuses on improving access to quality education & training for girls and women, child development and educational support, skill training followed by guaranteed placement, supporting impoverished people with medical needs, promoting local rural talent, and providing personal home-care assistant services for senior citizens.',
        imageUrl: '/images/about/about-us.jpg',
      },
    ],
  });

  // Programs
  await prisma.program.createMany({
    data: [
      {
        title: 'Women & Child Education',
        slug: 'women-child-education',
        description: 'Improving access to quality education & training for girls and women in rural and marginalized areas. We work to ensure every girl has the opportunity to receive quality education and develop essential life skills.',
        imageUrl: '/images/programs/education.jpg',
        icon: 'BookOpen',
        order: 1,
        isActive: true,
      },
      {
        title: 'Skill Training & Development',
        slug: 'skill-training',
        description: 'Comprehensive vocational training programs followed by guaranteed placement opportunities. We equip individuals with market-relevant skills to ensure sustainable employment and economic independence.',
        imageUrl: '/images/programs/training.jpg',
        icon: 'GraduationCap',
        order: 2,
        isActive: true,
      },
      {
        title: 'Child Development Support',
        slug: 'child-development',
        description: 'Child development and educational support programs to nurture young minds. We provide holistic development opportunities including academic support, extracurricular activities, and health services.',
        imageUrl: '/images/programs/child-development.jpg',
        icon: 'Heart',
        order: 3,
        isActive: true,
      },
      {
        title: 'Healthcare for Impoverished Communities',
        slug: 'healthcare',
        description: 'Supporting impoverished people with medical needs and healthcare access. We organize health camps, provide medical assistance, and ensure access to basic healthcare services.',
        imageUrl: '/images/programs/healthcare.jpg',
        icon: 'Stethoscope',
        order: 4,
        isActive: true,
      },
      {
        title: 'Rural Talent Promotion',
        slug: 'rural-talent',
        description: 'Promoting local rural talent through various initiatives and platforms. We identify and nurture talent in rural areas, providing opportunities for growth and recognition.',
        imageUrl: '/images/programs/talent.jpg',
        icon: 'Star',
        order: 5,
        isActive: true,
      },
      {
        title: 'Senior Citizen Home Care',
        slug: 'senior-care',
        description: 'Providing personal home-care assistant services for senior citizens. Our trained caregivers offer compassionate support and assistance to elderly individuals in their homes.',
        imageUrl: '/images/programs/senior-care.jpg',
        icon: 'Users',
        order: 6,
        isActive: true,
      },
    ],
  });

  // Strategic Objectives
  await prisma.objective.createMany({
    data: [
      {
        title: 'Quality Education & Training',
        description: 'Ensure quality education & training for the most neglected sections of society.',
        order: 1,
        isActive: true,
      },
      {
        title: 'Women Empowerment',
        description: 'Empower women through social development & skill training programs.',
        order: 2,
        isActive: true,
      },
      {
        title: 'Merit Tests & Scholarships',
        description: 'Conduct merit tests & provide scholarships to school students.',
        order: 3,
        isActive: true,
      },
      {
        title: 'Community Sensitization',
        description: 'Sensitise society regarding health, education & needs of impoverished communities.',
        order: 4,
        isActive: true,
      },
      {
        title: 'Employment Guarantee',
        description: 'Ensure employment for trainees after training completion.',
        order: 5,
        isActive: true,
      },
      {
        title: 'School Programs',
        description: 'Conduct skill-based programs in schools across West Bengal.',
        order: 6,
        isActive: true,
      },
      {
        title: 'Senior Care Services',
        description: 'Provide home-care assistant services for senior citizens.',
        order: 7,
        isActive: true,
      },
    ],
  });

  // Legal Documents
  await prisma.legalDocument.createMany({
    data: [
      {
        name: 'Society Registration Act',
        registrationNumber: 'SO 096057 of 2003-2004',
        documentType: 'society',
        validity: 'One Time',
        notes: 'Society Registration Act XXVI 1961 West Bengal',
        order: 1,
      },
      {
        name: '12A (Income Tax Act)',
        registrationNumber: 'AAAAHI789AE20214',
        documentType: 'tax',
        validity: 'Valid AY 2022-2023 to 2026-2027',
        order: 2,
      },
      {
        name: 'TAN',
        registrationNumber: 'CALH02329F',
        documentType: 'tax',
        validity: 'One Time',
        order: 3,
      },
      {
        name: 'PAN',
        registrationNumber: 'AAAAH1789A',
        documentType: 'tax',
        validity: 'One Time',
        order: 4,
      },
      {
        name: 'GST',
        registrationNumber: '19AAAAH1789A6ZP',
        documentType: 'gst',
        validity: 'One Time',
        order: 5,
      },
      {
        name: 'Professional Tax',
        registrationNumber: '191001752990',
        documentType: 'tax',
        validity: 'One Time',
        order: 6,
      },
      {
        name: 'FCRA',
        registrationNumber: '147120622',
        documentType: 'fcra',
        validity: 'Renew every 5 years',
        notes: 'Last renewed: 14.01.2022',
        order: 7,
      },
      {
        name: 'MCA-CSR',
        registrationNumber: 'CSR00000338',
        documentType: 'csr',
        validity: 'One Time',
        order: 8,
      },
      {
        name: '80G(5)',
        registrationNumber: 'AAAAH1789AF20214',
        documentType: 'tax',
        validity: 'Valid AY 2022-2023 to 2026-2027',
        order: 9,
      },
      {
        name: 'Credibility Alliance',
        registrationNumber: 'CA/05/2023',
        documentType: 'certification',
        validity: 'Valid 05-06-2023 to 04-06-2028',
        order: 10,
      },
      {
        name: 'Darpan ID (NITI Aayog)',
        registrationNumber: 'WB/2017/0176254',
        documentType: 'government',
        validity: 'One Time',
        order: 11,
      },
    ],
  });

  // Sample Blog Posts
  await prisma.blogPost.createMany({
    data: [
      {
        title: 'Empowering Rural Women Through Vocational Training',
        slug: 'empowering-rural-women-vocational-training',
        excerpt: 'Learn how our skill training programs are transforming lives in rural West Bengal.',
        content: '<p>Our recent vocational training initiative has successfully trained over 200 women in various skills including tailoring, computer literacy, and healthcare assistance. The program, conducted in partnership with local communities, ensures that trainees receive guaranteed placement opportunities upon completion.</p><p>The success stories are inspiring - women who had no formal education or employment are now financially independent and contributing to their families and communities.</p>',
        imageUrl: '/images/blog/training-program.jpg',
        author: 'Agraani Team',
        category: 'Training',
        tags: ['women empowerment', 'skill training', 'rural development'],
        isPublished: true,
        publishedAt: new Date('2024-01-15'),
      },
      {
        title: 'Annual Health Camp Serves 500+ Families',
        slug: 'annual-health-camp-2024',
        excerpt: 'Our annual health camp provided free medical checkups and medications to over 500 families.',
        content: '<p>The annual health camp organized by Agraani Welfare Foundation was a resounding success. Over 500 families from marginalized communities received free medical checkups, consultations with specialists, and necessary medications.</p><p>The camp featured various medical services including general health checkups, eye care, dental care, and diagnostic tests. We extend our gratitude to the volunteer doctors and healthcare professionals who made this possible.</p>',
        imageUrl: '/images/blog/health-camp.jpg',
        author: 'Dr. Medical Team',
        category: 'Healthcare',
        tags: ['healthcare', 'community service', 'health camp'],
        isPublished: true,
        publishedAt: new Date('2024-02-10'),
      },
    ],
  });

  // Sample Gallery Items
  await prisma.galleryItem.createMany({
    data: [
      {
        title: 'Skill Training Program 2024',
        description: 'Women participating in our vocational training program',
        imageUrl: '/images/gallery/training-1.jpg',
        type: MediaType.IMAGE,
        category: 'training',
        order: 1,
        isActive: true,
      },
      {
        title: 'Community Health Camp',
        description: 'Free medical checkup camp in rural areas',
        imageUrl: '/images/gallery/health-1.jpg',
        type: MediaType.IMAGE,
        category: 'healthcare',
        order: 2,
        isActive: true,
      },
      {
        title: 'Educational Workshop',
        description: 'Interactive learning session for children',
        imageUrl: '/images/gallery/education-1.jpg',
        type: MediaType.IMAGE,
        category: 'education',
        order: 3,
        isActive: true,
      },
      {
        title: 'Success Stories - Video',
        description: 'Testimonials from our beneficiaries',
        videoUrl: 'https://youtube.com/@agraaniwelfarefoundation',
        type: MediaType.VIDEO,
        category: 'events',
        order: 4,
        isActive: true,
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
