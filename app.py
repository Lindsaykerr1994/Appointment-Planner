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
    return render_template('new-app.html',
                           clients=mongo.db.clients.find())


@app.route('/insert_appointment', methods=['POST'])
def insert_appointment():
    appointments = mongo.db.appointments
    startTimeHour = request.form.get('start_time_hour')
    startTimeMinute = request.form.get('start_time_minute')
    startTime = startTimeHour+":"+startTimeMinute
    appointments.insert_one({
        'client_id': request.form.get('client_id'),
        'start_time': startTime,
        'appointment_duration': request.form.get('appointment_duration'),
        'start_date': request.form.get('start_date'),
        'appointment_notes': request.form.get('appointment_notes')
    })
    return redirect(url_for('get_appointments'))


@app.route('/see_appt_details/<appt_id>')
def see_appt_details(appt_id):
    the_appt = mongo.db.appointments.find_one({"_id": ObjectId(appt_id)})
    all_clients = mongo.db.clients.find()
    return render_template('appointment.html',
                           appointment=the_appt,
                           clients=all_clients)


@app.route('/edit_appointment/<appt_id>')
def edit_appointment(appt_id):
    the_appt = mongo.db.appointments.find_one({"_id": ObjectId(appt_id)})
    all_clients = mongo.db.clients.find()
    return render_template('edit-app.html',
                           appointment=the_appt,
                           clients=all_clients)


@app.route('/update_appointment/<appt_id>', methods=["POST"])
def update_appointment(appt_id):
    appointments = mongo.db.appointments
    startTimeHour = request.form.get('start_time_hour')
    startTimeMinute = request.form.get('start_time_minute')
    startTime = startTimeHour+":"+startTimeMinute
    appointments.update({'_id': ObjectId(appt_id)},
                        {
        'client_id': request.form.get('client_id'),
        'start_time': startTime,
        'appointment_duration': request.form.get('appointment_duration'),
        'start_date': request.form.get('start_date'),
        'appointment_notes': request.form.get('appointment_notes')
    })
    return redirect(url_for('get_appointments'))


@app.route('/delete_appointment/<appt_id>')
def delete_task(appt_id):
    mongo.db.appointments.remove({'_id': ObjectId(appt_id)})
    return redirect(url_for('get_appointments'))


@app.route('/see_client/<client_id>')
def see_client(client_id):
    the_client = mongo.db.clients.find_one({"_id": ObjectId(client_id)})
    return render_template('client-details.html',
                           client=the_client,
                           appointments=mongo.db.appointments.find())


if __name__ == '__main__':
    app.run(host=os.environ.get('IP'),
            port=int(os.environ.get('PORT')),
            debug=True)
