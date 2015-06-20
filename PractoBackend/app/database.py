from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
 
engine = create_engine('mysql://root@localhost/Practo', convert_unicode=True)
db_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()
 
def init_database():
    import models
    print "Successfully connected to DB"
    Base.metadata.create_all(bind=engine)