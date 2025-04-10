import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <img
        src="/cctic.svg"
        alt="CCTIC Logo"
        className="h-12 sm:h-14 lg:h-16 w-auto object-contain transition-transform duration-200 hover:scale-[1.05] dark:invert"
      />
    </Link>
  );
};

export default Logo;
