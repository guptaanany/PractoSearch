from flask import Flask,request,jsonify
from flaskext.mysql import MySQL
import collections
import json

mysql=MySQL()
app = Flask(__name__)
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = ''
app.config['MYSQL_DATABASE_DB'] = 'PractoSearch'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)


@app.route('/')
def serveStatic():
	return app.send_static_file('index.html')

@app.route('/<path:path>')
def static_proxy(path):
  # send_static_file will guess the correct MIME type
  return app.send_static_file(path)

@app.route('/getDoctorsBySpecialityRegion', methods = ['POST'])
def getDoctorsBySpecialityRegion():
	post = request.get_json()
	#print 'ye le saale'
	print post
	cursor=mysql.connect().cursor()
	print "cursor created"
	cursor.execute("SELECT * FROM DOCTOR_MASTER a,CLINIC_MASTER b WHERE b.clinic_city='"+post['city']+"' AND a.doc_clinicId=b.clinic_id");
	
	print "cursor query executed"
	rows=cursor.fetchall()
	print "cursor fetched the results"
	#print 'ye le saale'
	print rows
	# Convert query to row arrays
	results_list = []
	for row in rows:
		data = collections.OrderedDict()
		data['doc_id'] = row[0]
		data['doc_name'] = row[1]
		data['doc_gender'] = row[2]
		data['doc_qual'] = row[3]
		data['doc_exp'] = row[4]
		data['doc_spec'] = row[5]
		data['doc_mobileNumber'] = row[7]
		data['doc_timings'] = row[9]
		data['clinic_id'] = row[10]
		data['clinic_name'] = row[11]
		data['clinic_location'] = row[12]
		data['clinic_city'] = row[13]
		data['clinic_address'] = row[14]
		results_list.append(data)
 	result = collections.OrderedDict()
 	result['returnCode'] = 'SUCCESS'
 	result['data'] = results_list;
 	result['errorCode'] = None
	response = json.dumps(result)
	#j = json.dumps(rowarray_list)
	# Convert query to objects of key-value pairs 
	#conn.close()

	#print post['city']
	return response

if __name__ == '__main__':
	app.run(host='0.0.0.0')