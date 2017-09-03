from django.core.exceptions import PermissionDenied

import requests
import json
import base64
import datetime

# Python logging package
import logging
logger = logging.getLogger('django')

#REST_BASE_URL = 'http://localhost:3000/'
REST_BASE_URL = 'http://restserver:3000/'
REST_DATE_FIELD_FORMAT = "%Y-%m-%dT%H:%M:%S.%fZ"

def fixDate(data, datefield):
	if data:
		if datefield in data:
			data[datefield] = datetime.datetime.strptime(data[datefield], REST_DATE_FIELD_FORMAT)
	return data

def fixId(data):
	if data:
		if '_id' in data:
			data['id'] = data['_id']
	return data

def isAdmin(user):
	me_user = me(user)
	if me_user and ('admin' in me_user):
		return me_user['admin']
	return False

def header(user):
	auth = user['username'] + ':' + user['password']
	return { 'Authorization': 'Basic ' + base64.b64encode(auth) }

def receive_req(req):
	if (req.content == "Unauthorized"):
		raise PermissionDenied('Unauthorized access!')
	else:
		jsonData = json.loads(req.content)
		if 'error' in jsonData:
			raise PermissionDenied('Invalid data!')
		return jsonData

############
# Services #
############

def login(user):
	if user:
		req = requests.get(REST_BASE_URL + 'api/me', headers=header(user))

		jsonData = receive_req(req)
		if not jsonData:
			raise PermissionDenied('Unauthorized access!')
		return True
	raise PermissionDenied('Unauthorized access!')

def signup(user):
	if user:
		req = requests.post(REST_BASE_URL + 'api/users', data=user)
		jsonData = receive_req(req)
		if not jsonData:
			raise PermissionDenied('Unauthorized access!')
		if '_id' in jsonData:
			return jsonData['_id']
	raise PermissionDenied('Unauthorized access!')

# USER
def list_users(user):
	if user:
		req = requests.get(REST_BASE_URL + 'api/users', headers=header(user))
		jsonData = receive_req(req)

		if isinstance(jsonData, list):
			for d in jsonData:
				fixId(fixDate(d, 'updated'))
		else:
			jsonData = [fixId(fixDate(jsonData, 'updated'))]

		return jsonData
	return []

def read_user(user, pk):
	if user and pk:
		req = requests.get(REST_BASE_URL + 'api/users/' + pk, headers=header(user))
		jsonData = receive_req(req)
		return fixId(fixDate(jsonData, 'updated'))
	return []

def update_user(user, pk, userData):
	if user and pk:
		req = requests.put(REST_BASE_URL + 'api/users/' + pk, headers=header(user), data=userData)
		jsonData = receive_req(req)
		return jsonData
	return []

def delete_user(user, pk):
	if user and pk:
		req = requests.delete(REST_BASE_URL + 'api/users/' + pk, headers=header(user))
		jsonData = receive_req(req)
		return jsonData
	return []

def me(user):
	if user:
		req = requests.get(REST_BASE_URL + 'api/me', headers=header(user))
		jsonData = receive_req(req)
		return fixId(fixDate(jsonData, 'updated'))
	return []

# BOOKMARK
def list_bookmarks(user):
	if user:
		req = requests.get(REST_BASE_URL + 'api/bookmarks', headers=header(user))
		jsonData = receive_req(req)

		if isinstance(jsonData, list):
			for d in jsonData:
				fixId(fixDate(d, 'updated'))
		else:
			jsonData = [fixId(fixDate(jsonData, 'updated'))]

		return jsonData
	return []

def read_bookmark(user, pk):
	if user and pk:
		req = requests.get(REST_BASE_URL + 'api/bookmarks/' + pk, headers=header(user))
		jsonData = receive_req(req)
		jsonData = fixId(fixDate(jsonData, 'updated'))

		if isinstance(jsonData, list):
			jsonData = jsonData[0]
		return jsonData

	return []

def create_bookmark(user, bookmark):
	if user and bookmark:
		req = requests.post(REST_BASE_URL + 'api/bookmarks', headers=header(user), data=bookmark)
		jsonData = receive_req(req)
		if not jsonData:
			raise PermissionDenied('Unauthorized access!')
		if '_id' in jsonData:
			return jsonData['_id']
	raise PermissionDenied('Unauthorized access!')

def update_bookmark(user, bookmark, pk):
	if user and bookmark:
		req = requests.put(REST_BASE_URL + 'api/bookmarks/' + pk, headers=header(user), data=bookmark)
		jsonData = receive_req(req)
		if not jsonData:
			raise PermissionDenied('Unauthorized access!')
		if '_id' in jsonData:
			return jsonData['_id']
	raise PermissionDenied('Unauthorized access!')

def delete_bookmark(user, pk):
	if user and pk:
		req = requests.delete(REST_BASE_URL + 'api/bookmarks/' + pk, headers=header(user))
		jsonData = receive_req(req)
		return jsonData
	return []