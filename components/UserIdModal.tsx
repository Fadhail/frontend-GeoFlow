'use client';

import React, { FormEvent, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface UserIdModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (userId: string) => Promise<void>;
  isValidating: boolean;
  error: string | null;
  onErrorClear: () => void;
}

export function UserIdModal({
  open,
  onOpenChange,
  onSubmit,
  isValidating,
  error,
  onErrorClear,
}: UserIdModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = React.useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      return;
    }

    await onSubmit(trimmedValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (error) onErrorClear();
  };

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="pointer-events-auto" onPointerDown={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Input Your User ID</DialogTitle>
          <DialogDescription>
            Select a user to view tracking history
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <label className="block">
              <span className="block text-sm font-medium">User ID</span>
              <Input
                ref={inputRef}
                type="text"
                placeholder="e.g., user123, john_doe"
                value={inputValue}
                onChange={handleInputChange}
                disabled={isValidating}
              />
              {error && (
                <p className="text-xs text-red-600 mt-2 font-medium bg-red-50 p-2 rounded border border-red-200">
                  ❌ {error}
                </p>
              )}
            </label>
          </div>

          <DialogDescription>
              Before you can view your tracking data, please create your tracker <a href="https://fadhail.github.io/mobile-GeoFlow/" className='text-blue-600 underline'>here</a>. or download app from <a href="#" className='text-blue-600 underline'>Google Play Store</a>.
          </DialogDescription>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setInputValue('');
                onErrorClear();
              }}
              disabled={isValidating}
            >
              Clear
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={isValidating || !inputValue.trim()}
              aria-busy={isValidating}
            >
              {isValidating ? '✓ Loading...' : '✓ View Tracking'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
