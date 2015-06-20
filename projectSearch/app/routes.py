from flask import Flask,request,jsonify
from models import *
import collections
from database import init_database, db_session
from app import app
from sqlalchemy import and_

@app.route('/')
def serveStatic() :
	return app.send_static_file('index.html')

@app.route('/<path:path>')
def static_proxy(path) :
	# send_static_file will guess the correct MIME type
	return app.send_static_file(path)

@app.route('/getDoctorsBySpecialityRegion', methods = ['POST'])
def getDoctorsBySpecialityRegion() :
	post = request.get_json()
	#this post contains 'city' 'locality' and 'specialization'
	app.logger.debug(post['specialization'])
	spec = Specialization.query.filter(Specialization.name==post['specialization']).first()
	app.logger.debug(spec)
	doctorObjectList = db_session.query(Doctor).filter(Doctor.clinics.any(Clinic.location==post['location']), Doctor.clinics.any(Clinic.city==post['city']),Doctor.spec==spec.id).all()
	docsList = []
	doctorDetailsDictionary={}
	for doc in doctorObjectList:
		print doc.clinics
		print doc.specialization.name
		clinicListForADoctor = []
		for clinic in doc.clinics:
			clinicListForADoctor.append({'clinic_name':clinic.name,'clinic_location':clinic.location,'clinic_city':clinic.city,'clinic_address':clinic.address})
		doctorDetailsDictionary = {'name': doc.name, 'qual': doc.qual, 'exp': doc.exp, 'mobileNumber':doc.mobileNumber, 'email':doc.email, 'clinicList':clinicListForADoctor,'spec':{'id':doc.specialization.id,'name':doc.specialization.name}};
		docsList.append(doctorDetailsDictionary);
	return jsonify({'returnCode': "SUCCESS", 'data':docsList, 'errorCode':None})


@app.route('/getSpecializations', methods = ['GET'])
def sendDoctorSpecialities() :
	specialityList = Specialization.query.all()
	specNameList = []
	for speciality in specialityList :
		specNameList.append(speciality.name)
	return jsonify({'returnCode': "SUCCESS", 'data':specNameList, 'errorCode':None})


@app.route('/getCities', methods = ['GET'])
def sendCity() :
	query = db_session.query(Clinic.city.distinct().label('city'))
	cityList = [row.city for row in query.all()]
	#for clinic in clinicList :
	#	cityList.append(clinic.city)
	return jsonify({'returnCode': "SUCCESS", 'data':cityList, 'errorCode':None})

@app.route('/getLocalities', methods = ['POST'])
def sendLocality() :
	post = request.get_json()
	clinicList = Clinic.query.filter(Clinic.city==post['city']).all()
	locationList = []
	for clinic in clinicList :
		locationList.append(clinic.location)
	return jsonify({'returnCode': "SUCCESS", 'data':locationList, 'errorCode':None})

