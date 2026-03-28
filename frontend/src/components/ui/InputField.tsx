import React, { forwardRef } from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const generatedId = id || label.replace(/\s+/g, '-').toLowerCase();
    
    return (
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor={generatedId} className="text-lg font-medium text-agri-dark">
          {label}
        </label>
        <input
          id={generatedId}
          ref={ref}
          className={`input ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
          {...props}
        />
        {error && (
          <span className="text-red-500 text-sm">{error}</span>
        )}
      </div>
    );
  }
);
InputField.displayName = 'InputField';
