/** Re-mounts per navigation → subtle page-in transition (disabled under reduced motion). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
