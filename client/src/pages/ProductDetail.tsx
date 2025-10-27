import { useState } from "react";
import { useRoute, Link } from "wouter";
import { Star, ShoppingCart, Minus, Plus, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ProductDetail() {
  const [, params] = useRoute("/produto/:slug");
  const slug = params?.slug || "";
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const { data: product, isLoading } = trpc.products.bySlug.useQuery(slug);
  const { data: reviews } = trpc.reviews.byProduct.useQuery(product?.id || 0, {
    enabled: !!product,
  });

  const addToCartMutation = trpc.cart.add.useMutation({
    onSuccess: () => {
      toast.success("Produto adicionado ao carrinho!");
      utils.cart.list.invalidate();
    },
    onError: () => {
      toast.error("Erro ao adicionar ao carrinho");
    },
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
            className={`h-5 w-5 ${i < stars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    if (!product) return;
    addToCartMutation.mutate({ productId: product.id, quantity });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description || "",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado para a área de transferência!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-square bg-muted animate-pulse rounded-lg" />
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                <div className="h-24 bg-muted animate-pulse rounded" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="container text-center">
            <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
            <Link href="/produtos">
              <Button>Ver Todos os Produtos</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = product.images ? JSON.parse(product.images) : [product.imageUrl];
  const averageRating = product.rating ? product.rating / 10 : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Início
            </Link>
            {" / "}
            <Link href="/produtos" className="hover:text-primary">
              Produtos
            </Link>
            {" / "}
            <span className="text-foreground">{product.name}</span>
          </div>

          {/* Product Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
                <img
                  src={images[selectedImage] || product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.compareAtPrice && (
                  <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded text-sm font-semibold">
                    -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
                {product.brand && <p className="text-muted-foreground">Marca: {product.brand}</p>}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {renderStars(product.rating || 0)}
                  <span className="font-semibold">{averageRating.toFixed(1)}</span>
                </div>
                <span className="text-muted-foreground">({product.reviewCount} avaliações)</span>
              </div>

              {/* Price */}
              <div>
                {product.compareAtPrice && (
                  <div className="text-lg text-muted-foreground line-through mb-1">
                    {formatPrice(product.compareAtPrice)}
                  </div>
                )}
                <div className="text-4xl font-bold text-primary">{formatPrice(product.price)}</div>
                <p className="text-sm text-muted-foreground mt-1">ou 3x de {formatPrice(product.price / 3)} sem juros</p>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              {/* Stock */}
              <div>
                {product.stock > 0 ? (
                  <p className="text-sm text-green-600">✓ {product.stock} unidades em estoque</p>
                ) : (
                  <p className="text-sm text-destructive">Produto esgotado</p>
                )}
              </div>

              {/* Quantity */}
              {product.stock > 0 && (
                <div className="flex items-center gap-4">
                  <span className="font-semibold">Quantidade:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  className="flex-1 gap-2"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || addToCartMutation.isPending}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {product.stock === 0 ? "Esgotado" : "Adicionar ao Carrinho"}
                </Button>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="shrink-0" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Avaliações dos Clientes</h2>
            {reviews && reviews.length > 0 ? (
              <div className="grid gap-4">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6 space-y-3">
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating * 10)}
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      {review.comment && <p className="text-muted-foreground">{review.comment}</p>}
                      {review.imageUrl && (
                        <img
                          src={review.imageUrl}
                          alt="Review"
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

