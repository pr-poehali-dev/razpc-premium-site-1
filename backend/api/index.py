"""
RazPC — главный API: каталог, портфолио, отзывы, услуги, контент, заявки
"""
import json
import os
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id, X-Auth-Token, X-Session-Id",
}

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def ok(data, status=200):
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(data, ensure_ascii=False, default=str)}

def err(msg, status=400):
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps({"error": msg}, ensure_ascii=False)}

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    params = event.get("queryStringParameters") or {}
    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    conn = get_conn()
    cur = conn.cursor()

    try:
        # ── GET /products ──────────────────────────────────────────────────
        if method == "GET" and path == "/products":
            category = params.get("category")
            featured = params.get("featured")
            sql = "SELECT p.*, c.name as cat_name, c.slug as cat_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_active = true"
            args = []
            if category and category != "all":
                sql += " AND c.slug = %s"
                args.append(category)
            if featured == "true":
                sql += " AND p.is_featured = true"
            sql += " ORDER BY p.sort_order, p.id"
            cur.execute(sql, args)
            cols = [d[0] for d in cur.description]
            rows = [dict(zip(cols, r)) for r in cur.fetchall()]
            return ok(rows)

        # ── GET /products/:slug ────────────────────────────────────────────
        if method == "GET" and path.startswith("/products/"):
            slug = path.split("/products/")[1]
            cur.execute("SELECT p.*, c.name as cat_name, c.slug as cat_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = %s AND p.is_active = true", (slug,))
            cols = [d[0] for d in cur.description]
            row = cur.fetchone()
            if not row:
                return err("Not found", 404)
            return ok(dict(zip(cols, row)))

        # ── GET /categories ────────────────────────────────────────────────
        if method == "GET" and path == "/categories":
            cur.execute("SELECT * FROM categories WHERE is_active = true ORDER BY sort_order")
            cols = [d[0] for d in cur.description]
            rows = [dict(zip(cols, r)) for r in cur.fetchall()]
            return ok(rows)

        # ── GET /services ──────────────────────────────────────────────────
        if method == "GET" and path == "/services":
            cur.execute("SELECT * FROM services WHERE is_active = true ORDER BY sort_order")
            cols = [d[0] for d in cur.description]
            rows = [dict(zip(cols, r)) for r in cur.fetchall()]
            return ok(rows)

        # ── GET /portfolio ─────────────────────────────────────────────────
        if method == "GET" and path == "/portfolio":
            cur.execute("SELECT * FROM portfolio WHERE is_active = true ORDER BY sort_order")
            cols = [d[0] for d in cur.description]
            rows = [dict(zip(cols, r)) for r in cur.fetchall()]
            return ok(rows)

        # ── GET /reviews ───────────────────────────────────────────────────
        if method == "GET" and path == "/reviews":
            featured = params.get("featured")
            sql = "SELECT * FROM reviews WHERE is_active = true"
            if featured == "true":
                sql += " AND is_featured = true"
            sql += " ORDER BY sort_order, id"
            cur.execute(sql)
            cols = [d[0] for d in cur.description]
            rows = [dict(zip(cols, r)) for r in cur.fetchall()]
            return ok(rows)

        # ── GET /content ───────────────────────────────────────────────────
        if method == "GET" and path == "/content":
            cur.execute("SELECT key, value FROM site_content")
            rows = cur.fetchall()
            return ok({r[0]: r[1] for r in rows})

        # ── GET /articles ──────────────────────────────────────────────────
        if method == "GET" and path == "/articles":
            cur.execute("SELECT id, title, slug, excerpt, image_url, seo_title, published_at FROM articles WHERE is_published = true ORDER BY sort_order, published_at DESC")
            cols = [d[0] for d in cur.description]
            rows = [dict(zip(cols, r)) for r in cur.fetchall()]
            return ok(rows)

        if method == "GET" and path.startswith("/articles/"):
            slug = path.split("/articles/")[1]
            cur.execute("SELECT * FROM articles WHERE slug = %s AND is_published = true", (slug,))
            cols = [d[0] for d in cur.description]
            row = cur.fetchone()
            if not row:
                return err("Not found", 404)
            return ok(dict(zip(cols, row)))

        # ── POST /orders ───────────────────────────────────────────────────
        if method == "POST" and path == "/orders":
            name = body.get("name", "").strip()
            if not name:
                return err("Имя обязательно")
            phone = body.get("phone", "").strip()
            email = body.get("email", "").strip()
            message = body.get("message", "").strip()
            service = body.get("service", "").strip()
            product_id = body.get("product_id")
            product_name = body.get("product_name", "").strip()
            source = body.get("source", "website")
            cur.execute(
                "INSERT INTO orders (name, phone, email, message, service, product_id, product_name, source) VALUES (%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
                (name, phone or None, email or None, message or None, service or None, product_id or None, product_name or None, source)
            )
            order_id = cur.fetchone()[0]
            conn.commit()
            return ok({"success": True, "id": order_id}, 201)

        return err("Not found", 404)

    except Exception as e:
        conn.rollback()
        return err(str(e), 500)
    finally:
        cur.close()
        conn.close()
