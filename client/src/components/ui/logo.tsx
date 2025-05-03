const Logo = ({ className = "", white = false }: { className?: string; white?: boolean }) => {
  return (
    <img 
      src="/images/niddik_logo.png" 
      alt="NIDDIK Logo" 
      className={className + " object-contain"}
    />
  );
};

export default Logo;
