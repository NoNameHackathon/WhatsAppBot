interface FloatingIconProps {
  icon: React.ReactNode;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function FloatingIcon({ icon, position, size = 'md', className = '' }: FloatingIconProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const style = {
    top: position.top,
    bottom: position.bottom,
    left: position.left,
    right: position.right,
  };

  return (
    <div 
      className={`absolute ${sizeClasses[size]} text-white/30 ${className}`}
      style={style}
    >
      {icon}
    </div>
  );
}
