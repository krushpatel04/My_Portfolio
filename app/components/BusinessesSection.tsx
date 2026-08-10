import { business } from "../data/resume";
import SectionHeading from "./SectionHeading";
import BusinessCard from "./BusinessCard";

export default function BusinessesSection() {
  return (
    <section className="pt-16">
      <SectionHeading id="businesses" label="Businesses" />
      <div className="mt-8">
        <BusinessCard item={business} />
      </div>
    </section>
  );
}
