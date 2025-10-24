import { Skeleton } from "@/components/ui/skeleton";

export function ProtectedLayoutSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar skeleton */}
      <nav className="bg-secondary border-b border-secondary/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo skeleton */}
            <div className="flex-shrink-0">
              <Skeleton className="h-6 w-32 bg-secondary-foreground/20" />
            </div>

            {/* User info and logout skeleton */}
            <div className="flex items-center space-x-4">
              <Skeleton className="h-4 w-32 bg-secondary-foreground/20" />
              <Skeleton className="h-8 w-16 bg-secondary-foreground/20" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main content skeleton */}
      <main>
        <div className="bg-gradient-to-br from-slate-50 via-yellow-50/20 to-blue-50/30 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Title skeleton */}
            <div className="text-center mb-8">
              <Skeleton className="h-10 w-48 mx-auto mb-4" />
              <Skeleton className="h-6 w-64 mx-auto" />
            </div>

            {/* Products grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={index}
                  className="bg-white rounded-xl border shadow-sm overflow-hidden"
                >
                  {/* Product image skeleton */}
                  <Skeleton className="h-48 w-full" />

                  {/* Product content skeleton */}
                  <div className="p-6 space-y-3">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>

                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
