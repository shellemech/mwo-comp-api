import urllib.request
import urllib.error
import requests
import sys
import os

def main():
  mwourl = "https://mwomercs.com/api/v1/matches/{}?api_token={}".format(matchid, apikey)
  getmatchdata(mwourl)

# Get matchdata from MWO
def getmatchdata(url):
  try: 
    request = urllib.request.Request(url)
    result = urllib.request.urlopen(request)
  except urllib.error.HTTPError as e:
    print('MWO API Error: '+e.reason+'. HTTP Error code', e.code)
    sys.exit(1)
  except urllib.error.URLError as e:
    print('MWO API URL Error:'+e.reason)
    sys.exit(1)
  else:
    matchjson = str(result.read(), 'utf-8')
    postmatchdata(matchjson)

# Format and post to Elasticsearch
def postmatchdata(json):
  esobj = '{"index": {"_index": "mwo", "_type": "match", "_id": "'+ matchid +'"}}\n'
  headers = {'Content-Type': 'application/x-ndjson'}
  json+='\n'
  esobj+=json
  try:
    espost = requests.post('http://localhost:9200/_bulk?pretty', auth=requests.auth.HTTPBasicAuth('mwopost', mwopostpw), headers=headers, data=esobj)
  except requests.exceptions.RequestException as e:
    print('Elasticsearch POST Error: ', e)
    sys.exit(1) 
  else:
    output = espost.json()
    try:
      print(output['status'])
    except KeyError:
      print('Success! Match '+ matchid +' has been added to the indexer.')
    else:
      print('Error inserting match '+ matchid +' in to index, check Elasticsearch logs :(')

if __name__ == '__main__':
  matchid = sys.argv[1]
  apikey = os.environ['apikey']
  mwopostpw = os.environ['mwopostpw']
  main()
