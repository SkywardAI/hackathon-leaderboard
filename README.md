# Automated Leaderboard System for Hackathon Evaluation Using Large Language Models 

The code for the paper [Automated Leaderboard System for Hackathon Evaluation Using Large Language Models ]()

# Architecture

![](./imgs/image.png)


# Deployment

## How to download the Submissions manually

Preparing [Kaggle API credentials](https://github.com/Kaggle/kaggle-api/blob/main/docs/README.md).

```bash
pip install kaggle
```

Run the file `retrieve-competition.py` it will download and convert all the submission files to .md file.


## How to launch the server

You should have node on your machine. And you are welcome to create a SQLite db file `results.db`

```
npm install
```

```
node index.js
```

## How to run the marking manually

```
node mark.js
```
