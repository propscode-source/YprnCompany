import { motion } from "motion/react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { companyInfo } from "../data/companyData";
import { useLanguage } from "../hooks/useLanguage";
import {
  fadeInUp,
  fadeInRight,
  staggerContainer,
  staggerItem,
  defaultViewport,
} from "../utils/animations";

const Kontak = () => {
  const { t } = useLanguage();

  // Data kartu kontak untuk loop & stagger
  const contactCards = [
    {
      icon: MapPin,
      title: t("kontakPage.alamat"),
      content: <p className="text-text-body text-sm">{companyInfo.address}</p>,
    },
    {
      icon: Phone,
      title: t("kontakPage.telepon"),
      content: <p className="text-text-body text-sm">{companyInfo.phone}</p>,
    },
    {
      icon: Mail,
      title: t("kontakPage.email"),
      content: <p className="text-text-body text-sm">{companyInfo.email}</p>,
    },
    {
      icon: Clock,
      title: t("kontakPage.jamOperasional"),
      content: (
        <>
          <p className="text-text-body text-sm">{t("kontakPage.jamKerja")}</p>
          <p className="text-text-body text-sm">{t("kontakPage.jamLibur")}</p>
        </>
      ),
    },
  ];

  return (
    <div className="pt-20 bg-dark">
      {/* Hero Section */}
      <section className="section-padding bg-dark hero-pattern cyber-grid relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]"></div>
        </div>
        <div className="container-custom relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            custom={0.15}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.span
              variants={staggerItem}
              className="text-primary font-semibold inline-block"
            >
              {t("kontakPage.heroLabel")}
            </motion.span>
            <motion.h1
              variants={staggerItem}
              className="heading-primary mt-2 mb-6"
            >
              {t("kontakPage.heroTitle1")}{" "}
              <span className="gradient-text">
                {t("kontakPage.heroTitle2")}
              </span>
            </motion.h1>
            <motion.p variants={staggerItem} className="text-body">
              {t("kontakPage.heroDesc")}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Info Kontak & Maps */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Info Kontak — stagger cards */}
            <div className="space-y-8">
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={defaultViewport}
                custom={0}
              >
                <h2 className="text-2xl font-bold text-text-heading mb-6">
                  {t("kontakPage.infoTitle1")}{" "}
                  <span className="gradient-text">
                    {t("kontakPage.infoTitle2")}
                  </span>
                </h2>
                <p className="text-text-body mb-8">
                  {t("kontakPage.infoDesc")}
                </p>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={defaultViewport}
                custom={0.15}
                className="space-y-6"
              >
                {contactCards.map((card, index) => {
                  const IconComponent = card.icon;
                  return (
                    <motion.div
                      key={index}
                      variants={staggerItem}
                      className="card-glow p-5 flex items-start space-x-4"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0 shadow-glow-primary">
                        <IconComponent className="text-dark" size={22} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-text-heading mb-1">
                          {card.title}
                        </h3>
                        {card.content}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Google Maps — fade in dari kanan */}
            <motion.div
              variants={fadeInRight}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              custom={0.2}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-text-heading mb-6">
                {t("kontakPage.lokasiTitle1")}{" "}
                <span className="gradient-text">
                  {t("kontakPage.lokasiTitle2")}
                </span>
              </h2>
              <div className="card-glow overflow-hidden rounded-2xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d1675.3005048349974!2d104.74117721986681!3d-2.942332581252365!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMsKwNTYnMzAuNiJTIDEwNMKwNDQnMjkuNSJF!5e0!3m2!1sid!2sid!4v1770376310906!5m2!1sid!2sid"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={
                    t("kontakPage.lokasiTitle1") +
                    " " +
                    t("kontakPage.lokasiTitle2")
                  }
                  className="w-full"
                ></iframe>
              </div>
              <p className="text-text-muted text-xs text-center">
                {t("kontakPage.mapNote")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Kontak;
