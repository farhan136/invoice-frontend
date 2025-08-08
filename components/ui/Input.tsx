import React from 'react';

// Define the props for the input component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * A reusable input field component.
 * It accepts all standard input attributes.
 */
export const Input = ({ className, ...props }: InputProps) => {
  return (
    <input
      className={`
        w-full px-3 py-2 border border-gray-300 rounded-md 
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${className}
      `}
      {...props}
    />
  );
};

export default Input;