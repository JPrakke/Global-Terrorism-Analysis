#Imports:
from flask import Flask, jsonify, render_template
from settings import username, password
import sqlalchemy
import sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, MetaData

#Set up the database
# TODO: Update connection_string with database name, update bases/classes when database is completed
# source activate Project3ENV

connection_string = (f"{username}:{password}@127.0.0.1:3306/###########")

engine = create_engine(f'mysql://{connection_string)',encoding='utf-8')

Base = automap_base()
Base.prepare(engine, reflect=True)

# WeaponType = Base.classes.WeaponType
# Lattitude = Base.classes.Lattitude
# Longitude = Base.classes.Longitude

session = Session(engine)

# Flask Setup

app = Flask(__name__)

# Routing
# @TODO route api correctly once database is created

@app.route("/")
@app.route("/home")
def home():
    """ home page of website """
    return render_template("index.html")


if __name__ == '__main__'
    app.run(debug=False)
