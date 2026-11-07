import Hero from "./Hero";
import AboutPage from "./About-Page";
import Experience from "./Experience";
import Skills from "./Skills";
import Projects from "./Projects";
import Services from "./Services";
import Accomplishments from "./Accomplishments";
import Testimonials from "./Testimonials";
import Connect from "./Connect";
import FAQ from "./FAQ";

export default function Home() {
  return (
    <div className="bg-dark overflow-x-hidden">
      <Hero />
      <Services />
      <Projects />
      <AboutPage />
      <Experience />
      <Skills />
      <Accomplishments />
      <Testimonials />
      <FAQ />
      <Connect />
    </div>
  )
}
