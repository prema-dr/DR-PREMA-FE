"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import {
  ArrowLeftIcon as ArrowLeft,
  CaretLeftIcon as CaretLeft,
  CaretRightIcon as CaretRight,
  CheckCircleIcon as CheckCircle,
  ImageIcon as ImageGlyph,
  MagnifyingGlassIcon as MagnifyingGlass,
  SpinnerGapIcon as SpinnerGap,
  StarIcon as Star,
  UploadSimpleIcon as UploadSimple,
  WarningCircleIcon as WarningCircle,
  XIcon as X,
} from "@phosphor-icons/react/dist/ssr";
import { api, errorMessage } from "@/lib/admin-api";
import { services } from "@/lib/services";

/* ───────────── Toasts ───────────── */

type Toast = { id: number; tone: "success" | "error"; message: string };
const ToastContext = createContext<(tone: Toast["tone"], message: string) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const push = useCallback((tone: Toast["tone"], message: string) => {
    const id = ++counter.current;
    setToasts((list) => [...list, { id, tone, message }]);
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 4200);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="admin-pop pointer-events-auto flex max-w-sm items-start gap-3 rounded-2xl border border-rose-100 bg-white px-4 py-3 text-sm text-rose-950 shadow-[0_12px_32px_-8px_rgba(143,32,63,0.25)]"
          >
            {t.tone === "success" ? (
              <CheckCircle size={20} weight="fill" className="mt-px shrink-0 text-emerald-500" />
            ) : (
              <WarningCircle size={20} weight="fill" className="mt-px shrink-0 text-rose-600" />
            )}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const push = useContext(ToastContext);
  return { success: (m: string) => push("success", m), error: (m: string) => push("error", m) };
};

/* ───────────── Layout pieces ───────────── */

export function PageHeader({
  title,
  subtitle,
  back,
  actions,
}: {
  title: string;
  subtitle?: string;
  back?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-10 flex min-h-[76px] items-center justify-between gap-4 border-b border-rose-100/70 bg-white/85 px-5 py-4 backdrop-blur-md sm:px-8">
      <div className="flex min-w-0 items-center gap-3">
        {back && (
          <Link
            href={back}
            aria-label="Back"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-rose-100 bg-white text-rose-900 transition-colors hover:border-rose-300 hover:text-rose-600"
          >
            <ArrowLeft size={16} weight="bold" />
          </Link>
        )}
        <div className="min-w-0">
          <h1 className="truncate font-display text-xl font-semibold tracking-tight text-rose-950 sm:text-2xl">{title}</h1>
          {subtitle && <p className="mt-0.5 truncate text-sm text-rose-900/60">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}

export function PageBody({ children, narrow }: { children: ReactNode; narrow?: boolean }) {
  return <div className={`admin-rise mx-auto w-full p-5 sm:p-8 ${narrow ? "max-w-5xl" : "max-w-[84rem]"}`}>{children}</div>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-3xl border border-rose-100/80 bg-white shadow-[0_2px_15px_-3px_rgba(232,64,122,0.08),0_10px_20px_-2px_rgba(232,64,122,0.04)] ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-5">
      <h2 className="font-display text-base font-semibold text-rose-950">{title}</h2>
      {hint && <p className="mt-0.5 text-sm text-rose-900/55">{hint}</p>}
    </div>
  );
}

/* ───────────── Buttons ───────────── */

type Variant = "primary" | "secondary" | "danger" | "ghost";

export function buttonClass(variant: Variant = "primary", size: "md" | "sm" = "md") {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";
  const sizes = size === "sm" ? "px-3 py-1.5 text-[13px]" : "px-4 py-2.5 text-sm";
  const variants: Record<Variant, string> = {
    primary:
      "bg-gradient-to-b from-rose-500 to-rose-600 text-white shadow-[0_6px_16px_-6px_rgba(232,64,122,0.7)] hover:from-rose-500 hover:to-rose-700",
    secondary: "border border-rose-200 bg-white text-rose-900 hover:border-rose-300 hover:bg-rose-50",
    danger: "border border-rose-200 bg-white text-rose-700 hover:border-rose-600 hover:bg-rose-600 hover:text-white",
    ghost: "text-rose-900/70 hover:bg-rose-50 hover:text-rose-700",
  };
  return `${base} ${sizes} ${variants[variant]}`;
}

export function Button({
  variant = "primary",
  size = "md",
  loading,
  children,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: "md" | "sm"; loading?: boolean }) {
  return (
    <button type="button" {...rest} disabled={rest.disabled || loading} className={`${buttonClass(variant, size)} ${className}`}>
      {loading && <SpinnerGap size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

/* ───────────── Form controls ───────────── */

export const inputClass =
  "w-full rounded-xl border border-rose-100 bg-rose-50/40 px-3.5 py-2.5 text-sm text-rose-950 placeholder:text-rose-900/35 transition-colors focus:border-rose-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-rose-100";

export function Field({
  label,
  required,
  hint,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 flex items-baseline gap-1 text-[13px] font-medium text-rose-950">
        {label}
        {required && <span className="text-rose-600">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-rose-900/50">{hint}</span>}
    </label>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 disabled:opacity-50 ${
        checked ? "bg-rose-500" : "bg-rose-200/70"
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

export function ToggleRow({
  checked,
  onChange,
  title,
  hint,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-rose-100 bg-rose-50/40 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-rose-950">{title}</p>
        {hint && <p className="text-xs text-rose-900/55">{hint}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} label={title} />
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
      <MagnifyingGlass size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-900/40" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputClass} !bg-white pl-10`}
      />
    </div>
  );
}

export function Select({
  value,
  onChange,
  children,
  className = "",
}: {
  value: string | number;
  onChange: (v: string) => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass} !bg-white pr-8 ${className}`}>
      {children}
    </select>
  );
}

/* Service/category picker shared by every content module. */
export function ServiceSelect({
  value,
  onChange,
  allLabel,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  allLabel?: string;
  className?: string;
}) {
  return (
    <Select value={value} onChange={onChange} className={className}>
      <option value="">{allLabel ?? "Select a service"}</option>
      {services.map((s) => (
        <option key={s.slug} value={s.slug}>
          {s.name}
        </option>
      ))}
    </Select>
  );
}

/* Image upload with preview. `onFile` receives the chosen file (or null when removed). */
export function ImagePicker({
  url,
  onFile,
  aspect = "aspect-[16/10]",
  label = "Upload image",
}: {
  url?: string | null;
  onFile: (file: File | null) => void;
  aspect?: string;
  label?: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const shown = preview ?? url ?? null;

  function pick(file?: File) {
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    onFile(file);
  }

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        pick(e.dataTransfer.files?.[0]);
      }}
      className={`group relative flex ${aspect} w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed text-rose-900/60 transition-colors ${
        dragging ? "border-rose-500 bg-rose-50" : "border-rose-200 bg-rose-50/40 hover:border-rose-400 hover:bg-rose-50"
      }`}
    >
      {shown ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={shown} alt="" className="absolute inset-0 size-full object-cover" />
      ) : (
        <>
          <span className="flex size-11 items-center justify-center rounded-full bg-white text-rose-500 shadow-sm">
            <ImageGlyph size={22} weight="duotone" />
          </span>
          <span className="text-sm">
            Drop an image or <span className="font-medium text-rose-600">browse</span>
          </span>
          <span className="text-xs text-rose-900/40">JPEG, PNG or WebP · max 5 MB</span>
        </>
      )}
      {shown && (
        <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-gradient-to-t from-rose-950/70 to-transparent py-3 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
          <UploadSimple size={14} weight="bold" />
          {label}
        </span>
      )}
      <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
    </label>
  );
}

/* ───────────── Display bits ───────────── */

export function StatusPill({ on, onLabel = "Enabled", offLabel = "Disabled" }: { on: boolean; onLabel?: string; offLabel?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        on ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-500"
      }`}
    >
      <span className={`size-1.5 rounded-full ${on ? "bg-emerald-500" : "bg-stone-400"}`} />
      {on ? onLabel : offLabel}
    </span>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="inline-flex max-w-full truncate rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700">{children}</span>;
}

export function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={14} weight={n <= value ? "fill" : "regular"} className={n <= value ? "text-amber-400" : "text-rose-200"} />
      ))}
    </span>
  );
}

export function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onClick={() => onChange(n)}
          className="rounded-lg p-1 transition-transform hover:scale-110"
        >
          <Star size={26} weight={n <= value ? "fill" : "regular"} className={n <= value ? "text-amber-400" : "text-rose-200"} />
        </button>
      ))}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-rose-100/60 ${className}`} />;
}

export function GridSkeleton({ count = 6, className = "h-56" }: { count?: number; className?: string }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className={className} />
      ))}
    </div>
  );
}

export function EmptyState({ icon, title, hint, action }: { icon: ReactNode; title: string; hint: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-rose-200 bg-white/60 px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">{icon}</span>
      <p className="mt-4 font-display text-base font-semibold text-rose-950">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-rose-900/55">{hint}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <EmptyState
      icon={<WarningCircle size={28} weight="duotone" />}
      title="Couldn't load this"
      hint={message}
      action={<Button variant="secondary" onClick={onRetry}>Try again</Button>}
    />
  );
}

export function Pagination({
  page,
  totalPages,
  total,
  onPage,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPage: (p: number) => void;
}) {
  if (totalPages <= 1) return <p className="mt-6 text-center text-xs text-rose-900/45">{total} total</p>;
  return (
    <div className="mt-8 flex items-center justify-between gap-4">
      <p className="text-sm text-rose-900/55">
        Page {page} of {totalPages} · {total} total
      </p>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          <CaretLeft size={14} weight="bold" /> Prev
        </Button>
        <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>
          Next <CaretRight size={14} weight="bold" />
        </Button>
      </div>
    </div>
  );
}

/* ───────────── Overlays ───────────── */

function useEscape(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEscape(open, onClose);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={title}>
      <div className="admin-fade absolute inset-0 bg-rose-950/30 backdrop-blur-[2px]" onClick={onClose} />
      <div className="admin-slide relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-rose-100 px-6 py-4">
          <h2 className="font-display text-lg font-semibold text-rose-950">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-rose-900/60 hover:bg-rose-50 hover:text-rose-700">
            <X size={18} weight="bold" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-rose-100 bg-rose-50/40 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  loading,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEscape(open, onCancel);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="alertdialog" aria-modal="true" aria-label={title}>
      <div className="admin-fade absolute inset-0 bg-rose-950/40 backdrop-blur-[2px]" onClick={onCancel} />
      <div className="admin-pop relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <WarningCircle size={26} weight="duotone" />
        </span>
        <h2 className="mt-4 font-display text-lg font-semibold text-rose-950">{title}</h2>
        <p className="mt-1.5 text-sm text-rose-900/65">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button loading={loading} onClick={onConfirm} className="!bg-rose-600 !from-rose-600 !to-rose-700 !text-white !border-transparent">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ───────────── Data hook ───────────── */

type ListState<T> = { key: string; data: T | null; error: string | null };

/** Fetches `path` whenever `key` (path + query) changes; `reload()` refetches. Loading is derived, not stored. */
export function useFetch<T>(path: string, query?: Record<string, string | number | boolean | undefined | null>) {
  const key = JSON.stringify([path, query]);
  const [nonce, setNonce] = useState(0);
  const [state, setState] = useState<ListState<T>>({ key: "", data: null, error: null });
  const fullKey = `${key}#${nonce}`;

  useEffect(() => {
    let live = true;
    api
      .get<T>(path, query)
      .then((data) => live && setState({ key: fullKey, data, error: null }))
      .catch((e) => live && setState({ key: fullKey, data: null, error: errorMessage(e) }));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullKey]);

  const settled = state.key === fullKey;
  return {
    data: settled ? state.data : (state.data ?? null),
    loading: !settled,
    error: settled ? state.error : null,
    reload: () => setNonce((n) => n + 1),
  };
}

export function useDebounced<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/** Calls `onNew` once when the page was opened with ?new=1 (used by dashboard quick actions). */
export function useNewParam(onNew: () => void) {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("new") === "1") onNew();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** Shared list state for the drawer-based modules: filters, paging, delete + toggle handlers. */
export function useModule<T extends { id: string; isEnabled: boolean }>(resource: string, label: string, limit = 12) {
  const toast = useToast();
  const [serviceId, setServiceId] = useState("");
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<T | "new" | null>(null);
  const [toDelete, setToDelete] = useState<T | null>(null);
  const [busy, setBusy] = useState(false);

  const debounced = useDebounced(search);
  const list = useFetch<{ items: T[]; meta: { page: number; limit: number; total: number; totalPages: number } }>(`admin/${resource}`, {
    page, limit, search: debounced, serviceSlug: serviceId, isEnabled: state,
  });

  const filter = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setPage(1);
  };

  async function toggle(item: T, isEnabled: boolean) {
    try {
      await api.patch(`admin/${resource}/${item.id}`, { isEnabled });
      toast.success(`${label} ${isEnabled ? "enabled" : "disabled"}`);
      list.reload();
    } catch (e) {
      toast.error(errorMessage(e));
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setBusy(true);
    try {
      await api.remove(`admin/${resource}/${toDelete.id}`);
      toast.success(`${label} deleted`);
      setToDelete(null);
      list.reload();
    } catch (e) {
      toast.error(errorMessage(e));
    }
    setBusy(false);
  }

  return {
    list, page, setPage, search, setSearch: filter(setSearch), serviceId, setServiceId: filter(setServiceId),
    state, setState: filter(setState), editing, setEditing, toDelete, setToDelete, busy, toggle, confirmDelete,
  };
}

/** The filter row used above every drawer-based list. */
export function FilterBar({
  search, onSearch, serviceId, onService, state, onState, placeholder,
}: {
  search: string; onSearch: (v: string) => void; serviceId: string; onService: (v: string) => void;
  state: string; onState: (v: string) => void; placeholder: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-3">
      <SearchInput value={search} onChange={onSearch} placeholder={placeholder} />
      <ServiceSelect value={serviceId} onChange={onService} allLabel="All services" className="!w-auto min-w-[180px]" />
      <Select value={state} onChange={onState} className="!w-auto min-w-[140px]">
        <option value="">All statuses</option>
        <option value="true">Enabled</option>
        <option value="false">Disabled</option>
      </Select>
    </div>
  );
}

/** Drawer form footer + submit plumbing shared by all four modules. */
export function useDrawerSave(onDone: () => void) {
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  async function save(action: () => Promise<unknown>, message: string) {
    setSaving(true);
    try {
      await action();
      toast.success(message);
      onDone();
    } catch (e) {
      toast.error(errorMessage(e));
    }
    setSaving(false);
  }
  return { saving, save };
}
