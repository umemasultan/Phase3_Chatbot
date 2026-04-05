import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:shadow-2xl focus:ring-purple-500 shadow-lg',
    secondary: 'bg-gray-100 dark:bg-[#0A1854] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#0A1854]/70 focus:ring-gray-500 border border-gray-200 dark:border-[#0A1854]',
    danger: 'bg-gradient-to-r from-red-600 via-pink-600 to-red-600 text-white hover:shadow-2xl focus:ring-red-500 shadow-lg',
    outline: 'border-2 border-gray-300 dark:border-[#0A1854] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#0A1854]/30 hover:border-gray-400 dark:hover:border-[#0A1854] focus:ring-blue-500 backdrop-blur-sm'
  };

  const sizeClasses = {
    sm: 'text-xs py-2 px-4',
    md: 'text-sm py-3 px-6',
    lg: 'text-base py-3.5 px-8'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}