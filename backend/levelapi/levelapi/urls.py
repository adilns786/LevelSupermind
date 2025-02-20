"""
URL configuration for levelapi project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from .views import get_company_and_play_store_details,get_reviews, get_reddit_posts,get_quora_data

urlpatterns = [
    path('admin/', admin.site.urls),
    path('scrape-data/', get_company_and_play_store_details, name='scrape_data'),
    path('scrape-review/', get_reviews, name='get_reviews'),(),
    path('scrape-reddit/', get_reddit_posts, name='get_reddit'),
    path('scrape-quora/', get_quora_data, name='get_quora_data'), 
]

    