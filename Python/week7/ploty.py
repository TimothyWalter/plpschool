# ========================================
# Assignment: Data Analysis with Pandas & Matplotlib
# ========================================

# ---- Task 1: Load and Explore the Dataset ----

import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris

# Load Iris dataset from sklearn
iris = load_iris(as_frame=True)
df = iris.frame   # already a pandas DataFrame
df['species'] = iris.target_names[iris.target]  # add species names

# Inspect the first few rows
print("First 5 rows of dataset:")
display(df.head())

# Check structure (data types, missing values)
print("\nDataset Info:")
print(df.info())

print("\nMissing Values:")
print(df.isnull().sum())

# Clean data (Iris dataset has no missing values, but let's show handling)
df = df.dropna()

# ---- Task 2: Basic Data Analysis ----

# Summary statistics
print("\nBasic Statistics:")
display(df.describe())

# Group by species and compute mean
species_means = df.groupby("species").mean()
print("\nMean values grouped by species:")
display(species_means)

# Quick insights
print("\nObservations:")
print("- Setosa flowers generally have smaller petals than the other species.")
print("- Virginica species has the largest petal length and width on average.")
print("- Sepal length/width varies less distinctly across species.")

# ---- Task 3: Data Visualization ----

plt.style.use("seaborn-v0_8")  # nice styling

# 1. Line chart (not time-series in Iris, so we simulate index as order of samples)
plt.figure(figsize=(8,5))
plt.plot(df.index, df["sepal length (cm)"], label="Sepal Length")
plt.plot(df.index, df["petal length (cm)"], label="Petal Length")
plt.title("Line Chart: Sepal vs Petal Length Across Samples")
plt.xlabel("Sample Index")
plt.ylabel("Length (cm)")
plt.legend()
plt.show()

# 2. Bar chart: Average petal length by species
species_means["petal length (cm)"].plot(kind="bar", color=["#74b9ff","#55efc4","#fd79a8"])
plt.title("Average Petal Length per Species")
plt.xlabel("Species")
plt.ylabel("Petal Length (cm)")
plt.show()

# 3. Histogram: Distribution of sepal length
plt.hist(df["sepal length (cm)"], bins=15, color="#0984e3", edgecolor="black")
plt.title("Histogram: Sepal Length Distribution")
plt.xlabel("Sepal Length (cm)")
plt.ylabel("Frequency")
plt.show()

# 4. Scatter plot: Sepal length vs Petal length
plt.scatter(df["sepal length (cm)"], df["petal length (cm)"], 
            c=iris.target, cmap="viridis", alpha=0.7)
plt.title("Scatter Plot: Sepal Length vs Petal Length")
plt.xlabel("Sepal Length (cm)")
plt.ylabel("Petal Length (cm)")
plt.colorbar(label="Species (0=Setosa,1=Versicolor,2=Virginica)")
plt.show()

# ---- Error Handling Demo ----
try:
    bad_df = pd.read_csv("non_existent_file.csv")
except FileNotFoundError:
    print("\nError Handling: File not found. Please check the file path.")
