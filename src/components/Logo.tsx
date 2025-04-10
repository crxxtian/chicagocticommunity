import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <img
        src="/cctic.svg"
        alt="CCTIC Logo"
        className="h-20 sm:h-12 w-auto object-contain transition-transform duration-200 hover:scale-[1.03] dark:invert"
      />
    </Link>
  );
};

export default Logo;
