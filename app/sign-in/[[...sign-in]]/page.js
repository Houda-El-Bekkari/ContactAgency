'use client';

import { SignIn, useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [email, setEmail] = useState('');

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
        {[...Array(15)].map((_, i) => (
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
          {/* Left Side - Branding & Benefits */}
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

            {/* Welcome Back Message */}
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/30 mb-4">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></span>
                <span className="text-cyan-400 text-sm font-medium">Content de vous revoir !</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Bon retour{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent bg-size-200 animate-gradient">
                  Parmi Nous
                </span>
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed font-light">
                Reconnectez-vous à votre espace et continuez à révolutionner votre gestion des contacts.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 py-6">
              {[
                { number: "99.9%", label: "Uptime", color: "text-green-400" },
                { number: "50+", label: "Contacts", color: "text-cyan-400" },
                { number: "24/7", label: "Support", color: "text-purple-400" }
              ].map((stat, index) => (
                <div key={index} className="text-center group transform hover:scale-110 transition-transform duration-300">
                  <div className={`text-2xl font-bold ${stat.color} mb-2`}>
                    {stat.number}
                  </div>
                  <div className="text-slate-400 text-sm font-medium group-hover:text-slate-300 transition-colors">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* User Benefits */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Vos avantages :</h3>
              {[
                "Accès immédiat à vos agences partenaires",
                "Base de contacts mise à jour en temps réel",
                "Outils de gestion avancés",
                "Support prioritaire 24h/24"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3 group">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center border border-green-400/30 group-hover:bg-green-500/30 transition-all duration-300">
                    <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-slate-300 font-light group-hover:text-white transition-colors">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            {/* Security Badge */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold">Connexion Sécurisée</h4>
                  <p className="text-slate-400 text-sm font-light">
                    Vos données sont chiffrées de bout en bout
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Sign In Form */}
          <div className="relative">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-500">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 p-8 text-center border-b border-white/10">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Connexion
                </h2>
                <p className="text-slate-300 font-light">
                  Accédez à votre espace personnel
                </p>
              </div>

              {/* Clerk SignIn Component */}
              <div className="p-8">
                <SignIn 
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
                      formFieldInput__identifier: 
                        "bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-slate-400 rounded-xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300",
                      formFieldInput__password:
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
                      formResendCodeLink: "text-cyan-400 hover:text-cyan-300",
                      alert: "bg-red-500/20 border border-red-400/30 text-red-400 rounded-xl",
                      alertText: "text-red-400",
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
                  path="/sign-in"
                  signUpUrl="/sign-up"
                  redirectUrl="/dashboard"
                />
              </div>

              {/* Quick Actions */}
              <div className="bg-white/5 backdrop-blur-sm p-6 border-t border-white/10">
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-slate-400 font-light mb-4">
                      Nouveau sur ContactAgency ?
                    </p>
                    <Link
                      href="/sign-up"
                      className="inline-flex items-center justify-center w-full bg-transparent border-2 border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400 font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      Créer un compte gratuit
                      <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                  
                  <div className="text-center">
                    <Link
                      href="/forgot-password"
                      className="text-cyan-400 hover:text-cyan-300 font-medium text-sm transition-colors duration-300 hover:underline"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>
                </div>
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