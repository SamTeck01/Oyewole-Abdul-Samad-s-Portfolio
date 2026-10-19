import Hero from "./Hero";
import AboutPage from "./About-Page";
import Experience from "./Experience";
import Skills from "./Skills";
import Projects from "./Projects";
import MotionWork from "./MotionWork";
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
      <MotionWork />
      <Accomplishments />
      <Testimonials />
      <Connect />
    </div>
  )
}
