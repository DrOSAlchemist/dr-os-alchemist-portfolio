import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { evidenceUrl, featuredProjects, projectUrl } from "@/lib/projects";

export default function FeaturedProjects() {
  return (
    <div className="featured-project-grid">
      {featuredProjects.map((project) => (
        <article className="featured-project" key={project.name}>
          <div className="featured-project-topline">
            <span className="mono-label">{project.category}</span>
            <a href={projectUrl(project)} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} on GitHub`}>
              <ArrowUpRight aria-hidden="true" size={18} />
            </a>
          </div>
          <span className="project-status">{project.status}</span>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <dl className="project-evidence">
            <div><dt>Evidence</dt><dd>{project.evidence}</dd></div>
            <div><dt>Boundary</dt><dd>{project.limitation}</dd></div>
          </dl>
          <div className="resume-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <div className="project-links">
            <a className="text-link" href={projectUrl(project)} target="_blank" rel="noreferrer">
              Source code <ArrowUpRight aria-hidden="true" size={14} />
            </a>
            <a className="text-link" href={evidenceUrl(project)} target="_blank" rel="noreferrer">
              Inspect evidence <ArrowUpRight aria-hidden="true" size={14} />
            </a>
            {project.noteSlug && (
              <Link className="text-link" href={`/writing/${project.noteSlug}`}>
                Design note <ArrowUpRight aria-hidden="true" size={14} />
              </Link>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
