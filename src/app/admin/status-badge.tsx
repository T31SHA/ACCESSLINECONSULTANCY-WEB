import { cn } from "@/lib/utils";

const tone: Record<string, string> = {
  new: "bg-accent-400/25 text-[#7a4a12]",
  contacted: "bg-mint-200 text-forest-900",
  qualified: "bg-forest-500 text-white",
  proposal: "bg-forest-700 text-sand-50",
  won: "bg-forest-900 text-sand-50",
  lost: "bg-sand-200 text-slate-600",
  spam: "bg-[#FEE4E2] text-[#7A271A]",
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={cn("inline-flex rounded-pill px-2.5 py-0.5 text-xs font-semibold capitalize", tone[status])}>{status}</span>;
}
