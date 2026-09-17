import os
from gtts import gTTS
import speech_recognition as sr

# from pydub import AudioSegment
# def convert_to_wav(audio_file_path: str) -> str:
#     if not audio_file_path.endswith(".wav"):
#         sound = AudioSegment.from_file(audio_file_path)
#         wav_path = audio_file_path.rsplit(".", 1)[0] + ".wav"
#         sound.export(wav_path, format="wav")
#         return wav_path
#     return audio_file_path

def text_to_speech(text: str, output_path: str = "output_question.mp3"):
    tts = gTTS(text=text, lang='en', slow=False)
    tts.save(output_path)
    return output_path

def speech_to_text(audio_file_path: str) -> str:
    """Converts candidate audio recording into text (expects a .wav file)."""
    recognizer = sr.Recognizer()
    
    with sr.AudioFile(audio_file_path) as source:
        audio_data = recognizer.record(source)
        try:
            text = recognizer.recognize_google(audio_data)
            return text
        except sr.UnknownValueError:
            return "Speech recognition could not understand audio"
        except sr.RequestError as e:
            return f"Could not request results from speech service; {e}"