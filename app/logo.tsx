export default function Logo({
  className = "h-20 w-auto",
}: {
  className?: string;
}) {
  return (
    // Plain <img>: SVGs are not optimized by next/image unless the app opts
    // into dangerouslyAllowSVG, which is not warranted for a local vector.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-full-title.svg"
      alt="AI In-memory Database Club"
      width={443}
      height={261}
      className={className}
    />
  );
}