## Project Status

This project is currently under development.

## Purpose of the Project

We are building a platform that helps users prepare for job interviews through AI-powered mock interviews.

Users can create an account, securely log in, and upload their resume. They can then select the role and difficulty level for their mock interview and specify the interview duration.

The platform will conduct an AI-powered interview tailored to the user's resume, selected role, and difficulty level. After the interview, the user's responses will be evaluated and they will receive a score out of 100 along with detailed feedback on their strengths and areas for improvement.

The system is designed using a **multi-agent architecture**, where multiple asynchronous AI agents work together to handle different stages of the interview preparation and evaluation process. This approach allows the platform to perform tasks concurrently and create a more modular and scalable interview workflow.

We are also developing a **custom resume parser built using C++** to efficiently extract and process relevant information from uploaded resumes. The parsed resume data is then used to personalize the interview experience based on the user's background, skills, experience, and target role.

Each user has a personalized dashboard where they can view their previous mock interviews, track statistics such as total interviews, average score, and best score, and filter their interview history by role and difficulty.
