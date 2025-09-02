import React, { forwardRef } from 'react';
import { ButtonProps } from '@/types';
import { cn } from '@/utils';

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = 'button',
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      onClick,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        onClick={onClick}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed',
          
          // Size variants
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-sm': size === 'md',
            'px-6 py-3 text-base': size === 'lg',
          },
          
          // Color variants
          {
            // Primary
            'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300':
              variant === 'primary',
            
            // Secondary
            'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-300':
              variant === 'secondary',
            
            // Outline
            'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400':
              variant === 'outline',
            
            // Ghost
            'text-gray-700 hover:bg-gray-100 focus:ring-blue-500 disabled:text-gray-400 disabled:hover:bg-transparent':
              variant === 'ghost',
          },
          
          // Loading state
          loading && 'cursor-wait',
          
          // Custom className
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;