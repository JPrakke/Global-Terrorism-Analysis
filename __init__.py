#Imports:
from flask import Flask, jsonify, render_template
from settings import username, password
import sqlalchemy
import simplejson as json
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, MetaData
from sqlalchemy.pool import StaticPool

#Set up the database
#source activate Project3ENV

connection_string = (f"{username}:{password}@127.0.0.1:3306/global_terrorism_db")

engine = create_engine(f'mysql://{connection_string}'
    ,encoding='utf-8'
    ,poolclass=StaticPool)

Base = automap_base()
Base.prepare(engine, reflect=True)

GTD = Base.classes.global_terrorism_new
Happiness = Base.classes.world_happiness_index

session = Session(engine)

# Flask Setup

app = Flask(__name__)

queries =[
    GTD.iyear,
    GTD.country_txt,
    GTD.latitude,
    GTD.longitude,
    GTD.attacktype1_txt,
    GTD.attacktype2_txt,
    GTD.attacktype3_txt,
    GTD.targtype1_txt,
    GTD.targsubtype1_txt,
    GTD.gname,
    GTD.weaptype1_txt,
    GTD.weapsubtype1_txt,
    GTD.weaptype2_txt,
    GTD.weapsubtype2_txt,
    GTD.nkill,
    GTD.nwound
    ]

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
        "api/v1.0/global_terror/metadata/<year>",
        "api/v1.0/global_terror/<year>",
        "api/v1.0/global_terror/<year>/<weaptype>",
        "api/v1.0/happiness/<year>"
    ]
    return render_template("api.html", api_routes=api_routes)

@app.route("/api/v1.0/global_terror/metadata/<year>")
def meta_data(year):
    """ Return Meta Data for given year """
    results = session.query(*queries).\
    filter(GTD.iyear == year).all()
# TODO : Work out meta data table queries
    year_metadata = {}
    for i in results:
        year_metadata["Year"] = i[0]
        year_metadata["Country"] = i[1]
        year_metadata["Attack Type 1"] = i[4]
        year_metadata["Attack Type 2"] = i[5]
        year_metadata["Attack Type 3"] = i[6]
        year_metadata["Target Type"] = i[7]
        year_metadata["Target Subtype"] =i[8]
    
    print(year_metadata)
    return jsonify(year_metadata)

@app.route("/api/v1.0/global_terror/<year>")
def y(year):
    """ json of data by year """

    results = session.query(*queries).\
        filter(GTD.iyear == year).all()
    
    return jsonify(results)

@app.route("/api/v1.0/global_terror/<year>/<weaptype>")
def w_y(year,weaptype):
    """ json of data by year and weapon type """
#    TODO: work on querying weapontype 2 could build api to have third input? ask group1
    results = session.query(*queries).\
        filter(GTD.iyear == year).\
        filter(GTD.weaptype1_txt == weaptype).all()
    
    return jsonify(results)

@app.route("/api/v1.0/happiness/<year>")
def happiness(year):
    """ json of average global happiness per year """
    results = session.query(func.avg(Happiness.life_ladder).label("average")).\
        filter(Happiness.year == year).all()
    print(results[0])
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)


  # ts = {
    #     "Country":{"name":GTD.country_txt,
    #                "Location":[GTD.latitude,
    #                            GTD.longitude]
                               
    #                 }
    #     }