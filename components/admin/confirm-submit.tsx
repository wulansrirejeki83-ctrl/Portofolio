"use client";

import type { ReactNode } from "react";

interface ConfirmSubmitProps {
  message: string;
  children: ReactNode;
  className?: string;
  title?: string;
  disabled?: boolean;
}

/**
 * Tombol submit yang meminta konfirmasi sebelum form dikirim.
 */
export function ConfirmSubmit({
  message,
  children,
  className,
  title,
  disabled,
}: ConfirmSubmitProps) {
  return (
    <button
      type="submit"
      title={title}
      disabled={disabled}
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
      className={className}
    >
      {children}
    </button>
  );
}
