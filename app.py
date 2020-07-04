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
timeline_opts = ["09:00", "09:30", "10:00", "10:30",
                 "11:00", "11:30", "12:00", "12:30",
                 "13:00", "13:30", "14:00", "14:30",
                 "15:00", "15:30", "16:00", "16:30",
                 "17:00", "17:30"]
prof_id = ""
profquery = { "profile_id": "%s" % prof_id}


@app.route('/')
@app.route('/get_login')
def get_login():
    return render_template('login.html')


@app.route('/check_login', methods=['POST'])
def check_login():
    error = None
    resp_wrong_user = "This user does not exist. Please check the username"
    resp_wrong_pword = "This password does not match the username. Please re-enter your password."
    resp_no_pword = "Please enter a password"
    profile_user_input = request.form.get('profile_user')
    profiles = mongo.db.profiles.find({'profile_user': profile_user_input})
    profile_pword_input = request.form.get('profile_pword')
    for profile in profiles:
        if len(profile) == 0:
            error = resp_wrong_user
        else:
            profile_pword = profile["profile_pword"]
            if len(profile_pword_input) == 0:
                error = resp_no_pword
            elif str(profile_pword_input) != str(profile_pword):
                error = resp_wrong_pword
            else:
                global prof_id
                prof_id = profile["_id"]
                return redirect('get_schedule', prof_id=prof_id)
    return render_template('login.html', error=error)


@app.route('/get_schedule')
def get_schedule():
    prof_id = "5efd0ac854f682912533cb68"
    return render_template('base.html',
                           prof_id=prof_id,
                           clientlist=mongo.db.clients.find(),
                           appointments=mongo.db.appointments.find())


@app.route('/see_app_details/<app_id>')
def see_app_details(app_id):
    appointment = mongo.db.appointments.find_one({"_id": ObjectId(app_id)})
    return render_template('appointment.html',
                           prof_id=prof_id,
                           the_app=appointment,
                           appointments=mongo.db.appointments.find(),
                           clientlist=mongo.db.clients.find())


@app.route('/create_appointment')
def create_appointment():
    return render_template('new-app.html',
                           prof_id=prof_id,
                           timeline_opts=timeline_opts,
                           appointments=mongo.db.appointments.find(),
                           clientlist=mongo.db.clients.find(),
                           clients=mongo.db.clients.find())


@app.route('/insert_appointment', methods=['POST'])
def insert_appointment():
    appointments = mongo.db.appointments
    client_id = request.form.get('client_id')
    this_client = mongo.db.clients.find_one({'_id': ObjectId(client_id)})
    client_name = this_client['first']+" "+this_client['last']
    appointments.insert_one({
        'profile_id': request.form.get('profile_id'),
        'client_id': client_id,
        'client_name': client_name,
        'start_time': request.form.get('start_time'),
        'end_time': request.form.get('end_time'),
        'appointment_duration': request.form.get('appointment_duration'),
        'start_date': request.form.get('start_date'),
        'appointment_notes': request.form.get('appointment_notes')
    })
    return redirect(url_for('get_schedule'))


@app.route('/edit_appointment/<app_id>')
def edit_appointment(app_id):
    appointment = mongo.db.appointments.find_one({"_id": ObjectId(app_id)})
    return render_template('edit-app.html',
                           prof_id=prof_id,
                           the_app=appointment,
                           appointments=mongo.db.appointments.find(),
                           timeline_opts=timeline_opts,
                           clientlist=mongo.db.clients.find(),
                           clients=mongo.db.clients.find())


@app.route('/update_appointment/<app_id>', methods=["POST"])
def update_appointment(app_id):
    appointments = mongo.db.appointments
    client_id = request.form.get('client_id')
    this_client = mongo.db.clients.find_one({'_id': ObjectId(client_id)})
    client_name = this_client['first']+" "+this_client['last']
    appointments.update({'_id': ObjectId(app_id)},
                        {
        'profile_id': request.form.get('profile_id'),
        'client_id': client_id,
        'client_name': client_name,
        'start_time': request.form.get('start_time'),
        'end_time': request.form.get('end_time'),
        'appointment_duration': request.form.get('appointment_duration'),
        'start_date': request.form.get('start_date'),
        'appointment_notes': request.form.get('appointment_notes')
    })
    return redirect(url_for('see_app_details', app_id=app_id))


@app.route('/delete_appointment/<app_id>')
def delete_appointment(app_id):
    mongo.db.appointments.remove({'_id': ObjectId(app_id)})
    return redirect(url_for('get_schedule'))


@app.route('/see_client/<client_id>')
def see_client(client_id):
    the_client = mongo.db.clients.find_one({"_id": ObjectId(client_id)})
    return render_template('client-details.html',
                           prof_id=prof_id,
                           clientlist=mongo.db.clients.find(),
                           client=the_client,
                           appointments=mongo.db.appointments.find())


@app.route('/create_client')
def create_client():
    return render_template('new-client.html',
                           prof_id=prof_id,
                           clientlist=mongo.db.clients.find(),
                           appointments=mongo.db.appointments.find())


@app.route('/insert_client', methods=['POST'])
def insert_client():
    clients = mongo.db.clients
    clients.insert_one(request.form.to_dict())
    return redirect(url_for('get_clients'))


@app.route('/edit_client/<client_id>')
def edit_client(client_id):
    the_client = mongo.db.clients.find_one({"_id": ObjectId(client_id)})
    return render_template('edit-client.html',
                           clients=mongo.db.clients.find(),
                           clientlist=mongo.db.clients.find(),
                           client=the_client,
                           prof_id=prof_id,
                           appointments=mongo.db.appointments.find())


@app.route('/update_client/<client_id>', methods=["POST"])
def update_client(client_id):
    clients = mongo.db.clients
    clients.update({'_id': ObjectId(client_id)},
                   {
        'profile_id': request.form.get('profile_id'),
        'first': request.form.get('first'),
        'last': request.form.get('last'),
        'location': request.form.get('location'),
        'client_email': request.form.get('client_email'),
        'client_tel': request.form.get('client_tel'),
        'additional_notes': request.form.get('additional_notes')
    })
    return redirect(url_for('get_schedule'))


@app.route('/delete_client/<client_id>')
def delete_client(client_id):
    mongo.db.clients.remove({'_id': ObjectId(client_id)})
    return redirect(url_for('get_clients'))


@app.route('/get_profile/<prof_id>')
def get_profile(prof_id):
    the_prof = mongo.db.profiles.find_one({"_id": ObjectId(prof_id)})
    return render_template('profile.html',
                           prof_id=prof_id,
                           profile=the_prof,
                           clientlist=mongo.db.clients.find(),
                           appointments=mongo.db.appointments.find())


@app.route('/edit_profile/<prof_id>')
def edit_profile(prof_id):
    the_prof = mongo.db.profiles.find_one({"_id": ObjectId(prof_id)})
    return render_template('edit-profile.html',
                           prof_id=prof_id,
                           profile=the_prof,
                           clientlist=mongo.db.clients.find(),
                           appointments=mongo.db.appointments.find())


@app.route('/update_profile/<prof_id>', methods=["POST"])
def update_profile(prof_id):
    profiles = mongo.db.profiles
    profiles.update({'_id': ObjectId(prof_id)},
                    {
        'profile_user': request.form.get('profile_user'),
        'profile_pword': request.form.get('profile_pword'),
        'profile_first': request.form.get('profile_first'),
        'profile_last': request.form.get('profile_last'),
        'profile_email': request.form.get('profile_email'),
        'profile_tel': request.form.get('profile_tel'),
        'start_time': request.form.get('start_time'),
        'end_time': request.form.get('end_time')
    })
    return redirect(url_for('get_profile', prof_id=prof_id))


if __name__ == '__main__':
    app.run(host=os.environ.get('IP'),
            port=int(os.environ.get('PORT')),
            debug=True)
