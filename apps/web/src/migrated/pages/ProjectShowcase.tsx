/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Code2,
  ExternalLink,
  Layers,
  Terminal,
} from "lucide-react";

import { projects } from "../constants";

export default function ProjectShowcase() {
  const { id } = useParams();
  const index = projects.findIndex((p) => p.id === id);
  const project = index >= 0 ? projects[index] : undefined;
  const next = index >= 0 ? projects[(index + 1) % projects.length] : undefined;

  useEffect(() => {
    if (!project) {
      document.title = "Project Not Found | Kurt's Portfolio";
      return;
    }

    document.title = `${project.title} | Kurt's Portfolio`;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", project.desc);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", project.title);
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute("content", project.desc);
  }, [project]);

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold">Project Not Found</h1>
          <Link
            to="/#projects"
            className="inline-flex items-center justify-center gap-2 text-blue-500 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to projects
          </Link>
        </div>
      </div>
    );
  }

  const isExternal = project.href?.startsWith("http") ?? false;
  const launchLabel = project.hrefLabel ?? "Launch app";

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-10"
      >
        <Link
          to="/#projects"
          className="group inline-flex items-center gap-2 text-gray-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to projects
        </Link>

        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-widest">
            <span
              className={`rounded-full border px-3 py-1 ${
                project.live
                  ? "border-green-500/40 bg-green-500/10 text-green-400"
                  : "border-blue-500/40 bg-blue-500/10 text-blue-400"
              }`}
            >
              {project.status}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-gray-400">
              {project.tag}
            </span>
          </div>

          <div className="flex items-start gap-4">
            <div className="mt-1 hidden rounded-2xl border border-white/10 bg-white/5 p-3 text-white sm:block">
              {project.icon}
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-black leading-tight md:text-5xl">
                {project.title}
              </h1>
              <p className="max-w-3xl text-lg leading-relaxed text-gray-400 md:text-xl">
                {project.desc}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel={isExternal ? "noopener noreferrer" : "noopener"}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
              >
                {isExternal ? (
                  <ExternalLink className="h-4 w-4" />
                ) : (
                  <ArrowUpRight className="h-4 w-4" />
                )}
                {launchLabel}
              </a>
            )}
            <Link
              to="/#contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
            >
              Start a project
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        {project.image && (
          <figure className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
            <img
              src={project.image}
              alt={`${project.title} interface`}
              fetchPriority="high"
              decoding="async"
              className={
                project.imageFit === "contain"
                  ? "mx-auto h-auto max-h-[36rem] w-full object-contain"
                  : "h-auto w-full object-cover object-top"
              }
            />
          </figure>
        )}

        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-12">
            <section className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-blue-500">
                What I built
              </h2>
              <p className="text-lg leading-relaxed text-gray-300">
                {project.role}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-blue-500">
                Launch it
              </h2>
              {project.href ? (
                <p className="text-gray-400">
                  {isExternal
                    ? "This build is deployed. The launch button opens the live site in a new tab."
                    : "The demo is bundled with this portfolio, so it runs from the same origin in a new tab."}
                </p>
              ) : (
                <p className="text-gray-400">
                  This build runs locally. Open the entry file below and start it
                  with the command shown.
                </p>
              )}

              {project.entry && (
                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <Code2 className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Entry file
                    </p>
                    <code className="break-all font-mono text-sm text-gray-300">
                      {project.entry}
                    </code>
                  </div>
                </div>
              )}

              {project.command && (
                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/40 p-4">
                  <Terminal className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Run it
                    </p>
                    <code className="break-all font-mono text-sm text-green-400">
                      {project.command}
                    </code>
                  </div>
                </div>
              )}

              {project.note && (
                <p className="text-sm leading-relaxed text-gray-500">
                  {project.note}
                </p>
              )}
            </section>

            {project.images && project.images.length > 1 && (
              <section className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-blue-500">
                  More screens
                </h2>
                <div className={`grid gap-4 ${project.images.length > 2 ? "sm:grid-cols-2" : ""}`}>
                  {project.images.slice(1).map((image) => (
                    <img
                      key={image}
                      src={image}
                      alt={`${project.title} — additional screen`}
                      loading="lazy"
                      decoding="async"
                      className="h-auto w-full rounded-2xl border border-white/10 object-cover object-top"
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-8">
            <div className="space-y-3 rounded-3xl border border-white/10 bg-white/[0.02] p-6">
              <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400">
                <Layers className="h-4 w-4" />
                Stack
              </h2>
              <ul className="flex flex-wrap gap-2">
                {project.stack?.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 rounded-3xl border border-white/10 bg-white/[0.02] p-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                Status
              </h2>
              <p className="text-sm leading-relaxed text-gray-400">
                {project.status}. {project.live ? "Shipped and reachable." : "Built and verified locally."}
              </p>
            </div>
          </aside>
        </div>

        {next && next.id !== project.id && (
          <Link
            to={next.path}
            className="group flex items-center justify-between gap-6 rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-white/25 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] md:p-8"
          >
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Next project
              </p>
              <p className="text-xl font-bold transition-colors group-hover:text-blue-400 md:text-2xl">
                {next.title}
              </p>
            </div>
            <ArrowRight className="h-6 w-6 shrink-0 text-gray-500 transition-all group-hover:translate-x-1 group-hover:text-white" />
          </Link>
        )}
      </motion.div>
    </div>
  );
}
