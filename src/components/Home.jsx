
import Hero from "./Hero";
import AboutPage from "./About-Page";
import FreePage from "./Free Page";
import Skills from "./Skills";
import Contact from "./Contact";
import Projects from "./Projects";

export default function Home() {
  return (
    <div>
      <Hero />
      <AboutPage/>
      <FreePage/>
      <Skills/>
      <Projects/>
      <Contact/>
    </div>
  )
}
