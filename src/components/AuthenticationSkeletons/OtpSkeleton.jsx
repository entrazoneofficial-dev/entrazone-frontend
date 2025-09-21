import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function OtpSkeleton() {
  return (
    <div className="w-full lg:w-1/2 max-w-sm flex justify-center">
      <div className="w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <div className="text-center">
          <div className="mb-6">
            <Skeleton height={28} width={250} className="mx-auto mb-2" />
            <Skeleton height={16} width={200} className="mx-auto mb-4" />
            <Skeleton height={96} width={96} circle className="mx-auto mb-9" />
          </div>

          <div className="space-y-12">
            <div className="space-y-9">
              <div className="flex justify-center gap-2 sm:gap-3">
                {[0, 1, 2, 3].map((index) => (
                  <Skeleton 
                    key={index} 
                    height={48} 
                    width={48} 
                    className="rounded-lg" 
                  />
                ))}
              </div>

              <Skeleton height={60} className="w-full rounded-lg" />
            </div>

            <Skeleton count={3} className="text-xs" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtpSkeleton;