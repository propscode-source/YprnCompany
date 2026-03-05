import { motion } from "motion/react";
import { useLanguage } from "../hooks/useLanguage";
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  scaleIn,
  defaultViewport,
} from "../utils/animations";

const PersonCard = ({ member, size = "md", t }) => {
  const sizeClass = size === "lg" ? "w-24 h-24" : "w-20 h-20";
  return (
    <div className="card-glow p-6 card-lift w-full max-w-xs mx-auto">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full blur-md opacity-40"></div>
          <img
            src={member.image}
            alt={t(member.roleKey)}
            className={`relative ${sizeClass} rounded-full object-cover border-2 border-primary/30`}
            loading="lazy"
          />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-heading">{member.name}</h3>
          <p className="text-primary font-medium text-sm">
            {t(member.roleKey)}
          </p>
        </div>
      </div>
    </div>
  );
};

const StrukturOrganisasi = () => {
  const { t } = useLanguage();

  const atas = [
    {
      name: "Yuliusman, S.H, M.H ",
      roleKey: "struktur.pembina",
      image: "/assets/images/Struktur/pembina.webp",
    },
    {
      name: "Dr. Syafrul Yunardy, S.Hut., M.E",
      roleKey: "struktur.pengawas",
      image: "/assets/images/Struktur/pengawas.webp",
    },
  ];

  const ketua = {
    name: "Dr. M Subardin, S.E., M.Si",
    roleKey: "struktur.ketua",
    image: "/assets/images/Struktur/ketua.webp",
  };

  const bawah = [
    {
      name: "Dr. Imam Asngari S.E., M.Si",
      roleKey: "struktur.sekretaris",
      image: "/assets/images/Struktur/sekretaris.webp",
    },
    {
      name: "Mega Debiyanti S.E",
      roleKey: "struktur.bendahara",
      image: "/assets/images/Struktur/bendahara.webp",
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
              {t("struktur.heroLabel")}
            </motion.span>
            <motion.h1
              variants={staggerItem}
              className="heading-primary mt-2 mb-6"
            >
              {t("struktur.heroTitle1")}{" "}
              <span className="gradient-text">{t("struktur.heroTitle2")}</span>
            </motion.h1>
            <motion.p variants={staggerItem} className="text-body">
              {t("struktur.heroDesc")}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Struktur Organisasi */}
      <section className="section-padding bg-dark-50">
        <div className="container-custom">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            custom={0}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="text-primary font-semibold">
              {t("struktur.pengurusLabel")}
            </span>
            <h2 className="heading-primary mt-2 mb-4">
              {t("struktur.pengurusTitle1")}{" "}
              <span className="gradient-text">
                {t("struktur.pengurusTitle2")}
              </span>
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {/* Baris Atas: Pembina & Pengawas */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              custom={0.2}
              className="grid grid-cols-2 gap-8"
            >
              {atas.map((member, index) => (
                <motion.div key={index} variants={scaleIn}>
                  <PersonCard member={member} t={t} />
                </motion.div>
              ))}
            </motion.div>

            {/* Garis penghubung atas ke tengah */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={defaultViewport}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-center py-2 origin-top"
            >
              <div className="w-0.5 h-10 bg-gradient-to-b from-primary to-secondary"></div>
            </motion.div>

            {/* Baris Tengah: Ketua */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              custom={0.1}
              className="flex justify-center"
            >
              <PersonCard member={ketua} size="lg" t={t} />
            </motion.div>

            {/* Garis penghubung tengah ke bawah */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={defaultViewport}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-center py-2 origin-top"
            >
              <div className="w-0.5 h-10 bg-gradient-to-b from-primary to-secondary"></div>
            </motion.div>

            {/* Baris Bawah: Sekretaris & Bendahara */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              custom={0.2}
              className="grid grid-cols-2 gap-8"
            >
              {bawah.map((member, index) => (
                <motion.div key={index} variants={scaleIn}>
                  <PersonCard member={member} t={t} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StrukturOrganisasi;
