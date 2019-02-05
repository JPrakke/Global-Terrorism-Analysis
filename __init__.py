#Imports:
from flask import Flask, jsonify, render_template
from settings import username, password
import sqlalchemy
import simplejson as json
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, desc
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

general_queries =[
    GTD.index1,
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

weap_queries =[
    GTD.weaptype1_txt, 
    GTD.weapsubtype2_txt
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

@app.route("/years")
def years():
    """return list of availible years"""
    year = []
    for value in session.query(GTD.iyear).distinct():
        year.append(value.iyear)
    return jsonify(list(year)[0:])

@app.route("/api/v1.0/global_terror/metadata/<year>")
def meta_data(year):
    """ Return Meta Data for given year """
    
    num_attacks = session.query(func.count(GTD.index1).label("Number of Attacks")).\
        filter(GTD.iyear == year).all()

    num_kill = session.query(func.sum(GTD.nkill).label("Total Fatalities")).\
        filter(GTD.iyear == year).all()

    num_wound = session.query(func.sum(GTD.nwound).label("Total Wounded")).\
        filter(GTD.iyear == year).all()
    
    top_attack_type = session.query(GTD.attacktype1_txt,
        func.count(GTD.index1).label("Top Three Attack Types")).\
        filter(GTD.iyear == year).\
        group_by(GTD.attacktype1_txt).\
        order_by(desc("Top Three Attack Types")).limit(3).all()

    top_weap_type = session.query(*weap_queries,
        func.count(GTD.index1).label("Top Three Weapon Types")).\
        filter(GTD.iyear == year).\
        group_by(*weap_queries).\
        order_by(desc("Top Three Weapon Types")).limit(3).all()

    year_metadata = {
        "METADATA":[{"year":year},
                    num_attacks,
                    top_attack_type,
                    num_kill,
                    num_wound,
                    top_weap_type]
    }
    
    return jsonify(year_metadata)

@app.route("/api/v1.0/global_terror/<year>")
def y(year):
    """ json of data by year """

    results = session.query(*general_queries).\
        filter(GTD.iyear == year).all()
    
    return jsonify(results)

@app.route("/api/v1.0/global_terror/<year>/<weaptype>")
def w_y(year,weaptype):
    """ json of data by year and weapon type """
    results = session.query(*general_queries).\
        filter(GTD.iyear == year).\
        filter(GTD.weaptype1_txt == weaptype).\
        filter((GTD.weaptype2_txt == weaptype)|(GTD.weapsubtype2_txt != weaptype)).all()
    
    return jsonify(results)

@app.route("/api/v1.0/happiness/<year>")
def happiness(year):
    """ json of average global happiness per year """
    queries = [Happiness.country, Happiness.index1]
    
    results = session.query(*queries,
        func.avg(Happiness.life_ladder).label("Averages")).\
        filter(Happiness.year == year).all()
    
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
