import os
import pymongo
from flask import Flask, render_template, redirect, request, url_for
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
if os.path.exists("env.py"):
    import env


app = Flask(__name__)
app.config["MONGO_URI"] = os.environ.get("MONGO_URI")
app.config["DATABASE"] = "appointmentPlanner"

mongo = PyMongo(app)


@app.route('/')
@app.route('/get_apppointments')
def get_appointments():
    return render_template('schedule.html',
                           appointments=mongo.db.appointments.find(),
                           clients=mongo.db.clients.find())

@app.route('/create_appointment')
def create_appointment():
    return render_template('new-app.html')


if __name__ == '__main__':
    app.run(host=os.environ.get('IP'),
            port=int(os.environ.get('PORT')),
            debug=True)
