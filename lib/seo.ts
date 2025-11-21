import { Metadata } from 'next';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  path?: string;
}

export function generateSEO({
  title,
  description,
  keywords = [],
  ogImage = '/images/og-default.jpg',
  path = '',
}: SEOProps): Metadata {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://agraaniwelfare.org';
  const fullUrl = `${appUrl}${path}`;

  return {
    title: `${title} | Agraani Welfare Foundation`,
    description,
    keywords: [
      'NGO',
      'West Bengal',
      'Education',
      'Women Empowerment',
      'Skill Training',
      'Agraani Welfare Foundation',
      ...keywords,
    ],
    authors: [{ name: 'Agraani Welfare Foundation' }],
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url: fullUrl,
      title,
      description,
      siteName: 'Agraani Welfare Foundation',
      images: [
        {
          url: `${appUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${appUrl}${ogImage}`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function generateNGOSchema() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://agraaniwelfare.org';

  return {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'Agraani Welfare Foundation',
    description:
      'An organization focused on Women and Child Education, Training & Development, and enabling self-dependence in West Bengal, India.',
    url: appUrl,
    logo: `${appUrl}/images/logo.png`,
    email: 'agraaniwelfarefoundation@gmail.com',
    areaServed: {
      '@type': 'Place',
      name: 'West Bengal, India',
    },
    sameAs: [
      'https://www.facebook.com/share/1Gyuj8ASUE/',
      'https://youtube.com/@agraaniwelfarefoundation',
    ],
    foundingDate: '2003',
    nonprofit: true,
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
