'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface AdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  onSave?: () => void;
  saveLabel?: string;
  disabled?: boolean;
}

export function AdminDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  actions,
  className,
  isLoading,
  onSave,
  saveLabel = 'Save Changes',
  disabled,
}: AdminDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('sm:max-w-[600px] p-0 gap-0 overflow-hidden', className)}>
        <DialogHeader className="px-6 py-4 border-b bg-muted/10">
          <DialogTitle className="text-xl font-semibold text-gradient-primary">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="px-6 py-6 space-y-6">{children}</div>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t bg-muted/10 gap-2">
          {actions ? (
            actions
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancel
              </Button>
              {onSave && (
                <Button
                  onClick={onSave}
                  disabled={isLoading || disabled}
                  className="btn-gradient-primary min-w-[100px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    saveLabel
                  )}
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
