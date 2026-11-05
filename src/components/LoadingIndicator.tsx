export const LoadingIndicator = () => (
  <div className="rounded-2xl bg-accent/[0.04] px-3 py-5 sm:px-4 dark:bg-accent/[0.06]" role="status">
    <div className="flex items-center gap-4">
      <div className="relative size-8 shrink-0">
        <div className="absolute inset-0 animate-[spin_2s_linear_infinite] rounded-lg bg-gradient-to-r from-accent via-accent-2 to-accent" />
        <div className="bg-brand absolute inset-[2px] grid place-items-center rounded-[6px] text-xs font-semibold text-white">
          AI
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-medium text-muted">Thinking</span>
        <div className="flex gap-1.5">
          {[0, 200, 400].map((delay) => (
            <span
              key={delay}
              className="size-2 animate-[bounce_0.8s_infinite] rounded-full bg-accent"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
)
