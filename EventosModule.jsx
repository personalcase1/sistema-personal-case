import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Calendar, Plus, Edit, Trash2, CalendarDays } from 'lucide-react'

const EventosModule = () => {
  const [eventos, setEventos] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEvento, setEditingEvento] = useState(null)
  const [viewMode, setViewMode] = useState('lista') // lista ou calendario
  const [formData, setFormData] = useState({
    nome_evento: '',
    artista: '',
    quantidade_copos: 0,
    status: 'Em Execução',
    data_evento: ''
  })

  const API_BASE = 'http://localhost:5001/api'

  useEffect(() => {
    fetchEventos()
  }, [])

  const fetchEventos = async () => {
    try {
      const response = await fetch(`${API_BASE}/eventos`)
      const data = await response.json()
      setEventos(data)
    } catch (error) {
      console.error('Erro ao buscar eventos:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingEvento 
        ? `${API_BASE}/eventos/${editingEvento.id}`
        : `${API_BASE}/eventos`
      
      const method = editingEvento ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchEventos()
        resetForm()
        setIsDialogOpen(false)
      }
    } catch (error) {
      console.error('Erro ao salvar evento:', error)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este evento?')) {
      try {
        await fetch(`${API_BASE}/eventos/${id}`, { method: 'DELETE' })
        fetchEventos()
      } catch (error) {
        console.error('Erro ao excluir evento:', error)
      }
    }
  }

  const handleEdit = (evento) => {
    setEditingEvento(evento)
    setFormData({
      nome_evento: evento.nome_evento,
      artista: evento.artista,
      quantidade_copos: evento.quantidade_copos,
      status: evento.status,
      data_evento: evento.data_evento ? evento.data_evento.split('T')[0] : ''
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingEvento(null)
    setFormData({
      nome_evento: '',
      artista: '',
      quantidade_copos: 0,
      status: 'Em Execução',
      data_evento: ''
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Feito': return 'bg-green-100 text-green-800'
      case 'Em Execução': return 'bg-blue-100 text-blue-800'
      case 'Cancelado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Próximos Eventos</h2>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'lista' ? 'default' : 'outline'}
            onClick={() => setViewMode('lista')}
            size="sm"
          >
            Lista
          </Button>
          <Button
            variant={viewMode === 'calendario' ? 'default' : 'outline'}
            onClick={() => setViewMode('calendario')}
            size="sm"
          >
            <CalendarDays className="h-4 w-4 mr-2" />
            Calendário
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Evento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingEvento ? 'Editar Evento' : 'Novo Evento'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nome_evento">Nome do Evento</Label>
                  <Input
                    id="nome_evento"
                    value={formData.nome_evento}
                    onChange={(e) => setFormData({...formData, nome_evento: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="artista">Artista</Label>
                  <Input
                    id="artista"
                    value={formData.artista}
                    onChange={(e) => setFormData({...formData, artista: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="quantidade_copos">Quantidade de Copos</Label>
                  <Input
                    id="quantidade_copos"
                    type="number"
                    value={formData.quantidade_copos}
                    onChange={(e) => setFormData({...formData, quantidade_copos: parseInt(e.target.value)})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Em Execução">Em Execução</SelectItem>
                      <SelectItem value="Feito">Feito</SelectItem>
                      <SelectItem value="Cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="data_evento">Data do Evento</Label>
                  <Input
                    id="data_evento"
                    type="date"
                    value={formData.data_evento}
                    onChange={(e) => setFormData({...formData, data_evento: e.target.value})}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingEvento ? 'Atualizar' : 'Criar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {viewMode === 'lista' ? (
        <div className="grid gap-4">
          {eventos.map((evento) => (
            <Card key={evento.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{evento.nome_evento}</h3>
                      <Badge className={getStatusColor(evento.status)}>
                        {evento.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-1">Artista: {evento.artista}</p>
                    <p className="text-gray-600 mb-1">Quantidade: {evento.quantidade_copos} copos</p>
                    {evento.data_evento && (
                      <p className="text-gray-600 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(evento.data_evento).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(evento)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(evento.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Visualização de Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                <div key={day} className="p-2 text-center font-medium text-gray-600">
                  {day}
                </div>
              ))}
            </div>
            <div className="text-center text-gray-500 py-8">
              Calendário interativo será implementado em breve
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default EventosModule

