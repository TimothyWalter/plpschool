# ============================================================
# CORD-19 Metadata Analysis & Streamlit Dashboard
# ============================================================

# --- Part 1: Data Loading and Basic Exploration ---
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from collections import Counter
import re

# Optional: for word cloud
from wordcloud import WordCloud

# Load dataset
df = pd.read_csv("metadata.csv")

# Preview dataset
print("Dataset shape:", df.shape)
print("\nDataset Info:")
print(df.info())
print("\nFirst 5 rows:")
print(df.head())

# Missing values check
print("\nMissing values per column:")
print(df.isnull().sum())

# Summary statistics
print("\nSummary statistics:")
print(df.describe(include="all"))

# --- Part 2: Data Cleaning and Preparation ---

# Drop rows missing critical info (title, abstract, publish_time)
df = df.dropna(subset=["title", "abstract", "publish_time"])

# Convert publish_time to datetime
df["publish_time"] = pd.to_datetime(df["publish_time"], errors="coerce")

# Extract year
df["year"] = df["publish_time"].dt.year

# Abstract word count
df["abstract_word_count"] = df["abstract"].apply(lambda x: len(x.split()))

print("\nCleaned dataset shape:", df.shape)

# --- Part 3: Data Analysis and Visualization ---

# 1. Count papers by year
year_counts = df["year"].value_counts().sort_index()
plt.figure(figsize=(10,5))
sns.barplot(x=year_counts.index, y=year_counts.values, color="skyblue")
plt.title("Publications by Year")
plt.xlabel("Year")
plt.ylabel("Number of Papers")
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# 2. Top journals
top_journals = df["journal"].value_counts().head(10)
plt.figure(figsize=(8,5))
sns.barplot(y=top_journals.index, x=top_journals.values, palette="viridis")
plt.title("Top 10 Journals Publishing COVID-19 Research")
plt.xlabel("Paper Count")
plt.ylabel("Journal")
plt.tight_layout()
plt.show()

# 3. Word frequency in titles
titles_text = " ".join(df["title"].dropna()).lower()
words = re.findall(r"\b[a-z]{4,}\b", titles_text)  # words with 4+ letters
common_words = Counter(words).most_common(20)

print("\nTop 20 words in paper titles:")
for word, freq in common_words:
    print(f"{word}: {freq}")

# 4. Word cloud of paper titles
wc = WordCloud(width=800, height=400, background_color="white").generate(" ".join(words))
plt.figure(figsize=(10,6))
plt.imshow(wc, interpolation="bilinear")
plt.axis("off")
plt.title("Word Cloud of Paper Titles")
plt.show()

# 5. Distribution by source_x (data source field in CORD-19 metadata)
plt.figure(figsize=(10,5))
df["source_x"].value_counts().head(10).plot(kind="bar")
plt.title("Top Sources of Papers")
plt.xlabel("Source")
plt.ylabel("Count")
plt.tight_layout()
plt.show()

# --- Part 4: Streamlit Application ---
# Save this section as app.py if you want to run separately with Streamlit

import streamlit as st

st.title("CORD-19 Data Explorer")
st.write("Exploring COVID-19 research metadata from the CORD-19 dataset.")

# Year range slider
min_year, max_year = int(df["year"].min()), int(df["year"].max())
year_range = st.slider("Select year range", min_year, max_year, (2019, 2021))

# Filter by year
filtered = df[(df["year"] >= year_range[0]) & (df["year"] <= year_range[1])]

st.write(f"Showing {len(filtered)} papers in the selected range.")

# Publications by year chart
year_counts = filtered["year"].value_counts().sort_index()
st.bar_chart(year_counts)

# Top journals
st.write("### Top Journals")
st.bar_chart(filtered["journal"].value_counts().head(10))

# Word cloud
st.write("### Word Cloud of Titles")
titles_text = " ".join(filtered["title"].dropna()).lower()
words = re.findall(r"\b[a-z]{4,}\b", titles_text)
wc = WordCloud(width=800, height=400, background_color="white").generate(" ".join(words))
plt.imshow(wc, interpolation="bilinear")
plt.axis("off")
st.pyplot(plt)

# Show sample of the data
st.write("### Sample Data")
st.dataframe(filtered.head(20))
