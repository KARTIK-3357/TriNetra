from sqlalchemy import Column, Integer, String, Float, Text
from .database import Base


class MP(Base):
    __tablename__ = "mps"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    state = Column(String)
    constituency = Column(String)
    allocated_amount = Column(Float)


class RecommendedWork(Base):
    __tablename__ = "works_recommended"

    id = Column(Integer, primary_key=True, index=True)
    work_category = Column(String)
    work = Column(Text)
    state = Column(String)
    ida = Column(String)
    mp_name = Column(String)
    constituency = Column(String)
    work_description = Column(Text)
    recommended_date = Column(String)
    recommended_amount = Column(Float)


class SanctionedWork(Base):
    __tablename__ = "works_sanctioned"

    id = Column(Integer, primary_key=True, index=True)
    work_category = Column(String)
    work = Column(Text)
    state = Column(String)
    ida = Column(String)
    mp_name = Column(String)
    constituency = Column(String)
    work_description = Column(Text)
    recommended_date = Column(String)
    sanction_date = Column(String)
    sanction_amount = Column(Float)
    work_status = Column(String)


class CompletedWork(Base):
    __tablename__ = "works_completed"

    id = Column(Integer, primary_key=True, index=True)
    work_category = Column(String)
    work = Column(Text)
    state = Column(String)
    ida = Column(String)
    work_description = Column(Text)
    mp_name = Column(String)
    constituency = Column(String)
    image = Column(Text)
    completion_date = Column(String)
    amount_disbursed = Column(Float)


class Expenditure(Base):
    __tablename__ = "expenditures"

    id = Column(Integer, primary_key=True, index=True)
    state = Column(String)
    work = Column(Text)
    work_id = Column(String, index=True)
    ida = Column(String)
    mp_name = Column(String)
    constituency = Column(String)
    expenditure_date = Column(String)
    vendor_name = Column(String)
    payment_status = Column(String)
    fund_disbursed_amount = Column(Float)


class Calamity(Base):
    __tablename__ = "calamities"

    id = Column(Integer, primary_key=True, index=True)
    calamity_type = Column(String)
    calamity_name = Column(String)
    mp_name = Column(String)
    date_of_consent = Column(String)
    consent_amount = Column(Float)