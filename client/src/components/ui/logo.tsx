const Logo = ({ className = "", white = false }: { className?: string; white?: boolean }) => {
  return (
    <img 
      src="/images/niidik_logo.png" 
      alt="NIIDIK Logo" 
      className={className + " object-contain"}
    />
  );
};

export default Logo;
