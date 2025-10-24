import { ProductsList } from "@/components/ProductsList";

export default function HomePage() {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-yellow-50/20 to-blue-50/30 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Produtos</h1>
          <p className="text-lg text-muted-foreground">
            Explore nossa seleção de produtos
          </p>
        </div>

        <ProductsList />
      </div>
    </div>
  );
}
