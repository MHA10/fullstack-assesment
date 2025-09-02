import React, { forwardRef } from 'react';
import { TextareaProps } from '@/types';
import { cn } from '@/utils';

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      id,
      name,
      placeholder,
      value,
      onChange,
      onBlur,
      error,
      required = false,
      disabled = false,
      rows = 4,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          rows={rows}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            // Base styles
            'w-full px-3 py-2 text-sm border rounded-md transition-colors duration-200',
            'placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2',
            'resize-vertical min-h-[80px]',
            // Default state
            'border-gray-300 bg-white text-gray-900',
            'focus:border-blue-500 focus:ring-blue-500',
            // Error state
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            // Disabled state
            disabled && 'bg-gray-50 text-gray-500 cursor-not-allowed opacity-60',
            // Custom className
            className
          )}
          {...props}
        />
        {error && (
          <p
            id={`${id}-error`}
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;