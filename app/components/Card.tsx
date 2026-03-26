import { ReactNode } from "react"

interface CardProps {
 children: ReactNode;
 className?: string;
 style?: React.CSSProperties;
}

const Card = ({ children, className = "", style }: CardProps) => {
 return (
  <div
   className={`bg-bg border-brutal border-border rounded-brutal shadow-brutal p-6 md:p-8 ${className}`}
   style={style}
  >
   {children}
  </div>
 );
};

export default Card;
