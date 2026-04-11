import { motion } from "motion/react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import {
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  staggerItem,
  defaultViewport,
} from "../../utils/animations";

const About = () => {
  const { t } = useLanguage();

  const features = t("about.features");

  return (
    <section className="section-padding bg-dark">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image — slide dari kiri saat scroll */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            custom={0}
            className="relative"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-2xl"></div>
              <img
                src="/assets/images/Beranda/beranda2.webp"
                alt="Kegiatan Yayasan"
                className="relative rounded-2xl shadow-xl w-full object-cover border border-dark-200"
                loading="lazy"
                width="648"
                height="424"
              />
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-dark shadow-glow-primary">
                <div className="text-center">
                  <p className="text-4xl font-bold">2</p>
                  <p className="text-sm">{t("about.yearsDedicated")}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content — slide dari kanan saat scroll */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            custom={0.1}
            className="space-y-6"
          >
            <span className="text-primary font-semibold">
              {t("about.label")}
            </span>
            <h2 className="heading-primary">
              {t("about.title1")}{" "}
              <span className="gradient-text">{t("about.title2")}</span>
            </h2>
            <p className="text-body">{t("about.description")}</p>

            {/* Features — stagger effect */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              custom={0.12}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4"
            >
              {Array.isArray(features) &&
                features.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={staggerItem}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle
                      className="text-primary flex-shrink-0"
                      size={20}
                    />
                    <span className="text-text-body">{feature}</span>
                  </motion.div>
                ))}
            </motion.div>

            <Link
              to="/tentang/visi-misi"
              className="btn-primary inline-flex group mt-4"
            >
              {t("about.btnLearnMore")}
              <ArrowRight
                className="ml-2 group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
