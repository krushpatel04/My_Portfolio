import { business } from "../data/resume";
import SectionHeading from "./SectionHeading";
import BusinessCard from "./BusinessCard";

export default function BusinessesSection() {
  return (
    <section className="pt-16" aria-labelledby="businesses-label">
      <SectionHeading id="businesses" label="Businesses" />
      <div className="mt-8">
        <BusinessCard item={business} />
      </div>
    </section>
  );
}
