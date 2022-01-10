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

#set FLASK_ENV=development
app = Flask(__name__)

pythondata = {"prediction": "None", "probabilities-string": "None", "probabilities": [0,0,0,0,0], "order": [0,1,2,3,4], "destinations": ["Education", "Research and Internships", "Projects", "About", "Contact"]}

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
        # conn = psycopg2.connect(database="paintmyown", user = "nidhin")
        # cur = conn.cursor()
        # cur.execute("INSERT INTO files (name, data, canvas_image) VALUES (%s, %s, %s)", [filename, data, canvas_image])
        # conn.commit()
        # conn.close()
        offset = canvas_image.index(',')+1
        img_bytes = base64.b64decode(canvas_image[offset:])
        img = Image.open(BytesIO(img_bytes))
        img  = np.array(img)


        prediction, index, outputs = get_prediction(img)
        probabilities_string = get_probabilities_string(outputs, index)

        pythondata["prediction"] =  prediction
        pythondata["probabilities_string"] = probabilities_string

        print(outputs)
        orders_list = np.argsort(-1*np.array(outputs)).tolist()
        print(outputs)
        print(orders_list)
        probs_list = outputs

        orders_map = {}
        probs_map = {}
        labels = ["education", "research", "projects", "about", "contact"]
        for i in range(len(labels)):
            orders_map[labels[i]] = orders_list.index(i)
            probs_map[labels[i]] = probs_list[i]



        pythondata["probabilities"] = probs_map
        pythondata["order"] = orders_map

        return render_template("base.html")


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

# @app.route('/education')
@app.route('/go_to_prediction', methods=['GET', 'POST'])
def go_to_prediction():
    print("TESTING")
    print(pythondata["prediction"])
    if pythondata["prediction"] == "Book":
        return render_template('education.html')
    elif pythondata["prediction"] == "Face":
        return render_template('about.html')
    elif pythondata["prediction"] == "Computer":
        return render_template('projects.html')
    elif pythondata["prediction"] == "Brain":
        return render_template('research_internships.html')
    elif pythondata["prediction"] == "Envelope":
        return render_template('projects.html')

    return render_template('paint.html')


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
