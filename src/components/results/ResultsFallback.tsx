/** Skeleton with the same footprint as the results page, so nothing jumps when it streams in. */
export function ResultsFallback() {
  return (
    <div aria-hidden>
      <div className="h-[9.5rem] border-b border-hairline bg-paper-2 md:h-[10.5rem]" />
      <div className="container-x py-10">
        <div className="h-9 w-56 rounded-sm bg-paper-2" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <div className="aspect-[4/3] rounded-sm bg-paper-2" />
              <div className="mt-4 h-6 w-3/4 rounded-sm bg-paper-2" />
              <div className="mt-2 h-4 w-1/2 rounded-sm bg-paper-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
