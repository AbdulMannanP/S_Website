"""
app.py — Saeed Luxury Majlis Configurator
Backend API and Template Server with Strict Cache Control.
"""
from flask import Flask, render_template, jsonify, send_from_directory, request
import os

app = Flask(__name__)

# Disable long caching during development so updated JS/CSS always loads
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

# -------------------------------------------------------------------
# ASSET MATRIX DEFINITION
# -------------------------------------------------------------------
# This matrix defines the entire universe of available configurations.
# It is consumed by the JS engine to drive the UI and preload assets.
CONFIG_MATRIX = {
    "shapes": [
        {"id": "U", "label": "شكل U", "sub": "مجلس بثلاثة جدران"},
        {"id": "L", "label": "شكل L", "sub": "مجلس بجدارين"},
        {"id": "single", "label": "قطعة واحدة", "sub": "مقعد متصل"}
    ],
    "materials": [
        {
            "id": "velvet",
            "label": "قطيفة",
            "colors": [
                {"id": "cream", "label": "كريمي", "hex": "#F4EFEA"},
                {"id": "navy", "label": "أزرق ملكي", "hex": "#1B2A47"},
                {"id": "teal", "label": "تيل", "hex": "#184E5B"}
            ]
        },
        {
            "id": "jacquard",
            "label": "جاكار",
            "colors": [
                {"id": "olive", "label": "زيتوني", "hex": "#8A8D63"},
                {"id": "beige", "label": "بيج", "hex": "#D6C7B2"},
                {"id": "grey", "label": "رمادي", "hex": "#7A7D80"}
            ]
        },
        {
            "id": "leather",
            "label": "جلد",
            "colors": [
                {"id": "camel", "label": "جملي", "hex": "#C17A43"},
                {"id": "espresso", "label": "إسبريسو", "hex": "#3D261C"},
                {"id": "black", "label": "أسود", "hex": "#1A1A1A"}
            ]
        }
    ],
    "angles": [
        {"id": "front", "label": "أمامي"},
        {"id": "three_quarter", "label": "٣/٤"},
        {"id": "side", "label": "جانبي"}
    ]
}

def generate_image_path(shape, material, color, angle):
    """Generates the semantic file path for a specific configuration."""
    # Example: /static/img/mockups/u_velvet_navy_front.jpg
    return f"/static/img/mockups/{shape}_{material}_{color}_{angle}.jpg"

# -------------------------------------------------------------------
# ROUTES
# -------------------------------------------------------------------

@app.route("/")
def index():
    """Serves the main SPA interface."""
    return render_template("index.html")

@app.route("/api/configurator", methods=["GET"])
def get_configurator_data():
    """
    API Endpoint returning the comprehensive matrix and asset paths.
    The frontend uses this to build the UI and power the intelligent preloader.
    """
    # Dynamically inject the semantic image paths into the matrix response
    # to keep the frontend completely decoupled from path building logic.
    matrix_with_paths = {
        "schema": CONFIG_MATRIX,
        "assetMap": {}
    }
    
    for shape in CONFIG_MATRIX["shapes"]:
        s_id = shape["id"]
        for mat in CONFIG_MATRIX["materials"]:
            m_id = mat["id"]
            for col in mat["colors"]:
                c_id = col["id"]
                for ang in CONFIG_MATRIX["angles"]:
                    a_id = ang["id"]
                    key = f"{s_id}_{m_id}_{c_id}_{a_id}"
                    matrix_with_paths["assetMap"][key] = generate_image_path(s_id, m_id, c_id, a_id)
                    
    return jsonify(matrix_with_paths)

@app.after_request
def add_header(response):
    """Ensure dynamic API responses aren't strictly cached by the browser."""
    if 'api' in request.path:
        response.cache_control.no_cache = True
        response.cache_control.must_revalidate = True
        response.cache_control.max_age = 0
    return response

if __name__ == "__main__":
    app.run(debug=True, port=5001)
