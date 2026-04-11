import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  Sparkles,
  Leaf,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import { fadeInUp, fadeInRight, scaleIn } from "../../utils/animations";
import { API_URL, getImageUrl } from "../../config/api";

const HeroImageSlider = ({ images }) => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, images.length]);

  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <img
        src={images[0].src}
        alt={images[0].alt}
        className="w-full h-full object-cover"
        fetchPriority="high"
      />
    );
  }

  return (
    <div className="relative group w-full h-full">
      {images.map((img, index) => (
        <img
          key={index}
          src={img.src}
          alt={img.alt}
          loading={index === 0 ? "eager" : "lazy"}
          fetchPriority={index === 0 ? "high" : "auto"}
          className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${
            index === current
              ? "relative opacity-100 scale-100"
              : "absolute inset-0 opacity-0 scale-105"
          }`}
          style={{ display: index === current ? "block" : "none" }}
        />
      ))}

      <button
        onClick={prev}
        aria-label="Slide sebelumnya"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-dark/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-primary hover:text-dark transition-all duration-300 opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        aria-label="Slide berikutnya"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-dark/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-primary hover:text-dark transition-all duration-300 opacity-0 group-hover:opacity-100"
      >
        <ChevronRight size={22} />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`Pergi ke slide ${index + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === current
                ? "bg-primary w-7 shadow-glow-primary"
                : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const Hero = () => {
  const { t } = useLanguage();
  const [heroImages, setHeroImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const res = await fetch(`${API_URL}/hero-beranda`);
        if (res.ok) {
          const data = await res.json();
          const images = data.map((item) => ({
            src: getImageUrl(item.gambar),
            alt: item.judul || "Kegiatan Yayasan",
          }));
          setHeroImages(images);
        }
      } catch {
        // Fallback ke static image jika API error
        setHeroImages([
          {
            src: "/assets/images/Beranda/beranda1.webp",
            alt: "Kegiatan Yayasan",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroImages();
  }, []);

  // Fallback image saat loading atau kosong
  const fallbackImages = [
    { src: "/assets/images/Beranda/beranda1.webp", alt: "Kegiatan Yayasan" },
  ];
  const displayImages = heroImages.length > 0 ? heroImages : fallbackImages;

  return (
    <section className="relative min-h-screen flex items-center hero-pattern cyber-grid bg-dark pt-20 overflow-hidden">
      {/* Background layout wallpaper */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage: "url('/assets/images/Layout/layout.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] floating-orb"></div>
        <div
          className="absolute bottom-20 left-20 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] floating-orb"
          style={{ animationDelay: "-3s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center px-4 py-2 bg-dark-100 border border-primary/30 rounded-full shadow-glow-primary"
            >
              <Leaf className="w-4 h-4 text-primary mr-2 animate-pulse" />
              <span className="text-primary text-sm font-medium">
                {t("hero.badge")}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.15}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-heading leading-tight"
            >
              {t("hero.title1")}{" "}
              <span className="gradient-text text-glow">
                {t("hero.title2")}
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.3}
              className="text-lg md:text-xl text-text-body leading-relaxed max-w-xl"
            >
              {t("hero.description")}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.45}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/tentang/visi-misi" className="btn-primary group">
                {t("hero.btnAbout")}
                <ArrowRight
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </Link>
              <Link
                to="/kegiatan/social-impact-assessment"
                className="btn-glow group"
              >
                <Sparkles className="mr-2" size={20} />
                {t("hero.btnActivity")}
              </Link>
            </motion.div>
          </div>

          {/* Image/Illustration */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="relative"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-3xl rotate-6 blur-2xl"></div>
              <div className="absolute inset-0 border-2 border-primary/20 rounded-3xl rotate-3"></div>
              <div
                className="relative rounded-3xl shadow-2xl border border-dark-200 overflow-hidden bg-dark-100"
                style={{ aspectRatio: "4 / 3" }}
              >
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center bg-dark-200/30">
                    <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <HeroImageSlider images={displayImages} />
                )}
              </div>
            </div>

            {/* Floating card bottom-left */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              custom={0.7}
              className="absolute -bottom-6 -left-6 bg-dark-50/90 backdrop-blur-xl p-6 rounded-2xl border border-primary/30 shadow-glow-primary animate-float"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-glow-primary">
                  <Leaf className="text-dark" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-heading">2</p>
                  <p className="text-text-body text-sm">
                    {t("hero.yearsDedicated")}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Floating card top-right */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              custom={0.9}
              className="absolute -top-4 -right-4 bg-dark-50/90 backdrop-blur-xl px-4 py-3 rounded-xl border border-secondary/30 shadow-glow-secondary animate-float"
              style={{ animationDelay: "-1.5s" }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
                <span className="text-secondary text-sm font-medium">
                  {t("hero.location")}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
