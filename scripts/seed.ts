import { drizzle } from "drizzle-orm/mysql2";
import { categories, products } from "../drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

const seedData = async () => {
  console.log("🌱 Seeding database...");

  // Categories
  const categoryData = [
    {
      name: "Batons",
      slug: "batons",
      description: "Batons de alta qualidade com cores vibrantes e duradouras",
      imageUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80",
    },
    {
      name: "Sombras",
      slug: "sombras",
      description: "Paletas de sombras com pigmentação intensa",
      imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80",
    },
    {
      name: "Pincéis",
      slug: "pinceis",
      description: "Pincéis profissionais para maquiagem perfeita",
      imageUrl: "https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=800&q=80",
    },
    {
      name: "Skincare",
      slug: "skincare",
      description: "Produtos para cuidados com a pele",
      imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
    },
    {
      name: "Perfumes",
      slug: "perfumes",
      description: "Fragrâncias exclusivas e marcantes",
      imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
    },
    {
      name: "Base e Corretivo",
      slug: "base-corretivo",
      description: "Bases e corretivos para todos os tons de pele",
      imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
    },
  ];

  console.log("Inserting categories...");
  await db.insert(categories).values(categoryData);

  // Products
  const productData = [
    // Batons
    {
      name: "Batom Matte Rosé",
      slug: "batom-matte-rose",
      description: "Batom matte de longa duração com acabamento aveludado. Cor rosé elegante e sofisticada.",
      price: 4990, // R$ 49,90
      compareAtPrice: 6990,
      stock: 50,
      categoryId: 1,
      brand: "Amora Makeup",
      imageUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80",
        "https://images.unsplash.com/photo-1631214524020-7e18db7a8f0c?w=800&q=80",
      ]),
      featured: 1,
      rating: 48,
      reviewCount: 127,
    },
    {
      name: "Batom Líquido Nude",
      slug: "batom-liquido-nude",
      description: "Batom líquido com textura cremosa e cor nude perfeita para o dia a dia.",
      price: 3990,
      stock: 35,
      categoryId: 1,
      brand: "Amora Makeup",
      imageUrl: "https://images.unsplash.com/photo-1631214524020-7e18db7a8f0c?w=800&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1631214524020-7e18db7a8f0c?w=800&q=80",
      ]),
      featured: 0,
      rating: 45,
      reviewCount: 89,
    },
    {
      name: "Batom Cremoso Vermelho",
      slug: "batom-cremoso-vermelho",
      description: "Batom cremoso com cor vermelha intensa e hidratação prolongada.",
      price: 4490,
      compareAtPrice: 5990,
      stock: 42,
      categoryId: 1,
      brand: "Amora Makeup",
      imageUrl: "https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=800&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=800&q=80",
      ]),
      featured: 1,
      rating: 50,
      reviewCount: 203,
    },
    // Sombras
    {
      name: "Paleta de Sombras Nude",
      slug: "paleta-sombras-nude",
      description: "Paleta com 12 cores nude essenciais para looks naturais e sofisticados.",
      price: 8990,
      compareAtPrice: 11990,
      stock: 28,
      categoryId: 2,
      brand: "Amora Makeup",
      imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80",
      ]),
      featured: 1,
      rating: 47,
      reviewCount: 156,
    },
    {
      name: "Paleta de Sombras Colorida",
      slug: "paleta-sombras-colorida",
      description: "Paleta vibrante com 18 cores para criar looks ousados e criativos.",
      price: 9990,
      stock: 22,
      categoryId: 2,
      brand: "Amora Makeup",
      imageUrl: "https://images.unsplash.com/photo-1583241800698-c318c6b8d7c7?w=800&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1583241800698-c318c6b8d7c7?w=800&q=80",
      ]),
      featured: 0,
      rating: 46,
      reviewCount: 98,
    },
    // Pincéis
    {
      name: "Kit de Pincéis Profissionais",
      slug: "kit-pinceis-profissionais",
      description: "Kit com 10 pincéis profissionais para maquiagem completa.",
      price: 12990,
      compareAtPrice: 17990,
      stock: 18,
      categoryId: 3,
      brand: "Amora Makeup",
      imageUrl: "https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=800&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=800&q=80",
      ]),
      featured: 1,
      rating: 49,
      reviewCount: 234,
    },
    {
      name: "Pincel para Base",
      slug: "pincel-para-base",
      description: "Pincel de cerdas sintéticas para aplicação uniforme de base líquida.",
      price: 2990,
      stock: 45,
      categoryId: 3,
      brand: "Amora Makeup",
      imageUrl: "https://images.unsplash.com/photo-1583241800698-c318c6b8d7c7?w=800&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1583241800698-c318c6b8d7c7?w=800&q=80",
      ]),
      featured: 0,
      rating: 44,
      reviewCount: 67,
    },
    // Skincare
    {
      name: "Sérum Vitamina C",
      slug: "serum-vitamina-c",
      description: "Sérum facial com vitamina C para iluminar e uniformizar a pele.",
      price: 7990,
      stock: 32,
      categoryId: 4,
      brand: "Amora Skincare",
      imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
      ]),
      featured: 1,
      rating: 48,
      reviewCount: 178,
    },
    {
      name: "Hidratante Facial",
      slug: "hidratante-facial",
      description: "Hidratante facial com ácido hialurônico para pele macia e hidratada.",
      price: 5990,
      compareAtPrice: 7990,
      stock: 40,
      categoryId: 4,
      brand: "Amora Skincare",
      imageUrl: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&q=80",
      ]),
      featured: 0,
      rating: 46,
      reviewCount: 134,
    },
    // Perfumes
    {
      name: "Perfume Amora Elegance",
      slug: "perfume-amora-elegance",
      description: "Fragrância floral sofisticada com notas de rosa e jasmim.",
      price: 15990,
      compareAtPrice: 19990,
      stock: 15,
      categoryId: 5,
      brand: "Amora Fragrances",
      imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
      ]),
      featured: 1,
      rating: 50,
      reviewCount: 289,
    },
    // Base e Corretivo
    {
      name: "Base Líquida HD",
      slug: "base-liquida-hd",
      description: "Base líquida de alta cobertura com acabamento natural. Disponível em 12 tonalidades.",
      price: 6990,
      stock: 38,
      categoryId: 6,
      brand: "Amora Makeup",
      imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
      ]),
      featured: 1,
      rating: 47,
      reviewCount: 201,
    },
    {
      name: "Corretivo Líquido",
      slug: "corretivo-liquido",
      description: "Corretivo líquido de alta cobertura para disfarçar olheiras e imperfeições.",
      price: 3490,
      stock: 52,
      categoryId: 6,
      brand: "Amora Makeup",
      imageUrl: "https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=800&q=80",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=800&q=80",
      ]),
      featured: 0,
      rating: 45,
      reviewCount: 112,
    },
  ];

  console.log("Inserting products...");
  await db.insert(products).values(productData);

  console.log("✅ Database seeded successfully!");
  process.exit(0);
};

seedData().catch((error) => {
  console.error("❌ Error seeding database:", error);
  process.exit(1);
});

