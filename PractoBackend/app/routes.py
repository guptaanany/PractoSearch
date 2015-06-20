from flask import Flask,request, jsonify
from models import *
import collections
from database import init_database, db_session
from app import app

@app.route('/')
def serveStatic():
	return app.send_static_file('index.html')

@app.route('/<path:path>')
def static_proxy(path):
  # send_static_file will guess the correct MIME type
  return app.send_static_file(path)

@app.route('/addClinic', methods = ['POST'])
def addClinic():
	post = request.get_json()
	print post
	newClinic = Clinic(post['name'],post['location'],post['city'],post['address'])
	db_session.add(newClinic)
	db_session.commit()
	response = {'returnCode': "SUCCESS", 'data':{}, 'errorCode':None}
	return jsonify(response)

@app.route('/getAllClinics', methods = ['GET'])
def getAllClinics():
	clinicList = Clinic.query.all()
	clinics = []
	for clinic in clinicList:
		clinicObject = {'id': clinic.id, 'name': clinic.name, 'location': clinic.location, 'city':clinic.city, 'address':clinic.address};
		clinics.append(clinicObject);
	return jsonify({'returnCode': "SUCCESS", 'data':clinics, 'errorCode':None})

@app.route('/deleteClinic',methods = ['POST'])
def deleteClinic():
	post = request.get_json()
	clinicToDelete= db_session.query(Clinic).get(post['id'])
	db_session.delete(clinicToDelete)
	db_session.commit()
	response = {'returnCode': "SUCCESS", 'data':{}, 'errorCode':None}
	return jsonify(response)

@app.route('/editClinic', methods =['POST'])
def editClinic():
	post = request.get_json()
	app.logger.debug(post['id'])
	db_session.query(Clinic).filter_by(id = post['id']).update({'name':post['name'],'location':post['location'],'city':post['city'],'address':post['address']})
	db_session.commit()
	response = {'returnCode': "SUCCESS", 'data':{}, 'errorCode':None}
	return jsonify(response)

@app.route('/addDoctor', methods = ['POST'])
def addDoctor():
	post = request.get_json()
	print post
	clinicForDoc = db_session.query(Clinic).get(post['clinicId'])
	specializationForDoc = db_session.query(Specialization).get(post['specId'])
	#the clinic id should already be added otherwise it will not add the doctor and will give an error.... how to handle the error
	docToAdd = Doctor(post['name'],post['qual'],post['exp'],post['mobileNumber'],post['email'],specializationForDoc)

	clinicForDoc.doctors.append(docToAdd)
	db_session.add(docToAdd)
	db_session.commit()
	response = {'returnCode': "SUCCESS", 'data':{}, 'errorCode':None}
	return jsonify(response)

@app.route('/getAllDoctors', methods = ['GET'])
def getAllDoctor():
	doctorList = Doctor.query.all()
	print doctorList
	docs = []
	doctorObject={}
	for doc in doctorList:
		print doc.clinics
		print doc.specialization
		clinicListForADoctor = []
		clinicDetailsForAClinic = {}
		for clinic in doc.clinics:
			clinicListForADoctor.append({'clinic_id':clinic.id, 'clinic_name':clinic.name,'clinic_location':clinic.location,'clinic_city':clinic.city,'clinic_address':clinic.address})
		doctorObject = {'id' : doc.id, 'name': doc.name, 'qual': doc.qual, 'exp': doc.exp, 'mobileNumber':doc.mobileNumber, 'email':doc.email, 'clinicList':clinicListForADoctor, 'spec':{'id':doc.specialization.id,'name':doc.specialization.name}};
		docs.append(doctorObject);
	return jsonify({'returnCode': "SUCCESS", 'data':docs, 'errorCode':None})

@app.route('/deleteDoctor',methods = ['POST'])
def deleteDoctor():
	post = request.get_json()
	doctorToDelete=Doctor.query.get(post['doctorId'])
	db_session.delete(doctorToDelete)
	db_session.commit()
	response = {'returnCode': "SUCCESS", 'data':{}, 'errorCode':None}
	return jsonify(response)

@app.route('/editDoctor',methods =['POST'])
def editDoctor():
	post = request.get_json()
	doc = Doctor.query.filter(Doctor.id==post['id']).first()
	#clinicsOfDoctor = doc.clinics.query.all()
	ClinicToBeUpdated = None;
	app.logger.debug(doc)
	for aClinic in doc.clinics:
		clinicToBeUpdated = Clinic.query.filter(Clinic.id==aClinic.id).first()
		app.logger.debug(clinicToBeUpdated)
		clinicToBeUpdated.doctors.remove(doc)
		db_session.commit()


	doc.name = post['name']
	doc.qual = post['qual']
	doc.exp = post['exp']
	doc.spec = post['specId']
	doc.mobileNumber = post['mobileNumber']
	doc.email = post['email']
	doc.specialization = db_session.query(Specialization).get(post['specId'])
	ClinicToBeUpdated = db_session.query(Clinic).get(post['clinicId'])
	ClinicToBeUpdated.doctors.append(doc)
	db_session.commit()
#	flag=1
#	prevClinicId=post['prevClinicId']
#	for aClinic in clinicsOfDoctor:
#		if aClinic.id == post['clinicId']:
#				flag=0
#
#	if flag==1 :
#		updatedClinic = db_session.query(Clinic).get(prevClinicId)
#		updatedClinic.doctors.delete(doc)
#		db_session.commit()
#
#	spec = db_session.query(Specialization).get(post['specId'])
#	docNew = Doctor(post['name'],post['qual'],post['exp'],post['spec'], post['mobileNumber'],post['email'],spec})
#	
#	currentClinicId = post['clinicId']
#	if flag ==1
#		currentClinc=post['prevClinicId']
#
#	newClinicOfDoc = db_session.query(Clinic).get(currentClinicId)
#	newClinicOfDoc.doctors.append(newClinicOfDoc)
	
	db_session.commit()
	response = {'returnCode': "SUCCESS", 'data':{}, 'errorCode':None}
	return jsonify(response)


# @app.route('/editDoctor',methods =['POST'])
# def editDoctor():
# 	post = request.get_json()
# 	clinicForDoc = db_session.query(Clinic).get(post['clinicId'])
# 	specializationForDoc = db_session.query(Specialization).get(post['specId'])
# 	docToEdit = db_session.query(Doctor).filter_by(id = post['id'])
# 	docToEdit.update({'name':post['name'],'qual':post['qual'],'exp':post['exp'], 'mobileNumber':post['mobileNumber'],'email':post['email'],'spec':post['specId']})
# 	db_session.commit()
# 	clinicForDoc.doctors.append(docToEdit)
# 	db_session.add(docToEdit)
# 	db_session.commit()
# 	response = {'returnCode': "SUCCESS", 'data':{}, 'errorCode':None}
# 	return jsonify(response)

@app.route('/addSpecialization', methods = ['POST'])
def addSpecialization():
	post = request.get_json()
	print post
	specToAdd = Specialization(post['name'])
	db_session.add(specToAdd)
	db_session.commit()
	response = {'returnCode': "SUCCESS", 'data':{}, 'errorCode':None}
	return jsonify(response)

@app.route('/getAllSpecializations', methods = ['GET'])
def getAllSpecializations():
	specializationList = Specialization.query.all()
	specs = []
	for spec in specializationList:
		specObject = {'id':spec.id,'name':spec.name};
		specs.append(specObject);
	return jsonify({'returnCode': "SUCCESS", 'data':specs, 'errorCode':None})
		#doctorObject = {'id': clinic.id, 'name': clinic.name, 'location': clinic.location, 'city':clinic.city, 'address':clinic.address};
		#clinics.append(clinicObject);

@app.route('/deleteSpecialization',methods = ['POST'])
def deleteSpecialization():
	post = request.get_json()
	specializationToDelete=db_session.query(Specialization).get(post['specId'])
	db_session.delete(specializationToDelete)
	db_session.commit()
	response = {'returnCode': "SUCCESS", 'data':{}, 'errorCode':None}
	return jsonify(response)

@app.route('/editSpecialization',methods =['POST'])
def editSpecialization():
	post = request.get_json()
	db_session.query(Specialization).filter_by(id=post['id']).update({'name':post['name']})
	db_session.commit()
	response = {'returnCode': "SUCCESS", 'data':{}, 'errorCode':None}
	return jsonify(response)
