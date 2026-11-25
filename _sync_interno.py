from pathlib import Path
import re

root = Path(__file__).resolve().parent
live = (root / "templo-interno.html").read_text(encoding="utf-8")
start = "    <!-- Container principal -->"
end = "    <script>"
i = live.find(start)
j = live.find(end, i)
if i < 0 or j < 0:
    raise SystemExit("live markers missing")
live_container = live[i:j]
new_funcs = """        function abrirDestino(el) {
            const url = el && el.getAttribute('data-url');
            if (!url) {
                return;
            }
            window.open(url, '_blank', 'noopener,noreferrer');
        }

        function enviarEmail() {
            window.location.href = 'mailto:teris.ofc777@gmail.com';
        }
"""
files = [
    "templo-interno-android-fix.html",
    "templo-interno-fixado.html",
    "templo-interno-mobile-fix.html",
]
pat = re.compile(
    r"\n        function downloadPDF\(filename\) \{.*?\n        function visitarYouTube\(\) \{.*?\n        \}\n",
    re.S,
)
for name in files:
    p = root / name
    text = p.read_text(encoding="utf-8")
    nl = "\r\n" if "\r\n" in text else "\n"
    i = text.find(start)
    j = text.find(end, i)
    if i < 0 or j < 0:
        raise SystemExit(f"markers missing in {name}")
    chunk = live_container.replace("\r\n", "\n").replace("\n", nl)
    text = text[:i] + chunk + text[j:]
    text = text.replace(
        "window.location.href = '../index.html';",
        "window.location.href = './index.html';",
    )
    m = pat.search(text)
    if not m:
        raise SystemExit(f"functions not found in {name}")
    funcs = new_funcs.replace("\r\n", "\n").replace("\n", nl)
    text = text[: m.start()] + nl + funcs + text[m.end() :]
    p.write_text(text, encoding="utf-8")
    print(name, "updated")
