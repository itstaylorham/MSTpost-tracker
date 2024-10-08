import json
import re
from pathlib import Path

# Define the function to clean the content of unnecessary names and timestamps
def clean_content(content):
    # Regex to match timestamps like 'Yesterday 1:45 PM' or '1:45 PM', etc.
    timestamp_pattern = r"(Yesterday|Today)?\s?\d{1,2}:\d{2}\s?(AM|PM)"
    
    # Regex to match names, assuming they always come before the timestamp and start with a capital letter.
    # This assumes names have first and last name, like 'Heather Moore'
    name_pattern = r"^[A-Z][a-z]+\s[A-Z][a-z]+"

    # First, remove names at the beginning of the string
    cleaned = re.sub(name_pattern, "", content).strip()
    
    # Then, remove timestamps (e.g., "Yesterday 1:45 PM" or just "1:45 PM")
    cleaned = re.sub(timestamp_pattern, "", cleaned).strip()
    
    return cleaned

# Path to the directory where JSON files are stored
data_directory = Path('./data')

# Initialize a list to collect all the cleaned content
all_cleaned_content = []

# Loop through each JSON file that starts with 'posts_replies'
for json_file in data_directory.glob('posts_replies*.json'):
    with open(json_file, 'r', encoding='utf-8') as file:
        data = json.load(file)
        for entry in data:
            # Clean the content of each entry
            cleaned_content = clean_content(entry['content'])
            if cleaned_content:  # Only add if there's content left after cleaning
                all_cleaned_content.append(cleaned_content)

# Save all cleaned content to a new JSON file
with open(data_directory / 'all-text-content.json', 'w', encoding='utf-8') as outfile:
    json.dump(all_cleaned_content, outfile, indent=2)

print(f"Cleaned content saved to all-text-content.json.")
