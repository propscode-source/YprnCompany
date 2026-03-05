import { motion } from "motion/react";
import Hero from "../components/home/Hero";
import About from "../components/home/About";
import Stats from "../components/home/Stats";
import VideoSection from "../components/home/VideoSection";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, BarChart3 } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  defaultViewport,
} from "../utils/animations";

const Home = () => {
  const { t } = useLanguage();

  return (
    <>
      <Hero />
      <About />
      <Stats />

      <VideoSection />

      {/* Kegiatan Preview */}
      <section className="section-padding bg-dark-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary/5 rounded-full blur-[100px]"></div>
        </div>
        <div className="container-custom relative z-10">
          {/* Section heading — fade in saat scroll */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            custom={0}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="text-primary font-semibold">
              {t("homeKegiatan.label")}
            </span>
            <h2 className="heading-primary mt-2 mb-4">
              {t("homeKegiatan.title1")}{" "}
              <span className="gradient-text">{t("homeKegiatan.title2")}</span>
            </h2>
            <p className="text-body">{t("homeKegiatan.description")}</p>
          </motion.div>

          {/* Cards — stagger */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            custom={0.2}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* SIA Card */}
            <motion.div
              variants={staggerItem}
              className="card-glow p-8 card-lift group"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-6 shadow-glow-primary">
                <BarChart3 className="text-dark" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-text-heading mb-3">
                {t("homeKegiatan.siaTitle")}
              </h3>
              <p className="text-text-body mb-6">{t("homeKegiatan.siaDesc")}</p>
              <Link
                to="/kegiatan/social-impact-assessment"
                className="inline-flex items-center text-primary font-medium group-hover:gap-3 gap-2 transition-all duration-300"
              >
                {t("homeKegiatan.btnMore")} <ArrowRight size={18} />
              </Link>
            </motion.div>

            {/* SROI Card */}
            <motion.div
              variants={staggerItem}
              className="card-glow p-8 card-lift group"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center mb-6 shadow-glow-secondary">
                <Leaf className="text-dark" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-text-heading mb-3">
                {t("homeKegiatan.sroiTitle")}
              </h3>
              <p className="text-text-body mb-6">
                {t("homeKegiatan.sroiDesc")}
              </p>
              <Link
                to="/kegiatan/social-return-on-investment"
                className="inline-flex items-center text-primary font-medium group-hover:gap-3 gap-2 transition-all duration-300"
              >
                {t("homeKegiatan.btnMore")} <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            custom={0.15}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.h2
              variants={staggerItem}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-heading mb-6"
            >
              {t("homeCTA.title")}
            </motion.h2>
            <motion.p
              variants={staggerItem}
              className="text-lg text-text-body mb-8"
            >
              {t("homeCTA.description")}
            </motion.p>
            <motion.div
              variants={staggerItem}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/tentang/visi-misi" className="btn-primary">
                {t("homeCTA.btnAbout")}
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                to="/kegiatan/social-impact-assessment"
                className="btn-glow"
              >
                {t("homeCTA.btnActivity")}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
