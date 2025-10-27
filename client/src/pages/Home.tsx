import { Link } from "wouter";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  const { data: featuredProducts, isLoading: productsLoading } = trpc.products.featured.useQuery();
  const { data: categories, isLoading: categoriesLoading } = trpc.categories.list.useQuery();

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(priceInCents / 100);
  };

  const renderStars = (rating: number) => {
    const stars = Math.round(rating / 10);
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < stars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-pink-50 to-purple-50 py-16 md:py-24">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Beleza que
                  <span className="text-primary block">Transforma</span>
                </h1>
                <p className="text-lg text-muted-foreground">
                  Descubra nossa coleção exclusiva de maquiagem, skincare e produtos de beleza de alta qualidade.
                </p>
                <div className="flex gap-4">
                  <Link href="/produtos">
                    <Button size="lg" className="gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Ver Produtos
                    </Button>
                  </Link>
                  <Link href="/sobre">
                    <Button size="lg" variant="outline">
                      Sobre Nós
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=800&q=80"
                  alt="Amora Makeup"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-background">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Categorias</h2>
              <p className="text-muted-foreground">Explore nossa variedade de produtos</p>
            </div>
            {categoriesLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories?.map((category) => (
                  <Link key={category.id} href={`/produtos?categoria=${category.slug}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                      <div className="aspect-square relative overflow-hidden">
                        <img
                          src={category.imageUrl || "https://images.unsplash.com/photo-1596704017254-9b121068ec31?w=400&q=80"}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-3 text-center">
                        <h3 className="font-semibold text-sm">{category.name}</h3>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-muted">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Destaques da Semana</h2>
              <p className="text-muted-foreground">Produtos mais vendidos e amados pelas nossas clientes</p>
            </div>
            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-96 bg-background animate-pulse rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts?.map((product) => (
                  <Link key={product.id} href={`/produto/${product.slug}`}>
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group h-full">
                      <div className="aspect-square relative overflow-hidden bg-muted">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {product.compareAtPrice && (
                          <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-semibold">
                            -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4 space-y-2">
                        <h3 className="font-semibold line-clamp-2 min-h-[3rem]">{product.name}</h3>
                        <div className="flex items-center gap-1">
                          {renderStars(product.rating || 0)}
                          <span className="text-xs text-muted-foreground ml-1">({product.reviewCount})</span>
                        </div>
                        <div className="space-y-1">
                          {product.compareAtPrice && (
                            <div className="text-sm text-muted-foreground line-through">
                              {formatPrice(product.compareAtPrice)}
                            </div>
                          )}
                          <div className="text-xl font-bold text-primary">{formatPrice(product.price)}</div>
                        </div>
                        <Button className="w-full gap-2" size="sm">
                          <ShoppingCart className="h-4 w-4" />
                          Adicionar ao Carrinho
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>



        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronta para se sentir incrível?</h2>
            <p className="text-lg mb-8 opacity-90">
              Descubra os produtos perfeitos para realçar sua beleza natural
            </p>
            <Link href="/produtos">
              <Button size="lg" variant="secondary" className="gap-2">
                <ShoppingCart className="h-5 w-5" />
                Começar a Comprar
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

