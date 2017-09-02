from django.conf.urls import url

from app import views

urlpatterns = [
	url(r'^$', views.index, name='index'),
	# auth
	url(r'^login/$', views.login, name='login'),
	url(r'^logout/$', views.logout, name='logout'),
	url(r'^signup/$', views.signup, name='signup'),

	# user
	url(r'^users/$', views.list_users, name='users'),
	url(r'^user/(?P<pk>\w+)/$', views.read_user, name='read_user'),
	url(r'^user/delete/(?P<pk>\w+)/$', views.delete_user, name='delete_user'),
	url(r'^user/togadmin/(?P<pk>\w+)/$', views.toggle_admin, name='toggle_admin'),

	# bookmark
	url(r'^bookmarks/$', views.list_bookmarks, name='bookmarks'),
	url(r'^bookmark/create/$', views.create_bookmark, name='create_bookmark'),
	url(r'^bookmark/update/(?P<pk>\w+)/$', views.update_bookmark, name='update_bookmark'),
	url(r'^bookmark/delete/(?P<pk>\w+)/$', views.delete_bookmark, name='delete_bookmark'),
]