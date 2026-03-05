import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useLanguage } from "../hooks/useLanguage";
import { API_URL } from "../config/api";
import { LogIn, Eye, EyeOff, Shield, KeyRound, ArrowLeft } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Forgot password state
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotUsername, setForgotUsername] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(username, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || t("loginPage.errorDefault"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: forgotUsername,
          email: forgotEmail,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setSuccessMessage(t("loginPage.forgotSuccess"));
      // Reset form setelah berhasil
      setForgotUsername("");
      setForgotEmail("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || t("loginPage.forgotError"));
    } finally {
      setIsLoading(false);
    }
  };

  const switchToForgotPassword = () => {
    setIsForgotPassword(true);
    setError("");
    setSuccessMessage("");
    setForgotUsername("");
    setForgotEmail("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const switchToLogin = () => {
    setIsForgotPassword(false);
    setError("");
    setSuccessMessage("");
  };

  return (
    <div className="pt-20 min-h-screen bg-dark flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Card */}
        <div className="bg-dark-50/80 backdrop-blur-xl rounded-2xl border border-dark-200/50 shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
              {isForgotPassword ? (
                <KeyRound className="w-8 h-8 text-primary" />
              ) : (
                <Shield className="w-8 h-8 text-primary" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-text-heading mb-2">
              {isForgotPassword
                ? t("loginPage.forgotTitle")
                : t("loginPage.title")}
            </h1>
            <p className="text-text-body text-sm">
              {isForgotPassword
                ? t("loginPage.forgotDesc")
                : t("loginPage.description")}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm text-center">
              {successMessage}
            </div>
          )}

          {isForgotPassword ? (
            /* Forgot Password Form */
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  {t("loginPage.username")}
                </label>
                <input
                  type="text"
                  value={forgotUsername}
                  onChange={(e) => setForgotUsername(e.target.value)}
                  placeholder={t("loginPage.usernamePlaceholder")}
                  className="w-full px-4 py-3 bg-dark/50 border border-dark-200/50 rounded-xl text-text-heading placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  {t("loginPage.forgotEmail")}
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder={t("loginPage.forgotEmailPlaceholder")}
                  className="w-full px-4 py-3 bg-dark/50 border border-dark-200/50 rounded-xl text-text-heading placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  {t("loginPage.forgotNewPassword")}
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t("loginPage.forgotNewPasswordPlaceholder")}
                    className="w-full px-4 py-3 pr-12 bg-dark/50 border border-dark-200/50 rounded-xl text-text-heading placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-heading transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  {t("loginPage.forgotConfirmPassword")}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t(
                      "loginPage.forgotConfirmPasswordPlaceholder",
                    )}
                    className="w-full px-4 py-3 pr-12 bg-dark/50 border border-dark-200/50 rounded-xl text-text-heading placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-heading transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <KeyRound size={20} />
                    <span>{t("loginPage.forgotBtn")}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={switchToLogin}
                className="w-full flex items-center justify-center space-x-2 text-sm text-text-muted hover:text-primary transition-colors duration-300"
              >
                <ArrowLeft size={16} />
                <span>{t("loginPage.forgotBack")}</span>
              </button>
            </form>
          ) : (
            /* Login Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  {t("loginPage.username")}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t("loginPage.usernamePlaceholder")}
                  className="w-full px-4 py-3 bg-dark/50 border border-dark-200/50 rounded-xl text-text-heading placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-heading mb-2">
                  {t("loginPage.password")}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("loginPage.passwordPlaceholder")}
                    className="w-full px-4 py-3 pr-12 bg-dark/50 border border-dark-200/50 rounded-xl text-text-heading placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-heading transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={switchToForgotPassword}
                  className="text-sm text-text-muted hover:text-primary transition-colors duration-300"
                >
                  {t("loginPage.forgotLink")}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn size={20} />
                    <span>{t("loginPage.btnLogin")}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
