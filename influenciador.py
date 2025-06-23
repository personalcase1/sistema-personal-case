from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Influenciador(db.Model):
    __tablename__ = 'influenciadores'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    instagram = db.Column(db.String(200), nullable=False)
    nicho = db.Column(db.String(100), nullable=False)
    alcance_estimado = db.Column(db.Integer, nullable=True, default=0)
    ja_recebeu_copo = db.Column(db.Boolean, nullable=False, default=False)
    resultado = db.Column(db.Text, nullable=True)
    observacoes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Influenciador {self.nome}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'instagram': self.instagram,
            'nicho': self.nicho,
            'alcance_estimado': self.alcance_estimado,
            'ja_recebeu_copo': self.ja_recebeu_copo,
            'resultado': self.resultado,
            'observacoes': self.observacoes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

