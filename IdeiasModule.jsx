import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Edit, Trash2, Lightbulb, Image, Grid, List, TrendingUp, TrendingDown, Minus } from 'lucide-react'

const IdeiasModule = () => {
  const [ideias, setIdeias] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingIdeia, setEditingIdeia] = useState(null)
  const [viewMode, setViewMode] = useState('galeria') // galeria ou lista
  const [filterCategoria, setFilterCategoria] = useState('')
  const [filterPotencial, setFilterPotencial] = useState('')
  const [formData, setFormData] = useState({
    titulo_ideia: '',
    categoria: '',
    descricao: '',
    potencial: 'Médio',
    imagem_referencia: ''
  })

  const API_BASE = 'http://localhost:5001/api'

  const potencialConfig = {
    'Alto': { icon: TrendingUp, color: 'bg-green-100 text-green-800' },
    'Médio': { icon: Minus, color: 'bg-yellow-100 text-yellow-800' },
    'Baixo': { icon: TrendingDown, color: 'bg-red-100 text-red-800' }
  }

  const categoriaColors = {
    'Sertanejo': 'bg-orange-100 text-orange-800',
    'Urbano': 'bg-blue-100 text-blue-800',
    'Infantil': 'bg-pink-100 text-pink-800',
    'Outros': 'bg-gray-100 text-gray-800'
  }

  useEffect(() => {
    fetchIdeias()
  }, [])

  const fetchIdeias = async () => {
    try {
      const response = await fetch(`${API_BASE}/ideias`)
      const data = await response.json()
      setIdeias(data)
    } catch (error) {
      console.error('Erro ao buscar ideias:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingIdeia 
        ? `${API_BASE}/ideias/${editingIdeia.id}`
        : `${API_BASE}/ideias`
      
      const method = editingIdeia ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchIdeias()
        resetForm()
        setIsDialogOpen(false)
      }
    } catch (error) {
      console.error('Erro ao salvar ideia:', error)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir esta ideia?')) {
      try {
        await fetch(`${API_BASE}/ideias/${id}`, { method: 'DELETE' })
        fetchIdeias()
      } catch (error) {
        console.error('Erro ao excluir ideia:', error)
      }
    }
  }

  const handleEdit = (ideia) => {
    setEditingIdeia(ideia)
    setFormData({
      titulo_ideia: ideia.titulo_ideia,
      categoria: ideia.categoria,
      descricao: ideia.descricao,
      potencial: ideia.potencial,
      imagem_referencia: ideia.imagem_referencia || ''
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingIdeia(null)
    setFormData({
      titulo_ideia: '',
      categoria: '',
      descricao: '',
      potencial: 'Médio',
      imagem_referencia: ''
    })
  }

  const filteredIdeias = ideias.filter(ideia => {
    const matchCategoria = !filterCategoria || ideia.categoria === filterCategoria
    const matchPotencial = !filterPotencial || ideia.potencial === filterPotencial
    return matchCategoria && matchPotencial
  })

  const GaleriaCard = ({ ideia }) => {
    const PotencialIcon = potencialConfig[ideia.potencial]?.icon

    return (
      <Card className="hover:shadow-lg transition-shadow group">
        <CardContent className="p-0">
          <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
            {ideia.imagem_referencia ? (
              <img 
                src={ideia.imagem_referencia} 
                alt={ideia.titulo_ideia}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
            ) : null}
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Image className="h-12 w-12" />
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleEdit(ideia)}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleDelete(ideia.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-sm line-clamp-2">{ideia.titulo_ideia}</h3>
              {PotencialIcon && (
                <PotencialIcon className="h-4 w-4 text-gray-500 flex-shrink-0 ml-2" />
              )}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={categoriaColors[ideia.categoria] || categoriaColors['Outros']}>
                {ideia.categoria}
              </Badge>
              <Badge className={potencialConfig[ideia.potencial]?.color}>
                {ideia.potencial}
              </Badge>
            </div>
            {ideia.descricao && (
              <p className="text-xs text-gray-600 line-clamp-3">{ideia.descricao}</p>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Ideias de Produtos</h2>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'galeria' ? 'default' : 'outline'}
            onClick={() => setViewMode('galeria')}
            size="sm"
          >
            <Grid className="h-4 w-4 mr-2" />
            Galeria
          </Button>
          <Button
            variant={viewMode === 'lista' ? 'default' : 'outline'}
            onClick={() => setViewMode('lista')}
            size="sm"
          >
            <List className="h-4 w-4 mr-2" />
            Lista
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Ideia
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingIdeia ? 'Editar Ideia' : 'Nova Ideia'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="titulo_ideia">Título da Ideia</Label>
                  <Input
                    id="titulo_ideia"
                    value={formData.titulo_ideia}
                    onChange={(e) => setFormData({...formData, titulo_ideia: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="categoria">Categoria</Label>
                    <Select value={formData.categoria} onValueChange={(value) => setFormData({...formData, categoria: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sertanejo">Sertanejo</SelectItem>
                        <SelectItem value="Urbano">Urbano</SelectItem>
                        <SelectItem value="Infantil">Infantil</SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="potencial">Potencial</Label>
                    <Select value={formData.potencial} onValueChange={(value) => setFormData({...formData, potencial: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Alto">Alto</SelectItem>
                        <SelectItem value="Médio">Médio</SelectItem>
                        <SelectItem value="Baixo">Baixo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="imagem_referencia">Imagem de Referência (URL)</Label>
                  <Input
                    id="imagem_referencia"
                    type="url"
                    value={formData.imagem_referencia}
                    onChange={(e) => setFormData({...formData, imagem_referencia: e.target.value})}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingIdeia ? 'Atualizar' : 'Criar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <Select value={filterCategoria} onValueChange={setFilterCategoria}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as categorias</SelectItem>
            <SelectItem value="Sertanejo">Sertanejo</SelectItem>
            <SelectItem value="Urbano">Urbano</SelectItem>
            <SelectItem value="Infantil">Infantil</SelectItem>
            <SelectItem value="Outros">Outros</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPotencial} onValueChange={setFilterPotencial}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por potencial" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os potenciais</SelectItem>
            <SelectItem value="Alto">Alto</SelectItem>
            <SelectItem value="Médio">Médio</SelectItem>
            <SelectItem value="Baixo">Baixo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {viewMode === 'galeria' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredIdeias.map((ideia) => (
            <GaleriaCard key={ideia.id} ideia={ideia} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredIdeias.map((ideia) => (
            <Card key={ideia.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{ideia.titulo_ideia}</h3>
                      <Badge className={categoriaColors[ideia.categoria] || categoriaColors['Outros']}>
                        {ideia.categoria}
                      </Badge>
                      <Badge className={potencialConfig[ideia.potencial]?.color}>
                        {ideia.potencial}
                      </Badge>
                    </div>
                    {ideia.descricao && (
                      <p className="text-gray-600 mb-2">{ideia.descricao}</p>
                    )}
                    {ideia.imagem_referencia && (
                      <p className="text-sm text-blue-600">
                        <a href={ideia.imagem_referencia} target="_blank" rel="noopener noreferrer">
                          Ver imagem de referência
                        </a>
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(ideia)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(ideia.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredIdeias.length === 0 && (
        <div className="text-center py-12">
          <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Nenhuma ideia encontrada</p>
        </div>
      )}
    </div>
  )
}

export default IdeiasModule

