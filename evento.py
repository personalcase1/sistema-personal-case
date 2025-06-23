from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class ProximoEvento(db.Model):
    __tablename__ = 'proximos_eventos'
    
    id = db.Column(db.Integer, primary_key=True)
    nome_evento = db.Column(db.String(200), nullable=False)
    artista = db.Column(db.String(200), nullable=False)
    quantidade_copos = db.Column(db.Integer, nullable=False, default=0)
    status = db.Column(db.String(50), nullable=False, default='Em Execução')  # Feito, Em Execução, Cancelado
    data_evento = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<ProximoEvento {self.nome_evento}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nome_evento': self.nome_evento,
            'artista': self.artista,
            'quantidade_copos': self.quantidade_copos,
            'status': self.status,
            'data_evento': self.data_evento.isoformat() if self.data_evento else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

