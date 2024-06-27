# # record_voice.py
# import pyaudio
# import wave
# import requests
#
#
# def record_voice(output_filename, record_seconds=4):
#     chunk = 1024  # Record in chunks of 1024 samples
#     sample_format = pyaudio.paInt16  # 16 bits per sample
#     channels = 1  # Mono
#     fs = 44100  # Record at 44100 samples per second
#
#     p = pyaudio.PyAudio()  # Create an interface to PortAudio
#
#     print('Recording...')
#
#     stream = p.open(format=sample_format,
#                     channels=channels,
#                     rate=fs,
#                     frames_per_buffer=chunk,
#                     input=True)
#
#     frames = []  # Initialize array to store frames
#
#     # Store data in chunks for the specified duration
#     for _ in range(0, int(fs / chunk * record_seconds)):
#         data = stream.read(chunk)
#         frames.append(data)
#
#     # Stop and close the stream
#     stream.stop_stream()
#     stream.close()
#     # Terminate the PortAudio interface
#     p.terminate()
#
#     print('Finished recording.')
#
#     # Save the recorded data as a WAV file
#     with wave.open(output_filename, 'wb') as wf:
#         wf.setnchannels(channels)
#         wf.setsampwidth(p.get_sample_size(sample_format))
#         wf.setframerate(fs)
#         wf.writeframes(b''.join(frames))
#
#
#
# def get_feedback(api_url, text):
#     response = requests.post(api_url, json={"text": text})
#     return response.json()
#
#
# def main():
#     output_filename = "recordings/output.wav"
#     record_voice(output_filename)
#
#     print("Recorded voice saved.")
#
#     feedback_api_url = "http://127.0.0.1:8888/immediatefeedback"
#
#     # Send recorded audio to the Flask API
#     record_response = send_audio_file(output_filename, record_api_url)
#     print("Record Response:", record_response)
#
#     if "message" in record_response and record_response["message"] == "File saved successfully":
#         transcription_response = requests.post(transcription_api_url, json={"filename": "output.wav"}).json()
#         if 'transcription' in transcription_response:
#             text = transcription_response['transcription']
#             print("Transcription:", text)
#
#             feedback_response = get_feedback(feedback_api_url, text)
#             print("Feedback:", feedback_response.get('feedback'))
#         else:
#             print("Transcription Error:", transcription_response.get('error'))
#     else:
#         print("Error:", record_response.get('error'))
#
#
# if __name__ == "__main__":
#     main()
