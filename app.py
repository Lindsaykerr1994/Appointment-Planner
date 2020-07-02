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
@app.route('/get_schedule')
def get_schedule():
    return render_template('schedule.html',
                           prof_id="5efd0ac854f682912533cb68",
                           profiles=mongo.db.profiles.find(),
                           appointments=mongo.db.appointments.find(),
                           clients=mongo.db.clients.find())


@app.route('/create_appointment')
def create_appointment():
    return render_template('new-app.html',
                           prof_id="5efd0ac854f682912533cb68",
                           clients=mongo.db.clients.find())


@app.route('/insert_appointment', methods=['POST'])
def insert_appointment():
    appointments = mongo.db.appointments
    startTimeHour = request.form.get('start_time_hour')
    startTimeMinute = request.form.get('start_time_minute')
    startTime = startTimeHour+":"+startTimeMinute
    appointments.insert_one({
        'profile_id': request.form.get('profile_id'),
        'client_id': request.form.get('client_id'),
        'start_time': startTime,
        'appointment_duration': request.form.get('appointment_duration'),
        'start_date': request.form.get('start_date'),
        'appointment_notes': request.form.get('appointment_notes')
    })
    return redirect(url_for('get_schedule'))


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
                           prof_id="5efd0ac854f682912533cb68",
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
        'profile_id': request.form.get('profile_id'),
        'client_id': request.form.get('client_id'),
        'start_time': startTime,
        'appointment_duration': request.form.get('appointment_duration'),
        'start_date': request.form.get('start_date'),
        'appointment_notes': request.form.get('appointment_notes')
    })
    return redirect(url_for('get_schedule'))


@app.route('/delete_appointment/<appt_id>')
def delete_appointment(appt_id):
    mongo.db.appointments.remove({'_id': ObjectId(appt_id)})
    return redirect(url_for('get_schedule'))


@app.route('/get_clients')
def get_clients():
    all_clients = mongo.db.clients.find()
    return render_template('all-clients.html',
                           prof_id="5efd0ac854f682912533cb68",
                           clients=all_clients)


@app.route('/see_client/<client_id>')
def see_client(client_id):
    the_client = mongo.db.clients.find_one({"_id": ObjectId(client_id)})
    return render_template('client-details.html',
                           prof_id="5efd0ac854f682912533cb68",
                           client=the_client,
                           appointments=mongo.db.appointments.find())


@app.route('/create_client')
def create_client():
    return render_template('new-client.html')


@app.route('/insert_client', methods=['POST'])
def insert_client():
    clients = mongo.db.clients
    clients.insert_one(request.form.to_dict())
    return redirect(url_for('get_clients'))


@app.route('/edit_client/<client_id>')
def edit_client(client_id):
    the_client = mongo.db.clients.find_one({"_id": ObjectId(client_id)})
    return render_template('edit-client.html',
                           client=the_client,
                           prof_id="5efd0ac854f682912533cb68",
                           appointments=mongo.db.appointments.find())


@app.route('/update_client/<client_id>', methods=["POST"])
def update_client(client_id):
    clients = mongo.db.clients
    clients.update({'_id': ObjectId(client_id)},
                   {
        'profile_id': request.form.get('profile_id'),
        'first': request.form.get('first'),
        'last': request.form.get('last'),
        'age': request.form.get('age'),
        'location': request.form.get('location'),
        'client_email': request.form.get('client_email'),
        'client_tel': request.form.get('client_tel'),
        'additional_notes': request.form.get('additional_notes')
    })
    return redirect(url_for('get_clients'))


@app.route('/delete_client/<client_id>')
def delete_client(client_id):
    mongo.db.clients.remove({'_id': ObjectId(client_id)})
    return redirect(url_for('get_clients'))


@app.route('/get_profile/<prof_id>')
def get_profile(prof_id):
    prof_id = "5efd0ac854f682912533cb68"
    the_prof = mongo.db.profiles.find_one({"_id": ObjectId(prof_id)})
    return render_template('profile.html',
                           profile=the_prof)


@app.route('/edit_profile/<prof_id>')
def edit_profile(prof_id):
    the_prof = mongo.db.profiles.find_one({"_id": ObjectId(prof_id)})
    return render_template('edit-profile.html',
                           profile=the_prof)


@app.route('/update_profile/<prof_id>', methods=["POST"])
def update_profile(prof_id):
    profiles = mongo.db.profiles
    profiles.update({'_id': ObjectId(prof_id)},
                    {
        'profile_user': request.form.get('profile_user'),
        'profile_pword': request.form.get('profile_pword'),
        'profile_first': request.form.get('profile_first'),
        'profile_last': request.form.get('profile_last'),
        'start_time': request.form.get('start_time'),
        'end_time': request.form.get('end_time')
    })
    return redirect(url_for('get_profile', prof_id=prof_id))


if __name__ == '__main__':
    app.run(host=os.environ.get('IP'),
            port=int(os.environ.get('PORT')),
            debug=True)
