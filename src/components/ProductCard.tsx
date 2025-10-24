import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Product } from "@/types/product";
import { formatPrice } from "@/utils/amount";
import { useCart } from "@/contexts/CartContext";
import { Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { cart } = useCart();

  // Verifica se o produto já está no carrinho
  const isInCart = cart.items.some((item) => item.productId === product.id);
  return (
    <Card className="h-full flex flex-col p-0 overflow-hidden">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <CardHeader className="flex-1">
        <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 pb-6">
        <div className="text-2xl font-bold text-primary">
          {formatPrice(product.price)}
        </div>

        {isInCart ? (
          <Button className="w-full" disabled>
            <Check className="h-4 w-4 mr-2" />
            Adicionado
          </Button>
        ) : (
          <Button className="w-full" onClick={() => onAddToCart(product.id)}>
            Adicionar ao Carrinho
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
