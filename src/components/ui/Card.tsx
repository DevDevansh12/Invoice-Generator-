import React, { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export const Card: React.FC<CardProps> = ({
  className,
  title,
  description,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden',
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div className="p-6 border-b border-gray-200">
          {title && <h3 className="text-xl font-semibold text-gray-800">{title}</h3>}
          {description && <p className="mt-2 text-gray-600">{description}</p>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default Card;