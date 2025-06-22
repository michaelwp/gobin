import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      &copy; {new Date().getFullYear()} GoBin
    </footer>
  );
};

export default Footer;
