import React from 'react';

// Define the props for the label component
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

/**
 * A reusable label component for form elements.
 */
export const Label = ({ children, className, ...props }: LabelProps) => {
  return (
    <label
      className={`
        block text-sm font-medium text-gray-900 mb-1
        ${className}
      `}
      {...props}
    >
      {children}
    </label>
  );
};

export default Label;