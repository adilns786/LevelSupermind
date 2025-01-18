import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time
import json
import pandas as pd
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse


# Function to search DuckDuckGo for the company website and extract the URL using Selenium
def search_duckduckgo(query):
    url = f"https://duckduckgo.com/html/?q={query}"

    # Set up Chrome options to run in headless mode (optional)
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run Chrome in headless mode (without UI)

    # Use WebDriverManager to automatically handle ChromeDriver installation
    service = Service(ChromeDriverManager().install())

    # Set up the Selenium WebDriver with options
    driver = webdriver.Chrome(service=service, options=chrome_options)

    try:
        driver.get(url)

        # Wait for the search results to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CLASS_NAME, 'result__url'))
        )

        # Extract search results
        results = driver.find_elements(By.CLASS_NAME, 'result__url')

        if not results:
            print("No search results found")
            return None

        # Return the first valid link (that starts with 'http')
        for result in results:
            link = result.get_attribute('href')
            if "http" in link:
                return link

    finally:
        driver.quit()  # Close the browser after scraping

    return None


# Function to scrape ad-related information from the company website
def scrape_ad_information(company_url):
    # Setup WebDriver with headless option and custom User-Agent
    options = Options()
    options.add_argument('--headless')  # Run in headless mode (no GUI)
    options.add_argument('--disable-gpu')
    options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    # Open the company URL
    driver.get(company_url)

    # Wait for the page to load
    time.sleep(3)  # Adjust this to ensure content loads

    # Initialize a dictionary to store ad-related data
    ad_data = {}

    try:
        # Wait for ad elements to load (if they exist)
        ad_elements = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, 'div.ad, .advertisement, .banner, .promo-text'))
        )
        ad_copy = [ad.text for ad in ad_elements if ad.text.strip() != ""]
    except Exception as e:
        ad_copy = []

    try:
        # Wait for CTA buttons/text to appear
        cta_elements = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, 'button, .cta, .cta-button, .cta-text'))
        )
        cta_buttons = [cta.text for cta in cta_elements if cta.text.strip() != ""]
    except Exception as e:
        cta_buttons = []

    try:
        # Scrape key headlines or value propositions
        headline_elements = driver.find_elements(By.CSS_SELECTOR, 'h1, h2, h3, .headline, .offer-text')
        headlines = [headline.text for headline in headline_elements if headline.text.strip() != ""]
    except Exception as e:
        headlines = []

    try:
        # Scrape promotional banners or offers
        promotion_elements = driver.find_elements(By.CSS_SELECTOR, '.promo-banner, .offer-banner, .deal-banner')
        promotions = [promo.text for promo in promotion_elements if promo.text.strip() != ""]
    except Exception as e:
        promotions = []

    # Close the driver
    driver.quit()

    # Return the collected ad-related data
    ad_data = {
        'ad_copy': ad_copy,
        'cta_buttons': cta_buttons,
        'headlines': headlines,
        'promotions': promotions
    }

    return ad_data


# Function to scrape reviews and ratings from Play Store URL
def scrape_reviews_and_rating(url):
    try:
        # Send HTTP GET request to the URL
        response = requests.get(url)

        # Check if the request was successful
        if response.status_code == 200:
            print(f"Successfully fetched the content from {url}")

            # Parse the HTML content with BeautifulSoup
            soup = BeautifulSoup(response.content, 'html.parser')

            # Find the overall rating (assuming it is inside a div with the class `Jwxk6d` or nearby)
            rating_div = soup.find('div', class_='Jwxk6d')
            overall_rating = None
            if rating_div:
                rating_tag = rating_div.find('span',
                                             {'class': 'EGFGHd'})  # Update with actual class for rating if different
                if rating_tag:
                    overall_rating = rating_tag.get_text(strip=True)

            # Find individual reviews
            reviews = []
            review_divs = soup.find_all('div', class_='h3YV2d')  # Update the class if necessary

            for review_div in review_divs:
                review_text = review_div.get_text(strip=True)
                reviews.append(review_text)

            # Return reviews and overall rating
            return {
                'reviews': reviews,
                'overall_rating': overall_rating
            }
        else:
            print(f"Failed to fetch the content. Status code: {response.status_code}")
            return None

    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None


# API view to scrape company details, Play Store link, ad-related info, and reviews
@api_view(['GET'])
def get_company_and_play_store_details(request):
    company_name = request.GET.get('company_name')

    if not company_name:
        return JsonResponse({"error": "Company name is required"}, status=400)

    # Search for company website
    company_website = search_duckduckgo(f"{company_name} official website")

    if not company_website:
        return JsonResponse({"error": "No website found"}, status=404)

    # Search for Play Store link
    play_store_url = search_duckduckgo(f"{company_name} site:play.google.com")

    if not play_store_url:
        return JsonResponse({"error": "No Play Store link found"}, status=404)

    # Scrape ad-related information from the company website
    ad_information = scrape_ad_information(company_website)

    # Scrape reviews and ratings from the Play Store
    reviews_data = scrape_reviews_and_rating(play_store_url)

    if reviews_data:
        reviews = reviews_data['reviews']
        overall_rating = reviews_data['overall_rating']
    else:
        reviews = []
        overall_rating = None

    # Return the results as a JSON response
    return JsonResponse({
        "company_name": company_name,
        "company_website": company_website,
        "play_store_link": play_store_url,
        "ad_information": ad_information,
        "reviews": reviews,
        "overall_rating": overall_rating
    })
