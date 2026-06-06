"""
RazPC — Admin API: управление товарами, услугами, портфолио, отзывами, заявками, контентом
"""
import json
import os
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
}

ADMIN_TOKEN = os.environ.get("RAZPC_ADMIN_TOKEN", "razpc-admin-2024")

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def ok(data, status=200):
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(data, ensure_ascii=False, default=str)}

def err(msg, status=400):
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps({"error": msg}, ensure_ascii=False)}

def check_auth(event):
    headers = event.get("headers") or {}
    token = headers.get("X-Admin-Token") or headers.get("x-admin-token", "")
    return token == ADMIN_TOKEN

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    if not check_auth(event):
        return err("Unauthorized", 401)

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    conn = get_conn()
    cur = conn.cursor()

    def fetch_all(sql, args=()):
        cur.execute(sql, args)
        cols = [d[0] for d in cur.description]
        return [dict(zip(cols, r)) for r in cur.fetchall()]

    def fetch_one(sql, args=()):
        cur.execute(sql, args)
        cols = [d[0] for d in cur.description]
        row = cur.fetchone()
        return dict(zip(cols, row)) if row else None

    try:
        # ── ORDERS ─────────────────────────────────────────────────────────
        if path == "/admin/orders":
            if method == "GET":
                rows = fetch_all("SELECT o.*, p.name as product_title FROM orders o LEFT JOIN products p ON o.product_id = p.id ORDER BY o.created_at DESC")
                return ok(rows)

        if path.startswith("/admin/orders/") and len(path.split("/")) == 4:
            oid = path.split("/")[3]
            if method == "PUT":
                status_val = body.get("status")
                note = body.get("manager_note")
                cur.execute("UPDATE orders SET status = COALESCE(%s, status), manager_note = COALESCE(%s, manager_note), updated_at = NOW() WHERE id = %s RETURNING id", (status_val, note, oid))
                conn.commit()
                return ok({"success": True})

        # ── PRODUCTS ────────────────────────────────────────────────────────
        if path == "/admin/products":
            if method == "GET":
                rows = fetch_all("SELECT p.*, c.name as cat_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.sort_order, p.id")
                return ok(rows)
            if method == "POST":
                cur.execute(
                    "INSERT INTO products (category_id,name,slug,short_description,description,specs,fps_data,price,old_price,image_url,status,is_featured,sort_order) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
                    (body.get("category_id"), body["name"], body["slug"], body.get("short_description"), body.get("description"),
                     json.dumps(body.get("specs", {})), json.dumps(body.get("fps_data", {})),
                     body.get("price", 0), body.get("old_price"), body.get("image_url"),
                     body.get("status", "in_stock"), body.get("is_featured", False), body.get("sort_order", 0))
                )
                new_id = cur.fetchone()[0]
                conn.commit()
                return ok({"success": True, "id": new_id}, 201)

        if path.startswith("/admin/products/") and len(path.split("/")) == 4:
            pid = path.split("/")[3]
            if method == "PUT":
                cur.execute(
                    "UPDATE products SET category_id=%s,name=%s,slug=%s,short_description=%s,description=%s,specs=%s,fps_data=%s,price=%s,old_price=%s,image_url=%s,status=%s,is_featured=%s,is_active=%s,sort_order=%s,updated_at=NOW() WHERE id=%s",
                    (body.get("category_id"), body["name"], body["slug"], body.get("short_description"), body.get("description"),
                     json.dumps(body.get("specs", {})), json.dumps(body.get("fps_data", {})),
                     body.get("price", 0), body.get("old_price"), body.get("image_url"),
                     body.get("status", "in_stock"), body.get("is_featured", False), body.get("is_active", True),
                     body.get("sort_order", 0), pid)
                )
                conn.commit()
                return ok({"success": True})
            if method == "DELETE":
                cur.execute("UPDATE products SET is_active = false WHERE id = %s", (pid,))
                conn.commit()
                return ok({"success": True})

        # ── SERVICES ────────────────────────────────────────────────────────
        if path == "/admin/services":
            if method == "GET":
                return ok(fetch_all("SELECT * FROM services ORDER BY sort_order"))
            if method == "POST":
                cur.execute(
                    "INSERT INTO services (name,slug,short_description,description,image_url,icon,price_from,sort_order) VALUES (%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
                    (body["name"], body["slug"], body.get("short_description"), body.get("description"), body.get("image_url"), body.get("icon"), body.get("price_from"), body.get("sort_order", 0))
                )
                conn.commit()
                return ok({"success": True}, 201)

        if path.startswith("/admin/services/") and len(path.split("/")) == 4:
            sid = path.split("/")[3]
            if method == "PUT":
                cur.execute(
                    "UPDATE services SET name=%s,slug=%s,short_description=%s,description=%s,image_url=%s,icon=%s,price_from=%s,is_active=%s,sort_order=%s WHERE id=%s",
                    (body["name"], body["slug"], body.get("short_description"), body.get("description"), body.get("image_url"), body.get("icon"), body.get("price_from"), body.get("is_active", True), body.get("sort_order", 0), sid)
                )
                conn.commit()
                return ok({"success": True})

        # ── PORTFOLIO ───────────────────────────────────────────────────────
        if path == "/admin/portfolio":
            if method == "GET":
                return ok(fetch_all("SELECT * FROM portfolio ORDER BY sort_order"))
            if method == "POST":
                cur.execute(
                    "INSERT INTO portfolio (title,client_task,specs,image_url,category,sort_order) VALUES (%s,%s,%s,%s,%s,%s) RETURNING id",
                    (body["title"], body.get("client_task"), body.get("specs"), body.get("image_url"), body.get("category"), body.get("sort_order", 0))
                )
                conn.commit()
                return ok({"success": True}, 201)

        if path.startswith("/admin/portfolio/") and len(path.split("/")) == 4:
            pid = path.split("/")[3]
            if method == "PUT":
                cur.execute(
                    "UPDATE portfolio SET title=%s,client_task=%s,specs=%s,image_url=%s,category=%s,is_active=%s,sort_order=%s WHERE id=%s",
                    (body["title"], body.get("client_task"), body.get("specs"), body.get("image_url"), body.get("category"), body.get("is_active", True), body.get("sort_order", 0), pid)
                )
                conn.commit()
                return ok({"success": True})
            if method == "DELETE":
                cur.execute("UPDATE portfolio SET is_active = false WHERE id = %s", (pid,))
                conn.commit()
                return ok({"success": True})

        # ── REVIEWS ─────────────────────────────────────────────────────────
        if path == "/admin/reviews":
            if method == "GET":
                return ok(fetch_all("SELECT * FROM reviews ORDER BY sort_order, id"))
            if method == "POST":
                cur.execute(
                    "INSERT INTO reviews (author_name,author_city,text,product_name,is_featured,sort_order) VALUES (%s,%s,%s,%s,%s,%s) RETURNING id",
                    (body["author_name"], body.get("author_city"), body["text"], body.get("product_name"), body.get("is_featured", False), body.get("sort_order", 0))
                )
                conn.commit()
                return ok({"success": True}, 201)

        if path.startswith("/admin/reviews/") and len(path.split("/")) == 4:
            rid = path.split("/")[3]
            if method == "PUT":
                cur.execute(
                    "UPDATE reviews SET author_name=%s,author_city=%s,text=%s,product_name=%s,is_active=%s,is_featured=%s,sort_order=%s WHERE id=%s",
                    (body["author_name"], body.get("author_city"), body["text"], body.get("product_name"), body.get("is_active", True), body.get("is_featured", False), body.get("sort_order", 0), rid)
                )
                conn.commit()
                return ok({"success": True})
            if method == "DELETE":
                cur.execute("UPDATE reviews SET is_active = false WHERE id = %s", (rid,))
                conn.commit()
                return ok({"success": True})

        # ── CONTENT ─────────────────────────────────────────────────────────
        if path == "/admin/content":
            if method == "GET":
                return ok(fetch_all("SELECT * FROM site_content ORDER BY key"))
            if method == "PUT":
                for key, value in body.items():
                    cur.execute("UPDATE site_content SET value=%s, updated_at=NOW() WHERE key=%s", (value, key))
                    if cur.rowcount == 0:
                        cur.execute("INSERT INTO site_content (key, value) VALUES (%s, %s)", (key, value))
                conn.commit()
                return ok({"success": True})

        # ── ARTICLES ────────────────────────────────────────────────────────
        if path == "/admin/articles":
            if method == "GET":
                return ok(fetch_all("SELECT * FROM articles ORDER BY sort_order, id"))
            if method == "POST":
                cur.execute(
                    "INSERT INTO articles (title,slug,excerpt,content,image_url,seo_title,seo_description,is_published,sort_order) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
                    (body["title"], body["slug"], body.get("excerpt"), body.get("content"), body.get("image_url"), body.get("seo_title"), body.get("seo_description"), body.get("is_published", False), body.get("sort_order", 0))
                )
                conn.commit()
                return ok({"success": True}, 201)

        if path.startswith("/admin/articles/") and len(path.split("/")) == 4:
            aid = path.split("/")[3]
            if method == "PUT":
                cur.execute(
                    "UPDATE articles SET title=%s,slug=%s,excerpt=%s,content=%s,image_url=%s,seo_title=%s,seo_description=%s,is_published=%s,sort_order=%s,updated_at=NOW() WHERE id=%s",
                    (body["title"], body["slug"], body.get("excerpt"), body.get("content"), body.get("image_url"), body.get("seo_title"), body.get("seo_description"), body.get("is_published", False), body.get("sort_order", 0), aid)
                )
                conn.commit()
                return ok({"success": True})

        return err("Not found", 404)

    except Exception as e:
        conn.rollback()
        return err(str(e), 500)
    finally:
        cur.close()
        conn.close()
