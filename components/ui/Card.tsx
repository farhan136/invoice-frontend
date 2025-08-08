import React from 'react';

// Define the props for the card component
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A reusable card component for content grouping.
 */
export const Card = ({ children, className }: CardProps) => {
  return (
    <div
      className={`
        bg-white shadow-md rounded-lg p-6
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;