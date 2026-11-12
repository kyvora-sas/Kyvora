"use client";

import { useId } from "react";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

const BASE_CONTROL_CLASSES =
  "w-full rounded-xl bg-[#080B12] border border-[#252D3A] px-4 py-3 text-sm text-white placeholder:text-[#68768F] transition-colors focus:outline-none focus:border-[#1677FF] focus-visible:ring-2 focus-visible:ring-[#2B85FF]/35 disabled:opacity-50";

export function FieldLabel({
  htmlFor,
  children,
  required,
  className,
}: {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("block text-xs font-medium text-[#AFC4E8] mb-2", className)}
    >
      {children}
      {required ? <span className="text-[#1677FF] ml-1" aria-hidden="true">*</span> : null}
    </label>
  );
}

export function FieldWrapper({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <FieldLabel htmlFor={htmlFor} required={required} className="mb-1.5">
        {label}
      </FieldLabel>
      {children}
      {error ? (
        <p className="text-xs text-red-400" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-[#8F9BB3]">{hint}</p>
      ) : null}
    </div>
  );
}

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function TextInput({ hasError, className, ...props }: TextInputProps) {
  return (
    <input
      aria-invalid={hasError || undefined}
      className={cn(
        BASE_CONTROL_CLASSES,
        hasError && "border-red-500/70 focus:border-red-400",
        className
      )}
      {...props}
    />
  );
}

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export function SelectField({ hasError, className, children, ...props }: SelectFieldProps) {
  return (
    <select
      aria-invalid={hasError || undefined}
      className={cn(
        BASE_CONTROL_CLASSES,
        "cursor-pointer",
        hasError && "border-red-500/70 focus:border-red-400",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export function TextAreaField({ hasError, className, ...props }: TextAreaFieldProps) {
  return (
    <textarea
      aria-invalid={hasError || undefined}
      className={cn(
        BASE_CONTROL_CLASSES,
        "resize-none",
        hasError && "border-red-500/70 focus:border-red-400",
        className
      )}
      {...props}
    />
  );
}

export interface CheckboxFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
}

export function CheckboxField({ label, id, className, ...props }: CheckboxFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;

  return (
    <div className={cn("flex items-start gap-3", className)}>
      <input
        id={fieldId}
        type="checkbox"
        className="mt-1 h-4 w-4 rounded border-[#252D3A] bg-[#080B12] accent-[#1677FF] focus-visible:ring-2 focus-visible:ring-[#2B85FF] shrink-0 cursor-pointer"
        {...props}
      />
      <label htmlFor={fieldId} className="text-xs text-[#8F9BB3] leading-relaxed cursor-pointer">
        {label}
      </label>
    </div>
  );
}

