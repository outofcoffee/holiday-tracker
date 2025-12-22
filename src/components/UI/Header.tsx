import { holidayMessages, holidayColors } from '../../config';

const Header = () => {
  return (
    <header
      className="p-4 text-white text-center shadow-md"
      style={{
        background: `linear-gradient(to right, ${holidayColors.primary}, ${holidayColors.light})`,
      }}
    >
      <h1 className="text-3xl md:text-4xl font-title">{holidayMessages.title}</h1>
      <p className="text-lg mt-2">{holidayMessages.subtitle}</p>
    </header>
  );
};

export default Header;
