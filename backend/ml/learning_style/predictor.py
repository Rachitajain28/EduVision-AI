from .model import style_keywords

def predict_learning_style(user_answers):
    scores = {style: 0 for style in style_keywords}

    for answer in user_answers:
        answer_lower = answer.lower()
        for style, keywords in style_keywords.items():
            for kw in keywords:
                if kw in answer_lower:
                    scores[style] += 1

    predicted_style = max(scores, key=scores.get)

    # Fallback if no keywords matched
    if scores[predicted_style] == 0:
        predicted_style = "visual"

    details = {
        "visual": {
            "description": "You learn best through images, diagrams, and visual content.",
            "recommendations": ["Videos", "Mind maps", "Charts"]
        },
        "reading": {
            "description": "You prefer reading and writing notes.",
            "recommendations": ["Books", "Notes", "Articles"]
        },
        "auditory": {
            "description": "You learn best by listening and discussions.",
            "recommendations": ["Podcasts", "Lectures", "Group discussion"]
        },
        "kinesthetic": {
            "description": "You learn by doing and hands-on practice.",
            "recommendations": ["Projects", "Practice", "Experiments"]
        }
    }

    return {
        "style": predicted_style,
        "description": details[predicted_style]["description"],
        "recommendations": details[predicted_style]["recommendations"]
    }