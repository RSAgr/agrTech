import React, { useRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading,
  className = '',
  disabled,
  onClick,
  ...props
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const span = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      span.style.width = span.style.height = `${size}px`;
      span.style.left = `${e.clientX - rect.left - size / 2}px`;
      span.style.top = `${e.clientY - rect.top - size / 2}px`;
      span.className = 'ripple-effect';
      btnRef.current.appendChild(span);
      setTimeout(() => span.remove(), 700);
    }
    onClick?.(e);
  };

  const base = variant === 'primary' ? 'btn-primary' : 'btn-secondary';

  return (
    <button
      ref={btnRef}
      className={`${base} ${className} ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? (
        <span className="flex gap-1 items-center">
          <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
        </span>
      ) : children}
    </button>
  );
};
