import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  selected,
  interactive = true,
  ...props
}) => {
  return (
    <div
      className={`
        ${interactive ? 'card-interactive' : 'card'} 
        ${selected ? 'selected' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
