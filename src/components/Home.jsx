import Hero from "./Hero";
import AboutPage from "./About-Page";
import Experience from "./Experience";
import Skills from "./Skills";
import Projects from "./Projects";
import Accomplishments from "./Accomplishments";
import Testimonials from "./Testimonials";
import Connect from "./Connect";

export default function Home() {
  return (
    <div className="bg-dark overflow-x-hidden">
      <Hero />
      <AboutPage />
      <Experience />
      <Skills />
      <Projects />
      <Accomplishments />
      <Testimonials />
      <Connect />
    </div>
  )
}
