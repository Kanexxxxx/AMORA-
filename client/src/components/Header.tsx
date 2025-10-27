import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";

export default function Header() {
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated } = useAuth();
  const { data: cartItems } = trpc.cart.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const cartCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/produtos?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container flex justify-center items-center text-sm">
          <p>Frete grátis para compras acima de R$ 150 💄✨</p>
        </div>
      </div>

      {/* Main Header */}
      <div className="container py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">Amora</div>
            <div className="text-2xl font-light">Makeup</div>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar produtos..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <Link href="/conta">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span>{user?.name || "Minha Conta"}</span>
                </Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span>Entrar</span>
                </Button>
              </a>
            )}
            <Link href="/carrinho">
              <Button variant="ghost" size="sm" className="relative gap-2">
                <ShoppingCart className="h-4 w-4" />
                <span>Carrinho</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden mt-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar produtos..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>

      {/* Navigation */}
      <nav className="border-t border-border">
        <div className="container">
          <ul className="hidden md:flex items-center justify-center gap-8 py-3 text-sm">
            <li>
              <Link href="/produtos" className="hover:text-primary transition-colors">
                Todos os Produtos
              </Link>
            </li>
            <li>
              <Link href="/produtos?categoria=batons" className="hover:text-primary transition-colors">
                Batons
              </Link>
            </li>
            <li>
              <Link href="/produtos?categoria=sombras" className="hover:text-primary transition-colors">
                Sombras
              </Link>
            </li>
            <li>
              <Link href="/produtos?categoria=pinceis" className="hover:text-primary transition-colors">
                Pincéis
              </Link>
            </li>
            <li>
              <Link href="/produtos?categoria=skincare" className="hover:text-primary transition-colors">
                Skincare
              </Link>
            </li>
            <li>
              <Link href="/produtos?categoria=perfumes" className="hover:text-primary transition-colors">
                Perfumes
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container py-4 space-y-4">
            <Link
              href="/produtos"
              className="block py-2 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Todos os Produtos
            </Link>
            <Link
              href="/produtos?categoria=batons"
              className="block py-2 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Batons
            </Link>
            <Link
              href="/produtos?categoria=sombras"
              className="block py-2 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sombras
            </Link>
            <Link
              href="/produtos?categoria=pinceis"
              className="block py-2 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pincéis
            </Link>
            <Link
              href="/produtos?categoria=skincare"
              className="block py-2 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Skincare
            </Link>
            <Link
              href="/produtos?categoria=perfumes"
              className="block py-2 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Perfumes
            </Link>
            <div className="border-t border-border pt-4 space-y-2">
              {isAuthenticated ? (
                <Link href="/conta" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full gap-2">
                    <User className="h-4 w-4" />
                    <span>{user?.name || "Minha Conta"}</span>
                  </Button>
                </Link>
              ) : (
                <a href={getLoginUrl()}>
                  <Button variant="outline" className="w-full gap-2">
                    <User className="h-4 w-4" />
                    <span>Entrar</span>
                  </Button>
                </a>
              )}
              <Link href="/carrinho" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="default" className="w-full gap-2 relative">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Carrinho</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-background text-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center border border-border">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

