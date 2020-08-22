import os
import pymongo
from flask import Flask, render_template, redirect, request, url_for
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
if os.path.exists("env.py"):
    import env


app = Flask(__name__)
app.config["MONGO_URI"] =  # This needs filling in.
app.config["DATABASE"] = "appointmentPlanner"

mongo = PyMongo(app)
timeline_opts = ["09:00", "09:30", "10:00", "10:30",
                 "11:00", "11:30", "12:00", "12:30",
                 "13:00", "13:30", "14:00", "14:30",
                 "15:00", "15:30", "16:00", "16:30",
                 "17:00", "17:30"]


@app.route('/')
@app.route('/get_login')
def get_login():
    return render_template('login.html')


@app.route('/check_login', methods=['POST'])
def check_login():
    error = None
    resp_wrong_user = "This user does not exist. Please check the username"
    resp_wrong_pword = "This password does not match the username.\
                        Please re-enter your password."
    resp_no_pword = "Please enter a password"
    profile_user_input = request.form.get('profile_user')
    profiles = mongo.db.profiles.find({'profile_user': profile_user_input})
    profile_pword_input = request.form.get('profile_pword')
    for profile in profiles:
        print(profile)
        if len(profile) == 0:
            error = resp_wrong_user
        else:
            profile_pword = profile["profile_pword"]
            if len(profile_pword_input) == 0:
                error = resp_no_pword
            elif str(profile_pword_input) != str(profile_pword):
                error = resp_wrong_pword
            else:
                prof_id = profile["_id"]
                return redirect(url_for('get_schedule', prof_id=prof_id))
    return render_template('login.html', error=error)


@app.route('/new_account')
def new_account():
    profiles = mongo.db.profiles.find()
    profile_users = []
    profile_emails = []
    for profile in profiles:
        profile_emails.append(profile['profile_email'])
        profile_users.append(profile['profile_user'])
    return render_template('new-account.html',
                           profile_users=profile_users)


@app.route('/insert_account', methods=['POST'])
def insert_account():
    profiles = mongo.db.profiles
    profiles.insert_one(request.form.to_dict())
    return redirect(url_for('get_login'))


@app.route('/get_schedule/<prof_id>')
def get_schedule(prof_id):
    my_profile = mongo.db.profiles.find({"_id": ObjectId(prof_id)})
    clients = mongo.db.clients.find({'profile_id': prof_id})
    clientlist = mongo.db.clients.find({'profile_id': prof_id})
    appointments = mongo.db.appointments.find({'profile_id': prof_id})
    appointments.sort([('start_date', -1), ('start_time', -1)])
    return render_template('base.html',
                           my_profile=my_profile,
                           prof_id=prof_id,
                           clientlist=clientlist,
                           clients=clients,
                           appointments=appointments)


@app.route('/see_app_details/<prof_id>/<app_id>')
def see_app_details(prof_id, app_id):
    my_profile = mongo.db.profiles.find({"_id": ObjectId(prof_id)})
    clients = mongo.db.clients.find({'profile_id': prof_id})
    appointments = mongo.db.appointments.find({'profile_id': prof_id})
    appointment = mongo.db.appointments.find_one({"_id": ObjectId(app_id)})
    return render_template('appointment.html',
                           my_profile=my_profile,
                           prof_id=prof_id,
                           the_app=appointment,
                           appointments=appointments,
                           clientlist=clients)


@app.route('/create_appointment/<prof_id>')
def create_appointment(prof_id):
    my_profile = mongo.db.profiles.find({"_id": ObjectId(prof_id)})
    clientlist = mongo.db.clients.find({'profile_id': prof_id})
    allclients = mongo.db.clients.find({'profile_id': prof_id})
    appointments = mongo.db.appointments.find({'profile_id': prof_id})
    return render_template('new-app.html',
                           my_profile=my_profile,
                           prof_id=prof_id,
                           timeline_opts=timeline_opts,
                           appointments=appointments,
                           clientlist=clientlist,
                           allclients=allclients)


@app.route('/create_appointment_with_client/<prof_id>/<client_id>')
def create_appointment_with_client(prof_id, client_id):
    my_profile = mongo.db.profiles.find({"_id": ObjectId(prof_id)})
    clientlist = mongo.db.clients.find({'profile_id': prof_id})
    allclients = mongo.db.clients.find({'profile_id': prof_id})
    appointments = mongo.db.appointments.find({'profile_id': prof_id})
    return render_template('new-app.html',
                           my_profile=my_profile,
                           prof_id=prof_id,
                           client_id=client_id,
                           timeline_opts=timeline_opts,
                           appointments=appointments,
                           clientlist=clientlist,
                           allclients=allclients)


@app.route('/insert_appointment/<prof_id>', methods=['POST'])
def insert_appointment(prof_id):
    appointments = mongo.db.appointments
    client_id = request.form.get('client_id')
    this_client = mongo.db.clients.find_one({'_id': ObjectId(client_id)})
    client_name = this_client['first']+" "+this_client['last']
    start_time = request.form.get('start_time')
    print(start_time)
    start_time_float = float(start_time[0:2])
    if start_time[3] == "3":
        start_time_float += 0.5
    end_time = request.form.get('end_time')
    end_time_float = float(end_time[0:2])
    if end_time[3] == "3":
        end_time_float += 0.5
    appointment_duration = (end_time_float-start_time_float)*2
    app_id = appointments.insert_one({
        'profile_id': prof_id,
        'client_id': client_id,
        'client_name': client_name,
        'start_time': start_time,
        'end_time': end_time,
        'appointment_duration': appointment_duration,
        'start_date': request.form.get('start_date'),
        'appointment_notes': request.form.get('appointment_notes')
    })
    return redirect(url_for('see_app_details',
                            prof_id=prof_id,
                            app_id=app_id.inserted_id))


@app.route('/edit_appointment/<prof_id>/<app_id>')
def edit_appointment(prof_id, app_id):
    my_profile = mongo.db.profiles.find({"_id": ObjectId(prof_id)})
    appointment = mongo.db.appointments.find_one({"_id": ObjectId(app_id)})
    clientlist = mongo.db.clients.find({'profile_id': prof_id})
    allclients = mongo.db.clients.find({'profile_id': prof_id})
    return render_template('edit-app.html',
                           my_profile=my_profile,
                           prof_id=prof_id,
                           the_app=appointment,
                           appointments=mongo.db.appointments.find(),
                           timeline_opts=timeline_opts,
                           clientlist=clientlist,
                           allclients=allclients)


@app.route('/update_appointment/<prof_id>/<app_id>', methods=["POST"])
def update_appointment(prof_id, app_id):
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
    return redirect(url_for('see_app_details', prof_id=prof_id, app_id=app_id))


@app.route('/delete_appointment/<prof_id>/<app_id>')
def delete_appointment(prof_id, app_id):
    mongo.db.appointments.remove({'_id': ObjectId(app_id)})
    return redirect(url_for('get_schedule', prof_id=prof_id))


@app.route('/see_client/<prof_id>/<client_id>')
def see_client(prof_id, client_id):
    my_profile = mongo.db.profiles.find({"_id": ObjectId(prof_id)})
    clientlist = mongo.db.clients.find({'profile_id': prof_id})
    appointments = mongo.db.appointments.find({'profile_id': prof_id})
    the_client = mongo.db.clients.find_one({"_id": ObjectId(client_id)})
    client_appointments = mongo.db.appointments.find({'client_id': client_id})
    client_appointments.sort([('start_date', -1), ('start_time', -1)])
    return render_template('client-details.html',
                           my_profile=my_profile,
                           prof_id=prof_id,
                           client_id=client_id,
                           clientlist=clientlist,
                           client=the_client,
                           appointments=appointments,
                           client_appointments=client_appointments)


@app.route('/create_client/<prof_id>')
def create_client(prof_id):
    my_profile = mongo.db.profiles.find({"_id": ObjectId(prof_id)})
    clientlist = mongo.db.clients.find({'profile_id': prof_id})
    appointments = mongo.db.appointments.find({'profile_id': prof_id})
    return render_template('new-client.html',
                           my_profile=my_profile,
                           prof_id=prof_id,
                           clientlist=clientlist,
                           appointments=appointments)


@app.route('/insert_client/<prof_id>', methods=['POST'])
def insert_client(prof_id):
    clients = mongo.db.clients
    client_id = clients.insert_one(request.form.to_dict())
    return redirect(url_for('see_client',
                            prof_id=prof_id,
                            client_id=client_id.inserted_id))


@app.route('/edit_client/<prof_id>/<client_id>')
def edit_client(prof_id, client_id):
    my_profile = mongo.db.profiles.find({"_id": ObjectId(prof_id)})
    clientlist = mongo.db.clients.find({'profile_id': prof_id})
    allclients = mongo.db.clients.find({'profile_id': prof_id})
    appointments = mongo.db.appointments.find({'profile_id': prof_id})
    the_client = mongo.db.clients.find_one({"_id": ObjectId(client_id)})
    return render_template('edit-client.html',
                           my_profile=my_profile,
                           allclients=allclients,
                           clientlist=clientlist,
                           client=the_client,
                           prof_id=prof_id,
                           appointments=appointments)


@app.route('/update_client/<prof_id>/<client_id>', methods=["POST"])
def update_client(prof_id, client_id):
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
    client_name = request.form.get('first')+" "+request.form.get('last')
    mongo.db.appointments.update_many(
        {'client_id': client_id},
        {'$set':
            {'client_name': client_name}})
    return redirect(url_for('get_schedule', prof_id=prof_id))


@app.route('/delete_client/<prof_id>/<client_id>')
def delete_client(prof_id, client_id):
    mongo.db.clients.remove({'_id': ObjectId(client_id)})
    mongo.db.appointments.remove({'client_id': client_id})
    return redirect(url_for('get_schedule', prof_id=prof_id))


@app.route('/get_profile/<prof_id>')
def get_profile(prof_id):
    my_profile = mongo.db.profiles.find({"_id": ObjectId(prof_id)})
    clientlist = mongo.db.clients.find({'profile_id': prof_id})
    appointments = mongo.db.appointments.find({'profile_id': prof_id})
    the_prof = mongo.db.profiles.find_one({"_id": ObjectId(prof_id)})
    return render_template('profile.html',
                           my_profile=my_profile,
                           prof_id=prof_id,
                           profile=the_prof,
                           clientlist=clientlist,
                           appointments=appointments)


@app.route('/edit_profile/<prof_id>')
def edit_profile(prof_id):
    my_profile = mongo.db.profiles.find({"_id": ObjectId(prof_id)})
    the_prof = mongo.db.profiles.find_one({"_id": ObjectId(prof_id)})
    clientlist = mongo.db.clients.find({'profile_id': prof_id})
    appointments = mongo.db.appointments.find({'profile_id': prof_id})
    return render_template('edit-profile.html',
                           my_profile=my_profile,
                           prof_id=prof_id,
                           profile=the_prof,
                           clientlist=clientlist,
                           appointments=appointments)


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
    })
    return redirect(url_for('get_profile', prof_id=prof_id))


@app.route('/sign_out')
def sign_out():
    return redirect(url_for('get_login'))


if __name__ == '__main__':
    app.run(host=os.environ.get('IP'),
            port=int(os.environ.get('PORT')),
            debug=True)
