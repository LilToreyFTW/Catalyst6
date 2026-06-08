import json
import os
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import urlparse


BASE_DIR = Path(__file__).resolve().parent
IP_FILE = BASE_DIR / "vps_ip.ip"
PORT_FILE = BASE_DIR / "port_configurations.config"
MEMORY_FILE = BASE_DIR / "memory_store.json"
API_KEY_FILE = BASE_DIR / "api_key.secret"
ALLOWED_ORIGIN = os.getenv("CATALYST6_ALLOWED_ORIGIN", "*")


def load_api_key() -> str:
    env_value = os.getenv("CATALYST6_API_KEY", "").strip()
    if env_value:
        return env_value

    if API_KEY_FILE.exists():
        return read_text_file(API_KEY_FILE)

    return ""


API_KEY = load_api_key()


def read_text_file(path: Path) -> str:
    return path.read_text(encoding="utf-8").strip()


def resolve_bind_host_and_port() -> tuple[str, int]:
    raw_ip = read_text_file(IP_FILE)
    raw_port = read_text_file(PORT_FILE)

    host = "0.0.0.0"
    port = 3939

    if ":" in raw_ip:
        _, ip_port = raw_ip.rsplit(":", 1)
        if ip_port.isdigit():
            port = int(ip_port)

    for line in raw_port.splitlines():
        line = line.strip()
        if not line or ":" not in line:
            continue
        protocol, value = line.split(":", 1)
        if protocol.strip().upper() == "TCP" and value.strip().isdigit():
            port = int(value.strip())
            break

    return host, port


def ensure_memory_file() -> None:
    if not MEMORY_FILE.exists():
        MEMORY_FILE.write_text("[]", encoding="utf-8")


def load_memory() -> list[dict[str, Any]]:
    ensure_memory_file()
    raw = MEMORY_FILE.read_text(encoding="utf-8").strip() or "[]"
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        parsed = []
    return parsed if isinstance(parsed, list) else []


def save_memory(records: list[dict[str, Any]]) -> None:
    MEMORY_FILE.write_text(json.dumps(records, indent=2), encoding="utf-8")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class CatalystHandler(BaseHTTPRequestHandler):
    server_version = "Catalyst6VPS/1.0"

    def _set_headers(self, status_code: int = 200, content_type: str = "application/json") -> None:
        self.send_response(status_code)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", ALLOWED_ORIGIN)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, X-API-Key")
        self.end_headers()

    def _write_json(self, payload: dict[str, Any] | list[Any], status_code: int = 200) -> None:
        self._set_headers(status_code=status_code)
        self.wfile.write(json.dumps(payload).encode("utf-8"))

    def _read_json_body(self) -> dict[str, Any]:
        content_length = int(self.headers.get("Content-Length", "0"))
        if content_length <= 0:
            return {}
        body = self.rfile.read(content_length).decode("utf-8")
        return json.loads(body) if body else {}

    def _is_authorized(self) -> bool:
        if not API_KEY:
            return True
        return self.headers.get("X-API-Key", "").strip() == API_KEY

    def log_message(self, format: str, *args: Any) -> None:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] {self.address_string()} - {format % args}")

    def do_OPTIONS(self) -> None:
        self._set_headers(204)

    def do_GET(self) -> None:
        parsed = urlparse(self.path)

        if parsed.path == "/health":
            self._write_json(
                {
                    "status": "ok",
                    "service": "Catalyst6 Demon VPS Memory API",
                    "time": now_iso(),
                    "memory_records": len(load_memory()),
                }
            )
            return

        if parsed.path == "/memory":
            if not self._is_authorized():
                self._write_json({"error": "Unauthorized"}, 401)
                return

            records = load_memory()
            self._write_json(records)
            return

        self._write_json({"error": "Not found"}, 404)

    def do_POST(self) -> None:
        parsed = urlparse(self.path)

        if parsed.path != "/memory":
            self._write_json({"error": "Not found"}, 404)
            return

        if not self._is_authorized():
            self._write_json({"error": "Unauthorized"}, 401)
            return

        try:
            payload = self._read_json_body()
        except json.JSONDecodeError:
            self._write_json({"error": "Invalid JSON body"}, 400)
            return

        segments = payload.get("segments")
        record_id = payload.get("id")
        created_at = payload.get("createdAt")

        if not record_id or not isinstance(segments, list) or not segments:
            self._write_json({"error": "Missing required fields: id, segments"}, 400)
            return

        record = {
            "id": record_id,
            "genomeNumber": int(payload.get("genomeNumber", 0)),
            "segments": segments,
            "learningDelta": payload.get(
                "learningDelta",
                "search memory, ranking adaptation, transformer reinforcement.",
            ),
            "evolved": bool(payload.get("evolved", False)),
            "source": payload.get("source", "Google search intelligence"),
            "mediaTypes": payload.get("mediaTypes", ["image", "video", "mp4", "mp3"]),
            "createdAt": created_at or now_iso(),
        }

        records = load_memory()
        records = [item for item in records if item.get("id") != record["id"]]
        records.insert(0, record)
        save_memory(records[:5000])

        self._write_json(record, 201)


def run() -> None:
    host, port = resolve_bind_host_and_port()
    ensure_memory_file()

    server = ThreadingHTTPServer((host, port), CatalystHandler)
    print("Catalyst6 Demon VPS Memory API")
    print(f"Listening on {host}:{port}")
    print(f"Configured VPS target: {read_text_file(IP_FILE)}")
    print(f"Allowed origin: {ALLOWED_ORIGIN}")
    print(f"API key file: {API_KEY_FILE}")
    print(f"Memory file: {MEMORY_FILE}")
    server.serve_forever()


if __name__ == "__main__":
    run()
