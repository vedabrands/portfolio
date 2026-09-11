import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Roadmap from "@/components/Roadmap";
import Projects from "@/components/Projects";
import Certifications from "@/components/Certifications";
import Contact from "@/components/Contact";
import ScrollReveal from "@/components/ScrollReveal";
import { getPortfolioData } from "@/lib/data";

export default async function Home() {
  const data = await getPortfolioData();

  return (
    <>
      <ScrollReveal />
      <Navbar links={data.links} name={data.profile?.name} />
      <main>
        <Hero headlines={data.profile?.hero_headlines} />
        <About bio={data.profile?.bio} stats={data.profile?.stats} />
        <Skills skills={data.skills} />
        <Roadmap experience={data.experience} />
        <Projects projects={data.projects} />
        <Certifications certifications={data.certifications} />
        <Contact links={data.links} name={data.profile?.name} />
      </main>
    </>
  );
}
