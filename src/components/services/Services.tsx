import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Check, Plus, ShoppingBag, X } from "lucide-react";
import Section from "@/components/layout/Section";
import { Button, ICON_CONTROL } from "@/components/ui/Button";
import { formatPrice, SERVICES, type ServiceProduct } from "@/config/services";
import { cn } from "@/lib/utils";

interface ServicesProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
  /** Hands the chosen packages to the contact form. */
  onSend: () => void;
}

interface RequestDrawerProps {
  products: ServiceProduct[];
  onRemove: (id: string) => void;
  onSend: () => void;
  onClose: () => void;
}

const SCROLL_LOCK_CLASS = "scroll-locked";
const PANEL_VARIANTS = { closed: { x: "100%" }, open: { x: 0 } };
const SCRIM_VARIANTS = { closed: { opacity: 0 }, open: { opacity: 1 } };
const PANEL_TRANSITION = { duration: 0.35, ease: [0.16, 1, 0.3, 1] } as const;

function RequestDrawer({ products, onRemove, onSend, onClose }: RequestDrawerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const page = document.getElementById("page");
    page?.setAttribute("inert", "");
    document.documentElement.classList.add(SCROLL_LOCK_CLASS);
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      page?.removeAttribute("inert");
      document.documentElement.classList.remove(SCROLL_LOCK_CLASS);
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-50">
      <motion.div
        variants={SCRIM_VARIANTS}
        initial="closed"
        animate="open"
        exit="closed"
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="absolute inset-0 bg-scrim/60"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-title"
        variants={PANEL_VARIANTS}
        initial="closed"
        animate="open"
        exit="closed"
        transition={PANEL_TRANSITION}
        className="absolute inset-y-0 right-0 flex w-[min(92vw,26rem)] flex-col border-l border-border bg-surface shadow-2xl shadow-scrim/40"
      >
        <div className="flex items-center justify-between border-b border-border py-3 pr-3 pl-6">
          <h3 id="request-title" className="text-lg font-semibold text-foreground">
            Your request
          </h3>
          <button ref={closeRef} type="button" aria-label="Close your request" onClick={onClose} className={ICON_CONTROL}>
            <X />
          </button>
        </div>

        {products.length === 0 ? (
          <p className="p-6 text-muted-foreground">Nothing here yet. Add a package to start a request.</p>
        ) : (
          <ul className="flex-1 divide-y divide-border overflow-y-auto px-6">
            {products.map((product) => (
              <li key={product.id} className="flex items-start gap-3 py-5">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{product.name}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {formatPrice(product)} / {product.delivery}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${product.name}`}
                  onClick={() => onRemove(product.id)}
                  className={cn(ICON_CONTROL, "-mt-2 -mr-2")}
                >
                  <X />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto border-t border-border p-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            No payment here. Sending fills in the contact form, where you can add details and send it by email or
            WhatsApp.
          </p>
          <Button className="mt-5 w-full" disabled={products.length === 0} onClick={onSend}>
            Send request
          </Button>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}

export default function Services({ selectedIds, onToggle, onSend }: ServicesProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const selected = SERVICES.filter((product) => selectedIds.includes(product.id));

  return (
    <Section
      id="services"
      title="Services"
      intro="Pick what you need like you would in a shop. Nothing is charged here: your picks become a message to me."
      action={
        <Button size="sm" onClick={() => setDrawerOpen(true)} aria-haspopup="dialog">
          <ShoppingBag aria-hidden="true" />
          Your request ({selected.length})
        </Button>
      }
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((product) => {
          const isSelected = selectedIds.includes(product.id);
          return (
            <li
              key={product.id}
              className={cn(
                "flex flex-col rounded-card border border-border bg-surface p-6 transition-colors duration-200",
                isSelected && "border-accent",
              )}
            >
              <h3 className="text-xl font-semibold text-foreground">{product.name}</h3>
              <ul className="mt-4 space-y-2 text-[0.9375rem] text-muted-foreground">
                {product.included.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <Check className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-7">
                <p className="font-mono text-2xl font-bold tracking-tight text-foreground">
                  {product.price !== null && (
                    <span className="mb-1 block text-xs font-normal tracking-normal text-muted-foreground">
                      Starting from
                    </span>
                  )}
                  {product.price === null ? "Let's talk" : `$${product.price.toLocaleString("en-US")}`}
                </p>
                <p className="mt-2 font-mono text-xs text-muted-foreground">Delivery: {product.delivery}</p>
                <Button
                  size="sm"
                  className="mt-5 w-full"
                  aria-pressed={isSelected}
                  onClick={() => onToggle(product.id)}
                >
                  {isSelected ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
                  {isSelected ? "Added to request" : "Add to request"}
                </Button>
              </div>
            </li>
          );
        })}
      </ul>

      <AnimatePresence>
        {drawerOpen && (
          <RequestDrawer
            products={selected}
            onRemove={onToggle}
            onClose={() => setDrawerOpen(false)}
            onSend={() => {
              setDrawerOpen(false);
              onSend();
            }}
          />
        )}
      </AnimatePresence>
    </Section>
  );
}
