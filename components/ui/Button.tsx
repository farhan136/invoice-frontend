import React from 'react';

// Define the props for the button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

/**
 * A reusable button component.
 * It accepts all standard button attributes.
 */
export const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button
      className={`
        px-4 py-2 rounded-md font-semibold text-white
        bg-blue-600 hover:bg-blue-700 focus:outline-none 
        focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
        disabled:bg-gray-400 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;