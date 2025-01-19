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
import praw
from playwright.sync_api import sync_playwright

#company_name
#company_url
#subreddit=glasses,query=Lenskart,(competitorname,domain(keyword))
#q=Lenskart(competitorName)

# Initialize Reddit API client with credentials
reddit = praw.Reddit(
    client_id='jjMeVDNHzUYekpwYWYI2RQ',  # Replace with your Reddit API client_id
    client_secret='2RnoBlJ9acE0eT4cW-o6bfpRDC-07w',  # Replace with your Reddit API client_secret
    user_agent='art_finder_v1 by /u/ShravaniDev'  # Replace with your Reddit API user_agent
)


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

# Function to scrape reviews and rating
def scrape_reviews_and_rating(url):
    print(f"Fetching reviews from: {url}")
    try:
        # Send HTTP GET request to the URL
        response = requests.get(url, timeout=10)

        # Check if the request was successful
        if response.status_code == 200:
            print(f"Successfully fetched the content from {url}")

            # Parse the HTML content with BeautifulSoup
            soup = BeautifulSoup(response.content, 'html.parser')

            # Find the overall container (outer_div)
            outer_div = soup.find('div', class_='Jwxk6d')
            if not outer_div:
                print("Outer div not found. Ensure the class name is correct.")
                return None

            reviews = []
            try:
                # Find all review divs within the outer_div
                review_divs = outer_div.find_all('div', class_='h3YV2d')  # Update the class if necessary
                if not review_divs:
                    print("No reviews found inside the outer div.")
                else:
                    for review_div in review_divs:
                        # Extract and clean review text
                        review_text = review_div.get_text(strip=True)
                        reviews.append(review_text)
                        print(f"Review: {review_text}")
            except Exception as e:
                print(f"An error occurred while extracting reviews: {e}")

            # Return reviews and overall rating
            return {
                'reviews': reviews,
                'overall_rating': 0,  # Placeholder for rating
            }
        else:
            print(f"Failed to fetch the content. Status code: {response.status_code}")
            return None

    except requests.exceptions.RequestException as e:
        print(f"An error occurred while making the HTTP request: {e}")
        return None


# API view to scrape reviews
@api_view(['GET'])
def get_reviews(request):
    company_url = request.GET.get('company_url')  # Ensure the correct parameter name

    if not company_url:
        return JsonResponse({"error": "Company URL is required"}, status=400)

    # Call the scraping function
    result = scrape_reviews_and_rating(company_url)

    if result is None:
        return JsonResponse({"error": "Failed to scrape the reviews"}, status=500)

    return JsonResponse(result, status=200)

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

@api_view(['GET'])
def get_reddit_posts(request):
    subreddit_name = request.GET.get('subreddit', 'Sneakers')  # Default to 'Sneakers' if no subreddit is provided
    query = request.GET.get('query', 'Nike Adidas shoes')  # Default search query if not provided
    
    try:
        # Choose the relevant subreddit
        subreddit = reddit.subreddit(subreddit_name)

        # Search for posts related to the query
        posts = list(subreddit.search(query, limit=20))  # Ensure posts is a list

        # Check if there are no posts found
        if not posts:
            return JsonResponse({"message": "No posts found. Try using a different keyword."}, status=404)

        # Prepare the response data
        post_data = []
        
        for post in posts:
            post_details = {
                "title": post.title,
                "url": post.url,
                "comments": []
            }

            # Check if the query keyword is in the title
            if query.lower() in post.title.lower():
                # Add all comments if the title contains the query keyword
                post.comments.replace_more(limit=0)  # To prevent loading more comments
                comments = post.comments.list()[:10]  # Take only the first 10 comments

                for comment in comments:
                    post_details["comments"].append(comment.body)

                post_data.append(post_details)

            else:
                # If the title doesn't contain the query keyword, only add comments that contain the query
                post.comments.replace_more(limit=0)  # To prevent loading more comments
                comments = post.comments.list()[:10]  # Take only the first 10 comments

                for comment in comments:
                    if query.lower() in comment.body.lower():  # Check if the keyword is in the comment
                        post_details["comments"].append(comment.body)

                # Only append the post if there are relevant comments
                if post_details["comments"]:
                    post_data.append(post_details)

        # Return the data as JSON response
        return JsonResponse({"posts": post_data}, status=200)

    except Exception as e:
        return JsonResponse({"error": f"Failed to fetch posts: {str(e)}"}, status=500)
    
@api_view(['GET'])
def get_quora_data(request):
    query = request.GET.get('q', 'Sneakers')  # Default to 'Sneakers' if no query is provided
    
    try:
        with sync_playwright() as p:
            # Launch the browser in headless mode
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()

            # Set the headers for the request
            headers = {
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Accept-Language": "en-IN,en;q=0.9,mr-IN;q=0.8,mr;q=0.7,en-US;q=0.6,hi;q=0.5",
                "Cookie": "m-b=Z8UeoBlOVnypuFHui4101A==; m-b_lax=Z8UeoBlOVnypuFHui4101A==; m-b_strict=Z8UeoBlOVnypuFHui4101A==; m-s=wUEg3jZSZOsOMCpghuZRmw==; m-dynamicFontSize=regular; m-themeStrategy=auto; m-theme=dark; m-sa=1; m-login=1; m-lat=LNJZ/bOta03D9b1NlhVeYWPd7XCDYeTb9ZDy2dbbBQ==; m-uid=2918260132; __gads=ID=c22f694257972d3a:T=1737225983:RT=1737242187:S=ALNI_MaKHKPw0xstb6socsd1YWfTxmjzZw; __eoi=ID=7893099232cf7ebb:T=1737225983:RT=1737242187:S=AA-AfjajtrglRlKnHsFiNX8cm0W5; m-qm-4118881110-0=eyJrZXkiOiJhbG9nIiwiYXJncyI6WyJMb29rdXBCYXJWaWV3TW9yZUNsaWNrdGhyb3VnaCIseyJ0eXBlIjozOSwiaGFzaCI6IjA0MmUxNDY3NmI5NDViNDkyYjZmODg5NTZmYTk3NDFmfHNlYXJjaHwwfDA0NzI1MDgyNjk2MzUzODMzfDAifSxudWxsLG51bGxdfQ%3D%3D",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36"
            }

            # Set extra headers for the page
            page.set_extra_http_headers(headers)

            # Go to the Quora search page
            page.goto(f"https://www.quora.com/search?q={query}")

            # Wait for the page to load and for the main content to be available
            page.wait_for_selector('div#mainContent')

            # Extract the text content from the div with id "mainContent"
            main_content = page.locator('div#mainContent')
            text_content = main_content.inner_text()

            # Close the browser
            browser.close()

            # Return the extracted content as JSON response
            return JsonResponse({"query": query, "content": text_content})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status_code=500)
