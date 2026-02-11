import { ReactNode } from "react";
import { Truck, Package, TrendingUp, Users } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Branding (Hidden on mobile, visible on lg+) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">RN Logística</h1>
              <p className="text-white/80 text-sm">Gestão Inteligente de Fretes</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Gestão Completa da sua
              <br />
              Logística de Amendoim
            </h2>
            <p className="text-white/90 text-lg max-w-md">
              Sistema integrado para gerenciar fretes, frotas, motoristas e custos operacionais com eficiência.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <Package className="h-6 w-6 text-white mb-2" />
            <p className="text-white/90 text-sm font-medium">Gestão de Fretes</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <Users className="h-6 w-6 text-white mb-2" />
            <p className="text-white/90 text-sm font-medium">Controle de Equipe</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <TrendingUp className="h-6 w-6 text-white mb-2" />
            <p className="text-white/90 text-sm font-medium">Análise de Custos</p>
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-white/60 text-sm mt-8">
          © 2026 RN Logística. Todos os direitos reservados.
        </p>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg mb-4">
              <Truck className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">RN Logística</h1>
            <p className="text-muted-foreground text-sm mt-2 font-medium">Gestão Inteligente de Fretes</p>
          </div>

          {/* Form Card */}
          <div className="bg-card rounded-2xl border shadow-xl p-8 sm:p-10 animate-fade-in backdrop-blur-sm bg-opacity-95">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
