import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="bg-surface-container-lowest  border-t border-outline-variant/20 w-screen mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center py-xl px-gutter w-screen  gap-md">
          <div className="text-headline-sm font-headline-sm font-bold text-on-surface  opacity-100 hover:opacity-80 transition-opacity">
            FreelanceFlow
          </div>
          <div className="flex flex-wrap justify-center gap-md md:gap-lg">
            <a
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Contact
            </a>
            <a
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Support
            </a>
          </div>
          <div className="font-body-sm text-body-sm text-on-surface-variant">
            © 2024 FreelanceFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
