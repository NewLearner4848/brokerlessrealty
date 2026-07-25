const pool = require('../config/db');

const BLOGS = [
  {
    title: 'How to Buy a Home in India Without a Broker: A Step-by-Step Guide',
    slug: 'how-to-buy-a-home-in-india-without-a-broker-a-step-by-step-guide',
    excerpt: 'Discover how to navigate the Indian property market, verify legal titles, negotiate prices, and complete registration directly with the owner, saving lakhs in brokerage fees.',
    content: `# How to Buy a Home in India Without a Broker: A Step-by-Step Guide

Buying a home in India without a broker is easier than ever thanks to direct-connect property platforms. By eliminating middleman fees, buyers can save 1% to 2% of the property value — equating to lakhs of rupees.

## Step 1: Identify Verified Direct-Owner Listings
Start by filtering properties listed directly by owners. Look for platforms that verify land registry details and owner identification to ensure authenticity.

## Step 2: Conduct On-Site Inspections and Direct Negotiations
Schedule daylight property visits. Speak directly with the owner regarding maintenance fees, society rules, parking allocation, and expected handover dates.

## Step 3: Legal Verification & Title Search
Engage an independent real estate lawyer to verify the chain of title, sale deed, index II, and non-encumbrance status.

## Step 4: Final Agreement & Registration
Draft the Sale Agreement directly with legal assistance, pay the required stamp duty, and complete registration at the sub-registrar office.`,
    category: 'Home Buying Guides',
    author_name: 'Piyush Khardekar',
    author_role: 'Founder, Brokerless Realty',
    author_avatar: '/images/client1.jpeg',
    author_bio: 'Dedicated to eliminating middleman costs from Indian real estate. Sharing verified advice on buying, selling, and renting properties directly.',
    date: 'July 12, 2026',
    read_time: '6 min read',
    image: '/images/blog_guide.png',
    is_featured: 1,
    tags: JSON.stringify(['Zero Brokerage', 'Home Buying', 'Negotiation', 'Savings']),
    keywords: 'Direct Property Buying, Zero Brokerage India, Home Buying Guide, Save Broker Commission, Property Registration'
  },
  {
    title: 'Why Pune Is One of India\'s Best Cities to Buy Property in 2026',
    slug: 'why-pune-is-one-of-indias-best-cities-to-buy-property-in-2026',
    excerpt: 'Pune has become one of India\'s fastest-growing real estate destinations, attracting homebuyers, investors, and IT professionals alike.',
    content: `# Why Pune Is One of India's Best Cities to Buy Property in 2026

Pune has become one of India's fastest-growing real estate destinations, attracting homebuyers, investors, and IT professionals alike. With its thriving IT industry, world-class educational institutions, improving infrastructure, and excellent quality of life, Pune offers exceptional opportunities for both residential and commercial property investments.

Whether you're purchasing your first home, upgrading to a larger apartment, or looking for long-term investment returns, Pune's real estate market continues to deliver strong value.

## Why Invest in Pune Real Estate?

### 1. Booming IT and Employment Opportunities
Pune is home to major IT parks in Hinjawadi, Kharadi, Magarpatta, Baner, and Wakad, creating consistent demand for quality housing. Thousands of professionals move to Pune every year, supporting both property appreciation and rental demand.

### 2. Strong Infrastructure Development
Infrastructure projects like Ring Road, metro expansion, and improved highways connect key business hubs seamlessly, making daily commutes easier while increasing the attractiveness of nearby residential areas.

### 3. Excellent Rental Income Potential
Locations close to IT corridors continue to generate healthy rental demand. Investors purchasing apartments in high-growth areas often benefit from consistent rental income alongside long-term capital appreciation.

## Best Areas to Buy Property in Pune

### Hinjawadi
Ideal for IT professionals and investors, Hinjawadi offers excellent connectivity to Rajiv Gandhi Infotech Park and continues to witness significant residential development.

### Kharadi
One of Pune's fastest-growing commercial and residential hubs, Kharadi combines modern infrastructure, premium housing projects, and strong rental demand.

### Baner
Baner is known for luxury apartments, premium lifestyle amenities, restaurants, shopping centers, and excellent connectivity to business districts.

### Wakad
Wakad remains a preferred destination for families and professionals due to its strategic location near Hinjawadi, quality schools, hospitals, and shopping destinations.

### Tathawade & Punawale
These emerging neighborhoods offer affordable housing with strong future appreciation potential, making them attractive for first-time homebuyers and investors.

## Benefits of Buying Property in Pune
- Growing property values
- Strong rental demand
- Excellent educational institutions
- Expanding metro connectivity
- Modern healthcare facilities
- Thriving IT and manufacturing sectors
- High quality of life
- Wide range of housing options for every budget

## Tips Before Buying Property
Before making your investment, consider the following:
- Verify the builder's reputation and project history.
- Check RERA registration and legal approvals.
- Evaluate connectivity to workplaces, schools, and hospitals.
- Compare current market prices in nearby projects.
- Understand maintenance costs and future infrastructure plans.
- Choose properties that align with your financial goals.

## The Future of Real Estate
Industry trends indicate that Pune will continue to be among India's most attractive real estate markets due to sustained employment growth, infrastructure expansion, and increasing demand from professionals and families. Areas surrounding IT corridors and metro routes are expected to remain particularly attractive for both end-users and investors.

## Final Thoughts
Buying property in Pune is more than purchasing a home — it's an investment in one of India's most dynamic and rapidly growing cities. Whether you're looking for a luxury apartment, a family home, or an investment property, Pune offers options across every budget and lifestyle.

Working with verified direct owners and transparent guidance can help you identify the right location, negotiate the best price, and complete the buying process with confidence.`,
    category: 'Home Buying Guides',
    author_name: 'Piyush Khardekar',
    author_role: 'Founder, Brokerless Realty',
    author_avatar: '/images/client1.jpeg',
    author_bio: 'Dedicated to eliminating middleman costs from Indian real estate. Sharing verified advice on buying, selling, and renting properties directly.',
    date: 'July 17, 2026',
    read_time: '5 min read',
    image: '/images/blog_hero.png',
    is_featured: 0,
    tags: JSON.stringify(['Pune Real Estate', 'Home Buying', 'Property Investment']),
    keywords: 'Pune Real Estate, Property in Pune, Flats for Sale in Pune, Buy Property in Pune, Pune apartments, luxury homes Pune, Residential Projects Pune, Investment Property Pune, Hinjawadi Property, Kharadi Flats, Wakad Real Estate, Baner Apartments, Pune Property Investment.'
  },
  {
    title: 'Avoid Brokerage Fees: 5 Tips for Renting Directly from Owners',
    slug: 'avoid-brokerage-fees-5-tips-for-renting-directly-from-owners',
    excerpt: 'Renting an apartment in cities like Bangalore, Pune, or Mumbai can cost you high brokerage. Learn how to connect, negotiate, and finalize...',
    content: `# Avoid Brokerage Fees: 5 Tips for Renting Directly from Owners

Renting an apartment in top metro cities often comes with the burden of paying one to two months' rent as brokerage. Here are 5 practical ways to find verified owner rental listings, draft registered rent agreements, and avoid unnecessary middleman charges.`,
    category: 'Hassle-Free Renting',
    author_name: 'Sanjay Thakkar',
    author_role: 'Property Relations Specialist',
    author_avatar: '/images/client2.jpeg',
    author_bio: 'Helping tenants and landlords connect directly without heavy brokerage fees across India.',
    date: 'July 08, 2026',
    read_time: '4 min read',
    image: '/images/property2.jpg',
    is_featured: 0,
    tags: JSON.stringify(['Renting', 'Zero Brokerage', 'Tenant Guide']),
    keywords: 'Rent Direct from Owner, Zero Brokerage Rent, Flat for Rent Pune, Mumbai Apartment Rent'
  },
  {
    title: 'Understanding RERA: The Ultimate Guide for Indian Homebuyers',
    slug: 'understanding-rera-the-ultimate-guide-for-indian-homebuyers',
    excerpt: 'What is RERA and how does it protect you? Here is a breakdown of registration details, builder obligations, and how to verify RERA-compliant...',
    content: `# Understanding RERA: The Ultimate Guide for Indian Homebuyers

RERA (Real Estate Regulatory Authority) was introduced to protect property buyers from project delays, false promises, and legal loopholes. Learn how to search your builder's RERA registration number and review official project documents before paying booking amounts.`,
    category: 'Legal & Documentation',
    author_name: 'Anjali Deshmukh',
    author_role: 'Legal Counsel, Real Estate Specialist',
    author_avatar: '/images/client3.jpeg',
    author_bio: 'Specializing in property law, title search, RERA compliance, and legal due diligence for Indian homebuyers.',
    date: 'June 28, 2026',
    read_time: '5 min read',
    image: '/images/blog_legal.png',
    is_featured: 0,
    tags: JSON.stringify(['RERA', 'Legal Checklist', 'Home Buying']),
    keywords: 'RERA Compliance, Indian Real Estate Law, Builder Registration, RERA Verification'
  },
  {
    title: 'Top 5 Upcoming Real Estate Investment Hotspots in Pune (2026)',
    slug: 'top-5-upcoming-real-estate-investment-hotspots-in-pune-2026',
    excerpt: 'Discover which localities in Pune offer the best price appreciation, upcoming infrastructure projects, and rental yields this year.',
    content: `# Top 5 Upcoming Real Estate Investment Hotspots in Pune (2026)

From expanding metro routes to new IT belts, Pune offers incredible growth corridors. Discover the top 5 emerging areas — including Ravet, Punawale, Undri, Charholi, and Wagholi — that promise high rental returns and long-term capital growth.`,
    category: 'Investment Insights',
    author_name: 'Milind Kulkarni',
    author_role: 'Senior Property Analyst',
    author_avatar: '/images/client4.jpg',
    author_bio: 'Analyzing urban expansion trends, commercial real estate growth, and capital appreciation hotspots.',
    date: 'June 15, 2026',
    read_time: '5 min read',
    image: '/images/property3.jpg',
    is_featured: 0,
    tags: JSON.stringify(['Investment', 'Pune Real Estate', 'Market Analysis']),
    keywords: 'Pune Real Estate Investment, Top Hotspots Pune, High Rental Yield Pune'
  }
];

async function seedBlogs() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM blogs');
    if (rows[0].count > 0) {
      console.log('Blogs already exist in database. Skipping blog seeding.');
      return;
    }

    console.log('Seeding blogs table...');
    for (const blog of BLOGS) {
      await connection.query(
        'INSERT INTO blogs (title, slug, excerpt, content, category, author_name, author_role, author_avatar, author_bio, date, read_time, image, is_featured, tags, keywords) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          blog.title, blog.slug, blog.excerpt, blog.content, blog.category,
          blog.author_name, blog.author_role, blog.author_avatar, blog.author_bio,
          blog.date, blog.read_time, blog.image, blog.is_featured, blog.tags, blog.keywords
        ]
      );
    }
    console.log(`${BLOGS.length} blog posts seeded successfully.`);
  } catch (error) {
    console.error('Error seeding blogs:', error.message);
  } finally {
    connection.release();
  }
}

module.exports = { seedBlogs };
