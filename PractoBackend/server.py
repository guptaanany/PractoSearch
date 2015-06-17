from flask import Flask,request
from flask.ext.mysql import MySQL

mysql=MySQL()
app = Flask(__name__)
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = ''
app.config['MYSQL_DATABASE_DB'] = 'PractoSearch'
app.config['MYSQL_DATABASE_HOST'] = 'localhost:3306'
mysql.init_app(app)

app = Flask(__name__);

@app.route('/')
def serveStatic():
	return app.send_static_file('index.html');

@app.route('/<path:path>')
def static_proxy(path):
  # send_static_file will guess the correct MIME type
  return app.send_static_file(path)

@app.route('/getAllDoctors', methods = ['POST'])
def getAllDoctors():
	
	return "got it";

if __name__ == '__main__':
	app.run(host='0.0.0.0')