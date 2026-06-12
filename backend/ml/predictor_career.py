import pandas as pd
import os

CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "career_data_aggregated.csv")
df = pd.read_csv(CSV_PATH)


def validate_scores(scores):
    return (
        isinstance(scores, list) and
        len(scores) == 6 and
        all(isinstance(x, (int, float)) and 0 <= x <= 10 for x in scores)
    )


def parse_learning_path(lp_string):
    if not isinstance(lp_string, str):
        return []
    parts = [p.strip() for p in lp_string.split("|") if p.strip()]
    return [{"step": i + 1, "content": part} for i, part in enumerate(parts)]


def predict_top_careers(scores):
    score_cols = ["R_score", "I_score", "A_score", "S_score", "E_score", "C_score"]
    df_copy = df.copy()

    # Sum of squared differences between user's profile and each career's
    # average RIASEC profile (lower = closer match)
    df_copy["distance"] = df_copy[score_cols].apply(
        lambda row: sum((row.iloc[i] - scores[i]) ** 2 for i in range(6)),
        axis=1
    )

    top = df_copy.sort_values("distance").head(6)

    min_dist = top["distance"].min()
    max_dist = top["distance"].max()

    results = []
    for _, row in top.iterrows():
        dist = row["distance"]
        if max_dist == min_dist:
            confidence = 95.0
        else:
            # Scale: best match -> 95%, worst of top 6 -> 60%
            confidence = round(95 - ((dist - min_dist) / (max_dist - min_dist)) * 35, 1)

        results.append({
            "career": row["Career"],
            "confidence": confidence,
            "salary": row["Salary_Range"],
            "skills": [s.strip() for s in str(row["Required_Skills"]).split(",")],
            "learning_path": parse_learning_path(row["Learning_Path"]),
            "description": str(row["Required_Skills"])
        })
    return results
