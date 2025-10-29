import React, { useState, useEffect } from 'react';

// Simple icon components
const RocketLaunchIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
  </svg>
);

const SparklesIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

// --- SIMULATED SPLINE INTEGRATION ---
// NOTE: In a real React project, you would run 'npm install @splinetool/react-spline @splinetool/runtime'
// and replace the function below with the actual component call, passing your Spline URL.

const SplinePlaceholder = () => (
  <div className="relative w-full h-[400px] md:h-[600px] bg-gray-900 rounded-xl shadow-2xl flex items-center justify-center border border-indigo-700/50 transform hover:scale-[1.01] transition-transform duration-500">
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 animate-pulse-slow"></div>
    <div className="text-center z-10">
      <SparklesIcon className="w-16 h-16 text-yellow-300 animate-bounce-slow mx-auto" />
      <p className="text-white text-xl font-bold mt-2">3D SPLINE SCENE: The Compounding Engine</p>
      <p className="text-indigo-300 text-sm">Integrate your 3D Coin/Savings Jar Model here!</p>
    </div>
  </div>
);

// --- CUSTOM CSS FOR ANIMATIONS ---
const styles = {
  // Keyframes for a slow, gentle pulse
  '@keyframes pulse-slow': {
    '0%, 100%': { opacity: 0.7 },
    '50%': { opacity: 1 },
  },
  'pulse-slow': {
    animation: 'pulse-slow 6s infinite ease-in-out',
  },
  // Keyframes for a typing effect
  '@keyframes typing': {
    'from': { width: '0' },
    'to': { width: '100%' }
  },
  'typewriter-text': {
    overflow: 'hidden',
    borderRight: '0.15em solid white',
    whiteSpace: 'nowrap',
    animation: 'typing 3s steps(40, end), blink-caret 0.75s step-end infinite',
  },
  // Keyframes for a fading glow
  '@keyframes glow': {
    '0%, 100%': { filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.7))' },
    '50%': { filter: 'drop-shadow(0 0 15px rgba(99, 102, 241, 1))' },
  },
  'glowing-title': {
    animation: 'glow 5s infinite ease-in-out',
  }
};

const FinityLandingPage = () => {
  const [typedTitle, setTypedTitle] = useState("");
  const fullTitle = "Tlhe AI Financial Universe";

  useEffect(() => {
    // Typing effect logic
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullTitle.length) {
        setTypedTitle((prev) => prev + fullTitle.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 70); // Typing speed

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden" style={{ ...styles }}>
      {/* Dynamic Styles Injection (for React) */}
      <style>{`
        @keyframes pulse-slow { 
          ${styles['@keyframes pulse-slow']['0%, 100%']}
          ${styles['@keyframes pulse-slow']['50%']}
        }
        @keyframes glow { 
          ${styles['@keyframes glow']['0%, 100%']}
          ${styles['@keyframes glow']['50%']}
        }
      `}</style>
      
      {/* Header (Minimalist) */}
      <header className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <span className="text-xl font-extrabold text-indigo-400">FINITY</span>
          <a
            href="/signup"
            className="px-5 py-2 bg-indigo-600 rounded-full font-semibold hover:bg-purple-700 transition duration-300 shadow-lg"
          >
            Get Started
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 text-center">
        {/* Background Gradient Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-indigo-900/70 opacity-80 z-0"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          {/* Subtle noise/star texture placeholder */}
          <div className="w-full h-full bg-[url('https://placehold.co/100x100/101010/242424?text=')] bg-repeat"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 
            className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-4 inline-block mx-auto"
            style={styles['glowing-title']}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              {typedTitle}
            </span>
          </h1>
          <p className="mt-4 text-xl md:text-3xl font-light text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Stop Guessing. Start Growing. Your personal finance journey.
          </p>

          <div className="mt-12">
            <a
              href="/signup"
              className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-base font-bold rounded-full text-white bg-purple-600 hover:bg-purple-700 transition duration-300 shadow-xl transform hover:scale-105"
            >
              <RocketLaunchIcon className="w-6 h-6 mr-3" />
              Start Your Financial Journey
            </a>
          </div>
        </div>
      </section>

      {/* Spline Visualization Section */}
      <section id="simulation" className="py-20 bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-indigo-400">
            Simulate Your Financial Future
          </h2>
          <div className="max-w-6xl mx-auto">
            {/* The Placeholder for the Judge-Grabbing 3D Element */}
            <SplinePlaceholder />
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <div className="p-6 rounded-xl bg-gray-800/70 shadow-xl border-t-4 border-indigo-500 hover:shadow-2xl hover:border-indigo-400 transition duration-300 transform hover:-translate-y-1">
              <div className="text-4xl mb-3 text-indigo-400">🧠</div>
              <h3 className="text-xl font-bold mb-2">Adaptive Coaching</h3>
              <p className="text-gray-400">
                AI creates personalized lessons and Proof-of-Concept assignments based on your real spending habits.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-gray-800/70 shadow-xl border-t-4 border-purple-500 hover:shadow-2xl hover:border-purple-400 transition duration-300 transform hover:-translate-y-1">
              <div className="text-4xl mb-3 text-purple-400">🕹️</div>
              <h3 className="text-xl font-bold mb-2">Gamified Progress</h3>
              <p className="text-gray-400">
                Track your Savings Streaks and earn badges. Financial discipline made addictive.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-gray-800/70 shadow-xl border-t-4 border-teal-500 hover:shadow-2xl hover:border-teal-400 transition duration-300 transform hover:-translate-y-1">
              <div className="text-4xl mb-3 text-teal-400">🛡️</div>
              <h3 className="text-xl font-bold mb-2">Privacy First</h3>
              <p className="text-gray-400">
                No bank sync required. All guidance is based on your manual input, ensuring complete security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-800 border-t border-gray-700/50">
        <div className="container mx-auto px-4 text-center text-gray-500">
          &copy; {new Date().getFullYear()} Finity AI Coach. Built for Hackathons.
        </div>
      </footer>
    </div>
  );
};

export default FinityLandingPage;
