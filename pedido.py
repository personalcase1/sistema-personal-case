from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class PedidoCliente(db.Model):
    __tablename__ = 'pedidos_clientes'
    
    id = db.Column(db.Integer, primary_key=True)
    nome_cliente = db.Column(db.String(200), nullable=False)
    data_pedido = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    tipo_copo = db.Column(db.String(100), nullable=False)
    quantidade = db.Column(db.Integer, nullable=False, default=1)
    arte_enviada = db.Column(db.Boolean, nullable=False, default=False)
    prazo_entrega = db.Column(db.DateTime, nullable=True)
    status_pedido = db.Column(db.String(50), nullable=False, default='Pendente')  # Pendente, Em produção, Pronto, Entregue
    observacoes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<PedidoCliente {self.nome_cliente}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nome_cliente': self.nome_cliente,
            'data_pedido': self.data_pedido.isoformat(),
            'tipo_copo': self.tipo_copo,
            'quantidade': self.quantidade,
            'arte_enviada': self.arte_enviada,
            'prazo_entrega': self.prazo_entrega.isoformat() if self.prazo_entrega else None,
            'status_pedido': self.status_pedido,
            'observacoes': self.observacoes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

