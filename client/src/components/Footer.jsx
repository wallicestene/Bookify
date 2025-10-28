import {
  Close,
  GitHub,
  Instagram,
  KeyboardArrowDown,
  Twitter,
  YouTube,
} from "@mui/icons-material";
import { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [showFooter, setShowfooter] = useState(false);
  return (
    <footer
      className={`fixed bottom-0 left-0 z-10 w-full bg-white border-t border-gray-200 shadow-sm transition-all duration-300 ease-in-out ${
        showFooter ? "lg:h-[220px] h-[380px]" : "h-12"
      }`}
    >
      {!showFooter ? (
        <div className="flex items-center justify-between px-4 md:px-6 h-12 w-full">
          <div className="text-xs text-gray-500">
            <p>
              &copy; {new Date().getFullYear()}{" "}
              <Link to="/" className="text-orange-600 hover:text-orange-700 transition-colors">
                Bookify
              </Link>
              . All rights reserved
            </p>
          </div>
          

          <div className="flex items-center gap-2.5 text-gray-400">
            <a 
              href="https://github.com/wallicestene"
              className="h-7 w-7 grid place-items-center border border-gray-200 rounded-full hover:border-orange-500 hover:text-orange-500 transition-all"
              aria-label="GitHub"
            >
              <GitHub sx={{ fontSize: '16px' }} />
            </a>
            <a 
              href="https://twitter.com/wallicestene"
              className="h-7 w-7 grid place-items-center border border-gray-200 rounded-full hover:border-orange-500 hover:text-orange-500 transition-all"
              aria-label="Twitter"
            >
              <Twitter sx={{ fontSize: '16px' }} />
            </a>
            <a 
              href="https://instagram.com/wallicestene"
              className="h-7 w-7 grid place-items-center border border-gray-200 rounded-full hover:border-orange-500 hover:text-orange-500 transition-all"
              aria-label="Instagram"
            >
              <Instagram sx={{ fontSize: '16px' }} />
            </a>
            <a 
              href="https://youtube.com/@wallicestene"
              className="h-7 w-7 grid place-items-center border border-gray-200 rounded-full hover:border-orange-500 hover:text-orange-500 transition-all"
              aria-label="YouTube"
            >
              <YouTube sx={{ fontSize: '16px' }} />
            </a>
          </div>
          <div>
            <button
              onClick={() => setShowfooter(!showFooter)}
              className="h-7 w-7 grid place-items-center border border-gray-200 rounded-full hover:border-orange-500 hover:text-orange-500 transition-all"
              aria-label="Show more"
            >
              <KeyboardArrowDown sx={{ fontSize: '18px' }} />
            </button>
          </div>
        </div>
        
      ) : (
        <div className="py-4 px-4 md:px-6 h-full overflow-y-auto">
          <div className="mb-3">
            <button
              onClick={() => setShowfooter(false)}
              className="h-7 w-7 grid place-items-center border border-gray-200 rounded-full hover:border-orange-500 hover:text-orange-500 transition-all"
              aria-label="Close"
            >
              <Close sx={{ fontSize: '18px' }} />
            </button>
          </div>
          <div className="grid lg:grid-cols-4 grid-cols-2 gap-6 lg:gap-8">
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Bookify
              </h3>
              <div className="text-xs text-gray-600 flex flex-col gap-2">
                <p>
                  <span className="font-medium text-gray-700">Address:</span> 123 Street, Embakasi, KE, 12345 Kenya
                </p>
                <p>
                  <span className="font-medium text-gray-700">Phone:</span> +254 792 817 428
                </p>
                <p>
                  <span className="font-medium text-gray-700">Email:</span> wallicestenewaweru@gmail.com
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Company
              </h3>
              <div className="text-xs text-gray-600 flex flex-col gap-2">
                <a href="#" className="hover:text-orange-600 transition-colors">About</a>
                <a href="#" className="hover:text-orange-600 transition-colors">Careers</a>
                <a href="#" className="hover:text-orange-600 transition-colors">Blog</a>
                <a href="#" className="hover:text-orange-600 transition-colors">Terms & Policy</a>
              </div>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Discover
              </h3>
              <div className="text-xs text-gray-600 flex flex-col gap-2">
                <a href="#" className="hover:text-orange-600 transition-colors">Trust & Safety</a>
                <a href="#" className="hover:text-orange-600 transition-colors">Travel Credit</a>
                <a href="#" className="hover:text-orange-600 transition-colors">Gift Cards</a>
                <a href="#" className="hover:text-orange-600 transition-colors">Bookify Picks</a>
              </div>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Hosting
              </h3>
              <div className="text-xs text-gray-600 flex flex-col gap-2">
                <a href="#" className="hover:text-orange-600 transition-colors">Why Host</a>
                <a href="#" className="hover:text-orange-600 transition-colors">Hospitality</a>
                <a href="#" className="hover:text-orange-600 transition-colors">Responsible Hosting</a>
                <a href="#" className="hover:text-orange-600 transition-colors">Home Safety</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
