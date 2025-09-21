
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Task 1: Load and Explore the Dataset
try:
    # Load the dataset (example: Iris dataset from seaborn's built-in datasets)
    df = sns.load_dataset('iris')
    # You can replace this with
    # pd.read_csv('your_dataset.csv')

    # Display the first few rows
    print("First 5 rows of the dataset:")
    print(df.head())

    # Check the structure of the dataset
    print("\nDataset Info:")
    print(df.info())

    # Check for missing values
    print("\nMissing values per column:")
    print(df.isnull().sum())

    # Clean the dataset (fill or drop missing values)
    df = df.dropna()  # Drop rows with missing values
    # Alternatively, use df.fillna() to fill values
except Exception as e:
    print("Error loading or processing dataset:", e)
