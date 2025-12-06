import google.generativeai as genai
import os

# API 키 설정
API_KEY = "AIzaSyC-SfcIe80KB0ShRjldyUOY8ETt-NSnXdg"
genai.configure(api_key=API_KEY)

# Gemini 모델 초기화 (최신 모델)
model = genai.GenerativeModel('gemini-2.5-flash')

def chat_with_gemini(prompt):
    """Gemini와 대화하는 함수"""
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"오류 발생: {str(e)}"

def main():
    print("=== Gemini Agent 시작 ===")
    print("종료하려면 'quit' 또는 'exit'를 입력하세요.\n")
    
    while True:
        user_input = input("You: ")
        
        if user_input.lower() in ['quit', 'exit']:
            print("Gemini Agent를 종료합니다.")
            break
            
        if not user_input.strip():
            continue
            
        print("\nGemini: ", end="")
        response = chat_with_gemini(user_input)
        print(response)
        print()

if __name__ == "__main__":
    main()
