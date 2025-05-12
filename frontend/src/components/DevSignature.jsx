import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function DevSignature() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();

  const devInfo = {
    name: "Elmahdi Damyr",
    role: "Full Stack Developer",
    contact: "mahdidamyr@gmail.com",
    githubProfile: "https://github.com/damyr-elmahdi",
    developmentPeriod: "2025",
    technologies: [
      "React", "Tailwind CSS", "React Router", "i18next", "Axios",
      "Laravel 12", "Breeze", "Sanctum", "JWT", "MySQL",
      "PHP 8.1", "HTML", "CSS", "JavaScript", "Rest API"
    ]
  };

  return (
    <div className="mt-10 max-w-3xl mx-auto bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-2xl p-6 shadow-xl border border-white/10">
      <div className="text-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mb-4 inline-flex items-center px-4 py-1 text-sm font-medium rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          {isExpanded ? t("Hide Developer Info") : t("Show Developer Info")}
        </button>

        {isExpanded && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h3 className="text-xl font-semibold">{devInfo.name}</h3>
              <p className="text-sm opacity-90">{devInfo.role}</p>
            </div>

            <div className="text-xs space-y-1">
              <p>📧 {devInfo.contact}</p>
              <p>🗓️ {t("Development Year")}: {devInfo.developmentPeriod}</p>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">{t("Technologies Used")}:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {devInfo.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-white/10 text-white text-xs px-3 py-1 rounded-full hover:bg-white/20 transition"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <a
                href={devInfo.githubProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:bg-white/20 p-2 rounded-full transition"
                aria-label="GitHub"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 
                    11.387.599.111.793-.26.793-.577v-2.234C6.073 
                    20.092 5.318 18.29 5.318 18.29c-.546-1.386-1.333-1.756-1.333-1.756
                    -1.089-.745.083-.729.083-.729 1.205.084 1.839 
                    1.237 1.839 1.237 1.07 1.834 2.807 
                    1.304 3.492.997.107-.775.418-1.305.762-1.604
                    -2.665-.305-5.467-1.334-5.467-5.931 
                    0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 
                    0 0 1.008-.322 3.301 1.23a11.495 
                    11.495 0 0 1 3.003-.404c1.02.005 2.047.138 
                    3.006.404 2.291-1.552 3.297-1.23 
                    3.297-1.23.653 1.653.242 2.874.118 
                    3.176.77.84 1.235 1.911 1.235 
                    3.221 0 4.609-2.807 5.624-5.479 
                    5.921.43.372.823 1.102.823 
                    2.222v3.293c0 .319.192.694.801.576 
                    C20.565 21.796 24 17.298 24 
                    12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
