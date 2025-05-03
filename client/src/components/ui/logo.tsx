const Logo = ({ className = "", white = false }: { className?: string; white?: boolean }) => {
  return (
    <svg className={className} viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="#56C870"/>
      <path d="M12 20L20 28L28 20L20 12L12 20Z" fill="white"/>
      <path d="M50 15H54.5C57 15 58.5 16.5 58.5 19C58.5 21.5 57 23 54.5 23H50V15ZM54.2 21C55.3 21 56 20.3 56 19C56 17.7 55.3 17 54.2 17H52.5V21H54.2Z" fill={white ? "white" : "#132128"}/>
      <path d="M60 15H67.5V17H62.5V18H67V20H62.5V21H67.5V23H60V15Z" fill={white ? "white" : "#132128"}/>
      <path d="M75 15H72.5V23H75C77.5 23 79 21.5 79 19C79 16.5 77.5 15 75 15ZM74.8 21H75V17H74.8C73.7 17 73 17.7 73 19C73 20.3 73.7 21 74.8 21Z" fill={white ? "white" : "#132128"}/>
      <path d="M85 15H80V23H82.5V20.5H85C86.7 20.5 88 19.5 88 17.75C88 16 86.7 15 85 15ZM84.5 18.5H82.5V17H84.5C85 17 85.5 17.2 85.5 17.75C85.5 18.3 85 18.5 84.5 18.5Z" fill={white ? "white" : "#132128"}/>
      <path d="M89 23H91.5V15H89V23Z" fill={white ? "white" : "#132128"}/>
      <path d="M100.5 23L96.5 17.8V23H94V15H96.5L100.5 20.2V15H103V23H100.5Z" fill={white ? "white" : "#132128"}/>
    </svg>
  );
};

export default Logo;
