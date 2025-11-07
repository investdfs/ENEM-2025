import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface InfoDialogProps {
  triggerLabel?: string;
  triggerIcon?: string;
  title: string;
  body: string;
  sourceLabel?: string;
}

export const InfoDialog = ({
  triggerLabel,
  triggerIcon = "i",
  title,
  body,
  sourceLabel,
}: InfoDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary shadow-sm hover:bg-primary/20 transition-colors"
        aria-label={triggerLabel || "Ver detalhes do procedimento"}
      >
        {triggerIcon}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md w-[92vw] sm:w-full bg-card/95 backdrop-blur shadow-2xl border border-border/80 rounded-3xl p-5">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px]">
                i
              </span>
              <span>{title}</span>
            </DialogTitle>
            <DialogDescription className="mt-2 text-[10px] leading-relaxed text-muted-foreground whitespace-pre-line">
              {body}
            </DialogDescription>
          </DialogHeader>
          {sourceLabel && (
            <div className="mt-3 text-[8px] text-muted-foreground/80 border-t border-border/60 pt-2">
              {sourceLabel}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};