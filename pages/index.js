import Head from "next/head";
import Hero from "../components/hero";
import Navbar from "../components/navbar";
import SectionTitle from "../components/sectionTitle";

import { benefitOne, benefitTwo } from "../components/data";
import Video from "../components/video";
import Benefits from "../components/benefits";
import Footer from "../components/footer";
import Testimonials from "../components/testimonials";
import Faq from "../components/faq";
import PopupWidget from "../components/popupWidget";
import { AuthContextProvider } from "../context/AuthContext";

const Home = () => {
  return (
    <>
      <AuthContextProvider>
      <Head>
        <title>DialogueAI</title>
        <meta
          name="description"
          content="DialogueAI is a conversational learning agent for students to improve and practice on conversational skills. We provide meaningful insights, data and metrics to teachers as well"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <Hero />
      <SectionTitle
        pretitle="DialogueAI Benefits"
        title=" Why should you use DialogueAI">
        DialogueAI is a platform for students to engage in roleplaying scenarios with a language model trained to simulate real world dialogues to help improve students' conversational skills.
        It also provides meaningful insights and metrics for teachers to manage their students individually
      </SectionTitle>
      <Benefits data={benefitOne} />
      <Benefits imgPos="right" data={benefitTwo} />
      <SectionTitle
        pretitle="Testimonials"
        title="Here's what our customers said">
      </SectionTitle>
      <Testimonials />
      <SectionTitle pretitle="FAQ" title="Frequently Asked Questions">
      </SectionTitle>
      <Faq />
      <Footer />
      <PopupWidget />
      </AuthContextProvider>
    </>
  );
}

export default Home;