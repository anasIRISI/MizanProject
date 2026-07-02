import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-[#ebe8e4] dark:border-[#333333] bg-[#fcf9f5] dark:bg-[#1c1c1a]">
      <div className="flex flex-col items-center gap-8 py-12 px-8 w-full max-w-7xl mx-auto">
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-serif font-bold text-[#1c1c1a] text-xl">Mizan Legal AI</div>
          <div className="flex gap-8">
            <a href="#" className="font-sans text-xs uppercase tracking-widest text-[#1c1c1a]/60 dark:text-[#fcf9f5]/60 hover:text-[#aa3000] underline transition-all">Mentions Légales</a>
            <a href="#" className="font-sans text-xs uppercase tracking-widest text-[#1c1c1a]/60 dark:text-[#fcf9f5]/60 hover:text-[#aa3000] underline transition-all">Confidentialité</a>
            <a href="#" className="font-sans text-xs uppercase tracking-widest text-[#1c1c1a]/60 dark:text-[#fcf9f5]/60 hover:text-[#aa3000] underline transition-all">Contact</a>
          </div>
        </div>
        <div className="text-[#1c1c1a]/60 dark:text-[#fcf9f5]/60 font-sans text-xs uppercase tracking-widest">
          © 2024 Mizan Legal AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
