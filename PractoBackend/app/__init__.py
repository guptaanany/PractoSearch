from database import init_database, db_session
from flask import Flask
init_database()

app = Flask('app')

from app import models,routes
