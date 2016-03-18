csv 2 json

https://atom.io/packages/json-converter

cd api/db-scripts/

mongo --host $MONGO_HOST -u $MONGO_USER -p $MONGO_PASS starc3_dev

# 导入到生产环境

### export from dev server

    mongoexport -u $MONGO_USER -p $MONGO_PASS --host $MONGO_HOST --db starc3_dev --collection resources --out resources.json

### import to prod server

    mongoimport -u $MONGO_PROD_USER -p $MONGO_PROD_PASS --host $MONGO_PROD_HOST --db starc3 --collection resources --upsert resources.json

# 导回到开发环境

### export from prod server

    mongoexport -u $MONGO_PROD_USER -p $MONGO_PROD_PASS --host $MONGO_PROD_HOST --db starc3 --collection resources --out resources.json

### import to dev server

    mongoimport -u $MONGO_USER -p $MONGO_PASS --host $MONGO_HOST --db starc3_dev --collection resources --upsert resources.json

# 导入新数据

    mongoimport -u $MONGO_USER -p $MONGO_PASS --host $MONGO_HOST --db starc3_dev --collection resources --upsert resources_new.json
