
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Church, Users, Calendar, Music, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const features = [
    {
      icon: Church,
      title: 'Gestão Completa',
      description: 'Sistema completo para administração da sua igreja com controle total de membros e atividades.'
    },
    {
      icon: Users,
      title: 'Controle de Membros',
      description: 'Gerencie membros, departamentos e subdepartamentos com facilidade e organização.'
    },
    {
      icon: Calendar,
      title: 'Escalas e Eventos',
      description: 'Organize escalas de louvor, eventos e atividades da igreja de forma eficiente.'
    },
    {
      icon: Music,
      title: 'Repertório Musical',
      description: 'Gerencie músicas, repertórios e organize o ministério de louvor.'
    },
    {
      icon: Shield,
      title: 'Segurança e Privacidade',
      description: 'Sistema seguro com controle de acesso e isolamento total entre igrejas.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Church className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Igreja Unida</h1>
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
            Sistema de Gestão
            <span className="block text-blue-600">Eclesiástica Completo</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
            Gerencie sua igreja com eficiência e organização. Sistema completo para administração 
            de membros, escalas, departamentos, eventos e muito mais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg"
            >
              Saiba Mais
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
              Tudo que sua igreja precisa em um só lugar, com segurança e facilidade de uso.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
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
            Pronto para Começar?
          </h3>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 sm:mb-12 max-w-2xl mx-auto">
            Junte-se às igrejas que já transformaram sua gestão com nosso sistema.
          </p>
          <Link to="/login">
            <Button 
              size="lg" 
              variant="secondary"
              className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
            >
              Criar Conta Gratuitamente
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
              <span className="text-white font-semibold">Igreja Unida</span>
            </div>
            <p className="text-gray-400 text-sm text-center sm:text-right">
              © 2024 Igreja Unida. Sistema de Gestão Eclesiástica.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
