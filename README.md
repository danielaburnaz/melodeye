# MelodEye

## 1st Place at Junction 2023
## Challenge: Peek Behind The Eyes

<img src="site.png">

Live version:
https://melodeye.netlify.app/

## Your eyes reveal, your music heals.

Stress and anxiety have been a hindering factor in many people's daily life harming their overall mental health. Many studies have demonstrated that music can help reduce these stress and anxiety levels to improve one's quality of life. But, how can music be integrated into our daily lives? Meet MelodEye! Combining a non-invasive eye-tracking technology with heartbeat data, we aim to detect the intense emotions of individuals and support them through personalized playlists.

The opportunity to use Pixieray frames has allowed us to dive into how data regarding eye movement (IR sensor data and accelerometer) can be utilized with other variables to detect emotions. We first analyzed the raw data given by Pixieray and then manipulated it in different ways to achieve comprehensible information for our project's purpose.

Our unique process involves synthesizing various physiological indicators such as eye movement, changes in heart rate, breathing patterns, blink frequency, and head movements. These indicators are crucial in determining the user's emotional state. To enhance the accuracy of emotion classification, additional variables like pupil dilation and eye saccades should also be utilized.

The process of emotion detection is intricate. It involves analyzing the synthesized variables and comparing them to the established baseline values of the user. When a significant deviation from these baselines is detected, other variables are examined to create a "mapping." This mapping is essential in differentiating between various emotional categories.

To illustrate, we present an extreme example involving our teammate Jason. In this scenario, Jason experiences anxiety while engaged in a horror game. By tracking the changes in his physiological parameters and variables, we are able to determine his emotional state accurately.

In instances where intense negative emotions, such as fear and anxiety, are identified, our system should proactively respond. A notification is sent to the user through an app, and therapeutic music is gradually introduced to alleviate the user’s distress.

The selection of music is personalized and dynamic. It is based on the user's individual Spotify Niche mixes or playlists, leveraging keyword-based decision-making to choose music that is most apt for the situation. This personalization ensures that the music is not only relevant but also has a greater emotional impact on the user. Additionally, we are exploring the integration of generative music AI. This technology would use the essence of the user's preferred mixes to create new, therapeutic soundscapes.

It is important to note that emotion detection is quite limited with the data obtained from the Pixieray frame. This is because small eye movements such as saccades that contain crucial information regarding one's feelings cannot be measured as accurately. However, the accuracy of emotion clarification can be increased using external sensors such as EEG or EOG. 
