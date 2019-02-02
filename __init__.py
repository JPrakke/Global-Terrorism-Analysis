#Imports:
from flask import Flask, jsonify, render_template
from settings import username, password
import sqlalchemy
import simplejson as json
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, MetaData

#Set up the database
#source activate Project3ENV

connection_string = (f"{username}:{password}@127.0.0.1:3306/global_terrorism_db")

engine = create_engine(f'mysql://{connection_string}',encoding='utf-8')

Base = automap_base()
Base.prepare(engine, reflect=True)

GTD = Base.classes.global_terrorism_new
# Happiness = Base.classes.world_happiness_index

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

@app.route("/api")
def api():
    """ returns api.html and list of api routes """
    api_routes = [
        #"api/v1.0/WeaponType",
        #"api/v1.0/Lattitude",
        #"api/v1.0/Longitude",
    ]
    return render_template("api.html")
@app.route("/api/v1.0/<year>")
def year(year):

    """ json of data by year """
    queries =[GTD.latitude,GTD.longitude]
    results = session.query(*queries).\
    filter(GTD.iyear >= year).all()
    print(results)
    return json.dumps(results)


if __name__ == '__main__':
    app.run(debug=True)
