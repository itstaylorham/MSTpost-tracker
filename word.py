import json
import matplotlib.pyplot as plt
import seaborn as sns
from collections import Counter
from wordcloud import WordCloud
import pandas as pd
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import numpy as np
from textblob import TextBlob

# Download required NLTK data
nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)

# Load and preprocess the text
with open('./data/all-text-content.json', 'r', encoding='utf-8') as file:
    data = json.load(file)
    text = ' '.join(data)

# Tokenize and clean text
stop_words = set(stopwords.words('english'))
words = word_tokenize(text.lower())
words = [word for word in words if word.isalnum() and word not in stop_words]

# 1. Enhanced Word Cloud
plt.figure(figsize=(12, 8))
wordcloud = WordCloud(
    width=1200, 
    height=800,
    background_color='white',
    colormap='viridis',
    max_words=100,
    contour_width=3,
    contour_color='steelblue'
).generate(text)
plt.imshow(wordcloud, interpolation='bilinear')
plt.axis('off')
plt.title('Enhanced Word Cloud', pad=20, size=14)

# 2. Top Words Bar Chart
plt.figure(figsize=(12, 8))
word_freq = Counter(words).most_common(15)
words_df = pd.DataFrame(word_freq, columns=['Word', 'Frequency'])
sns.barplot(data=words_df, x='Word', y='Frequency', palette='viridis')
plt.xticks(rotation=45)
plt.title('Top 15 Most Frequent Words', pad=20, size=14)
plt.xlabel('Words', size=12)
plt.ylabel('Frequency', size=12)

# 3. Sentiment Distribution
plt.figure(figsize=(12, 8))
sentiments = [TextBlob(word).sentiment.polarity for word in words]
sns.kdeplot(sentiments, fill=True)
plt.title('Sentiment Distribution', pad=20, size=14)
plt.xlabel('Sentiment Score (Negative to Positive)', size=12)
plt.ylabel('Density', size=12)
plt.grid(True, alpha=0.3)

# 4. Word Co-occurrence Heatmap
plt.figure(figsize=(12, 8))
top_words = [word for word, _ in word_freq[:10]]
cooc_matrix = np.zeros((10, 10))

for i, word1 in enumerate(top_words):
    for j, word2 in enumerate(top_words):
        cooc_matrix[i][j] = sum(1 for k in range(len(words)-1) 
                              if words[k] == word1 and words[k+1] == word2)

sns.heatmap(cooc_matrix, xticklabels=top_words, yticklabels=top_words, 
            cmap='YlOrRd', annot=True, fmt='g', square=True)
plt.title('Word Co-occurrence Heatmap', pad=20, size=14)

# Show all plots
plt.show()