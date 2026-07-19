const pool = require('../config/db');

const properties = [
    {
        title: "Spacious 3BHK in Powai, Mumbai",
        description: "A spacious and modern 3BHK apartment located in the heart of Powai, Mumbai. Comes with all modern amenities and is perfect for families looking for a comfortable and convenient lifestyle.",
        price: 12000000,
        original_price: 13500000,
        savings_text: "Save ₹15 Lakhs",
        address: "Powai",
        city: "Mumbai",
        type: "Apartment",
        bedrooms: 3,
        bathrooms: 2,
        area: 1250,
        features: JSON.stringify(["Swimming Pool", "Gym", "Security", "Parking"]),
        images: JSON.stringify([
            "/images/property1.jpg",
            "/images/property1.jpg"
        ]),
        is_featured: true,
    },
    {
        title: "Luxury Villa in Whitefield, Bangalore",
        description: "Experience luxury living in this beautiful villa in Whitefield, Bangalore. Features a private garden, swimming pool, and top-of-the-line amenities in a serene neighborhood.",
        price: 28000000,
        original_price: 31000000,
        savings_text: "Save ₹30 Lakhs",
        address: "Whitefield",
        city: "Bangalore",
        type: "Villa",
        bedrooms: 4,
        bathrooms: 3,
        area: 2800,
        features: JSON.stringify(["Private Garden", "Swimming Pool", "Modular Kitchen", "Car Parking"]),
        images: JSON.stringify([
            "/images/property2.jpg",
            "/images/property2.jpg"
        ]),
        is_featured: true,
    },
    {
        title: "Heritage Home in Civil Lines, Delhi",
        description: "A stunning heritage home in the prestigious Civil Lines area of Delhi. A perfect blend of traditional architecture and modern comforts, offering a unique living experience in a prime location.",
        price: 35000000,
        original_price: 38000000,
        savings_text: "Save ₹30 Lakhs",
        address: "Civil Lines",
        city: "Delhi",
        type: "Heritage House",
        bedrooms: 5,
        bathrooms: 4,
        area: 3500,
        features: JSON.stringify(["Courtyard", "Traditional Architecture", "Modern Amenities", "Prime Location"]),
        images: JSON.stringify([
            "/images/property3.jpg",
            "/images/property3.jpg"
        ]),
        is_featured: true,
    }
];

async function seedProperties() {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT COUNT(*) as count FROM properties');
        if (rows[0].count > 0) {
            console.log('Properties table already has data. Skipping seeding.');
            return;
        }

        console.log('Seeding properties...');
        for (const prop of properties) {
            await connection.query(
                `INSERT INTO properties (title, description, price, original_price, savings_text, address, city, type, bedrooms, bathrooms, area, features, images, is_featured) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [prop.title, prop.description, prop.price, prop.original_price, prop.savings_text, prop.address, prop.city, prop.type, prop.bedrooms, prop.bathrooms, prop.area, prop.features, prop.images, prop.is_featured]
            );
        }
        console.log(`${properties.length} properties seeded successfully.`);
    } catch (error) {
        console.error('Error seeding properties:', error);
    } finally {
        connection.release();
    }
}

module.exports = { seedProperties };
