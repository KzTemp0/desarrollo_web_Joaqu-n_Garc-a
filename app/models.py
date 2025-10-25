from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Region(db.Model):
    __tablename__ = 'region'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)

class Comuna(db.Model):
    __tablename__ = 'comuna'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    region_id = db.Column(db.Integer, db.ForeignKey('region.id'), nullable=False)
    region = db.relationship('Region', backref='comunas')

class AvisoAdopcion(db.Model):
    __tablename__ = 'aviso_adopcion'
    id = db.Column(db.Integer, primary_key=True)
    comuna_id = db.Column(db.Integer, db.ForeignKey('comuna.id'), nullable=False)
    comuna = db.relationship('Comuna', backref='avisos')
    sector = db.Column(db.String(100))
    nombre = db.Column(db.String(200), nullable=False)              # contacto
    email = db.Column(db.String(100), nullable=False)
    celular = db.Column(db.String(20))
    tipo = db.Column(db.Enum('gato', 'perro'), nullable=False)
    cantidad = db.Column(db.Integer, nullable=False)
    edad = db.Column(db.Integer, nullable=False)
    unidad_medida = db.Column(db.Enum('m', 'a'), nullable=False)    # m: meses, a: años
    fecha_entrega = db.Column(db.DateTime, nullable=False)
    descripcion = db.Column(db.Text)
    fecha_ingreso = db.Column(db.DateTime, nullable=False, default=datetime.now)

class Foto(db.Model):
    __tablename__ = 'foto'
    id = db.Column(db.Integer, primary_key=True)
    ruta_archivo = db.Column(db.String(200), nullable=False, default="uploads")
    nombre_archivo = db.Column(db.String(255), nullable=False)
    actividad_id = db.Column(db.Integer, db.ForeignKey('aviso_adopcion.id'), nullable=False)
    aviso = db.relationship('AvisoAdopcion', backref='fotos')

class ContactarPor(db.Model):
    __tablename__ = 'contactar_por'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.Enum('whatsapp', 'telegram', 'X', 'instagram', 'tiktok', 'otra'), nullable=False)
    identificador = db.Column(db.String(150), nullable=False)
    actividad_id = db.Column(db.Integer, db.ForeignKey('aviso_adopcion.id'), nullable=False)
    aviso = db.relationship('AvisoAdopcion', backref='contactos')

class Comentario(db.Model):
    __tablename__ = 'comentario'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(80), nullable=False)
    texto = db.Column(db.String(300), nullable=False)
    fecha = db.Column(db.DateTime, nullable=False, default=datetime.now)
    aviso_id = db.Column(db.Integer, db.ForeignKey('aviso_adopcion.id'), nullable=False)
    aviso = db.relationship('AvisoAdopcion', backref='comentarios')
