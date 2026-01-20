// src/pages/View/Home.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowRight,
  CalendarCheck,
  ShieldCheck,
  Stethoscope,
  Search,
  Star,
  CheckCircle2,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function HomePage() {
  const handleDemoClick = () => toast.success("Login to book your first appointment!");

  const specialties = [
    { title: "Cardiology", desc: "Heart & blood pressure care", icon: <Stethoscope size={22} /> },
    { title: "Dermatology", desc: "Skin, hair & allergy care", icon: <CheckCircle2 size={22} /> },
    { title: "Neurology", desc: "Brain & nerve specialist", icon: <ShieldCheck size={22} /> },
  ];

  const topDoctors = [
    {
      name: "Dr. Ayesha Khan",
      spec: "Cardiologist",
      rating: 4.9,
      exp: "8+ years",
    },
    {
      name: "Dr. Ahmed Raza",
      spec: "Dermatologist",
      rating: 4.8,
      exp: "6+ years",
    },
    {
      name: "Dr. Sara Ali",
      spec: "Neurologist",
      rating: 4.9,
      exp: "10+ years",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900">
      {/* ================= HERO (FULL BLEED) ================= */}
      <section
        className="
          relative overflow-hidden
          w-screen left-1/2 -translate-x-1/2
          min-h-[92vh] flex items-center
        "
      >
        {/* Animated gradient */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(37,99,235,1), rgba(79,70,229,1), rgba(147,51,234,1))",
            backgroundSize: "200% 200%",
          }}
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        {/* Soft overlay */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-28 -right-24 w-96 h-96 rounded-full bg-white/10 blur-2xl" />

        <div className="relative z-10 w-full">
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="max-w-7xl mx-auto px-6 md:px-10"
          >
            {/* Top mini nav */}
            <motion.div
              variants={fadeUp}
              className="flex items-center justify-between mb-10"
            >
              <div className="flex items-center gap-2 text-white font-semibold">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                  <Stethoscope size={18} />
                </div>
                <span className="tracking-wide">MedBook</span>
              </div>

              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-white/90 hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-white text-blue-700 px-4 py-2 rounded-xl font-semibold hover:scale-105 transition"
                >
                  Sign up
                </Link>
              </div>
            </motion.div>

            {/* Hero content */}
            <motion.h1
              variants={fadeUp}
              className="text-white text-4xl md:text-6xl font-extrabold leading-tight"
            >
              Book Doctor Appointments <br />
              <span className="text-blue-200">Without Waiting</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-blue-100 text-base md:text-lg max-w-2xl"
            >
              Find verified doctors, check availability, and confirm appointments instantly —
              all in one platform.
            </motion.p>

            {/* Search bar */}
            <motion.div
              variants={fadeUp}
              className="mt-10 max-w-2xl bg-white/95 rounded-2xl p-2 shadow-xl backdrop-blur"
            >
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex items-center gap-2 flex-1 px-3">
                  <Search className="text-slate-400" size={18} />
                  <input
                    className="w-full py-3 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                    placeholder="Search doctors, specialties, hospitals..."
                  />
                </div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <button
                    onClick={() => toast("Search connected with backend later ✅")}
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
                  >
                    Search
                  </button>
                </motion.div>
              </div>
            </motion.div>

            {/* CTA buttons */}
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center bg-white text-blue-700 px-7 py-3 rounded-xl font-semibold shadow-md"
                >
                  Get Started
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/login"
                  onClick={handleDemoClick}
                  className="inline-flex items-center justify-center gap-2 border border-white/40 text-white px-7 py-3 rounded-xl hover:bg-white/10 transition"
                >
                  Book Demo <ArrowRight size={18} />
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust row */}
            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-wrap gap-6 text-blue-100/90 text-sm"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} /> Secure & Private
              </div>
              <div className="flex items-center gap-2">
                <CalendarCheck size={18} /> Instant Booking
              </div>
              <div className="flex items-center gap-2">
                <Stethoscope size={18} /> Verified Doctors
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: <ShieldCheck size={22} />,
              title: "Verified Profiles",
              text: "Doctors are screened, verified, and rated by patients.",
            },
            {
              icon: <CalendarCheck size={22} />,
              title: "Real-time Availability",
              text: "Instant slot visibility with quick confirmation.",
            },
            {
              icon: <Stethoscope size={22} />,
              title: "Smart Matching",
              text: "Find the right specialist with fast filters.",
            },
          ].map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="text-slate-500 mt-2">{f.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================= SPECIALTIES ================= */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-20">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-bold">Popular Specialties</h2>
            <p className="text-slate-500 mt-2">Choose a specialty and book within minutes.</p>
          </div>
          <Link
            to="/login"
            className="hidden md:inline-flex items-center gap-2 text-blue-700 font-semibold"
          >
            Explore all <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {specialties.map((s, idx) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12, duration: 0.5 }}
              className="group bg-white rounded-2xl p-6 border shadow-sm hover:shadow-lg transition"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:text-blue-700 transition">
                {s.icon}
              </div>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="text-slate-500 mt-2">{s.desc}</p>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 mt-5 text-blue-700 font-semibold"
              >
                View Doctors <ArrowRight size={16} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= TOP DOCTORS ================= */}
      <section className="bg-white py-20 border-t">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-bold">Top Doctors</h2>
              <p className="text-slate-500 mt-2">Highly rated professionals near you.</p>
            </div>
            <Link
              to="/login"
              className="hidden md:inline-flex items-center gap-2 text-blue-700 font-semibold"
            >
              View all <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {topDoctors.map((d, idx) => (
              <motion.div
                key={d.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.12, duration: 0.5 }}
                className="rounded-2xl border p-6 shadow-sm hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                    {d.name.split(" ")[1]?.[0] ?? "D"}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{d.name}</div>
                    <div className="text-slate-500 text-sm">{d.spec}</div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Star className="text-amber-500" size={16} />
                    <span className="font-semibold">{d.rating}</span>
                    <span className="text-slate-400">rating</span>
                  </div>
                  <div className="text-slate-500">{d.exp}</div>
                </div>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/login"
                    className="mt-6 w-full inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold"
                  >
                    Book Appointment
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-6"
        >
          <h2 className="text-4xl font-bold">Start Booking Smarter Healthcare</h2>
          <p className="mt-4 text-blue-100">
            Create an account and book appointments in seconds.
          </p>

          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/signup"
                className="bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold"
              >
                Create Account
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/login"
                className="border border-white/40 px-8 py-3 rounded-xl hover:bg-white/10 transition rounded-xl"
              >
                Login
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-10 text-center text-slate-500 text-sm">
        © 2026 Doctor Booking Platform — All rights reserved
      </footer>
    </div>
  );
}
