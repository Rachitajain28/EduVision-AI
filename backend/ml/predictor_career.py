import pandas as pd
import os

CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "career_data_final.csv")
df = pd.read_csv(CSV_PATH)

def validate_scores(scores):
    return (
        isinstance(scores, list) and
        len(scores) == 6 and
        all(isinstance(x, (int, float)) and 0 <= x <= 10 for x in scores)
    )

def predict_top_careers(scores):
    
    score_cols = ["R_score", "I_score", "A_score", "S_score", "E_score", "C_score"]
    
    # Calculate similarity between user scores and each row
    df_copy = df.copy()
    df_copy["similarity"] = df_copy[score_cols].apply(
        lambda row: -sum((row[i] - scores[i])**2 for i in range(6)),
        axis=1
    )
    
    top = df_copy.sort_values("similarity", ascending=False).drop_duplicates("Career").head(5)
    
    results = []
    for _, row in top.iterrows():
        max_sim = 0
        min_sim = -6 * 100  
        confidence = round(((row["similarity"] - min_sim) / (max_sim - min_sim)) * 100, 2)
        confidence = max(0, min(100, confidence))
        
        results.append({
            "career": row["Career"],
            "confidence": confidence,
            "description": f"Required Skills: {row['Required_Skills']}",
            "salary": row["Salary_Range"],
            "learning_path": row["Learning_Path"],
            "skills": [s.strip() for s in row["Required_Skills"].split(",")]
        })
    
    return results