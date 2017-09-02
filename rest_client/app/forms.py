from django import forms

class LoginForm(forms.Form):
	username = forms.CharField(max_length=20)
	password = forms.CharField(max_length=20, widget=forms.PasswordInput)

class SigninForm(forms.Form):
	username = forms.CharField(max_length=20)
	password = forms.CharField(max_length=20, widget=forms.PasswordInput)

class BookmarkForm(forms.Form):
	url = forms.CharField(max_length=300)