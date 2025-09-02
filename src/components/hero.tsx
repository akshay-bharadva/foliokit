import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Terminal,
  CircleDashed,
  Layers,
  Clock,
  ChevronRight,
  Activity,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { useGetSiteIdentityQuery } from "@/store/api/publicApi";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef, useMemo } from "react";
import { SOCIAL_ICONS } from "@/lib/social-icons";

const HeroSkeleton = () => (
  <section className="py-12 lg:py-20 grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
    <div className="lg:col-span-7 space-y-8">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-24 w-full max-w-2xl" />
      <Skeleton className="h-8 w-full max-w-lg" />
      <Skeleton className="h-32 w-full max-w-xl" />
      <div className="flex gap-4">
        <Skeleton className="h-12 w-32" />
        <Skeleton className="h-12 w-32" />
      </div>
    </div>
    <div className="lg:col-span-5">
      <Skeleton className="h-[500px] w-full rounded-xl" />
    </div>
  </section>
);

function LiveClock() {
  const [time, setTime] = useState<Date | null>(null);
  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  if (!time) return <span className="tabular-nums">00:00:00</span>;
  return (
    <span className="tabular-nums">
      {time.toLocaleTimeString("en-US", { hour12: false })}
    </span>
  );
}

function Uptime() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return (
    <span className="tabular-nums">
      {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:
      {String(s).padStart(2, "0")}
    </span>
  );
}

function TerminalLines({ name, title }: { name: string; title: string }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [loopCount, setLoopCount] = useState(0);
  const lines = [
    { prefix: "$", text: `whoami`, color: "text-foreground" },
    { prefix: "→", text: name.toLowerCase().replace(/\s/g, "_"), color: "text-primary" },
    { prefix: "$", text: `cat role.txt`, color: "text-foreground" },
    { prefix: "→", text: title, color: "text-green-400" },
    { prefix: "$", text: `systemctl status portfolio`, color: "text-foreground" },
    { prefix: "●", text: "active (running)", color: "text-green-400" },
  ];

  useEffect(() => {
    if (visibleLines < lines.length) {
      const timer = setTimeout(
        () => setVisibleLines((v) => v + 1),
        visibleLines === 0 ? 800 : 300 + Math.random() * 300,
      );
      return () => clearTimeout(timer);
    } else {
      // After all lines shown, wait then restart
      const timer = setTimeout(() => {
        setVisibleLines(0);
        setLoopCount((c) => c + 1);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [visibleLines, lines.length]);

  return (
    <div className="h-[108px] font-mono text-[11px] leading-relaxed">
      <AnimatePresence mode="wait">
        <motion.div
          key={loopCount}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-0.5"
        >
          {lines.slice(0, visibleLines).map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1.5"
            >
              <span className={cn(
                line.prefix === "$" ? "text-primary" : "text-muted-foreground/60",
              )}>
                {line.prefix}
              </span>
              <span className={line.color}>{line.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      {/* Blinking cursor always at bottom */}
      <div className="flex items-center gap-1 mt-0.5">
        <span className="text-primary">$</span>
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-1.5 h-3.5 bg-primary rounded-[1px]"
        />
      </div>
    </div>
  );
}

/** Kinetic text — reveals each character with a staggered wave animation */
function KineticText({ text }: { text: string }) {
  const chars = useMemo(() => text.split(""), [text]);

  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.04, delayChildren: 0.3 } },
      }}
      aria-label={text}
    >
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className="inline-block"
          style={{ whiteSpace: char === " " ? "pre" : undefined }}
          variants={{
            hidden: { opacity: 0, y: 40, rotateX: -90 },
            visible: {
              opacity: 1,
              y: 0,
              rotateX: 0,
              transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
              },
            },
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

/** Rotating subtitle — cycles through titles with a morphing effect */
function RotatingTitle({ titles }: { titles: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (titles.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % titles.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [titles.length]);

  return (
    <span className="relative inline-flex overflow-hidden h-[1.3em] align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={titles[index]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {titles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Tiny animated bar chart for visual flair */
function MiniBarChart() {
  return (
    <div className="flex items-end gap-[3px] h-5">
      {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.3, 0.75].map((h, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-primary/60"
          animate={{ height: [`${h * 100}%`, `${(1 - h) * 60 + 20}%`, `${h * 100}%`] }}
          transition={{
            repeat: Infinity,
            duration: 1.5 + Math.random() * 1,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  const { data: content, isLoading } = useGetSiteIdentityQuery();

  if (isLoading || !content) return <HeroSkeleton />;

  const { profile_data: hero, social_links: socials } = content;
  const { status_panel } = hero;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="py-10 md:py-14 relative">
      {/* Decorative blur orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Left Content */}
        <div
          className={cn(
            "flex flex-col gap-6 relative z-10",
            status_panel.show
              ? "lg:col-span-7"
              : "lg:col-span-12 text-center items-center",
          )}
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 text-primary font-mono text-sm tracking-widest uppercase"
          >
            <Terminal className="size-4" />
            <span>System Online</span>
            <span className="relative flex h-2 w-2 ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-display font-black text-foreground tracking-tighter leading-[0.95]"
            style={{ fontSize: "clamp(3.5rem, 10vw, 5rem)", perspective: "600px" }}
          >
            <KineticText text={hero.name} />
            <motion.span
              className="text-primary font-black inline-block"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + hero.name.length * 0.04, type: "spring", damping: 8, stiffness: 300 }}
            >
              .
            </motion.span>
          </motion.h1>

          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <motion.div
              className="h-px bg-primary/50"
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
            />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-heading text-muted-foreground">
              {hero.title.includes("|") ? (
                <RotatingTitle titles={hero.title.split("|").map((t) => t.trim())} />
              ) : (
                hero.title
              )}
            </h2>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className={cn(
              "max-w-xl prose prose-lg prose-p:text-muted-foreground prose-a:text-primary prose-p:leading-relaxed",
              !status_panel.show && "mx-auto",
            )}
          >
            <ReactMarkdown>{hero.description}</ReactMarkdown>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className={cn(
              "flex flex-wrap gap-4 pt-4",
              !status_panel.show && "justify-center",
            )}
          >
            {socials
              .filter((s) => s.is_visible)
              .map((social, index) => {
                const Icon = SOCIAL_ICONS[social.id.toLowerCase()];
                if (!Icon) return null;
                const isPrimary = index === 0;
                return (
                  <Button
                    key={social.url}
                    asChild
                    variant={isPrimary ? "default" : "outline"}
                    size="lg"
                    className={cn(
                      "gap-2 transition-all duration-300",
                      isPrimary
                        ? "bg-primary text-primary-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5"
                        : "border-border bg-card hover:bg-primary/5 hover:text-primary hover:border-primary/30",
                    )}
                  >
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon className="size-4" />
                      {social.label}
                    </a>
                  </Button>
                );
              })}
          </motion.div>
        </div>

        {/* Right: Combined Status + Terminal Panel */}
        {status_panel.show && (
          <motion.div className="lg:col-span-5 w-full" variants={itemVariants}>
            <div className="relative group">
              {/* Outer animated glow */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary/30 via-primary/10 to-accent/20 blur-md opacity-60 group-hover:opacity-80 transition-all duration-700" />
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 opacity-0 group-hover:opacity-40 transition-all duration-500" />

              <div className="bg-card/95 backdrop-blur-sm rounded-xl border border-border/60 shadow-lg hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                {/* Decorative internal blurs — boosted visibility */}
                <div className="absolute -top-20 -right-20 w-56 h-56 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/8 rounded-full blur-2xl pointer-events-none" />

                {/* Terminal-style header bar */}
                <div className="flex justify-between items-center px-5 py-3 border-b border-border/50 bg-secondary/40 backdrop-blur-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="flex gap-1.5">
                      <span className="size-2.5 rounded-full bg-red-500/70 shadow-[0_0_6px_rgba(239,68,68,0.3)]" />
                      <span className="size-2.5 rounded-full bg-yellow-500/70 shadow-[0_0_6px_rgba(234,179,8,0.3)]" />
                      <span className="size-2.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)] animate-pulse" />
                    </div>
                    <span className="font-mono text-[11px] text-muted-foreground ml-0.5">
                      {status_panel.title || "status.panel"}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <Clock className="size-3" />
                    <LiveClock />
                  </span>
                </div>

                {/* Status content */}
                <div className="p-5 md:p-6 space-y-4 relative z-10">
                  {/* Top stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-background/50 rounded-lg p-3 border border-border/30 space-y-1">
                      <span className="text-[10px] text-muted-foreground/60 font-mono uppercase tracking-wider flex items-center gap-1">
                        <CircleDashed className="size-2.5" /> Status
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                        </span>
                        <span className="text-xs font-medium text-green-500">Online</span>
                      </div>
                    </div>
                    <div className="bg-background/50 rounded-lg p-3 border border-border/30 space-y-1">
                      <span className="text-[10px] text-muted-foreground/60 font-mono uppercase tracking-wider flex items-center gap-1">
                        <Activity className="size-2.5" /> Uptime
                      </span>
                      <span className="text-xs font-medium text-foreground font-mono">
                        <Uptime />
                      </span>
                    </div>
                    <div className="bg-background/50 rounded-lg p-3 border border-border/30 space-y-1">
                      <span className="text-[10px] text-muted-foreground/60 font-mono uppercase tracking-wider flex items-center gap-1">
                        <Zap className="size-2.5" /> Load
                      </span>
                      <MiniBarChart />
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center justify-between bg-green-500/5 border border-green-500/10 rounded-lg px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                      </span>
                      <span className="text-sm font-medium text-green-400">
                        {status_panel.availability}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground/70 font-mono">
                      AVAILABILITY
                    </span>
                  </div>

                  {/* Exploring */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-muted-foreground/60 font-mono flex items-center gap-1.5 uppercase tracking-wider">
                      <Layers className="size-3" />
                      {status_panel.currently_exploring.title}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {status_panel.currently_exploring.items.map(
                        (item, index) => (
                          <motion.div
                            key={item}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                          >
                            <Badge
                              variant="secondary"
                              className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 font-mono text-[11px] transition-colors cursor-default"
                            >
                              {item}
                            </Badge>
                          </motion.div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Latest Project */}
                  <Link
                    href={status_panel.latestProject.href}
                    className="flex items-center justify-between group/link p-3 -mx-1 rounded-lg bg-background/30 hover:bg-primary/5 transition-all duration-300 border border-border/30 hover:border-primary/20"
                  >
                    <div>
                      <p className="text-[10px] text-muted-foreground/70 font-mono uppercase tracking-wider mb-0.5">
                        Latest Deploy
                      </p>
                      <p className="font-bold text-sm text-foreground">
                        {status_panel.latestProject.name}
                      </p>
                    </div>
                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center group-hover/link:bg-primary group-hover/link:text-primary-foreground transition-all duration-300 group-hover/link:shadow-[0_0_12px_rgba(var(--primary),0.3)] group-hover/link:scale-110">
                      <ArrowRight className="size-3.5" />
                    </div>
                  </Link>

                  {/* Terminal section */}
                  <div className="bg-background/60 rounded-lg border border-border/30 overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/20 bg-secondary/20">
                      <div className="flex items-center gap-1.5">
                        <ChevronRight className="size-3 text-primary" />
                        <span className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-wider">
                          system_init.sh
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-primary/40">bash</span>
                    </div>
                    <div className="p-3">
                      <TerminalLines name={hero.name} title={hero.title} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
