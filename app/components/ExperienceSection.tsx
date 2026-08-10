import { experience } from "../data/resume";
import SectionHeading from "./SectionHeading";
import JobCard from "./JobCard";

export default function ExperienceSection() {
  return (
    <section className="pt-16">
      <SectionHeading id="experience" label="Experience" />
      <div className="mt-8 flex flex-col gap-5">
        {experience.map((job, i) => (
          <JobCard key={`${job.company}-${i}`} job={job} />
        ))}
      </div>
    </section>
  );
}
