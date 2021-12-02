import os
import sys
import json
from flask import Flask, render_template, request, redirect, url_for
import psycopg2
import base64
from io import BytesIO
from PIL import Image
import numpy as np
import cv2

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def paintapp():
    if request.method == 'GET':
        return render_template("paint.html")
    if request.method == 'POST':
        data = request.form['save_cdata']
        canvas_image = request.form['save_image']
        # conn = psycopg2.connect(database="paintmyown", user = "nidhin")
        # cur = conn.cursor()
        # cur.execute("INSERT INTO files (name, data, canvas_image) VALUES (%s, %s, %s)", [filename, data, canvas_image])
        # conn.commit()
        # conn.close()
        offset = canvas_image.index(',')+1
        img_bytes = base64.b64decode(canvas_image[offset:])
        img = Image.open(BytesIO(img_bytes))
        img  = np.array(img)
        cv2.imwrite("static/test.png", img)
        return redirect(url_for('save'))


@app.route('/save', methods=['GET', 'POST'])
def save():
    conn = psycopg2.connect(database="paintmyown", user="nidhin")
    cur = conn.cursor()
    cur.execute("SELECT id, name, data, canvas_image from files")
    files = cur.fetchall()
    conn.close()
    return render_template("save.html", files = files )

@app.route('/search', methods=['GET', 'POST'])
def search():
    if request.method == 'GET':
        return render_template("search.html")
    if request.method == 'POST':
        filename = request.form['fname']
        conn = psycopg2.connect(database="paintmyown", user="nidhin")
        cur = conn.cursor()
        cur.execute("select id, name, data, canvas_image from files")
        files = cur.fetchall()
        conn.close()
        return render_template("search.html", files=files, filename=filename)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
