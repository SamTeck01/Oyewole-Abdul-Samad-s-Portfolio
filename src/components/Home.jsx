import Hero from "./Hero";
import Services from "./Services";
import Projects from "./Projects";
import Testimonials from "./Testimonials";
import AboutPage from "./About-Page";
import Experience from "./Experience";
import Skills from "./Skills";
import FAQ from "./FAQ";
import Connect from "./Connect";

/* Order is client-first: what I do -> proof (work, then what clients say) ->
   who I am -> recruiter detail (experience, skills) -> objections (FAQ) -> contact. */
export default function Home() {
  return (
    <div className="bg-dark overflow-x-hidden">
      <Hero />
      <Services />
      <Projects />
      <Testimonials />
      <AboutPage />
      <Experience />
      <Skills />
      <FAQ />
      <Connect />
    </div>
  )
}
