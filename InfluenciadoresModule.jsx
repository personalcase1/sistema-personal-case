import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Edit, Trash2, Users, Instagram, CheckCircle, X, Filter, BarChart } from 'lucide-react'

const InfluenciadoresModule = () => {
  const [influenciadores, setInfluenciadores] = useState([])
  const [estatisticas, setEstatisticas] = useState({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingInfluenciador, setEditingInfluenciador] = useState(null)
  const [filtros, setFiltros] = useState({
    nicho: '',
    ja_recebeu: ''
  })
  const [formData, setFormData] = useState({
    nome: '',
    instagram: '',
    nicho: '',
    alcance_estimado: 0,
    ja_recebeu_copo: false,
    resultado: '',
    observacoes: ''
  })

  const API_BASE = 'http://localhost:5001/api'

  useEffect(() => {
    fetchInfluenciadores()
    fetchEstatisticas()
  }, [filtros])

  const fetchInfluenciadores = async () => {
    try {
      const params = new URLSearchParams()
      if (filtros.nicho) params.append('nicho', filtros.nicho)
      if (filtros.ja_recebeu) params.append('ja_recebeu', filtros.ja_recebeu)
      
      const response = await fetch(`${API_BASE}/influenciadores?${params}`)
      const data = await response.json()
      setInfluenciadores(data)
    } catch (error) {
      console.error('Erro ao buscar influenciadores:', error)
    }
  }

  const fetchEstatisticas = async () => {
    try {
      const response = await fetch(`${API_BASE}/influenciadores/estatisticas`)
      const data = await response.json()
      setEstatisticas(data)
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingInfluenciador 
        ? `${API_BASE}/influenciadores/${editingInfluenciador.id}`
        : `${API_BASE}/influenciadores`
      
      const method = editingInfluenciador ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchInfluenciadores()
        fetchEstatisticas()
        resetForm()
        setIsDialogOpen(false)
      }
    } catch (error) {
      console.error('Erro ao salvar influenciador:', error)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este influenciador?')) {
      try {
        await fetch(`${API_BASE}/influenciadores/${id}`, { method: 'DELETE' })
        fetchInfluenciadores()
        fetchEstatisticas()
      } catch (error) {
        console.error('Erro ao excluir influenciador:', error)
      }
    }
  }

  const handleEdit = (influenciador) => {
    setEditingInfluenciador(influenciador)
    setFormData({
      nome: influenciador.nome,
      instagram: influenciador.instagram,
      nicho: influenciador.nicho,
      alcance_estimado: influenciador.alcance_estimado,
      ja_recebeu_copo: influenciador.ja_recebeu_copo,
      resultado: influenciador.resultado || '',
      observacoes: influenciador.observacoes || ''
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingInfluenciador(null)
    setFormData({
      nome: '',
      instagram: '',
      nicho: '',
      alcance_estimado: 0,
      ja_recebeu_copo: false,
      resultado: '',
      observacoes: ''
    })
  }

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatInstagram = (username) => {
    return username.startsWith('@') ? username : `@${username}`
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Influenciadores</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Influenciador
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingInfluenciador ? 'Editar Influenciador' : 'Novo Influenciador'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                    placeholder="@username"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nicho">Nicho</Label>
                  <Input
                    id="nicho"
                    value={formData.nicho}
                    onChange={(e) => setFormData({...formData, nicho: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="alcance_estimado">Alcance Estimado</Label>
                  <Input
                    id="alcance_estimado"
                    type="number"
                    value={formData.alcance_estimado}
                    onChange={(e) => setFormData({...formData, alcance_estimado: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ja_recebeu_copo"
                  checked={formData.ja_recebeu_copo}
                  onCheckedChange={(checked) => setFormData({...formData, ja_recebeu_copo: checked})}
                />
                <Label htmlFor="ja_recebeu_copo">Já recebeu copo?</Label>
              </div>
              <div>
                <Label htmlFor="resultado">Resultado</Label>
                <Textarea
                  id="resultado"
                  value={formData.resultado}
                  onChange={(e) => setFormData({...formData, resultado: e.target.value})}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingInfluenciador ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{estatisticas.total || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Receberam</p>
                <p className="text-2xl font-bold">{estatisticas.ja_receberam || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <X className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Não Receberam</p>
                <p className="text-2xl font-bold">{estatisticas.nao_receberam || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Conversão</p>
                <p className="text-2xl font-bold">{estatisticas.percentual_conversao || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 items-center">
        <Filter className="h-5 w-5 text-gray-500" />
        <Input
          placeholder="Filtrar por nicho..."
          value={filtros.nicho}
          onChange={(e) => setFiltros({...filtros, nicho: e.target.value})}
          className="w-48"
        />
        <Select value={filtros.ja_recebeu} onValueChange={(value) => setFiltros({...filtros, ja_recebeu: value})}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Status do copo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="true">Já receberam</SelectItem>
            <SelectItem value="false">Não receberam</SelectItem>
          </SelectContent>
        </Select>
        {(filtros.nicho || filtros.ja_recebeu) && (
          <Button 
            variant="outline" 
            onClick={() => setFiltros({nicho: '', ja_recebeu: ''})}
            size="sm"
          >
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Lista de Influenciadores */}
      <div className="grid gap-4">
        {influenciadores.map((influenciador) => (
          <Card key={influenciador.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{influenciador.nome}</h3>
                    <a 
                      href={`https://instagram.com/${influenciador.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-pink-600 hover:text-pink-800"
                    >
                      <Instagram className="h-4 w-4" />
                      {formatInstagram(influenciador.instagram)}
                    </a>
                    {influenciador.ja_recebeu_copo ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Recebeu copo
                      </Badge>
                    ) : (
                      <Badge className="bg-orange-100 text-orange-800">
                        <X className="h-3 w-3 mr-1" />
                        Não recebeu
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-2">
                    <p><strong>Nicho:</strong> {influenciador.nicho}</p>
                    <p><strong>Alcance:</strong> {formatNumber(influenciador.alcance_estimado)} seguidores</p>
                  </div>
                  {influenciador.resultado && (
                    <div className="mb-2">
                      <p className="text-sm"><strong>Resultado:</strong></p>
                      <p className="text-sm text-gray-600">{influenciador.resultado}</p>
                    </div>
                  )}
                  {influenciador.observacoes && (
                    <div>
                      <p className="text-sm"><strong>Observações:</strong></p>
                      <p className="text-sm text-gray-600">{influenciador.observacoes}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(influenciador)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(influenciador.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {influenciadores.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Nenhum influenciador encontrado</p>
        </div>
      )}
    </div>
  )
}

export default InfluenciadoresModule

