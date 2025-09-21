# =====================================================
# Task 1: Load and Explore the Dataset
# =====================================================

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Enable inline plotting if using Jupyter Notebook
# %matplotlib inline  

# Try to load dataset safely
try:
    
    # (if you have a local CSV file):
    # df = pd.read_csv("your_dataset.csv")

    print("✅ Dataset loaded successfully!\n")

except FileNotFoundError:
    print("❌ Error: File not found. Please check the path.")
except Exception as e:
    print("❌ An error occurred while loading the dataset:", e)


# Display first few rows
print("🔹 First 5 rows of dataset:")
print(df.head(), "\n")

# Explore structure
print("🔹 Dataset Info:")
print(df.info(), "\n")

# Missing values
print("🔹 Missing values per column:")
print(df.isnull().sum(), "\n")

# Clean dataset (drop rows with missing values just in case)
df = df.dropna()

# =====================================================
# Task 2: Basic Data Analysis
# =====================================================

# Descriptive statistics
print("🔹 Basic Statistics:")
print(df.describe(), "\n")

# Grouping example: average petal length per species
grouped = df.groupby("species")["petal_length"].mean()
print("🔹 Average Petal Length per Species:")
print(grouped, "\n")

# Interesting finding (example)
max_species = grouped.idxmax()
print(f"✅ Species with longest average petal length: {max_species}\n")

# =====================================================
# Task 3: Data Visualization
# =====================================================

# Set seaborn style
sns.set(style="whitegrid")

# 1. Line chart (using petal length over index just as trend example)
plt.figure(figsize=(8,5))
plt.plot(df.index, df["petal_length"], label="Petal Length", color="blue")
plt.title("Line Chart: Petal Length Trend")
plt.xlabel("Index")
plt.ylabel("Petal Length")
plt.legend()
plt.show()

# 2. Bar chart (average petal length per species)
plt.figure(figsize=(8,5))
sns.barplot(x="species", y="petal_length", data=df, ci=None, palette="viridis")
plt.title("Bar Chart: Average Petal Length by Species")
plt.xlabel("Species")
plt.ylabel("Average Petal Length")
plt.show()

# 3. Histogram (distribution of sepal length)
plt.figure(figsize=(8,5))
plt.hist(df["sepal_length"], bins=15, color="green", edgecolor="black")
plt.title("Histogram: Distribution of Sepal Length")
plt.xlabel("Sepal Length")
plt.ylabel("Frequency")
plt.show()

# 4. Scatter plot (sepal length vs petal length)
plt.figure(figsize=(8,5))
sns.scatterplot(x="sepal_length", y="petal_length", hue="species", data=df, palette="deep")
plt.title("Scatter Plot: Sepal Length vs Petal Length")
plt.xlabel("Sepal Length")
plt.ylabel("Petal Length")
plt.legend(title="Species")
plt.show()
