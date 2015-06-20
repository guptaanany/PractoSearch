Hi---

This is a tutorial to run the PractoSearch-

Download Mysql and run pip install flask, pip install sqlalchemy

Create a database <db_name> in MySql and update line no. 5 database.py as “sql://root@localhost/<db_name>”(both in projectSearch and PractoBackend)

For the User end, execute - server.py in PractoSearch/projectSearch
	Make PractoSearch directory as a current directory
	Run the command -  python projectSearch/server.py

For the Back end, execute - server.py in PractoSearch/PractoBackend
	Make PractoSearch directory as a current directory
	Run the command - sudo python PractoBackend/server.py