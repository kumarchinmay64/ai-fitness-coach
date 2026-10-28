import os
import re
import subprocess
from pathlib import Path
import markdown_it

BASE = Path(__file__).resolve().parent
MD_PATH = BASE / "AI_Fitness_Coach_Project_Documentation_Report.md"
HTML_PATH = BASE / "report.html"
PDF_PATH = BASE / "AI_Fitness_Coach_Project_Documentation_Report.pdf"

md_content = MD_PATH.read_text(encoding="utf-8")

# Custom transformer for screenshot placeholders:
# Match pattern:
# [INSERT SCREENSHOT X: ...]
# Caption: ...
# Note for Evaluation: ...
def replace_screenshot_placeholders(text):
    pattern = re.compile(
        r'\[INSERT SCREENSHOT (\d+): (.*?)\]\s*\n\s*Caption:\s*(.*?)\s*\n\s*Note for Evaluation:\s*(.*?)(?=\n\n|\Z)',
        re.DOTALL
    )
    def repl(m):
        num = m.group(1)
        title = m.group(2).strip()
        caption = m.group(3).strip()
        note = m.group(4).strip()
        return f"""
<div class="screenshot-container">
  <div class="screenshot-placeholder">
    <div class="camera-icon">📷</div>
    <div class="placeholder-title">[SCREENSHOT {num}: {title}]</div>
    <div class="placeholder-subtitle">High-Resolution Web Interface Capture Area (16:9 Aspect Ratio)</div>
  </div>
  <div class="screenshot-caption">{caption}</div>
  <div class="screenshot-note"><strong>Evaluation Note:</strong> {note}</div>
</div>
"""
    return pattern.sub(repl, text)

processed_md = replace_screenshot_placeholders(md_content)

parser = markdown_it.MarkdownIt("gfm-like").disable("linkify")
rendered_body = parser.render(processed_md)

# Enhance HTML with title page styling and pagination
full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AI Fitness Coach - Project Documentation Report</title>
  <style>
    @page {{
      size: A4;
      margin: 20mm 15mm 20mm 15mm;
      @bottom-right {{
        content: counter(page);
        font-size: 9pt;
        color: #64748b;
      }}
    }}
    
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1e293b;
      line-height: 1.6;
      font-size: 10.5pt;
      margin: 0;
      padding: 0;
      background: #ffffff;
    }}

    /* Title Page */
    .title-page {{
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 90vh;
      border: 3px double #0284c7;
      padding: 40px;
      margin-bottom: 30px;
      box-sizing: border-box;
      background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
    }}

    .title-page h1 {{
      font-size: 24pt;
      font-weight: 900;
      color: #0f172a;
      text-align: center;
      margin-bottom: 12px;
      line-height: 1.25;
      letter-spacing: -0.5px;
      border-bottom: 3px solid #0284c7;
      padding-bottom: 18px;
    }}

    .title-page h2 {{
      font-size: 14pt;
      font-weight: 700;
      color: #0284c7;
      text-align: center;
      margin-top: 0;
      margin-bottom: 30px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }}

    .meta-box {{
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 16px 20px;
      margin: 25px 0;
      font-size: 10pt;
    }}

    .meta-box p {{
      margin: 6px 0;
    }}

    /* Evaluation Table */
    .eval-table {{
      width: 100%;
      border-collapse: collapse;
      margin-top: 25px;
      font-size: 9.5pt;
    }}

    .eval-table th, .eval-table td {{
      border: 1px solid #94a3b8;
      padding: 8px 12px;
      text-align: left;
    }}

    .eval-table th {{
      background: #e2e8f0;
      color: #0f172a;
      font-weight: 700;
    }}

    /* General Typography */
    h1 {{
      font-size: 18pt;
      color: #0f172a;
      margin-top: 28px;
      margin-bottom: 14px;
      font-weight: 800;
      page-break-after: avoid;
    }}

    h2 {{
      font-size: 15pt;
      color: #0369a1;
      margin-top: 26px;
      margin-bottom: 12px;
      font-weight: 700;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 6px;
      page-break-after: avoid;
    }}

    h3 {{
      font-size: 12.5pt;
      color: #0f172a;
      margin-top: 18px;
      margin-bottom: 8px;
      font-weight: 700;
      page-break-after: avoid;
    }}

    h4 {{
      font-size: 11pt;
      color: #334155;
      margin-top: 14px;
      margin-bottom: 6px;
      font-weight: 600;
      page-break-after: avoid;
    }}

    p {{
      margin: 0 0 10px 0;
      text-align: justify;
    }}

    ul, ol {{
      margin: 0 0 12px 0;
      padding-left: 24px;
    }}

    li {{
      margin-bottom: 4px;
    }}

    hr {{
      border: 0;
      border-top: 1px solid #cbd5e1;
      margin: 24px 0;
    }}

    /* Tables */
    table {{
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0 24px 0;
      font-size: 9pt;
      page-break-inside: avoid;
    }}

    th, td {{
      border: 1px solid #cbd5e1;
      padding: 7px 10px;
      text-align: left;
      vertical-align: top;
    }}

    th {{
      background-color: #f1f5f9;
      font-weight: 700;
      color: #0f172a;
    }}

    tr:nth-child(even) {{
      background-color: #f8fafc;
    }}

    /* Code Blocks */
    pre {{
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #0284c7;
      padding: 12px 14px;
      border-radius: 4px;
      font-family: "Consolas", "Courier New", monospace;
      font-size: 8.5pt;
      line-height: 1.45;
      overflow-x: auto;
      margin: 14px 0;
      page-break-inside: avoid;
      color: #0f172a;
    }}

    code {{
      font-family: "Consolas", "Courier New", monospace;
      font-size: 9pt;
      background: #f1f5f9;
      padding: 2px 5px;
      border-radius: 3px;
      color: #0369a1;
    }}

    pre code {{
      background: none;
      padding: 0;
      color: inherit;
    }}

    /* Screenshot Placeholders */
    .screenshot-container {{
      margin: 20px 0 24px 0;
      page-break-inside: avoid;
    }}

    .screenshot-placeholder {{
      border: 2px dashed #0284c7;
      background: #f0f9ff;
      border-radius: 8px;
      padding: 40px 20px;
      text-align: center;
      min-height: 160px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
    }}

    .camera-icon {{
      font-size: 26pt;
      margin-bottom: 8px;
    }}

    .placeholder-title {{
      font-size: 11pt;
      font-weight: 700;
      color: #0369a1;
      letter-spacing: 0.5px;
    }}

    .placeholder-subtitle {{
      font-size: 8.5pt;
      color: #64748b;
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }}

    .screenshot-caption {{
      font-size: 9.5pt;
      font-weight: 700;
      color: #0f172a;
      margin-top: 8px;
      text-align: center;
    }}

    .screenshot-note {{
      font-size: 8.5pt;
      color: #475569;
      font-style: italic;
      margin-top: 3px;
      text-align: center;
      padding: 0 15px;
    }}

    /* Break rules */
    .page-break {{
      page-break-before: always;
    }}

    @media print {{
      body {{
        background: #ffffff;
      }}
      h2 {{
        page-break-before: auto;
      }}
    }}
  </style>
</head>
<body>

{rendered_body}

</body>
</html>
"""

HTML_PATH.write_text(full_html, encoding="utf-8")
print(f"Generated HTML report at: {HTML_PATH}")

# Call Google Chrome headless to convert HTML to PDF
chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
cmd = [
    chrome_path,
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    f"--print-to-pdf={PDF_PATH}",
    str(HTML_PATH)
]

print("Executing Chrome headless print-to-pdf...")
res = subprocess.run(cmd, capture_output=True, text=True)
print("Return code:", res.returncode)
if res.stdout:
    print("STDOUT:", res.stdout)
if res.stderr:
    print("STDERR:", res.stderr)

if PDF_PATH.exists():
    size_kb = PDF_PATH.stat().st_size / 1024
    print(f"SUCCESS: Generated PDF at {PDF_PATH} ({size_kb:.1f} KB)")
else:
    print("ERROR: PDF was not generated.")
