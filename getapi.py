from urllib import request, parse
import urllib.request
import requests
import sys
import os

matchid = sys.argv[1]
apikey = os.environ['apikey']
mwourl = "https://mwomercs.com/api/v1/matches/{}?api_token={}".format(matchid, apikey)
print(mwourl)
esobj = '{"index": {"_index": "mwomatch", "_type": "mwomatch"}}\n'
headers = {'Content-Type': 'application/x-ndjson'}

# Get matchdata from MWO
request = urllib.request.Request(mwourl)
result = urllib.request.urlopen(request)
matchjson = str(result.read(), 'utf-8')

# Format and post to Elasticsearch
matchjson+='\n'
esobj+=matchjson
print(esobj)
r = requests.post('http://localhost:9200/_bulk?pretty', headers=headers, data=esobj)
print(r.text)
