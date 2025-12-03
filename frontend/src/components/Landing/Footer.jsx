import { Link } from "react-router-dom";
import { Github, Linkedin, Globe } from "lucide-react";

const SocialLink = ({ href, children }) => {
  return (
    <a
      href={href}
      className="w-10 h-10 bg-red-950 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors duration-200"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center space-y-8">
          <Link className="flex items-center space-x-2" to="/">
            <span className="text-xl font-bold">InvoAIce</span>
          </Link>
          
          <p className="text-gray-400 text-center max-w-md">
            The simplest way to create and send professional invoices.
          </p>

          <div className="flex space-x-4">
            <SocialLink href="https://www.linkedin.com/in/vaibhavmali-li/">
              <Linkedin className="w-5 h-5" />
            </SocialLink>
            <SocialLink href="https://github.com/vaibhavmali-git">
              <Github className="w-5 h-5" />
            </SocialLink>
            <SocialLink href="https://vaibhavmali.netlify.app">
              <Globe className="w-5 h-5" />
            </SocialLink>
          </div>

          <div className="border-t border-gray-800 pt-8 w-full">
            <div className="flex flex-col items-center space-y-2">
              <p className="text-gray-400 text-sm">
                Developed by <a href="https://vaibhavmali.netlify.app" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 transition-colors">Vaibhav Mali</a>
              </p>
              <p className="text-gray-400 text-sm">
                &copy; 2025 InvoAIce. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;