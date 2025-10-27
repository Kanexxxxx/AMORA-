import { useState, useMemo } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Star, ShoppingCart, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Products() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const categorySlug = params.get("categoria");
  const searchQuery = params.get("q");

  const [sortBy, setSortBy] = useState("newest");
  const [, setLocation] = useLocation();

  const { data: allProducts, isLoading: productsLoading } = trpc.products.list.useQuery();
  const { data: categories } = trpc.categories.list.useQuery();
  const { data: searchResults } = trpc.products.search.useQuery(searchQuery || "", {
    enabled: !!searchQuery,
  });

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

  const selectedCategory = useMemo(() => {
    if (!categorySlug || !categories) return null;
    return categories.find((cat) => cat.slug === categorySlug);
  }, [categorySlug, categories]);

  const filteredProducts = useMemo(() => {
    let products = searchQuery ? searchResults : allProducts;
    if (!products) return [];

    // Filter by category
    if (selectedCategory) {
      products = products.filter((p) => p.categoryId === selectedCategory.id);
    }

    // Sort
    const sorted = [...products];
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
      default:
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return sorted;
  }, [allProducts, searchResults, searchQuery, selectedCategory, sortBy]);

  const handleCategoryChange = (slug: string) => {
    if (slug === "all") {
      setLocation("/produtos");
    } else {
      setLocation(`/produtos?categoria=${slug}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {searchQuery
                ? `Resultados para "${searchQuery}"`
                : selectedCategory
                ? selectedCategory.name
                : "Todos os Produtos"}
            </h1>
            <p className="text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? "produto encontrado" : "produtos encontrados"}
            </p>
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="sm:hidden gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtros
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3">Categorias</h3>
                    <div className="space-y-2">
                      <Button
                        variant={!categorySlug ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleCategoryChange("all")}
                      >
                        Todas
                      </Button>
                      {categories?.map((cat) => (
                        <Button
                          key={cat.id}
                          variant={categorySlug === cat.slug ? "default" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => handleCategoryChange(cat.slug)}
                        >
                          {cat.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Categories */}
            <div className="hidden sm:block">
              <Select value={categorySlug || "all"} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Categorias</SelectItem>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mais Recentes</SelectItem>
                <SelectItem value="price-asc">Menor Preço</SelectItem>
                <SelectItem value="price-desc">Maior Preço</SelectItem>
                <SelectItem value="rating">Melhor Avaliação</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">Nenhum produto encontrado</p>
              <Link href="/produtos">
                <Button>Ver Todos os Produtos</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
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
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-semibold">Esgotado</span>
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
                      <Button className="w-full gap-2" size="sm" disabled={product.stock === 0}>
                        <ShoppingCart className="h-4 w-4" />
                        {product.stock === 0 ? "Esgotado" : "Adicionar ao Carrinho"}
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

