import { HTMLAttributes, ReactNode } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

const Container = ({ children, className = '', ...props }: ContainerProps) => {
  return (
    <div
      className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-background rounded-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;