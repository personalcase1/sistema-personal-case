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
import { Plus, Edit, Trash2, Package, Calendar, CheckCircle, Clock, Truck, AlertCircle } from 'lucide-react'

const PedidosModule = () => {
  const [pedidos, setPedidos] = useState([])
  const [kanbanData, setKanbanData] = useState({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPedido, setEditingPedido] = useState(null)
  const [viewMode, setViewMode] = useState('kanban') // kanban ou tabela
  const [formData, setFormData] = useState({
    nome_cliente: '',
    data_pedido: new Date().toISOString().split('T')[0],
    tipo_copo: '',
    quantidade: 1,
    arte_enviada: false,
    prazo_entrega: '',
    status_pedido: 'Pendente',
    observacoes: ''
  })

  const API_BASE = 'http://localhost:5001/api'

  const statusConfig = {
    'Pendente': { icon: Clock, color: 'bg-yellow-100 text-yellow-800', bgColor: 'bg-yellow-50' },
    'Em produção': { icon: Package, color: 'bg-blue-100 text-blue-800', bgColor: 'bg-blue-50' },
    'Pronto': { icon: CheckCircle, color: 'bg-green-100 text-green-800', bgColor: 'bg-green-50' },
    'Entregue': { icon: Truck, color: 'bg-gray-100 text-gray-800', bgColor: 'bg-gray-50' }
  }

  useEffect(() => {
    fetchPedidos()
    fetchKanbanData()
  }, [])

  const fetchPedidos = async () => {
    try {
      const response = await fetch(`${API_BASE}/pedidos`)
      const data = await response.json()
      setPedidos(data)
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error)
    }
  }

  const fetchKanbanData = async () => {
    try {
      const response = await fetch(`${API_BASE}/pedidos/kanban`)
      const data = await response.json()
      setKanbanData(data)
    } catch (error) {
      console.error('Erro ao buscar dados kanban:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingPedido 
        ? `${API_BASE}/pedidos/${editingPedido.id}`
        : `${API_BASE}/pedidos`
      
      const method = editingPedido ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchPedidos()
        fetchKanbanData()
        resetForm()
        setIsDialogOpen(false)
      }
    } catch (error) {
      console.error('Erro ao salvar pedido:', error)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Tem certeza que deseja excluir este pedido?')) {
      try {
        await fetch(`${API_BASE}/pedidos/${id}`, { method: 'DELETE' })
        fetchPedidos()
        fetchKanbanData()
      } catch (error) {
        console.error('Erro ao excluir pedido:', error)
      }
    }
  }

  const handleEdit = (pedido) => {
    setEditingPedido(pedido)
    setFormData({
      nome_cliente: pedido.nome_cliente,
      data_pedido: pedido.data_pedido ? pedido.data_pedido.split('T')[0] : '',
      tipo_copo: pedido.tipo_copo,
      quantidade: pedido.quantidade,
      arte_enviada: pedido.arte_enviada,
      prazo_entrega: pedido.prazo_entrega ? pedido.prazo_entrega.split('T')[0] : '',
      status_pedido: pedido.status_pedido,
      observacoes: pedido.observacoes || ''
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingPedido(null)
    setFormData({
      nome_cliente: '',
      data_pedido: new Date().toISOString().split('T')[0],
      tipo_copo: '',
      quantidade: 1,
      arte_enviada: false,
      prazo_entrega: '',
      status_pedido: 'Pendente',
      observacoes: ''
    })
  }

  const KanbanColumn = ({ status, pedidos }) => {
    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <div className={`${config.bgColor} p-4 rounded-lg min-h-96`}>
        <div className="flex items-center gap-2 mb-4">
          <Icon className="h-5 w-5" />
          <h3 className="font-semibold">{status}</h3>
          <Badge variant="secondary">{pedidos.length}</Badge>
        </div>
        <div className="space-y-3">
          {pedidos.map((pedido) => (
            <Card key={pedido.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{pedido.nome_cliente}</h4>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(pedido)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(pedido.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mb-1">{pedido.tipo_copo}</p>
                <p className="text-xs text-gray-600 mb-2">Qtd: {pedido.quantidade}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {pedido.arte_enviada ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-orange-500" />
                    )}
                    <span className="text-xs">Arte</span>
                  </div>
                  {pedido.prazo_entrega && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600">
                        {new Date(pedido.prazo_entrega).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Pedidos de Clientes</h2>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'kanban' ? 'default' : 'outline'}
            onClick={() => setViewMode('kanban')}
            size="sm"
          >
            Kanban
          </Button>
          <Button
            variant={viewMode === 'tabela' ? 'default' : 'outline'}
            onClick={() => setViewMode('tabela')}
            size="sm"
          >
            Tabela
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Pedido
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingPedido ? 'Editar Pedido' : 'Novo Pedido'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome_cliente">Nome do Cliente</Label>
                    <Input
                      id="nome_cliente"
                      value={formData.nome_cliente}
                      onChange={(e) => setFormData({...formData, nome_cliente: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="data_pedido">Data do Pedido</Label>
                    <Input
                      id="data_pedido"
                      type="date"
                      value={formData.data_pedido}
                      onChange={(e) => setFormData({...formData, data_pedido: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tipo_copo">Tipo de Copo</Label>
                    <Input
                      id="tipo_copo"
                      value={formData.tipo_copo}
                      onChange={(e) => setFormData({...formData, tipo_copo: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantidade">Quantidade</Label>
                    <Input
                      id="quantidade"
                      type="number"
                      value={formData.quantidade}
                      onChange={(e) => setFormData({...formData, quantidade: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prazo_entrega">Prazo de Entrega</Label>
                    <Input
                      id="prazo_entrega"
                      type="date"
                      value={formData.prazo_entrega}
                      onChange={(e) => setFormData({...formData, prazo_entrega: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status_pedido">Status do Pedido</Label>
                    <Select value={formData.status_pedido} onValueChange={(value) => setFormData({...formData, status_pedido: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                        <SelectItem value="Em produção">Em produção</SelectItem>
                        <SelectItem value="Pronto">Pronto</SelectItem>
                        <SelectItem value="Entregue">Entregue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="arte_enviada"
                    checked={formData.arte_enviada}
                    onCheckedChange={(checked) => setFormData({...formData, arte_enviada: checked})}
                  />
                  <Label htmlFor="arte_enviada">Arte enviada?</Label>
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
                    {editingPedido ? 'Atualizar' : 'Criar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-4 gap-6">
          {Object.entries(kanbanData).map(([status, pedidos]) => (
            <KanbanColumn key={status} status={status} pedidos={pedidos} />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Tabela de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Cliente</th>
                    <th className="text-left p-2">Tipo</th>
                    <th className="text-left p-2">Qtd</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Arte</th>
                    <th className="text-left p-2">Prazo</th>
                    <th className="text-left p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido) => (
                    <tr key={pedido.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{pedido.nome_cliente}</td>
                      <td className="p-2">{pedido.tipo_copo}</td>
                      <td className="p-2">{pedido.quantidade}</td>
                      <td className="p-2">
                        <Badge className={statusConfig[pedido.status_pedido]?.color}>
                          {pedido.status_pedido}
                        </Badge>
                      </td>
                      <td className="p-2">
                        {pedido.arte_enviada ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                        )}
                      </td>
                      <td className="p-2">
                        {pedido.prazo_entrega ? 
                          new Date(pedido.prazo_entrega).toLocaleDateString('pt-BR') : 
                          '-'
                        }
                      </td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(pedido)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(pedido.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default PedidosModule

