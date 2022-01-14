import os
import sys
import json
from flask import Flask, render_template, request, redirect, url_for
import base64
from io import BytesIO
from PIL import Image
import numpy as np
import cv2
from auxiliary import *

from flask_jsglue import JSGlue

#set FLASK_ENV=development
app = Flask(__name__)
jsglue = JSGlue(app)


@app.route('/getpythondata')
def get_python_data():
    return json.dumps(pythondata)

@app.route('/', methods=['GET', 'POST'])
def paintapp():
    if request.method == 'GET':
        return render_template("paint.html")
    if request.method == 'POST':
        data = request.form['save_cdata']
        canvas_image = request.form['save_image']

        offset = canvas_image.index(',')+1
        img_bytes = base64.b64decode(canvas_image[offset:])
        img = Image.open(BytesIO(img_bytes))
        img  = np.array(img)

        prediction, index, outputs = get_prediction(img)
        probabilities_string = get_probabilities_string(outputs, index)

        pythondata = {"prediction": "None", "probabilities-string": "None", "probabilities": [0,0,0,0,0], "order": [0,1,2,3,4], "destinations": ["Education", "Research and Internships", "Projects", "About", "Contact"]}

        pythondata["prediction"] =  prediction
        pythondata["probabilities_string"] = probabilities_string

        orders_list = np.argsort(-1*np.array(outputs)).tolist()

        probs_list = outputs

        orders_map = {}
        probs_map = {}
        labels = ["education", "research", "projects", "about", "contact"]
        for i in range(len(labels)):
            orders_map[labels[i]] = orders_list.index(i)
            probs_map[labels[i]] = probs_list[i]



        pythondata["probabilities"] = probs_map
        pythondata["order"] = orders_map

        return json.dumps(pythondata)
        # render_template("base.html")

@app.route('/test', methods=['GET', 'POST'])
def themepaint():
    if request.method == 'POST':
        data = request.form['save_cdata']
        canvas_image = request.form['save_image']

        offset = canvas_image.index(',')+1
        img_bytes = base64.b64decode(canvas_image[offset:])
        img = Image.open(BytesIO(img_bytes))
        img  = np.array(img)

        prediction, index, outputs = get_theme_prediction(img)

        pythondata = {"prediction": "None", "probabilities": [0,0,0,0,0], "order": [0,1,2,3,4]}

        pythondata["prediction"] =  prediction

        orders_list = np.argsort(-1*np.array(outputs)).tolist()

        probs_list = outputs

        orders_map = {}
        probs_map = {}
        labels = ["sun", "moon"]
        for i in range(len(labels)):
            orders_map[labels[i]] = orders_list.index(i)
            probs_map[labels[i]] = probs_list[i]

        pythondata["probabilities"] = probs_map
        pythondata["order"] = orders_map

        return json.dumps(pythondata)

@app.route('/education')
def education():
    return render_template('education.html')
@app.route('/research_internships')
def research_internships():
    return render_template('research_internships.html')
@app.route('/projects')
def projects():
    return render_template('projects.html')
@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/learn_more')
def learn_more():
    return render_template('learn_more.html')


def run():
    # port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=8080)

if __name__ == '__main__':
    run()
