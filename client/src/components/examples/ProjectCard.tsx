import ProjectCard from '../ProjectCard';

export default function ProjectCardExample() {
  return (
    <div className="max-w-sm">
      <ProjectCard
        title="Garden Portfolio"
        description="A beautiful portfolio website built with React and Tailwind CSS, featuring a nature-inspired design and smooth animations."
        technologies={["React", "TypeScript", "Tailwind CSS"]}
        githubUrl="https://github.com/example/garden-portfolio"
        liveUrl="https://example.github.io/garden-portfolio"
        status="blooming"
        lastUpdated="2 days ago"
      />
    </div>
  );
}