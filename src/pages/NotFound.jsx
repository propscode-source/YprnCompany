import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const NotFound = () => {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="container-custom relative z-10 text-center py-20">
        {/* 404 Number */}
        <h1 className="text-[120px] md:text-[180px] font-bold leading-none gradient-text text-glow mb-4">
          404
        </h1>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-bold text-text-heading mb-4">
          {t('notFound.title')}
        </h2>
        <p className="text-text-body text-lg max-w-md mx-auto mb-10">{t('notFound.description')}</p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary group">
            <Home className="mr-2" size={20} />
            {t('notFound.btnHome')}
          </Link>
          <button onClick={() => window.history.back()} className="btn-glow group">
            <ArrowLeft className="mr-2" size={20} />
            {t('notFound.btnBack')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
