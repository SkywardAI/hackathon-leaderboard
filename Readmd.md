# Download


# 1.For maker
```
node mark.js
```

# connect to the db

```
sqlite3 results.db
```

# check all the results from db

```
select sum(mark) as total_mark, team_name from results where campus like "%melbourne%" group by team_name order by total_mark desc limit 3;
```

# 2.Run the webpage

For running the server
```
npm run dev
```


# columns
filename, mark, mark_str, reason, file_hash, campus, team_name, challenge

# Create table

CREATE TABLE results (filename, mark, mark_str, reason, file_hash, campus, team_name, challenge) 