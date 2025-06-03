try:
    import numpy as np
    print("NumPy imported successfully")
    
    import pandas as pd
    print("Pandas imported successfully")
    
    from sklearn import model_selection, ensemble, preprocessing, metrics
    print("Scikit-learn imported successfully")
    
    import matplotlib.pyplot as plt
    print("Matplotlib imported successfully")
    
    import seaborn as sns
    print("Seaborn imported successfully")
    
    import joblib
    print("Joblib imported successfully")
    
    from dotenv import load_dotenv
    print("Python-dotenv imported successfully")
    
    import openpyxl
    print("Openpyxl imported successfully")
    
    print("\nAll imports successful!")
    
except ImportError as e:
    print(f"Error importing: {str(e)}") 