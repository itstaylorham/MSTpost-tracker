import json
import re
from pathlib import Path

def clean_content(content):
    # List of specific names to remove
    user_names = [
        'Jeremy Barton',
        'Sherrell Bacon',
        'Rebecca Foster-Alvarez',
        'Mark Poisson',
        'Rohit Patil',
        'Heather Moore',
        'Rhonda Rivas',
        'Rajendra Prasad Poloju'
    ]
    
    # Create a regex pattern for the names
    names_pattern = '|'.join(map(re.escape, user_names))
    
    # Timestamp patterns including ISO 8601 format
    timestamp_patterns = [
        r"(Yesterday|Today)\s*",
        r"\d{1,2}/\d{1,2}",  # e.g., 8/26
        r"\d{1,2}:\d{2}\s*(AM|PM|am|pm)?",
        r"(AM|PM|am|pm)",
        r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z"  # ISO 8601
    ]
    
    # Start with the original content
    cleaned = content
    
    # Remove names
    if names_pattern:
        cleaned = re.sub(names_pattern, '', cleaned, flags=re.IGNORECASE)
    
    # Remove each timestamp pattern
    for pattern in timestamp_patterns:
        cleaned = re.sub(pattern, '', cleaned)
    
    # Remove all numbers (if not needed, skip this)
    cleaned = re.sub(r'\d+', '', cleaned)
    
    # Remove forward and backward slashes
    cleaned = re.sub(r'[/\\]', '', cleaned)
    
    # Remove multiple spaces and clean up
    cleaned = re.sub(r'\s+', ' ', cleaned)
    cleaned = cleaned.strip()
    
    return cleaned

def process_json_files():
    # Path to the directory where JSON files are stored
    data_directory = Path('./data')
    
    # Initialize a list to collect all the cleaned content
    all_cleaned_content = []
    
    # Loop through each JSON file that starts with 'posts_replies'
    for json_file in data_directory.glob('new_posts_replies*.json'):
        try:
            with open(json_file, 'r', encoding='utf-8') as file:
                data = json.load(file)
                
                # Debug the first entry's structure
                if data and len(data) > 0:
                    print(f"First entry structure in {json_file.name}:")
                    print(json.dumps(data[0], indent=2))
                
                for entry in data:
                    # Directly access the 'content' field
                    content = entry.get('content')
                    
                    if content:
                        cleaned_content = clean_content(content)
                        if cleaned_content:  # Only add if there's content left after cleaning
                            all_cleaned_content.append(cleaned_content)
                    else:
                        print(f"Warning: No content found in entry: {entry}")
                        
        except json.JSONDecodeError as e:
            print(f"Error reading JSON file {json_file}: {e}")
        except Exception as e:
            print(f"Unexpected error processing {json_file}: {e}")

    # Save all cleaned content to a new JSON file
    output_file = data_directory / 'all-text-content.json'
    try:
        with open(output_file, 'w', encoding='utf-8') as outfile:
            json.dump(all_cleaned_content, outfile, indent=2)
        print(f"Cleaned content saved to {output_file}")
    except Exception as e:
        print(f"Error saving output file: {e}")

if __name__ == "__main__":
    process_json_files()
