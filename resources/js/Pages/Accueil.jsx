import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Inertia } from '@inertiajs/inertia';
import VanillaTilt from 'vanilla-tilt';
import Logo from '../../img/image-removebg-preview.png';
import Chat from '../../img/chat.png';
import Notification from '../../img/notification.png';
import Stat from '../../img/statistique.png';
import DashView from '../../img/dashview1.png';
import Board from '../../img/board.png';
import BackgroundGradient from '../../img/Freebie-GradientTextures-01.jpg';
import { LinkPreview } from "@/components/ui/link-preview";
import { FaTasks, FaUsers, FaComments, FaChartLine, FaSyncAlt, FaTwitter, FaLinkedin, FaGithub, FaArrowUp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';


const Accueil = () => {

  const [activeIndex, setActiveIndex] = useState(null);
  const [showScroll, setShowScroll] = useState(false);

  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const card4Ref = useRef(null);

  // Initialiser Vanilla Tilt
  useEffect(() => {
    const options = {
      max: 5,          
      speed: 2000,        
      glare: false,     
      "max-glare": 0.5,  
      perspective: 1000, 
    };

    AOS.init({
      duration: 1000,
      once: true,    
    });

    [card1Ref, card2Ref, card3Ref, card4Ref].forEach((ref) => {
      if (ref.current) {
        VanillaTilt.init(ref.current, options);
      }
    });

    return () => {
      [card1Ref, card2Ref, card3Ref, card4Ref].forEach((ref) => {
        if (ref.current?.vanillaTilt) {
          ref.current.vanillaTilt.destroy();
        }
      });
    };
  }, []);

  const handleButtonLoginClick = () => {
    Inertia.visit('/home');
  };
  const handleButtonRegisterClick = () => {
    Inertia.visit('/register');
  };

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleAccordion = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index)); 
  };

  // Handle scroll to show/hide the scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>

      <div
        className=''
        style={{
          backgroundImage: `url(${BackgroundGradient})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <div className='w-full p-2 bg-white flex justify-between items-center rounded-b-xl' data-aos="fade-down">

          <img src={Logo} alt="" className='w-14 ml-4' />

          
          <ul className='flex space-x-10'>
            <li className='hover:text-purple-700 duration-300 cursor-pointer font-semibold' onClick={() => handleScrollTo('first-ancre')}>Découvrir Mira</li>
            <li className='hover:text-purple-700 duration-300 cursor-pointer font-semibold' onClick={() => handleScrollTo('fonctionnement')}>Fonctionnement</li>
            <li className='hover:text-purple-700 duration-300 cursor-pointer font-semibold' onClick={() => handleScrollTo('faq')}>FAQ</li>
            <li className='hover:text-purple-700 duration-300 cursor-pointer font-semibold' onClick={() => handleScrollTo('contact')}>Contact</li>
          </ul>
          

          <div className='space-x-4 mr-4'>
            <button onClick={handleButtonLoginClick} className='border-2 border-purple-600 p-2 px-4 rounded-full text-purple-800 hover:bg-purple-600 hover:text-white duration-150'>Se connecter</button>
            <button onClick={handleButtonRegisterClick} className="p-2 px-4 rounded-full text-white bg-gradient-to-r from-purple-600  to-purple-500 hover:shadow-lg hover:shadow-purple-500/50">
              S'inscrire
            </button>
          </div>

        </div>
        <header className='flex flex-col p-32'>
          <div className='w-2/3 space-y-8 mx-auto flex flex-col justify-center items-center'>
            <h1 className="text-6xl font-bold text-white text-center leading-relaxed" data-aos="fade-right">
              <span className="bg-white/20  border border-gray-300/30 hover:bg-white p-2 rounded-md shadow-xl duration-200 cursor-default">
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600'>Transformez</span>
              </span> vos projets en réussite grâce à la puissance de Mira Lab et de la collaboration intelligente.
            </h1>

            <p className='text-white tracking-wide w-3/4 mx-auto text-center text-3xl leading-relaxed' data-aos="fade-left" data-aos-delay="400" >
              Mira Lab
              <span className="bg-white/20  border border-gray-300/30 hover:bg-white p-1 mx-2 rounded-md shadow-xl duration-200 cursor-default">
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600'>optimise la gestion</span>
              </span> de vos projets et transforme chaque étape en succès collaboratif,
              <span className="bg-white/20  border border-gray-300/30 hover:bg-white p-1 mx-2 rounded-md shadow-xl duration-200 cursor-default">
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-purple-300'>sans effort</span>
              </span> supplémentaire.
            </p>

            <button className='p-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-white hover:text-purple-600 duration-200' onClick={() => handleScrollTo("first-ancre")} data-aos="fade-up" data-aos-delay="1000" >
              Découvrir Mira Lab
            </button>
          </div>
        </header>
      </div>

      <main className='w-full' data-aos="fade-up">
        <div className=''>
          <section className="p-16 w-3/4 mx-auto" id='first-ancre'>
            <h2 className="text-5xl w-1/3 mx-auto font-bold text-center text-gray-900 mb-10">
              Comment Mira Lab va <span className="text-purple-500">révolutionner</span> votre quotidien ?
            </h2>
            <div className="flex flex-wrap justify-center">
              <div className="text-left w-full sm:w-80 m-4" data-aos="fade-up" data-aos-delay="100">
                <div className="w-12 h-12 mb-4 flex items-center justify-center bg-purple-100 rounded-full">
                  <FaTasks className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Optimisez vos projets et collaborez efficacement</h3>
                <p className="text-gray-600">
                  Mira Lab vous permet d'organiser vos projets sous forme de tableaux intuitifs, de suivre l'avancement des tâches et de collaborer avec des équipes sur des projets publics ou privés. Simplifiez la gestion et renforcez la productivité.
                </p>
              </div>
              <div className="text-left w-full sm:w-80 m-4" data-aos="fade-up" data-aos-delay="200">
                <div className="w-12 h-12 mb-4 flex items-center justify-center bg-purple-100 rounded-full">
                  <FaComments className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Communiquez et travaillez en temps réel</h3>
                <p className="text-gray-600">
                  Échangez instantanément avec votre équipe grâce au chat intégré, partagez des idées et réagissez rapidement aux besoins des projets. Chaque modification ou message est immédiatement visible pour une synergie parfaite.
                </p>
              </div>
              <div className="text-left w-full sm:w-80 m-4" data-aos="fade-up" data-aos-delay="300">
                <div className="w-12 h-12 mb-4 flex items-center justify-center bg-purple-100 rounded-full">
                  <FaChartLine className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Analysez et améliorez vos performances</h3>
                <p className="text-gray-600">
                  Accédez à des statistiques détaillées sur vos projets et votre profil. Mesurez vos progrès, identifiez les points à optimiser et améliorez continuellement votre efficacité pour atteindre vos objectifs.
                </p>
              </div>
            </div>
          </section>

          {/* avantage Mira Lab */}

          <section className='w-full p-32 bg-purple-100/60' id='fonctionnement' >
            <div className='w-3/4 mx-auto text-center'>
              <h2 className="text-5xl font-bold text-gray-900 mb-4">
                Comment Mira Lab <span className="text-purple-500">fonctionne</span> ?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Mira Lab vous aide à gérer vos projets de manière intuitive, en facilitant la collaboration en temps réel, le suivi des performances, et en optimisant chaque étape de votre workflow.
              </p>
              <button className="px-8 py-3 text-white bg-purple-500 rounded-lg mb-12 hover:bg-purple-600">
                Découvrir la plateforme →
              </button>

              <div className="flex flex-col space-y-16">
                {/* Première Ligne de Cartes */}
                <div className='flex space-x-16 justify-center'>
                  {/* Carte 01 */}
                  <div
                    ref={card1Ref}
                    className="w-1/2 p-6 bg-white shadow-lg rounded-3xl space-y-4 relative group"
                    style={{ transformStyle: 'preserve-3d', transform: 'perspective(1000px)' }}
                  >
                    <h3 className="text-4xl text-left font-bold text-purple-500 mb-2" style={{ transform: 'translateZ(20px)' }}>01</h3>
                    <h4 className="text-xl text-left font-semibold text-gray-900 mb-4">Créez et organisez vos projets</h4>
                    <p className="text-gray-600 text-left">
                      Connectez-vous à Mira Lab et commencez par organiser vos projets sous forme de tableaux intuitifs. Ajoutez des équipes et répartissez les tâches facilement.
                    </p>
                    <div className="parallax-image" style={{ transform: 'translateZ(70px)' }}>
                      <img
                        src={Board}
                        alt="Board"
                        className="rounded-lg shadow-xl mx-auto transition-transform duration-300  group-hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Carte 02 */}
                  <div
                    ref={card2Ref}
                    className="w-1/2 p-6 bg-white shadow-lg rounded-3xl space-y-4 relative group"
                    style={{ transformStyle: 'preserve-3d', transform: 'perspective(1000px)' }}
                  >
                    <h3 className="text-4xl text-left font-bold text-purple-500 mb-2" style={{ transform: 'translateZ(20px)' }}>02</h3>
                    <h4 className="text-xl text-left font-semibold text-gray-900 mb-4">Collaborez en temps réel</h4>
                    <p className="text-gray-600 text-left">
                      Travaillez avec votre équipe de manière synchronisée. Les messages et mises à jour sont visibles en temps réel, permettant une collaboration fluide et efficace.
                    </p>
                    <div className="parallax-image" style={{ transform: 'translateZ(70px)' }}>
                      <img
                        src={Chat}
                        alt="Chat"
                        className="w-1/2 rounded-lg shadow-xl mx-auto transition-transform duration-300  group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>

                {/* Deuxième Ligne de Cartes */}
                <div className='flex space-x-16 justify-center '>
                  {/* Carte 03 */}
                  <div
                    ref={card3Ref}
                    className="w-2/3 p-6 bg-white shadow-lg rounded-3xl space-y-4 relative group"
                    style={{ transformStyle: 'preserve-3d', transform: 'perspective(1000px)' }}
                  >
                    <h3 className="text-4xl text-left font-bold text-purple-500 mb-2" style={{ transform: 'translateZ(20px)' }}>03</h3>
                    <h4 className="text-xl text-left font-semibold text-gray-900 mb-4">Suivez vos performances</h4>
                    <p className="text-gray-600 text-left">
                      Accédez à des statistiques avancées pour mesurer vos progrès, analyser la productivité de votre équipe et ajuster vos stratégies en fonction des résultats.
                    </p>
                    <div className="parallax-image" style={{ transform: 'translateZ(70px)' }}>
                      <img
                        src={Stat}
                        alt="Stat"
                        className="w-1/2 rounded-lg shadow-xl mx-auto transition-transform duration-300  group-hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Carte 04 */}
                  <div
                    ref={card4Ref}
                    className="w-1/3 p-6 bg-white shadow-lg rounded-3xl space-y-4 relative group" 
                    style={{ transformStyle: 'preserve-3d', transform: 'perspective(1000px)' }}
                  >
                    <h3
                      className="text-4xl text-left font-bold text-purple-500 mb-2"
                      style={{ transform: 'translateZ(20px)' }}
                    >
                      04
                    </h3>
                    <h4 className="text-xl text-left font-semibold text-gray-900 mb-4">
                      Recevez des notifications
                    </h4>
                    <p className="text-gray-600 text-left">
                      Soyez informé en temps réel des mises à jour importantes par notification, pour ne rien manquer et être toujours prêt à agir.
                    </p>
                    <div className="parallax-image" style={{ transform: 'translateZ(20px)' }}>
                      <img
                        src={Notification}
                        alt="Notification"
                        className="rounded-lg shadow-xl mx-auto transform transition-transform duration-300 group-hover:scale-105" 
                      />
                    </div>
                  </div>


                </div>
              </div>
            </div>
          </section>


          <section className='bg-purple-200/60 text-center p-60'>
            <h1 className='text-7xl w-1/2 leading-relaxed	mx-auto ' data-aos="zoom-in">L'outil de gestion que vous
              <span className="bg-white/20 backdrop-blur-xl border border-gray-300/30 hover:bg-white p-2 rounded-md shadow-xl duration-200 cursor-default ml-2">
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-600'>attendiez</span></span>.</h1>
          </section>

          {/* FAQ */}
          <section className="h-dvh bg-indigo-600 flex items-center justify-center text-white" id='faq'>
            <div className="w-2/3 bg-indigo-600 rounded-lg p-8 space-y-4">
              <h2 className="text-4xl font-bold text-center mb-8">FAQ</h2>
              {/* Onglet 1 */}
              <div className="border-b border-gray-200/30">
                <button
                  onClick={() => toggleAccordion(1)}
                  className="w-full text-left flex justify-between items-center py-4 px-6 text-lg font-medium text-white"
                >
                  <span className="font-bold">Qu'est-ce que Mira Lab ?</span>
                  <svg
                    className={`w-5 h-5 transition-transform ${activeIndex === 1 ? 'rotate-180' : ''
                      }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </button>
                {activeIndex === 1 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <motion.div
                      className="p-6 text-white"
                      initial={{ y: -20 }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      Mira Lab est une plateforme innovante qui facilite la gestion de
                      projets en équipe, avec des outils intuitifs pour organiser,
                      collaborer et analyser vos tâches.
                    </motion.div>
                  </motion.div>
                )}
              </div>
              {/* Onglet 2 */}
              <div className="border-b border-gray-200/30">
                <button
                  onClick={() => toggleAccordion(2)}
                  className="w-full text-left flex justify-between items-center py-4 px-6 text-lg font-medium text-white"
                >
                  <span className="font-bold">Comment collaborer avec mon équipe ?</span>
                  <svg
                    className={`w-5 h-5 transition-transform ${activeIndex === 2 ? 'rotate-180' : ''
                      }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </button>
                {activeIndex === 2 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <motion.div
                      className="p-6 text-white"
                      initial={{ y: -20 }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      Vous pouvez utiliser nos fonctionnalités de tableau et de chat en
                      temps réel pour collaborer efficacement avec votre équipe.
                    </motion.div>
                  </motion.div>
                )}
              </div>
              {/* Onglet 3 */}
              <div className="border-b border-gray-200/30">
                <button
                  onClick={() => toggleAccordion(3)}
                  className="w-full text-left flex justify-between items-center py-4 px-6 text-lg font-medium text-white"
                >
                  <span className="font-bold">Quelles sont les fonctionnalités principales ?</span>
                  <svg
                    className={`w-5 h-5 transition-transform ${activeIndex === 3 ? 'rotate-180' : ''
                      }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </button>
                {activeIndex === 3 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <motion.div
                      className="p-6 text-white"
                      initial={{ y: -20 }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      Mira Lab propose la gestion de tableaux, un chat en temps réel,
                      des statistiques avancées, des notifications et bien plus.
                    </motion.div>
                  </motion.div>
                )}
              </div>
              {/* Onglet 4 */}
              <div className="border-b border-gray-200/30">
                <button
                  onClick={() => toggleAccordion(4)}
                  className="w-full text-left flex justify-between items-center py-4 px-6 text-lg font-medium text-white"
                >
                  <span className="font-bold">Quels sont les avantages ?</span>
                  <svg
                    className={`w-5 h-5 transition-transform ${activeIndex === 4 ? 'rotate-180' : ''
                      }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </button>
                {activeIndex === 4 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <motion.div
                      className="p-6 text-white"
                      initial={{ y: -20 }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      Gagnez du temps, améliorez la communication dans votre équipe et
                      augmentez votre productivité grâce à des outils intuitifs et
                      modernes.
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-neutral-800 text-white  px-8" id='contact'>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 py-16">
          {/* Section 1: Logo et description */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Mira Lab</h3>
            <p className="text-gray-300">
              Mira Lab est votre plateforme collaborative pour organiser vos projets
              avec efficacité et style.
            </p>
          </div>

          {/* Section 2: Liens rapides */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="hover:text-indigo-400 transition">À propos</a>
              </li>
              <li>
                <a href="#features" className="hover:text-indigo-400 transition">Fonctionnalités</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-indigo-400 transition">FAQ</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-indigo-400 transition">Contact</a>
              </li>
            </ul>
          </div>

          {/* Section 3: Contact */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Contact</h4>
            <form className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Votre email"
                  className="w-full px-4 py-2 rounded bg-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea
                  id="message"
                  rows="3"
                  placeholder="Votre message"
                  className="w-full px-4 py-2 rounded bg-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-neutral-600 hover:bg-indigo-700 transition px-4 py-2 rounded text-white font-medium"
              >
                Envoyer
              </button>
            </form>
          </div>

          {/* Section 4: Réseaux sociaux */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Suivez-nous</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-indigo-400 transition">
                <FaTwitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-white hover:text-indigo-400 transition">
                <FaLinkedin className="w-6 h-6" />
              </a>
              <a href="#" className="text-white hover:text-indigo-400 transition">
                <FaGithub className="w-6 h-6" />
              </a>

            </div>
          </div>
        </div>
        <div className="border-t border-neutral-700 h-20 flex justify-center items-center  text-center text-gray-400">
          <p>
            © {new Date().getFullYear()} Mira Lab. Tous droits réservés. Développé par <LinkPreview url="https://github.com/Tristan-stack" className="font-bold text-white">
              Tristan Gerber
            </LinkPreview>.
          </p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 transition shadow-lg shadow-purple-500"
          aria-label="Scroll to top"
          data-aos="zoom-in"
          data-aos-duration="100"
        >
          <FaArrowUp />
        </button>
      )}

    </>
  );
};

export default Accueil;