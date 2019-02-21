# After running script be sure to run the sql queries provided
# in updateDB.sql

import pandas as pd
from settings import username, password
from sqlalchemy import create_engine
print("========================================================================================")
print("================================Script Initalizing...===================================")
print("========================================================================================")
whi_file = "database/Data/WHI.csv"
whi_df = pd.read_csv(whi_file)


gtd_file = "database/Data/GTD.csv"


gtd_df = pd.read_csv(gtd_file, encoding = 'iso-8859-1')

connection_string = (f"{username}:{password}@127.0.0.1:3306")
engine = create_engine(f'mysql://{connection_string}',encoding='iso-8859-1', connect_args={'connect_timeout': 10})

engine.execute("CREATE DATABASE global_terrorism_db")
engine.execute("USE global_terrorism_db")
print("Database Created")

whi_df
whi_df = whi_df[['country','year','Life Ladder']]
whi_df = whi_df.reset_index()
whi_df.set_index("index",inplace=True)

whi_df
whi_df = whi_df.rename(columns={'Life Ladder':'life_ladder'})

print("Creating Happiness Table ..")
whi_df.to_sql(name='world_happiness_index', con=engine, if_exists='append', index=False)
print("Happiness Table created")
gtd_df.head()
gtd_df = gtd_df.reset_index()
gtd_df.set_index("index",inplace=True)

gtd_2000df = gtd_df.drop(gtd_df.index[0:65943])

gtd_2000df = gtd_2000df.reset_index()
gtd_2000df.set_index("index",inplace=True)

gtd_2k1df = gtd_2000df.iloc[0:10000]

gtd_2k2df = gtd_2000df.iloc[10000:20000]

gtd_2k3df = gtd_2000df.iloc[20000:30000]
gtd_2k4df = gtd_2000df.iloc[30000:40000]
gtd_2k5df = gtd_2000df.iloc[40000:50000]
gtd_2k6df = gtd_2000df.iloc[50000:60000]
gtd_2k7df = gtd_2000df.iloc[60000:70000]
gtd_2k8df = gtd_2000df.iloc[70000:80000]
gtd_2k9df = gtd_2000df.iloc[80000:90000]
gtd_2k10df = gtd_2000df.iloc[90000:99801]

print("Creating Global Terrorism Table ..")
print("Global Terrorism Table pt.1")
gtd_2k1df.to_sql(name='global_terrorism', con=engine, if_exists='append', index=False)
print("Global Terrorism Table pt.2")
gtd_2k2df.to_sql(name='global_terrorism', con=engine, if_exists='append', index=False)
print("Global Terrorism Table pt.3")
gtd_2k3df.to_sql(name='global_terrorism', con=engine, if_exists='append', index=False)
print("Global Terrorism Table pt.4")
gtd_2k4df.to_sql(name='global_terrorism', con=engine, if_exists='append', index=False)
print("Global Terrorism Table pt.5")
gtd_2k5df.to_sql(name='global_terrorism', con=engine, if_exists='append', index=False)
print("Global Terrorism Table pt.6")
gtd_2k6df.to_sql(name='global_terrorism', con=engine, if_exists='append', index=False)
print("Global Terrorism Table pt.7")
gtd_2k7df.to_sql(name='global_terrorism', con=engine, if_exists='append', index=False)
print("Global Terrorism Table pt.8")
gtd_2k8df.to_sql(name='global_terrorism', con=engine, if_exists='append', index=False)
print("Global Terrorism Table pt.9")
gtd_2k9df.to_sql(name='global_terrorism', con=engine, if_exists='append', index=False)
print("Global Terrorism Table pt.10")
gtd_2k10df.to_sql(name='global_terrorism', con=engine, if_exists='append', index=False)

print("Global Terrorism Table created")
print("========================================================================================")
print("======================Thank you for running the script==================================")
print("====================Please run the MYSql queries provided===============================")
print("=========================in database/updateDB.sql=======================================")
print("========================================================================================")