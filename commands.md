'''bash
 docker run -d  --name devconnect-mongo  -p 27017:27017  -e MONGO_INITDB_ROOT_USERNAME=DevConnect  -e MONGO_INITDB_ROOT_PASSWORD=Your_Password  -v devconnectDB_data:/data/db   mongo
'''