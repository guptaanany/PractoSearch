from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship, backref
from database import Base


class Clinic(Base):
	__tablename__ = 'CLINIC_MASTER'
	id = Column("ID", Integer, primary_key=True,autoincrement=True)
	name = Column("NAME", String(50), unique=True)
	location = Column("LOCATION", String(100))
	city = Column("CITY", String(50))
	address = Column("ADDRESS",String(150))
	doctors = relationship("Doctor",
                    secondary="DOC_CLINIC_ASSOC",
                    backref="clinics",
                    cascade="all,delete",
                    passive_deletes=True)

	def __init__(self,name=None,location=None,city=None,address=None):
		self.name = name;
		self.location = location;
		self.city = city;
		self.address = address;


class Doctor(Base):
    __tablename__ = 'DOCTOR_MASTER'
    id = Column("ID", Integer, primary_key=True,autoincrement=True)
    name = Column("NAME", String(50), unique=True)
    qual = Column("QUALIFICATION", String(50))
    exp = Column("EXPERIENCE", Integer)
    spec = Column("SPEC_ID", Integer, ForeignKey('SPECIALIZATION_MASTER.ID'))
    mobileNumber = Column("MOBILENUMBER", String(20))
    email = Column("EMAIL", String(30))


    def __init__(self, name=None, qual = None, exp = None, mobileNumber = None, email=None, specialization=None):
        self.name = name
        self.qual = qual
        self.exp = exp
        self.mobileNumber = mobileNumber
        self.email = email 
        self.specialization= specialization
 
    def __repr__(self):
        return '<User %r>' % (self.name)

class Specialization(Base):
    __tablename__ = 'SPECIALIZATION_MASTER'
    id = Column("ID", Integer, primary_key=True,autoincrement=True)
    name = Column("SPEC_NAME", String(50), unique=True)
    doctors = relationship('Doctor', backref="specialization", lazy='dynamic')

    def __init__(self,name):
    	self.name = name;

class DoctorClinic(Base):
	__tablename__ = 'DOC_CLINIC_ASSOC'
	doc_id = Column("DOC_ID", Integer, ForeignKey('CLINIC_MASTER.ID', ondelete='CASCADE'), primary_key=True)
	clinic_id = Column("CLINIC_ID", Integer, ForeignKey('DOCTOR_MASTER.ID', ondelete='CASCADE'), primary_key=True)
