
import Hero from "./Hero";
import AboutPage from "./About-Page";
import FreePage from "./Free Page";
import Skills from "./Skills";
import Contact from "./Contact";
import Projects from "./Projects";

export default function Home() {
  return (
    <div>
      <section id="hero"><Hero /></section>
      <section id="about"><AboutPage /></section>
      <section id="free"><FreePage /></section>
      <section id="skills"><Skills /></section>
      <section id="projects"><Projects /></section>
      <section id="contact"><Contact /></section>
    </div>
  )
}
