export default function PatientStoriesLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdeaf2] via-[#fff5f9] to-[#fde7f0] -mb-24 pb-48">
      <section className="relative -mt-36 overflow-hidden pt-[150px] pb-24 sm:pt-[130px] md:-mt-40 lg:pt-[140px] lg:pb-32">
        <div className="relative mx-auto grid max-w-[90rem] grid-cols-1 items-center gap-14 px-[22px] md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
          <div>
            <div className="h-7 w-36 animate-pulse rounded-full bg-rose-200/60" />
            <div className="mt-5 h-12 w-3/4 animate-pulse rounded-2xl bg-rose-200/50" />
            <div className="mt-4 h-5 w-full max-w-md animate-pulse rounded-lg bg-rose-200/30" />
            <div className="mt-2 h-5 w-2/3 max-w-sm animate-pulse rounded-lg bg-rose-200/30" />
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="size-11 animate-pulse rounded-full bg-rose-200/60 ring-4 ring-rose-50" />
                ))}
              </div>
              <div className="h-4 w-40 animate-pulse rounded bg-rose-200/40" />
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="h-64 w-full animate-pulse rounded-[2.5rem] bg-rose-200/40 md:h-80" />
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-[90rem] px-[22px] py-16 md:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto h-4 w-28 animate-pulse rounded-full bg-rose-200/50" />
          <div className="mx-auto mt-4 h-10 w-64 animate-pulse rounded-xl bg-rose-200/50" />
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-56 animate-pulse rounded-2xl border border-rose-100 bg-white/70 p-6 shadow-sm" />
          ))}
        </div>
      </section>
    </div>
  );
}

