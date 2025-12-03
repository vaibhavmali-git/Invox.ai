import { Link } from "react-router-dom";
import { Github, Linkedin, Globe, Heart } from "lucide-react";

const SocialLink = ({ href, children }) => {
  return (
    <a
      href={href}
      className="w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-gray-50 rounded-lg transition-all duration-200 border border-gray-300 shadow-sm shadow-gray-100"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 border-x border-gray-200">
        <div className="py-16 grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-gray-100">
          <div className="col-span-1 md:col-span-1">
            <Link className="flex items-center space-x-2 mb-6" to="/">
              <span className="text-xl font-bold tracking-tight text-gray-900">
                InvoAIce.
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              The simplest way to create and send professional invoices.
            </p>
          </div>

          <div className="hidden md:block"></div>

          <div className="flex flex-col md:items-end">
            <h3 className="font-semibold text-xs tracking-wider uppercase mb-6 text-gray-900">
              Connect
            </h3>
            <div className="flex space-x-3">
              <SocialLink href="https://www.linkedin.com/in/vaibhavmali-li/">
                <Linkedin className="w-5 h-5 text-gray-600" />
              </SocialLink>
              <SocialLink href="https://github.com/vaibhavmali-git">
                <Github className="w-5 h-5 text-gray-600" />
              </SocialLink>
              <SocialLink href="https://vaibhavmali.netlify.app">
                <Globe className="w-5 h-5 text-gray-600" />
              </SocialLink>
            </div>
          </div>
        </div>

        <div className="py-8 flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
          <p className="text-gray-500 flex items-center gap-1.5">
            Developed by
            <a
              href="https://vaibhavmali.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gray-900 hover:text-amber-700 transition-colors"
            >
              Vaibhav Mali
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
