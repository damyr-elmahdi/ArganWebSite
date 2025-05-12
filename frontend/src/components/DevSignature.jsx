import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function DevSignature() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();

  // You can customize this information
  const devInfo = {
    name: "Elmahdi Damyr",
    role: "Full Stack Developer",
    contact: "mahdidamyr@gmail.com",
    githubProfile: "https://github.com/damyr-elmahdi",
    developmentPeriod: "2025",
technologies: [
      "React",
      "Tailwind CSS", 
      "React Router", 
      "i18next",
      "Axios",
      "Laravel 12",
      "Breeze",
      "Sanctum",
      "JWT",
      "MySQL",
      "PHP 8.1",
      "HTML",
      "CSS",
      "JavaScript",
      "Rest API"

    ]
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div 
        className={`bg-[#165b9f] text-white p-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out 
        ${isExpanded ? 'w-64' : 'w-12 cursor-pointer'}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {!isExpanded ? (
          <div className="flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-6 h-6"
            >
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
            </svg>
          </div>
        ) : (
          <div className="space-y-2">
            <h3 className="font-bold text-lg">{devInfo.name}</h3>
            <p className="text-sm">{devInfo.role}</p>
            
            <div className="mt-2 space-y-1 text-xs">
              <p>📧 {devInfo.contact}</p>
              <p>💻 Dev Period: {devInfo.developmentPeriod}</p>
            </div>
            
            <div className="mt-2">
              <p className="text-xs mb-1">Technologies:</p>
              <div className="flex flex-wrap gap-1">
                {devInfo.technologies.map((tech, index) => (
                  <span 
                    key={index} 
                    className="bg-white/20 px-2 py-1 rounded-full text-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-2 flex space-x-2">
              <a 
                href={devInfo.githubProfile} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:bg-white/20 p-1 rounded-full transition"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}