import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Users, Lightbulb, Package, BarChart3 } from 'lucide-react'
import personalCaseLogo from './assets/personal-case-logo.png'
import EventosModule from './components/EventosModule'
import PedidosModule from './components/PedidosModule'
import IdeiasModule from './components/IdeiasModule'
import InfluenciadoresModule from './components/InfluenciadoresModule'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('eventos')

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img 
                src={personalCaseLogo} 
                alt="Personal Case" 
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Personal Case</h1>
                <p className="text-sm text-gray-500">Sistema Interno</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-orange-500" />
              <span className="text-sm text-gray-600">Dashboard</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="eventos" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Próximos Eventos
            </TabsTrigger>
            <TabsTrigger value="pedidos" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="ideias" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Ideias
            </TabsTrigger>
            <TabsTrigger value="influenciadores" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Influenciadores
            </TabsTrigger>
          </TabsList>

          <TabsContent value="eventos">
            <EventosModule />
          </TabsContent>

          <TabsContent value="pedidos">
            <PedidosModule />
          </TabsContent>

          <TabsContent value="ideias">
            <IdeiasModule />
          </TabsContent>

          <TabsContent value="influenciadores">
            <InfluenciadoresModule />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default App

