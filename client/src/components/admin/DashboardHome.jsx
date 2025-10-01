import React, { useState, useEffect } from "react";
import { useStore } from "../../store/useStore";
import {
  FaRegImage,
  FaInfoCircle,
  FaBoxOpen,
  FaPencilAlt,
  FaRegAddressCard,
  FaComments,
  FaInfo,
  FaArrowRight,
  FaQuestionCircle,
} from "react-icons/fa";
import { clsx } from "clsx";
// ✨ For actual charts, you would import components from recharts
// import { LineChart, Line } from 'recharts';

// ✨ Component 1: The Main Dashboard Component
export default function DashboardHome({ setActiveSection }) {
  const { state } = useStore();
  const { heroData, aboutData, products, testimonials, faq, contact, queries } =
    state;
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data fetching to demonstrate the skeleton loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Simulate a 1.5-second load time
    return () => clearTimeout(timer);
  }, []);

  // Check for empty states to provide better user guidance
  const isHeroEmpty = !heroData?.title && !heroData?.subtitle;
  const isAboutEmpty = !aboutData?.title && !aboutData?.description;
  const isContactEmpty = !contact?.title && !contact?.subtitle;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    // ✨ A subtle background gradient can add a modern feel to the whole page
    <div className="p-1 bg-gradient-to-br bg-white min-h-full">
      <DashboardHeader />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {/* Content Preview Cards */}
        <Card
          title="Hero Section"
          icon={<FaRegImage size={20} />}
          actionLabel="Edit"
          onActionClick={() => setActiveSection?.("hero")}
          color="indigo"
          isEmpty={isHeroEmpty}
        >
          {isHeroEmpty ? (
            <p className="text-sm text-slate-500">
              Click 'Edit' to set your main headline and image.
            </p>
          ) : (
            <>
              <p className="text-base font-bold text-slate-800 truncate">
                {heroData.title}
              </p>
              <p className="mt-1 text-sm text-slate-500 truncate">
                {heroData.subtitle}
              </p>
            </>
          )}
        </Card>

        <Card
          title="About Us"
          icon={<FaInfoCircle size={20} />}
          actionLabel="Edit"
          onActionClick={() => setActiveSection?.("about")}
          color="sky"
          isEmpty={isAboutEmpty}
        >
          {isAboutEmpty ? (
            <p className="text-sm text-slate-500">
              Click 'Edit' to tell your story and mission.
            </p>
          ) : (
            <>
              <p className="text-base font-bold text-slate-800 truncate">
                {aboutData.title}
              </p>
              <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                {aboutData.description}
              </p>
            </>
          )}
        </Card>
        <Card
          title="Contact Info"
          icon={<FaInfo size={20} />}
          actionLabel="Edit"
          onActionClick={() => setActiveSection?.("contact")}
          color="rose"
        >
          {isContactEmpty ? (
            <p className="text-sm text-slate-500">
              Update your public contact details and address.
            </p>
          ) : (
            <>
              <p className="text-base font-bold text-slate-800 truncate">
                {contact.title}
              </p>
              <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                {contact.subtitle}
              </p>
            </>
          )}
        </Card>

        {/* Statistic Cards with Chart Placeholders */}
        <StatCard
          title="Products"
          value={products?.length ?? 0}
          label="items"
          icon={<FaBoxOpen size={20} />}
          color="emerald"
          onActionClick={() => setActiveSection?.("products")}
        />

        <StatCard
          title="Testimonials"
          value={testimonials?.items?.length ?? 0}
          label="reviews"
          icon={<FaRegAddressCard size={20} />}
          color="amber"
          onActionClick={() => setActiveSection?.("testimonials")}
        />

        <StatCard
          title="FAQs"
          value={faq?.items?.length ?? 0}
          label="questions"
          icon={<FaComments size={20} />}
          color="violet"
          onActionClick={() => setActiveSection?.("faq")}
        />
        <StatCard
          title={"Queries"}
          value={queries?.items?.length ?? 0}
          label={"Queries"}
          icon={<FaQuestionCircle size={20} />}
          color={"violet"}
          violet
          onActionClick={() => setActiveSection?.("queries")}
        />

        {/* You can add more cards as needed */}
      </div>
    </div>
  );
}

// ✨ Component 2: The Welcome Header
const DashboardHeader = () => (
  <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between">
    <div>
      <h1 className="text-3xl font-bold text-slate-800">
        Welcome back, Admin 👋
      </h1>
      <p className="mt-1 text-slate-500">
        Here's a snapshot of your website's content.
      </p>
    </div>
  </div>
);

// ✨ Component 3: The Interactive Content Card
const Card = ({
  title,
  icon,
  children,
  actionLabel,
  onActionClick,
  color = "indigo",
  isEmpty = false,
}) => {
  const colorClasses = {
    indigo: "bg-indigo-100 text-indigo-600",
    sky: "bg-sky-100 text-sky-600",
    rose: "bg-rose-100 text-rose-600",
  };

  return (
    <button
      onClick={onActionClick}
      className={clsx(
        "group bg-white/80 backdrop-blur-sm p-5 rounded-xl border text-left shadow-sm flex flex-col justify-between hover:shadow-lg hover:border-indigo-400 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
        isEmpty ? "border-slate-300 border-dashed" : "border-slate-200"
      )}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={clsx("rounded-lg p-2.5", colorClasses[color])}>
              {icon}
            </div>
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          </div>
          <FaArrowRight className="text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-500 transition-transform duration-200" />
        </div>
        <div className="pl-1">{children}</div>
      </div>
      <div className="mt-5 flex justify-end">
        <div className="flex items-center gap-2 text-xs bg-slate-100 text-slate-600 font-semibold px-2.5 py-1 rounded-md group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-200">
          <FaPencilAlt size={11} />
          {actionLabel}
        </div>
      </div>
    </button>
  );
};

// ✨ Component 4: The Statistic Card with Chart Placeholder
const StatCard = ({ title, value, label, icon, color, onActionClick }) => {
  const colorClasses = {
    emerald: {
      bg: "bg-emerald-100",
      text: "text-emerald-600",
      line: "stroke-emerald-500",
    },
    amber: {
      bg: "bg-amber-100",
      text: "text-amber-600",
      line: "stroke-amber-500",
    },
    violet: {
      bg: "bg-violet-100",
      text: "text-violet-600",
      line: "stroke-violet-500",
    },
  };

  return (
    <button
      onClick={onActionClick}
      className="group bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-slate-200 text-left shadow-sm hover:shadow-lg hover:border-indigo-400 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={clsx("rounded-lg p-2.5", colorClasses[color].bg)}>
            <span className={colorClasses[color].text}>{icon}</span>
          </div>
          <h3 className="font-semibold text-slate-800">{title}</h3>
        </div>
        <FaArrowRight className="text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-500 transition-transform duration-200" />
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-4xl font-bold text-slate-800">{value}</p>
          <p className="text-sm text-slate-500 capitalize">
            {value === 1 ? label.slice(0, -1) : label}
          </p>
        </div>
        {/* This is a placeholder for a real chart from a library like Recharts */}
        <div className="w-24 h-12 flex items-end">
          <svg viewBox="0 0 100 40" className="w-full h-full">
            <polyline
              fill="none"
              className={clsx(
                "stroke-2 opacity-50 group-hover:opacity-100 transition-opacity",
                colorClasses[color].line
              )}
              points="0,30 20,20 40,35 60,10 80,15 100,5"
            />
          </svg>
        </div>
      </div>
    </button>
  );
};

// ✨ Component 5: The Skeleton Loader for the entire dashboard
const DashboardSkeleton = () => {
  const SkeletonCard = () => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-slate-200"></div>
          <div className="h-4 w-24 rounded bg-slate-200"></div>
        </div>
        <div className="h-4 w-4 rounded-full bg-slate-200"></div>
      </div>
      <div className="mt-8 animate-pulse">
        <div className="h-8 w-1/3 rounded bg-slate-200"></div>
        <div className="mt-2 h-4 w-3/4 rounded bg-slate-200"></div>
      </div>
    </div>
  );

  return (
    <div className="p-1">
      <div className="mb-8 animate-pulse">
        <div className="h-8 w-1/3 rounded bg-slate-200"></div>
        <div className="mt-2 h-4 w-1/2 rounded bg-slate-200"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {[...Array(7)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
};
