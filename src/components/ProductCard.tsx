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

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
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

        <Button className="w-full" onClick={() => onAddToCart(product.id)}>
          Adicionar ao Carrinho
        </Button>
      </CardContent>
    </Card>
  );
}
