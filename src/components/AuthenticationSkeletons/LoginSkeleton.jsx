import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function LoginSkeleton() {
  return (
    <div className="w-full lg:w-1/2 max-w-sm flex justify-center">
      <div className="w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <div className="text-center">
          <div className="mb-6">
            <Skeleton height={28} width={200} className="mx-auto mb-2" />
            <Skeleton height={96} width={96} circle className="mx-auto mb-9" />
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Skeleton height={48} width={300} className="rounded-lg" />
              <Skeleton height={48} className="flex-1 rounded-lg" />
            </div>
            
            <Skeleton height={16} width={120} className="mx-auto" />
            
            <Skeleton height={60} className="w-full rounded-lg" />

            <div className="mt-6">
              <Skeleton count={3} className="text-xs" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginSkeleton;