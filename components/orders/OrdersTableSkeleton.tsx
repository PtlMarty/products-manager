"use client";

export default function OrdersTableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="hidden sm:block">
        <div className="min-w-full border-collapse">
          <div className="bg-gray-100">
            <div className="grid grid-cols-6 gap-4 px-4 py-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="grid grid-cols-6 gap-4 px-4 py-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Skeleton */}
      <div className="block sm:hidden space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg space-y-3">
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="flex space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 w-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
