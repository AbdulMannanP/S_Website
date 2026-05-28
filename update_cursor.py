import codecs

path = r'd:\Saeed Furniture\frontend\index.html'

with codecs.open(path, 'r', encoding='utf-8') as f:
    content = f.read()

target_css = """    /* Custom Cursor Styles */
    @media (pointer: fine) {
      body, a, button, [role="button"], input, textarea, select { cursor: none !important; }
    }
    .custom-cursor {
      position: fixed;
      top: 0; left: 0;
      width: 10px; height: 10px;
      background: #c9a96e;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: width 0.3s ease, height 0.3s ease, background 0.3s ease, border-radius 0.3s ease;
      display: none;
    }
    @media (pointer: fine) {
      .custom-cursor { display: block; }
    }
    .custom-cursor.active {
      width: 60px; height: 60px;
      background: rgba(201,169,110, 0.15);
      border: 1px solid rgba(201,169,110, 0.6);
      backdrop-filter: blur(2px);
    }"""

replacement_css = """    /* Custom Cursor Styles */
    .custom-cursor {
      position: fixed;
      top: 0; left: 0;
      width: 10px; height: 10px;
      background: #c9a96e;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: width 0.3s ease, height 0.3s ease, background 0.3s ease, border-radius 0.3s ease, opacity 0.3s ease;
      display: none;
      opacity: 0;
    }
    @media (pointer: fine) {
      .custom-cursor { display: block; }
      /* Hide default cursor only when hovering bound elements */
      .cursor-bound { cursor: none !important; }
    }
    .custom-cursor.active {
      opacity: 1;
      width: 60px; height: 60px;
      background: rgba(201,169,110, 0.15);
      border: 1px solid rgba(201,169,110, 0.6);
      backdrop-filter: blur(2px);
    }"""

if target_css in content:
    content = content.replace(target_css, replacement_css)
    with codecs.open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Cursor CSS updated.")
else:
    print("CSS Target not found.")
