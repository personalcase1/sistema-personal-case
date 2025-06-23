from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class IdeiaProduto(db.Model):
    __tablename__ = 'ideias_produtos'
    
    id = db.Column(db.Integer, primary_key=True)
    titulo_ideia = db.Column(db.String(200), nullable=False)
    categoria = db.Column(db.String(100), nullable=False)  # Sertanejo, Urbano, Infantil, Outros
    descricao = db.Column(db.Text, nullable=True)
    potencial = db.Column(db.String(50), nullable=False, default='Médio')  # Alto, Médio, Baixo
    imagem_referencia = db.Column(db.String(500), nullable=True)  # URL ou caminho do arquivo
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<IdeiaProduto {self.titulo_ideia}>'

    def to_dict(self):
        return {
            'id': self.id,
            'titulo_ideia': self.titulo_ideia,
            'categoria': self.categoria,
            'descricao': self.descricao,
            'potencial': self.potencial,
            'imagem_referencia': self.imagem_referencia,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

