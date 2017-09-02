# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, redirect

import services
from forms import LoginForm, SigninForm, BookmarkForm

# Python logging package
import logging
logger = logging.getLogger('django')

def isLogged(request):
	return 'user' in request.session and request.session['user'] != None

# Create your views here.
def index(request):
	if isLogged(request):
		return render(request, 'app/index.html')
	else:
		return redirect('/app/login')

def login(request):
	err = ''
	logged = isLogged(request)

	if not logged:
		if request.method == 'POST':
			form = LoginForm(request.POST)

			if form.is_valid():
				username = form.cleaned_data['username']
				password = form.cleaned_data['password']
				user = { 'username': username, 'password': password }

				try:
					services.login(user)
					request.session['user'] = user
					return redirect('/app/')
				except:
					err = 'Invalid access.'
		else:
			form = LoginForm()
	else:
		err = 'User already logged in.'
		form = None

	return render(request, 'app/login/loggedin.html', {'form': form, 'err': err, 'logged': logged})

def signup(request):
	err = ''

	if request.method == 'POST':
		form = SigninForm(request.POST)

		if form.is_valid():
			username = form.cleaned_data['username']
			password = form.cleaned_data['password']
			user = { 'username': username, 'password': password }
			try:
				sign = services.signup(user)
				if sign:
					request.session['user'] = user
					return redirect('/app/user/' + sign)
			except:
				err = 'Invalid username.'
	else:
		form = SigninForm()

	return render(request, 'app/login/signup.html', {'form': form, 'err': err})

def logout(request):
	if isLogged(request):
		request.session['user'] = None

	return redirect('/app/login')

# USER
def list_users(request):
	data = []
	if isLogged(request):
		admin = services.isAdmin(request.session['user'])
		data = services.list_users(request.session['user'])
		return render(request, 'app/user/list_users.html', { 'data': data, 'admin': admin })
	else:
		return redirect('/app/login')

def read_user(request, pk):
	data = []
	if isLogged(request):
		data = services.read_user(request.session['user'], pk)
		return render(request, 'app/user/read_user.html', { 'data': data })
	else:
		return redirect('/app/login')

def delete_user(request, pk):
	data = []
	if isLogged(request):
		data = services.delete_user(request.session['user'], pk)
		return redirect('/app/users')
	else:
		return redirect('/app/login')

def toggle_admin(request, pk):
	data = []
	if isLogged(request):
		userData = services.read_user(request.session['user'], pk)
		newData = {}

		if userData['admin'] == False:
			newData['admin'] = 'true'
		else:
			newData['admin'] = 'false'
		
		services.update_user(request.session['user'], pk, newData)
		return redirect('/app/users')
	else:
		return redirect('/app/login')

# BOOKMARK
def list_bookmarks(request):
	data = []
	if isLogged(request):
		data = services.list_bookmarks(request.session['user'])
		return render(request, 'app/bookmark/list_bookmarks.html', { 'data': data })
	else:
		return redirect('/app/login')

def create_bookmark(request):
	err = ''

	if request.method == 'POST':
		form = BookmarkForm(request.POST)

		if form.is_valid():
			url = form.cleaned_data['url']
			bookmark = { 'url': url }
			try:
				create = services.create_bookmark(request.session['user'], bookmark)
				if create:
					return redirect('/app/bookmarks')
			except:
				err = 'Invalid data.'
	else:
		form = BookmarkForm()

	return render(request, 'app/bookmark/create_bookmark.html', {'form': form, 'err': err})

def update_bookmark(request, pk):
	err = ''

	bookmark = services.read_bookmark(request.session['user'], pk)

	if request.method == 'POST':
		form = BookmarkForm(request.POST)

		if form.is_valid():
			url = form.cleaned_data['url']
			bookmark = { 'url': url }
			try:
				create = services.update_bookmark(request.session['user'], bookmark, pk)
				if create:
					return redirect('/app/bookmarks')
			except:
				err = 'Invalid data.'
	else:
		form = BookmarkForm(initial=bookmark)

	return render(request, 'app/bookmark/update_bookmark.html', {'form': form, 'err': err, 'id': pk})

def delete_bookmark(request, pk):
	data = []
	if isLogged(request):
		data = services.delete_bookmark(request.session['user'], pk)
		return redirect('/app/bookmarks')
	else:
		return redirect('/app/login')