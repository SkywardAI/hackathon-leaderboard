import os
import re
from kaggle.api.kaggle_api_extended import KaggleApi

os.system("rm -rf hackathon-converted-md && rm -rf rmit-gen-ai-and-cyber-security-hackathon && mkdir rmit-gen-ai-and-cyber-security-hackathon && mkdir hackathon-converted-md")

api = KaggleApi()
api.authenticate()

# Specify the competition name
competition_ref = 'rmit-gen-ai-and-cyber-security-hackathon'

# Fetch all notebooks (kernels) for the competition
pattern = re.compile(r"^.+-challenge-\d+-submission$", re.IGNORECASE)
notebooks = api.kernels_list(competition=competition_ref, page_size=200)
notebooks = [n for n in notebooks if pattern.match(n.ref.split('/')[-1])]

for notebook in notebooks:
    notebook_ref = f"{notebook.ref}"
    api.kernels_pull(notebook_ref, path=competition_ref)

os.system("jupyter nbconvert --to markdown rmit-gen-ai-and-cyber-security-hackathon/* --output-dir hackathon-converted-md")