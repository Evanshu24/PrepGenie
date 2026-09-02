from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGODB_URI"))
try:
    client.admin.command("ping")
    print("Connection established")
except Exception as e:
    print(e)

db = client["prepgenie"]
questions_collection = db["questions"]

# from pymongo import MongoClient
# from pymongo.server_api import ServerApi
#
# uri = "mongodb+srv://2003biswaranjan_db_user:DFwuVRqnLroNBF86@questionscluster.sxgzs1g.mongodb.net/?appName=QuestionsCluster"
#
#
# # Create a new client and connect to the server
# client = MongoClient(uri, server_api=ServerApi("1"))
#
# # Send a ping to confirm a successful connection
# try:
#     client.admin.command("ping")
#     print("Pinged your deployment. You successfully connected to MongoDB!")
# except Exception as e:
#     print(e)
