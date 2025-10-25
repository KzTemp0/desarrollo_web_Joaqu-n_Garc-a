from flask import Blueprint, jsonify, request, render_template, current_app, abort
from werkzeug.utils import secure_filename
from sqlalchemy import func, extract, desc, asc
from datetime import datetime
import os

from .models import db, AvisoAdopcion, Region, Comuna, Foto, ContactarPor, Comentario

bp = Blueprint("web", __name__)

# ------------------------ Helpers ------------------------

def aviso_dict(a: AvisoAdopcion):
    primera_foto = next((f"/static/uploads/{f.nombre_archivo}" for f in a.fotos), None)
    return {
        "id": a.id,
        "fecha_publicacion": a.fecha_ingreso.isoformat() if a.fecha_ingreso else None,
        "fecha_entrega": a.fecha_entrega.isoformat() if a.fecha_entrega else None,
        "region_id": a.comuna.region_id if a.comuna else None,
        "region_nombre": a.comuna.region.nombre if a.comuna else None,
        "comuna_id": a.comuna_id,
        "comuna_nombre": a.comuna.nombre if a.comuna else None,
        "sector": a.sector,
        "nombre_contacto": a.nombre,
        "email": a.email,
        "celular": a.celular,
        "tipo": a.tipo,
        "cantidad": a.cantidad,
        "edad": a.edad,
        "unidad_edad": "años" if a.unidad_medida == "a" else "meses",
        "unidad_raw": a.unidad_medida,
        "descripcion": a.descripcion,
        "foto_url": primera_foto
    }

def _allowed(filename: str) -> bool:
    ext = filename.rsplit(".", 1)[-1].lower()
    return ext in {"png", "jpg", "jpeg", "gif", "webp"}

# ------------------------ Vistas HTML ------------------------

@bp.get("/")
def portada():
    return render_template("portada.html")

@bp.get("/listado")
def listado():
    return render_template("listado.html")

@bp.get("/agregar")
def agregar():
    return render_template("agregar.html")

@bp.get("/detalle")
def detalle():
    return render_template("detalle.html")

@bp.get("/estadisticas")
def estadisticas():
    return render_template("estadisticas.html")

# ------------------------ APIs catálogo ------------------------

@bp.get("/api/regiones")
def api_regiones():
    rows = Region.query.order_by(Region.nombre.asc()).all()
    return jsonify([{"id": r.id, "nombre": r.nombre} for r in rows])

@bp.get("/api/comunas")
def api_comunas():
    region_id = request.args.get("region_id", type=int)
    q = Comuna.query
    if region_id:
        q = q.filter(Comuna.region_id == region_id)
    rows = q.order_by(Comuna.nombre.asc()).all()
    return jsonify([{"id": c.id, "nombre": c.nombre, "region_id": c.region_id} for c in rows])

# ------------------------ APIs avisos ------------------------

@bp.get("/api/avisos")
def api_avisos():
    limit = request.args.get("limit", type=int)
    page = request.args.get("page", default=1, type=int)
    per_page = request.args.get("per_page", default=5, type=int)
    region_id = request.args.get("region_id", type=int)
    comuna_id = request.args.get("comuna_id", type=int)
    tipo = request.args.get("tipo")
    orden = request.args.get("order", default="desc")

    q = AvisoAdopcion.query.join(Comuna, AvisoAdopcion.comuna_id == Comuna.id)

    if region_id:
        q = q.filter(Comuna.region_id == region_id)
    if comuna_id:
        q = q.filter(AvisoAdopcion.comuna_id == comuna_id)
    if tipo in ("gato", "perro"):
        q = q.filter(AvisoAdopcion.tipo == tipo)

    q = q.order_by(desc(AvisoAdopcion.fecha_ingreso) if orden == "desc"
                   else asc(AvisoAdopcion.fecha_ingreso))

    if limit:
        items = q.limit(limit).all()
        return jsonify([aviso_dict(a) for a in items])

    p = q.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        "items": [aviso_dict(a) for a in p.items],
        "total": p.total,
        "page": p.page,
        "pages": p.pages,
        "per_page": p.per_page
    })

@bp.get("/api/aviso/<int:aviso_id>")
def api_aviso(aviso_id):
    a = AvisoAdopcion.query.get_or_404(aviso_id)
    data = aviso_dict(a)
    data["fotos"] = [f"/static/uploads/{f.nombre_archivo}" for f in a.fotos]
    data["contactos"] = [{"nombre": c.nombre, "identificador": c.identificador} for c in a.contactos]
    return jsonify(data)

@bp.post("/api/avisos")
def api_crear_aviso():
    # Validaciones lado servidor (T2) y creación (T2) – ver reglas T1. :contentReference[oaicite:3]{index=3} :contentReference[oaicite:4]{index=4}
    errors = {}

    comuna_id = request.form.get("comuna_id", type=int)
    sector = (request.form.get("sector") or "").strip()
    nombre = (request.form.get("nombre") or "").strip()
    email = (request.form.get("email") or "").strip()
    celular = (request.form.get("celular") or "").strip()
    tipo = request.form.get("tipo")
    cantidad = request.form.get("cantidad", type=int)
    edad = request.form.get("edad", type=int)
    unidad = request.form.get("unidad_edad")
    fecha_entrega_raw = (request.form.get("fecha_entrega") or "").strip()
    descripcion = (request.form.get("descripcion") or "").strip()

    if not comuna_id:
        errors["comuna_id"] = "obligatorio"
    if not nombre or len(nombre) < 3 or len(nombre) > 200:
        errors["nombre"] = "largo"
    if (not email) or len(email) > 100 or ("@" not in email) or ("." not in email):
        errors["email"] = "formato"
    if celular:
        ok = celular.startswith("+") and "." in celular and celular.replace("+", "").replace(".", "").isdigit()
        if not ok:
            errors["celular"] = "formato"
    if tipo not in ("gato", "perro"):
        errors["tipo"] = "opcion"
    if not isinstance(cantidad, int) or cantidad < 1:
        errors["cantidad"] = "entero"
    if not isinstance(edad, int) or edad < 1:
        errors["edad"] = "entero"
    if unidad not in ("m", "a"):
        errors["unidad_edad"] = "opcion"

    try:
        fecha_entrega = datetime.fromisoformat(fecha_entrega_raw)
    except Exception:
        fecha_entrega = None
        errors["fecha_entrega"] = "formato"
    if fecha_entrega and fecha_entrega < datetime.now():
        errors["fecha_entrega"] = "minimo"

    fotos = request.files.getlist("fotos")
    if not fotos or len(fotos) < 1 or len(fotos) > 5:
        errors["fotos"] = "rango"
    else:
        for f in fotos:
            if not f.filename or not _allowed(f.filename):
                errors["fotos"] = "formato"
                break

    # contactos opcionales: máximo 5
    contactos = []
    # vienen como pares repetidos (cp_nombre, cp_identificador)
    for key in request.form:
        # nada especial aquí; usaremos índices explícitos del front si vienen
        pass
    # Para seguridad: obtenemos todos y armamos desde request.form.getlist
    nombres_cp = request.form.getlist("cp_nombre")
    ids_cp = request.form.getlist("cp_identificador")
    for nom, ident in zip(nombres_cp, ids_cp):
        nom = (nom or "").strip()
        ident = (ident or "").strip()
        if nom and ident:
            if nom not in ("whatsapp", "telegram", "X", "instagram", "tiktok", "otra"):
                continue
            if len(ident) < 4 or len(ident) > 50:
                continue
            contactos.append((nom, ident))
    if len(contactos) > 5:
        contactos = contactos[:5]

    if errors:
        return jsonify({"ok": False, "errors": errors}), 400

    a = AvisoAdopcion(
        comuna_id=comuna_id,
        sector=sector[:100] if sector else None,
        nombre=nombre,
        email=email,
        celular=celular or None,
        tipo=tipo,
        cantidad=cantidad,
        edad=edad,
        unidad_medida=unidad,
        fecha_entrega=fecha_entrega,
        descripcion=descripcion or None
    )
    db.session.add(a)
    db.session.flush()

    updir = current_app.config["UPLOAD_FOLDER"]
    os.makedirs(updir, exist_ok=True)
    for f in fotos:
        filename = secure_filename(f"{a.id}_{datetime.now().strftime('%Y%m%d%H%M%S%f')}_{f.filename}")
        f.save(os.path.join(updir, filename))
        db.session.add(Foto(ruta_archivo="uploads", nombre_archivo=filename, actividad_id=a.id))

    for nom, val in contactos:
        db.session.add(ContactarPor(nombre=nom, identificador=val, actividad_id=a.id))

    db.session.commit()
    return jsonify({"ok": True, "id": a.id}), 201

# ------------------------ APIs comentarios (T3) ------------------------

@bp.get("/api/comentarios")
def api_listar_comentarios():
    aviso_id = request.args.get("aviso_id", type=int)
    if not aviso_id:
        abort(400)
    a = AvisoAdopcion.query.get_or_404(aviso_id)
    rows = (Comentario.query
            .filter(Comentario.aviso_id == a.id)
            .order_by(Comentario.fecha.desc())
            .all())
    return jsonify([{
        "id": c.id,
        "fecha": c.fecha.strftime("%Y-%m-%d %H:%M"),
        "nombre": c.nombre,
        "texto": c.texto
    } for c in rows])

@bp.post("/api/comentarios")
def api_crear_comentario():
    data = request.get_json(silent=True) or {}
    errors = {}
    aviso_id = data.get("aviso_id", None)
    nombre = (data.get("nombre") or "").strip()
    texto = (data.get("texto") or "").strip()

    if not isinstance(aviso_id, int):
        errors["aviso_id"] = "obligatorio"
    if len(nombre) < 3 or len(nombre) > 80:
        errors["nombre"] = "largo"
    if len(texto) < 5:
        errors["texto"] = "largo"
    if errors:
        return jsonify({"ok": False, "errors": errors}), 400

    a = AvisoAdopcion.query.get(aviso_id)
    if not a:
        return jsonify({"ok": False, "errors": {"general": "aviso"}}), 404

    c = Comentario(aviso_id=aviso_id, nombre=nombre, texto=texto)
    db.session.add(c)
    db.session.commit()
    return jsonify({"ok": True, "id": c.id, "fecha": c.fecha.strftime("%Y-%m-%d %H:%M")}), 201

# ------------------------ APIs estadísticas (T3) ------------------------
# Deben ser consumidas via fetch desde el cliente. :contentReference[oaicite:5]{index=5}

@bp.get("/api/stats/por-dia")
def stats_por_dia():
    rows = (db.session.query(func.date(AvisoAdopcion.fecha_ingreso), func.count(AvisoAdopcion.id))
            .group_by(func.date(AvisoAdopcion.fecha_ingreso))
            .order_by(func.date(AvisoAdopcion.fecha_ingreso))
            .all())
    return jsonify([{"dia": d.isoformat(), "cantidad": int(n)} for d, n in rows])

@bp.get("/api/stats/por-tipo")
def stats_por_tipo():
    rows = (db.session.query(AvisoAdopcion.tipo, func.count(AvisoAdopcion.id))
            .group_by(AvisoAdopcion.tipo)
            .all())
    return jsonify([{"tipo": t, "cantidad": int(n)} for t, n in rows])

@bp.get("/api/stats/por-mes")
def stats_por_mes():
    rows = (db.session.query(
                extract("year", AvisoAdopcion.fecha_ingreso),
                extract("month", AvisoAdopcion.fecha_ingreso),
                AvisoAdopcion.tipo,
                func.count(AvisoAdopcion.id))
            .group_by(extract("year", AvisoAdopcion.fecha_ingreso),
                      extract("month", AvisoAdopcion.fecha_ingreso),
                      AvisoAdopcion.tipo)
            .order_by(extract("year", AvisoAdopcion.fecha_ingreso),
                      extract("month", AvisoAdopcion.fecha_ingreso))
            .all())
    out = {}
    for y, m, t, n in rows:
        key = f"{int(y)}-{int(m):02d}"
        if key not in out:
            out[key] = {"mes": key, "gato": 0, "perro": 0}
        out[key][t] = int(n)
    return jsonify(list(out.values()))
