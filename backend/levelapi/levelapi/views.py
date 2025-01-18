# app_name/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time


# Shared helper function to search DuckDuckGo
def search_duckduckgo(query):
    url = f"https://duckduckgo.com/html/?q={query}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        return soup
    return None

# Function to search for the company's official website
def search_company_website(company_name):
    query = f"{company_name} official website"
    soup = search_duckduckgo(query)
    if soup:
        for result in soup.find_all('a', class_='result__url'):
            link = result['href']
            if "http" in link:
                return link
    return None

# Function to search for the company's Google Play Store page
def search_play_store_link(company_name):
    query = f"{company_name} site:play.google.com"
    soup = search_duckduckgo(query)
    if soup:
        for result in soup.find_all('a', class_='result__url'):
            link = result['href']
            if "play.google.com/store/apps" in link:
                return link
    return None

# Function to scrape the company website (example: title and first paragraph)
def scrape_website(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        title = soup.title.string if soup.title else "No Title"
        paragraph = soup.find('p').text if soup.find('p') else "No Paragraph found"
        return {"title": title, "paragraph": paragraph}
    else:
        return {"error": f"Failed to retrieve the website. Status code: {response.status_code}"}

# Function to scrape the Play Store page (example: app title)
def scrape_play_store_page(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        title = soup.title.string if soup.title else "No Title"
        return {"app_title": title}
    else:
        return {"error": f"Failed to retrieve the Play Store page. Status code: {response.status_code}"}

# Function to scrape ad-related information from the company website
def scrape_ad_information(company_url):
    options = Options()
    options.add_argument('--headless')  # Run in headless mode (no GUI)
    options.add_argument('--disable-gpu')
    options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    driver.get(company_url)
    time.sleep(3)

    ad_data = {}

    try:
        ad_elements = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, 'div.ad, .advertisement, .banner, .promo-text'))
        )
        ad_copy = [ad.text for ad in ad_elements if ad.text.strip() != ""]
    except Exception:
        ad_copy = []

    try:
        cta_elements = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, 'button, .cta, .cta-button, .cta-text'))
        )
        cta_buttons = [cta.text for cta in cta_elements if cta.text.strip() != ""]
    except Exception:
        cta_buttons = []

    try:
        headline_elements = driver.find_elements(By.CSS_SELECTOR, 'h1, h2, h3, .headline, .offer-text')
        headlines = [headline.text for headline in headline_elements if headline.text.strip() != ""]
    except Exception:
        headlines = []

    try:
        promotion_elements = driver.find_elements(By.CSS_SELECTOR, '.promo-banner, .offer-banner, .deal-banner')
        promotions = [promo.text for promo in promotion_elements if promo.text.strip() != ""]
    except Exception:
        promotions = []

    driver.quit()

    ad_data = {
        'ad_copy': ad_copy,
        'cta_buttons': cta_buttons,
        'headlines': headlines,
        'promotions': promotions
    }

    return ad_data

# Unified API endpoint to get company website, Play Store details, and ad-related information
@api_view(['GET'])
def get_company_and_play_store_details(request):
    company_name = request.GET.get('company_name')  # Get the company name from the request
    if not company_name:
        return Response({"error": "Missing 'company_name' parameter"}, status=400)

    # Search for company website
    website_url = search_company_website(company_name)
    website_details = scrape_website(website_url) if website_url else {"error": "No website found"}

    # Search for Play Store link
    play_store_url = search_play_store_link(company_name)
    play_store_details = scrape_play_store_page(play_store_url) if play_store_url else {"error": "No Play Store link found"}

    # Scrape ad-related information from the company website (if available)
    ad_information = scrape_ad_information(website_url) if website_url else {"error": "No ad-related info found"}

    # Combine results
    return Response({
        "company_details": {
            "website_url": website_url,
            "details": website_details
        },
        "play_store_details": {
            "play_store_url": play_store_url,
            "details": play_store_details
        },
        "ad_information": ad_information
    })
