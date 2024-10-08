from wordcloud import WordCloud
import matplotlib.pyplot as plt

# Read the content from the generated text file
with open('./data/all-text-content.json', 'r', encoding='utf-8') as file:
    text = file.read()

# Generate the word cloud
wordcloud = WordCloud(width=800, height=400, background_color='white').generate(text)

# Display the word cloud using matplotlib
plt.figure(figsize=(10, 5))
plt.imshow(wordcloud, interpolation='bilinear')
plt.axis('off')  # Hide axes
plt.show()
