import { useLanguage } from '../../context/LanguageContext'

const LanguageSwitcher = ({ className = '' }) => {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg border border-dark-200/50 hover:border-primary/50 bg-dark-100/50 hover:bg-primary/10 transition-all duration-300 group ${className}`}
      title={language === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
    >
      {language === 'id' ? (
        <>
          {/* Indonesia Flag */}
          <span className="w-6 h-4 rounded-sm overflow-hidden flex-shrink-0 shadow-sm border border-dark-200/30">
            <svg viewBox="0 0 24 16" className="w-full h-full">
              <rect width="24" height="8" fill="#FF0000" />
              <rect y="8" width="24" height="8" fill="#FFFFFF" />
            </svg>
          </span>
          <span className="text-sm font-medium text-text-body group-hover:text-primary transition-colors">
            ID
          </span>
        </>
      ) : (
        <>
          {/* USA Flag */}
          <span className="w-6 h-4 rounded-sm overflow-hidden flex-shrink-0 shadow-sm border border-dark-200/30">
            <svg viewBox="0 0 24 16" className="w-full h-full">
              {/* Red and white stripes */}
              <rect width="24" height="16" fill="#FFFFFF" />
              <rect width="24" height="1.23" y="0" fill="#B22234" />
              <rect width="24" height="1.23" y="2.46" fill="#B22234" />
              <rect width="24" height="1.23" y="4.92" fill="#B22234" />
              <rect width="24" height="1.23" y="7.38" fill="#B22234" />
              <rect width="24" height="1.23" y="9.84" fill="#B22234" />
              <rect width="24" height="1.23" y="12.3" fill="#B22234" />
              <rect width="24" height="1.23" y="14.77" fill="#B22234" />
              {/* Blue canton */}
              <rect width="9.6" height="8.62" fill="#3C3B6E" />
              {/* Stars (simplified) */}
              <g fill="#FFFFFF">
                <circle cx="1.2" cy="1.0" r="0.4" />
                <circle cx="3.0" cy="1.0" r="0.4" />
                <circle cx="4.8" cy="1.0" r="0.4" />
                <circle cx="6.6" cy="1.0" r="0.4" />
                <circle cx="8.4" cy="1.0" r="0.4" />
                <circle cx="2.1" cy="2.1" r="0.4" />
                <circle cx="3.9" cy="2.1" r="0.4" />
                <circle cx="5.7" cy="2.1" r="0.4" />
                <circle cx="7.5" cy="2.1" r="0.4" />
                <circle cx="1.2" cy="3.2" r="0.4" />
                <circle cx="3.0" cy="3.2" r="0.4" />
                <circle cx="4.8" cy="3.2" r="0.4" />
                <circle cx="6.6" cy="3.2" r="0.4" />
                <circle cx="8.4" cy="3.2" r="0.4" />
                <circle cx="2.1" cy="4.3" r="0.4" />
                <circle cx="3.9" cy="4.3" r="0.4" />
                <circle cx="5.7" cy="4.3" r="0.4" />
                <circle cx="7.5" cy="4.3" r="0.4" />
                <circle cx="1.2" cy="5.4" r="0.4" />
                <circle cx="3.0" cy="5.4" r="0.4" />
                <circle cx="4.8" cy="5.4" r="0.4" />
                <circle cx="6.6" cy="5.4" r="0.4" />
                <circle cx="8.4" cy="5.4" r="0.4" />
                <circle cx="2.1" cy="6.5" r="0.4" />
                <circle cx="3.9" cy="6.5" r="0.4" />
                <circle cx="5.7" cy="6.5" r="0.4" />
                <circle cx="7.5" cy="6.5" r="0.4" />
                <circle cx="1.2" cy="7.6" r="0.4" />
                <circle cx="3.0" cy="7.6" r="0.4" />
                <circle cx="4.8" cy="7.6" r="0.4" />
                <circle cx="6.6" cy="7.6" r="0.4" />
                <circle cx="8.4" cy="7.6" r="0.4" />
              </g>
            </svg>
          </span>
          <span className="text-sm font-medium text-text-body group-hover:text-primary transition-colors">
            EN
          </span>
        </>
      )}
    </button>
  )
}

export default LanguageSwitcher
