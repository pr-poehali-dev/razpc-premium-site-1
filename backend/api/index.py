"""
RazPC — главный API: каталог, портфолио, отзывы, услуги, контент, заявки
Роутинг через ?action=products, ?action=services и т.д.
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
    params = event.get("queryStringParameters") or {}
    action = params.get("action", "")
    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    conn = get_conn()
    cur = conn.cursor()

    def rows(sql, args=()):
        cur.execute(sql, args)
        cols = [d[0] for d in cur.description]
        return [dict(zip(cols, r)) for r in cur.fetchall()]

    try:
        # ── GET products ───────────────────────────────────────────────────
        if method == "GET" and action == "products":
            category = params.get("category")
            featured = params.get("featured")
            sql = "SELECT p.*, c.name as cat_name, c.slug as cat_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_active = true"
            args = []
            if category and category != "all":
                sql += " AND c.slug = %s"; args.append(category)
            if featured == "true":
                sql += " AND p.is_featured = true"
            sql += " ORDER BY p.sort_order, p.id"
            return ok(rows(sql, args))

        # ── GET product by slug ────────────────────────────────────────────
        if method == "GET" and action == "product":
            slug = params.get("slug", "")
            cur.execute("SELECT p.*, c.name as cat_name, c.slug as cat_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = %s AND p.is_active = true", (slug,))
            cols = [d[0] for d in cur.description]
            row = cur.fetchone()
            if not row: return err("Not found", 404)
            return ok(dict(zip(cols, row)))

        # ── GET categories ─────────────────────────────────────────────────
        if method == "GET" and action == "categories":
            return ok(rows("SELECT * FROM categories WHERE is_active = true ORDER BY sort_order"))

        # ── GET services ───────────────────────────────────────────────────
        if method == "GET" and action == "services":
            return ok(rows("SELECT * FROM services WHERE is_active = true ORDER BY sort_order"))

        # ── GET portfolio ──────────────────────────────────────────────────
        if method == "GET" and action == "portfolio":
            return ok(rows("SELECT * FROM portfolio WHERE is_active = true ORDER BY sort_order"))

        # ── GET reviews ────────────────────────────────────────────────────
        if method == "GET" and action == "reviews":
            featured = params.get("featured")
            sql = "SELECT * FROM reviews WHERE is_active = true"
            if featured == "true": sql += " AND is_featured = true"
            sql += " ORDER BY sort_order, id"
            return ok(rows(sql))

        # ── GET content ────────────────────────────────────────────────────
        if method == "GET" and action == "content":
            cur.execute("SELECT key, value FROM site_content")
            return ok({r[0]: r[1] for r in cur.fetchall()})

        # ── GET articles ───────────────────────────────────────────────────
        if method == "GET" and action == "articles":
            return ok(rows("SELECT id, title, slug, excerpt, image_url, seo_title, published_at FROM articles WHERE is_published = true ORDER BY sort_order, published_at DESC"))

        if method == "GET" and action == "article":
            slug = params.get("slug", "")
            cur.execute("SELECT * FROM articles WHERE slug = %s AND is_published = true", (slug,))
            cols = [d[0] for d in cur.description]
            row = cur.fetchone()
            if not row: return err("Not found", 404)
            return ok(dict(zip(cols, row)))

        # ── POST order ─────────────────────────────────────────────────────
        if method == "POST" and action == "order":
            name = body.get("name", "").strip()
            if not name: return err("Имя обязательно")
            cur.execute(
                "INSERT INTO orders (name, phone, email, message, service, product_id, product_name, source) VALUES (%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
                (name, body.get("phone") or None, body.get("email") or None, body.get("message") or None,
                 body.get("service") or None, body.get("product_id") or None, body.get("product_name") or None,
                 body.get("source", "website"))
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
