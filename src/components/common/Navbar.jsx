import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, LogIn, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)
  const { isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navItems = [
    { name: 'Beranda', path: '/' },
    {
      name: 'Tentang Kami',
      dropdown: [
        { name: 'Visi & Misi', path: '/tentang/visi-misi' },
        { name: 'Struktur Organisasi', path: '/tentang/struktur-organisasi' },
      ],
    },
    {
      name: 'Kegiatan',
      path: '/kegiatan',
      dropdown: [
        { name: 'Galeri Kegiatan', path: '/kegiatan' },
        { name: 'Social Impact Assessment', path: '/kegiatan/social-impact-assessment' },
        { name: 'Social Return on Investment', path: '/kegiatan/social-return-on-investment' },
      ],
    },
    { name: 'Kontak', path: '/kontak' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {}, [location])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isActiveParent = (item) => {
    if (item.path) return location.pathname === item.path
    if (item.dropdown) return item.dropdown.some((sub) => location.pathname === sub.path)
    return false
  }

  const hasParentLink = (item) => item.dropdown && item.path

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-dark/95 backdrop-blur-xl border-b border-dark-200/50 shadow-lg shadow-dark/50'
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="/assets/Logo.svg"
              alt="Logo Rimba Nusantara"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1" ref={dropdownRef}>
            {navItems.map((item) =>
              item.dropdown ? (
                <div key={item.name} className="relative flex items-center">
                  {hasParentLink(item) ? (
                    <>
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                          isActiveParent(item)
                            ? 'text-primary bg-primary/10'
                            : 'text-text-body hover:text-primary hover:bg-primary/5'
                        }`}
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          setActiveDropdown(activeDropdown === item.name ? null : item.name)
                        }}
                        className={`p-2 -ml-1 rounded-lg transition-all duration-300 ${
                          isActiveParent(item)
                            ? 'text-primary hover:bg-primary/10'
                            : 'text-text-body hover:text-primary hover:bg-primary/5'
                        }`}
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${
                            activeDropdown === item.name ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() =>
                        setActiveDropdown(activeDropdown === item.name ? null : item.name)
                      }
                      className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                        isActiveParent(item)
                          ? 'text-primary bg-primary/10'
                          : 'text-text-body hover:text-primary hover:bg-primary/5'
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          activeDropdown === item.name ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  )}

                  <div
                    className={`absolute top-full left-0 mt-2 w-64 transition-all duration-300 ${
                      activeDropdown === item.name
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible -translate-y-2'
                    }`}
                  >
                    <div className="bg-dark-50/95 backdrop-blur-xl rounded-xl border border-dark-200/50 shadow-xl shadow-dark/50 overflow-hidden">
                      {item.dropdown.map((subLink, index) => (
                        <Link
                          key={subLink.path}
                          to={subLink.path}
                          className={`block px-4 py-3 text-sm font-medium transition-all duration-300 ${
                            location.pathname === subLink.path
                              ? 'text-primary bg-primary/10'
                              : 'text-text-body hover:text-primary hover:bg-primary/5'
                          } ${
                            index !== item.dropdown.length - 1 ? 'border-b border-dark-200/30' : ''
                          }`}
                        >
                          {subLink.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                    location.pathname === item.path
                      ? 'text-primary bg-primary/10'
                      : 'text-text-body hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* Auth Buttons Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className="flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-all duration-300"
                >
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-all duration-300"
                >
                  <LogOut size={16} />
                  <span>Keluar</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1.5 px-4 py-2 text-sm font-medium text-text-body hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-300"
              >
                <LogIn size={16} />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-text-body hover:text-primary hover:bg-primary/10 transition-all duration-300"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-500 overflow-hidden ${
          isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container-custom py-4 bg-dark-50/95 backdrop-blur-xl border-t border-dark-200/50">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) =>
              item.dropdown ? (
                <div key={item.name}>
                  <div
                    className={`flex items-center rounded-lg ${
                      isActiveParent(item) ? 'bg-primary/10' : ''
                    }`}
                  >
                    {hasParentLink(item) ? (
                      <>
                        <Link
                          to={item.path}
                          className={`flex-1 text-base font-medium py-3 px-4 transition-all duration-300 ${
                            isActiveParent(item)
                              ? 'text-primary'
                              : 'text-text-body hover:text-primary'
                          }`}
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() =>
                            setActiveDropdown(activeDropdown === item.name ? null : item.name)
                          }
                          className="p-3 text-text-body hover:text-primary transition-colors"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ${
                              activeDropdown === item.name ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() =>
                          setActiveDropdown(activeDropdown === item.name ? null : item.name)
                        }
                        className={`flex items-center justify-between w-full text-base font-medium py-3 px-4 rounded-lg transition-all duration-300 ${
                          isActiveParent(item)
                            ? 'text-primary bg-primary/10'
                            : 'text-text-body hover:text-primary hover:bg-primary/5'
                        }`}
                      >
                        <span>{item.name}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${
                            activeDropdown === item.name ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      activeDropdown === item.name ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    {item.dropdown.map((subLink) => (
                      <Link
                        key={subLink.path}
                        to={subLink.path}
                        className={`block text-sm font-medium py-2.5 px-8 rounded-lg transition-all duration-300 ${
                          location.pathname === subLink.path
                            ? 'text-primary bg-primary/10'
                            : 'text-text-body hover:text-primary hover:bg-primary/5'
                        }`}
                      >
                        {subLink.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-base font-medium py-3 px-4 rounded-lg transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'text-primary bg-primary/10'
                      : 'text-text-body hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}
            {/* Auth Buttons Mobile */}
            <div className="pt-4 mt-4 border-t border-dark-200/30">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-2 text-base font-medium py-3 px-4 rounded-lg text-primary bg-primary/10 mb-2"
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full text-base font-medium py-3 px-4 rounded-lg text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all"
                  >
                    <LogOut size={18} />
                    <span>Keluar</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 text-base font-medium py-3 px-4 rounded-lg text-text-body hover:text-primary hover:bg-primary/5 transition-all"
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </Link>
              )}
            </div>{' '}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
