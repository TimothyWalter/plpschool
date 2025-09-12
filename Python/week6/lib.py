import os
import requests
from urllib.parse import urlparse
import uuid

def fetch_image():
    # Prompt user for URL
    url = input("Enter the image URL: ").strip()
    
    # Create directory if it doesn't exist
    folder_name = "Fetched_Images"
    os.makedirs(folder_name, exist_ok=True)
    
    try:
        # Fetch image from the web
        response = requests.get(url, timeout=10)
        response.raise_for_status()  # Raises HTTPError for bad responses

        # Extract filename from URL or generate one
        parsed_url = urlparse(url)
        filename = os.path.basename(parsed_url.path)
        if not filename:  # If no filename in URL, generate one
            filename = f"image_{uuid.uuid4().hex}.jpg"

        # Full path to save image
        filepath = os.path.join(folder_name, filename)

        # Save image in binary mode
        with open(filepath, "wb") as file:
            file.write(response.content)

        print(f"✅ Image saved as {filepath}")

    except requests.exceptions.HTTPError as http_err:
        print(f"❌ HTTP error occurred: {http_err}")
    except requests.exceptions.ConnectionError:
        print("❌ Connection error. Please check your internet.")
    except requests.exceptions.Timeout:
        print("❌ Request timed out. Try again later.")
    except Exception as err:
        print(f"❌ An error occurred: {err}")


if __name__ == "__main__":
    fetch_image()
