import { holidayMessages, holidayColors } from '../../config';

const Header = () => {
  return (
    <header className="relative py-8 px-4 text-center overflow-hidden">
      {/* Subtle gradient background */}
      <div
        className="absolute inset-0 opacity-90"
        style={{ background: holidayColors.gradient }}
      />

      {/* Content */}
      <div className="relative z-10">
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-title font-bold tracking-tight"
          style={{ color: holidayColors.dark }}
        >
          {holidayMessages.title}
        </h1>
        <p
          className="mt-3 text-lg md:text-xl font-medium opacity-80"
          style={{ color: holidayColors.dark }}
        >
          {holidayMessages.subtitle}
        </p>
      </div>

      {/* Decorative bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-8"
        style={{
          background: `linear-gradient(to bottom, transparent, ${holidayColors.light}40)`,
        }}
      />
    </header>
  );
};

export default Header;
