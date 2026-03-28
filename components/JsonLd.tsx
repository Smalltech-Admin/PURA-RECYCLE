export function LocalBusinessJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RecyclingCenter',
    name: 'プラリサイクル株式会社',
    alternateName: 'PURA RECYCLE CO.,LTD',
    url: 'https://pura-recycle.com',
    logo: 'https://pura-recycle.com/images/Logo.jpg',
    image: 'https://pura-recycle.com/images/company001.png',
    description:
      '埼玉県新座市の非鉄金属買取専門業者。銅・電線・バッテリー・真鍮・モーター・ラジエター等を高価買取。建設重機・自動車の買取も対応。',
    telephone: '048-483-6687',
    faxNumber: '048-483-6688',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '野火止2-1-29',
      addressLocality: '新座市',
      addressRegion: '埼玉県',
      postalCode: '352-0004',
      addressCountry: 'JP',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 35.7934,
      longitude: 139.5647,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday',
        'Friday', 'Saturday', 'Sunday',
      ],
      opens: '08:30',
      closes: '19:00',
    },
    priceRange: '$$',
    sameAs: [
      'https://ja-jp.facebook.com/pages/%E3%83%97%E3%83%A9%E3%83%AA%E3%82%B5%E3%82%A4%E3%82%AF%E3%83%AB/491338754236880',
    ],
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 35.7934,
        longitude: 139.5647,
      },
      geoRadius: '50000',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: '買取サービス',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: '非鉄金属買取',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '銅買取' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '電線買取' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'バッテリー買取' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '真鍮・砲金買取' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'モーター買取' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'ラジエター買取' } },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: '建設重機買取',
        },
        {
          '@type': 'OfferCatalog',
          name: '自動車買取',
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; href: string }[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://pura-recycle.com${item.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
