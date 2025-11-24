import { MediaType, PrismaClient } from '@prisma/client';

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
        description:
          "Agraani Welfare Foundation mobilizes communities for girls' education and skill training in rural and educationally marginalized areas.",
        imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200',
        ctaText: 'Learn More',
        ctaLink: '/about',
        order: 1,
        isActive: true,
      },
      {
        title: 'Skill Training & Guaranteed Placement',
        subtitle: 'Transforming lives through vocational education',
        description:
          'We provide comprehensive skill training followed by guaranteed employment opportunities.',
        imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200',
        ctaText: 'Our Programs',
        ctaLink: '/programs',
        order: 2,
        isActive: true,
      },
      {
        title: 'Supporting Rural Communities',
        subtitle: 'Healthcare, education, and development',
        description:
          'Working extensively to improve quality education, healthcare access, and community development.',
        imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200',
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
        section: 'about',
        title: 'About Us',
        content:
          'Agraani Welfare Foundation is an organization focused on Women and Child Education, Training & Development, and enabling self-dependence. We are committed to creating lasting positive impact in the lives of marginalized communities across West Bengal, aligning with national initiatives such as Utkarsha Bangla Prakalpa, Samagra Shiksha, Skill India Mission, and the National Education Policy.',
        imageUrl: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800',
      },
      {
        section: 'mission',
        title: 'Our Mission',
        content:
          "Our mission is to mobilize communities for girls' education and skill training in rural and educationally marginalized areas. We work to improve access to quality education for girls and women, support child development, provide skill training with guaranteed placement, assist impoverished people with medical needs, promote local rural talent, and offer personal home-care assistant services for senior citizens.",
        imageUrl: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800',
      },
      {
        section: 'vision',
        title: 'Our Vision',
        content:
          'We envision a future where every girl and woman in West Bengal has access to quality education and skill development opportunities, leading to self-dependence, sustainable livelihoods, and empowered communities. We strive for a society where educational barriers are removed, and marginalized individuals can achieve their full potential.',
        imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800', // Reusing an image from hero banners for now
      },
    ],
  });

  // Programs
  await prisma.program.createMany({
    data: [
      {
        title: 'Women & Child Education',
        slug: 'women-child-education',
        description:
          'Improving access to quality education & training for girls and women in rural and marginalized areas. We work to ensure every girl has the opportunity to receive quality education and develop essential life skills.',
        targets: 'Girls and women in rural and educationally marginalized areas of West Bengal',
        impact:
          '500+ girls and women receiving quality education and life skills training annually',
        imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
        icon: 'BookOpen',
        order: 1,
        isActive: true,
      },
      {
        title: 'Skill Training & Development',
        slug: 'skill-training',
        description:
          'Comprehensive vocational training programs followed by guaranteed placement opportunities. We equip individuals with market-relevant skills to ensure sustainable employment and economic independence.',
        targets: 'Youth seeking vocational training and employment opportunities',
        impact: '200+ skilled individuals per year with 95% placement rate',
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
        icon: 'GraduationCap',
        order: 2,
        isActive: true,
      },
      {
        title: 'Child Development Support',
        slug: 'child-development',
        description:
          'Child development and educational support programs to nurture young minds. We provide holistic development opportunities including academic support, extracurricular activities, and health services.',
        targets:
          'Children from impoverished families requiring educational and developmental support',
        impact: '100+ students supported with holistic development programs',
        imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800',
        icon: 'Heart',
        order: 3,
        isActive: true,
      },
      {
        title: 'Healthcare for Impoverished Communities',
        slug: 'healthcare',
        description:
          'Supporting impoverished people with medical needs and healthcare access. We organize health camps, provide medical assistance, and ensure access to basic healthcare services.',
        targets: 'Impoverished families in rural communities lacking access to healthcare',
        impact: '500+ families serviced through annual health camps and medical assistance',
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
        icon: 'Stethoscope',
        order: 4,
        isActive: true,
      },
      {
        title: 'Rural Talent Promotion',
        slug: 'rural-talent',
        description:
          'Promoting local rural talent through various initiatives and platforms. We identify and nurture talent in rural areas, providing opportunities for growth and recognition.',
        targets: 'Talented individuals in rural areas seeking platforms for growth and recognition',
        impact: '50+ rural talents identified and promoted annually through various platforms',
        imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
        icon: 'Star',
        order: 5,
        isActive: true,
      },
      {
        title: 'Senior Citizen Home Care',
        slug: 'senior-care',
        description:
          'Providing personal home-care assistant services for senior citizens. Our trained caregivers offer compassionate support and assistance to elderly individuals in their homes.',
        targets: 'Senior citizens requiring personal home-care assistance and support',
        impact: '30+ seniors receiving quality home-care services monthly',
        imageUrl: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800',
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
        description:
          'Ensure quality education & training for the most neglected sections of society.',
        order: 1,
        isActive: false,
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
        description:
          'Sensitise society regarding health, education & needs of impoverished communities.',
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

  // Team Members
  await prisma.teamMember.createMany({
    data: [
      {
        name: 'Rajesh Kumar',
        position: 'Founder & Director',
        bio: 'With over 15 years of experience in social work and community development, Rajesh leads our mission to empower marginalized communities across West Bengal.',
        imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        email: 'rajesh@agraani.org',
        phone: '+91 98765 43210',
        order: 1,
        isActive: true,
      },
      {
        name: 'Priya Sharma',
        position: 'Program Director',
        bio: 'Priya oversees all our training and education programs, ensuring quality delivery and impact measurement across all initiatives.',
        imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
        email: 'priya@agraani.org',
        phone: '+91 98765 43211',
        order: 2,
        isActive: true,
      },
      {
        name: 'Dr. Amit Banerjee',
        position: 'Healthcare Coordinator',
        bio: 'Dr. Banerjee leads our healthcare initiatives, organizing medical camps and ensuring quality healthcare access for rural communities.',
        imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
        email: 'amit@agraani.org',
        order: 3,
        isActive: true,
      },
      {
        name: 'Sunita Das',
        position: 'Training Manager',
        bio: 'Sunita manages our vocational training programs and placement services, connecting trained individuals with employment opportunities.',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
        email: 'sunita@agraani.org',
        order: 4,
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

  // Sample Blog Posts (using existing images)
  await prisma.blogPost.createMany({
    data: [
      {
        title: 'Empowering Rural Women Through Vocational Training',
        slug: 'empowering-rural-women-vocational-training',
        excerpt:
          'Learn how our skill training programs are transforming lives in rural West Bengal.',
        content:
          '<p>Our recent vocational training initiative has successfully trained over 200 women in various skills including tailoring, computer literacy, and healthcare assistance. The program, conducted in partnership with local communities, ensures that trainees receive guaranteed placement opportunities upon completion.</p><p>The success stories are inspiring - women who had no formal education or employment are now financially independent and contributing to their families and communities.</p><p>We are proud to announce that 95% of our trainees have secured employment within 3 months of completing the program. This achievement reflects our commitment to not just training, but ensuring sustainable livelihoods.</p>',
        imageUrl: '/images/blog/training-program.webp',
        author: 'Agraani Team',
        category: 'Training',
        tags: ['women empowerment', 'skill training', 'rural development'],
        isPublished: true,
        publishedAt: new Date('2024-01-15'),
      },
      {
        title: 'Annual Health Camp Serves 500+ Families',
        slug: 'annual-health-camp-2024',
        excerpt:
          'Our annual health camp provided free medical checkups and medications to over 500 families.',
        content:
          '<p>The annual health camp organized by Agraani Welfare Foundation was a resounding success. Over 500 families from marginalized communities received free medical checkups, consultations with specialists, and necessary medications.</p><p>The camp featured various medical services including general health checkups, eye care, dental care, and diagnostic tests. We extend our gratitude to the volunteer doctors and healthcare professionals who made this possible.</p><p>Special focus was given to women and children, with dedicated sessions on maternal health, child nutrition, and preventive care. The camp also distributed free medicines and health supplements to those in need.</p>',
        imageUrl: '/images/blog/health-camp.webp',
        author: 'Dr. Amit Banerjee',
        category: 'Healthcare',
        tags: ['healthcare', 'community service', 'health camp'],
        isPublished: true,
        publishedAt: new Date('2024-02-10'),
      },
      {
        title: 'Educational Workshop for 100+ Children',
        slug: 'educational-workshop-children',
        excerpt:
          'Interactive learning sessions helping children develop critical thinking and creativity.',
        content:
          '<p>Our recent educational workshop brought together over 100 children from rural schools for an engaging learning experience. The workshop focused on developing critical thinking, creativity, and problem-solving skills through interactive activities.</p><p>Children participated in science experiments, art projects, and group discussions that encouraged them to think beyond textbooks. The workshop also included sessions on digital literacy and environmental awareness.</p>',
        imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
        author: 'Priya Sharma',
        category: 'Education',
        tags: ['education', 'children', 'workshop'],
        isPublished: true,
        publishedAt: new Date('2024-03-05'),
      },
    ],
  });

  // Sample Gallery Items (using existing images and external links)
  await prisma.galleryItem.createMany({
    data: [
      {
        title: 'Skill Training Program 2024',
        description: 'Women participating in our vocational training program',
        imageUrl: '/images/gallery/skill-1.webp',
        type: MediaType.IMAGE,
        category: 'training',
        order: 1,
        isActive: true,
      },
      {
        title: 'Community Health Camp',
        description: 'Free medical checkup camp in rural areas',
        imageUrl: '/images/gallery/health-camp-1.webp',
        type: MediaType.IMAGE,
        category: 'healthcare',
        order: 2,
        isActive: true,
      },
      {
        title: 'Educational Workshop',
        description: 'Interactive learning session for children',
        imageUrl: '/images/gallery/workshop-1.webp',
        type: MediaType.IMAGE,
        category: 'education',
        order: 3,
        isActive: true,
      },
      {
        title: 'Women Empowerment Session',
        description: 'Awareness and skill development program',
        imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800',
        type: MediaType.IMAGE,
        category: 'training',
        order: 4,
        isActive: true,
      },
      {
        title: 'Community Gathering',
        description: 'Local community members participating in awareness program',
        imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
        type: MediaType.IMAGE,
        category: 'events',
        order: 5,
        isActive: true,
      },
      {
        title: 'Success Stories - Video',
        description: 'Testimonials from our beneficiaries',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        type: MediaType.VIDEO,
        category: 'events',
        order: 6,
        isActive: true,
      },
      {
        title: 'Skill Training Graduation',
        description: 'Certificate distribution ceremony for successful trainees',
        imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
        type: MediaType.IMAGE,
        category: 'training',
        order: 7,
        isActive: true,
      },
      {
        title: 'Rural Healthcare Initiative',
        description: 'Mobile health unit serving remote villages',
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
        type: MediaType.IMAGE,
        category: 'healthcare',
        order: 8,
        isActive: true,
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log('📊 Seeded data:');
  console.log('  - 3 Hero Banners');
  console.log('  - 2 About Content sections');
  console.log('  - 6 Programs');
  console.log('  - 7 Objectives');
  console.log('  - 4 Team Members');
  console.log('  - 11 Legal Documents');
  console.log('  - 3 Blog Posts');
  console.log('  - 8 Gallery Items');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
