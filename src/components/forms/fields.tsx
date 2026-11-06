import { CircleAlert } from "lucide-react";
import { forwardRef, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "block w-full min-h-12 rounded-md border border-[var(--line)] bg-[var(--surface-raised)] px-4 py-3 text-base text-[var(--fg)] shadow-[inset_0_1px_2px_rgb(15_23_20/0.04)] placeholder:text-[var(--fg-muted)]/70 transition-[border-color,box-shadow] hover:border-[var(--fg-muted)] focus-visible:border-forest-500 focus-visible:shadow-[0_0_0_4px_rgb(13_104_59/0.14)] aria-[invalid=true]:border-[#B42318] aria-[invalid=true]:shadow-[0_0_0_3px_rgb(180_35_24/0.10)]";

export function Field({ id, label, error, hint, required, children, className }: {
  id: string; label: string; error?: string; hint?: string; required?: boolean; children: ReactNode; className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="block text-sm font-semibold">
        {label} {required ? <span aria-hidden className="text-forest-500">*</span> : <span className="font-normal text-[var(--fg-muted)]">(optional)</span>}
      </label>
      {hint && <p id={`${id}-hint`} className="text-sm text-[var(--fg-muted)]">{hint}</p>}
      {children}
      {error && (
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-sm font-medium text-[#B42318]">
          <CircleAlert aria-hidden strokeWidth={2} className="mt-0.5 size-4 shrink-0" />{error}
        </p>
      )}
    </div>
  );
}

export const describedBy = (id: string, error?: string, hint?: string) =>
  [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(" ") || undefined;

export const Input = forwardRef<HTMLInputElement, ComponentProps<"input">>(function Input({ className, ...p }, ref) {
  return <input ref={ref} className={cn(inputClass, className)} {...p} />;
});
export const Textarea = forwardRef<HTMLTextAreaElement, ComponentProps<"textarea">>(function Textarea({ className, ...p }, ref) {
  return <textarea ref={ref} className={cn(inputClass, "min-h-32 resize-y", className)} {...p} />;
});
export const Select = forwardRef<HTMLSelectElement, ComponentProps<"select">>(function Select({ className, ...p }, ref) {
  return <select ref={ref} className={cn(inputClass, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22none%22 stroke=%22%2343504A%22 stroke-width=%221.5%22><path d=%22m4 6 4 4 4-4%22/></svg>')] bg-[right_1rem_center] bg-no-repeat pr-10", className)} {...p} />;
});

export const Honeypot = (p: ComponentProps<"input">) => (
  <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
    <label>Leave this field empty<input type="text" tabIndex={-1} autoComplete="off" {...p} /></label>
  </div>
);
