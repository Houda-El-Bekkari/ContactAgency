'use client';

import { SignUp, useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg font-light">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }}></div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              transform: `scale(${0.5 + Math.random() * 1.5})`
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding & Features */}
          <div className="text-white space-y-8">
            {/* Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl transform group-hover:rotate-12 transition-transform duration-300 shadow-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CA</span>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                ContactAgency
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Rejoignez la{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent bg-size-200 animate-gradient">
                  Révolution
                </span>
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed font-light">
                Créez votre compte et découvrez une nouvelle ère dans la gestion de vos agences et contacts.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-6">
              {[
                {
                  icon: '🚀',
                  title: 'Lancement Instantané',
                  description: 'Commencez en moins de 2 minutes'
                },
                {
                  icon: '🔒',
                  title: 'Sécurité Maximale',
                  description: 'Chiffrement de niveau entreprise'
                },
                {
                  icon: '💎',
                  title: 'Gratuit Toujours',
                  description: 'Fonctionnalités essentielles gratuites'
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 group transform hover:translate-x-2 transition-transform duration-300"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-xl backdrop-blur-sm border border-white/20 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/30 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 font-light">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  AS
                </div>
                <div>
                  <div className="text-white font-semibold">Alexandre S.</div>
                  <div className="text-cyan-400 text-sm">CEO TechStart</div>
                </div>
              </div>
              <p className="text-slate-300 italic font-light">
                "Cette plateforme a transformé notre gestion des contacts. Interface incroyable et performances exceptionnelles !"
              </p>
            </div>
          </div>

          {/* Right Side - Sign Up Form */}
          <div className="relative">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-500">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 p-8 text-center border-b border-white/10">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Créer un Compte
                </h2>
                <p className="text-slate-300 font-light">
                  Rejoignez-nous en quelques secondes
                </p>
              </div>

              {/* Clerk SignUp Component */}
              <div className="p-8">
                <SignUp 
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "bg-transparent shadow-none border-none",
                      header: "hidden",
                      socialButtonsBlock: "space-y-4",
                      socialButtons: "w-full",
                      socialButton: 
                        "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-cyan-400/30 transition-all duration-300 rounded-xl py-4 px-6 font-medium",
                      formFieldInput: 
                        "bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-slate-400 rounded-xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300",
                      formButtonPrimary: 
                        "w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25",
                      footer: "bg-transparent border-t border-white/10 mt-6 pt-6",
                      footerAction: "text-slate-300 font-light",
                      footerActionLink: 
                        "text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-300",
                      identityPreviewEditButton: 
                        "text-cyan-400 hover:text-cyan-300 transition-colors duration-300",
                      formFieldLabel: "text-white font-medium mb-2",
                      formFieldSuccessText: "text-green-400",
                      formFieldErrorText: "text-red-400",
                      dividerLine: "bg-white/20",
                      dividerText: "text-slate-300 bg-transparent",
                    },
                    variables: {
                      colorPrimary: '#06b6d4',
                      colorText: '#ffffff',
                      colorTextSecondary: '#cbd5e1',
                      colorBackground: 'transparent',
                      colorInputBackground: 'rgba(255, 255, 255, 0.1)',
                      colorInputText: '#ffffff',
                    }
                  }}
                  routing="path"
                  path="/sign-up"
                  signInUrl="/sign-in"
                  redirectUrl="/dashboard"
                  afterSignUpUrl="/dashboard"
                />
              </div>

              {/* Additional CTA */}
              <div className="bg-white/5 backdrop-blur-sm p-6 text-center border-t border-white/10">
                <p className="text-slate-400 font-light">
                  Déjà membre ?{' '}
                  <a 
                    href="/sign-in"
                    className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-300 hover:underline"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    Connectez-vous ici
                  </a>
                </p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-cyan-400 rounded-full opacity-60 animate-ping"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-400 rounded-full opacity-60 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(var(--scale, 1)); }
          50% { transform: translateY(-20px) scale(var(--scale, 1)); }
        }
        
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
          background-size: 200% 200%;
        }
        
        .bg-size-200 {
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  );
}