import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

def analyze_dataset(file_path):
    # Read the Excel file
    print(f"Reading dataset from {file_path}...")
    df = pd.read_excel(file_path)
    
    # Basic information
    print("\nDataset Information:")
    print(f"Number of samples: {len(df)}")
    print(f"Number of features: {len(df.columns)}")
    print("\nColumns in the dataset:")
    for col in df.columns:
        print(f"- {col}")
    
    # Data types and missing values
    print("\nData Types and Missing Values:")
    print(df.info())
    
    # Basic statistics
    print("\nBasic Statistics:")
    print(df.describe())
    
    # Check for missing values
    missing_values = df.isnull().sum()
    if missing_values.any():
        print("\nMissing Values:")
        print(missing_values[missing_values > 0])
    else:
        print("\nNo missing values found in the dataset.")
    
    # Create visualizations directory if it doesn't exist
    vis_dir = Path("visualizations")
    vis_dir.mkdir(exist_ok=True)
    
    # Create correlation heatmap
    plt.figure(figsize=(12, 8))
    numeric_cols = df.select_dtypes(include=['float64', 'int64']).columns
    correlation_matrix = df[numeric_cols].corr()
    sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0)
    plt.title('Feature Correlation Heatmap')
    plt.tight_layout()
    plt.savefig(vis_dir / 'correlation_heatmap.png')
    plt.close()
    
    # Distribution of target variable (if it exists)
    if 'label' in df.columns:
        plt.figure(figsize=(10, 6))
        df['label'].value_counts().plot(kind='bar')
        plt.title('Distribution of Crop Types')
        plt.xlabel('Crop Type')
        plt.ylabel('Count')
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.savefig(vis_dir / 'crop_distribution.png')
        plt.close()
    
    # Save processed data to CSV
    output_path = 'processed_crop_data.csv'
    df.to_csv(output_path, index=False)
    print(f"\nProcessed data saved to {output_path}")
    
    return df

if __name__ == "__main__":
    dataset_path = "farmer_guide_crop_dataset.xlsx"
    try:
        df = analyze_dataset(dataset_path)
        print("\nDataset analysis completed successfully!")
    except Exception as e:
        print(f"Error analyzing dataset: {str(e)}") 