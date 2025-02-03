
import Hero from "./Hero";
import Popular from "./About-Page";
import Offer from "./Offer";
import NewCollections from "./Skills";
import NewsLetter from "./NewsLetter";

export default function Home() {
  return (
    <div>
      <Hero />
      <Popular/>
      <Offer/>
      <NewCollections/>
      <NewsLetter/>
    </div>
  )
}
