
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Church, Users, Calendar, Music, Shield, ArrowRight, CheckCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const features = [
    {
      icon: Users,
      title: 'Gestão de Equipes',
      description: 'Organize suas equipes musicais com posições específicas e hierarquia clara.'
    },
    {
      icon: Calendar,
      title: 'Eventos e Escalas',
      description: 'Planeje cultos, ensaios e eventos especiais com agenda inteligente.'
    },
    {
      icon: Music,
      title: 'Biblioteca Musical',
      description: 'Gerencie repertório, letras, cifras e organize músicas por evento.'
    },
    {
      icon: Shield,
      title: 'Controle de Acesso',
      description: 'Sistema de permissões granular para diferentes níveis de usuários.'
    }
  ];

  const plans = [
    {
      name: 'Inicial',
      price: 29,
      users: 15,
      storage: '500MB',
      popular: false
    },
    {
      name: 'Plano 1',
      price: 39,
      users: 30,
      storage: '1GB',
      popular: true
    },
    {
      name: 'Plano 2',
      price: 59,
      users: 70,
      storage: '2GB',
      popular: false
    },
    {
      name: 'Plano 3',
      price: 89,
      users: 200,
      storage: '4GB',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Church className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Church Plan</h1>
          </div>
          <Link to="/login">
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
              Fazer Login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Gestão Completa para
            <span className="block text-blue-600">Ministérios Musicais</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
            Plataforma SaaS desenvolvida especificamente para organizações religiosas e ministérios de música. 
            Planeje, organize e gerencie seus eventos, equipes e recursos musicais com eficiência.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg"
            >
              Ver Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Funcionalidades Principais
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tudo que seu ministério musical precisa em uma única plataforma.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Planos e Preços
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Escolha o plano ideal para o tamanho do seu ministério.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative border-2 transition-all duration-300 hover:shadow-lg ${
                plan.popular ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-200'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Mais Popular
                    </div>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-bold text-gray-900">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-gray-900">R$ {plan.price}</span>
                    <span className="text-gray-600">/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">{plan.users} usuários</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">{plan.storage} de armazenamento</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Suporte por email</span>
                  </div>
                  <Button 
                    className={`w-full mt-6 ${
                      plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    Escolher Plano
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            Pronto para Transformar seu Ministério?
          </h3>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 sm:mb-12 max-w-2xl mx-auto">
            Junte-se a centenas de igrejas que já revolucionaram sua gestão musical com nosso sistema.
          </p>
          <Link to="/login">
            <Button 
              size="lg" 
              variant="secondary"
              className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
            >
              Começar Agora - É Gratuito
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Church className="h-6 w-6 text-blue-400" />
              <span className="text-white font-semibold">Church Plan</span>
            </div>
            <p className="text-gray-400 text-sm text-center sm:text-right">
              © 2024 Church Plan. Gestão Completa para Ministérios Musicais.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
