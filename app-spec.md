Build an iOS app called a "friend check-in tracker" with the following features:

## 1\. Authentication

Login screen with two options: "Sign in with Google" (OAuth) and traditional email/username \+ password sign-up/login  
Account system designed to support a future web app version (same backend/user accounts shared across platforms)  
Password reset flow  
Include a message if the password is wrong or the account cannot be found.   
Create a forgot password button and implement the backend into it as well

## 2\. Creating friend profiles

Users can add friends, each represented by a customizable animal avatar chosen from a preset gallery  
For each friend, store: name, chosen animal, last contacted date, and a custom check-in frequency   
For the checking frequency, make it a slider from one week to one year. Have an advanced button under it that allows the user to make a more precise custom check-in that has a day, month, year option. Make these options like a wheel with numbers. Similar to: Timer.PNG

## 3\. Check-in tracking & visual states

Each animal avatar has multiple visual states reflecting how "overdue" the check-in is, based on the friend's individual frequency setting:  
Healthy/happy (recently contacted)  
Slightly tired (approaching check-in date) (begins roughly 10% of time left until check-in)  
Sick/sad (overdue) (begins right on check-in date)  
Very sick (significantly overdue) (begins roughly 10% of total time after check-in due)  
For now, use placeholder images/illustrations for each animal x state combination (these will be replaced with custom artwork later)  
A "log check-in" button updates the last-contacted date and resets the animal's appearance to healthy

## 4\. Notifications

Local push notifications reminding the user to check in with a friend when the friend's custom interval has elapsed  
Notification settings screen to manage/adjust per-friend reminder frequency  
Notifications should deep-link to the relevant friend's profile  
Include a method of adjusting the notification preferences.

- Notify when check-in date approaching  
- Notify day of check-in date  
- Notification frequency after check-in date (have options for this one daily, weekly)

## 5\. Home/dashboard screen

Grid or list view of all friends showing their animal avatar (reflecting current state), name, and last contact date  
Sort/filter by most overdue default  
Have option to also sort alphabetically and search for user (this option pops up if the user tries to scroll up beyond the top)

## 6\. Edit friend Profile

Make the edit screen like the create screen but include an extra information section below all of the things in the create section.   
Make this section so that when you're creating extra information, you can add tags to the information (so the information can be sorted) (refer to the design tab for more details) (the user can make these tabs)

7\. Clicking onto already created friend profile  
Includes friend name at top then animal picture then last contact date (in smaller font) then extra information below that.   
Make it so you can search through the extra information to find something specific  
Also include ability to filter the information with the tags 

## 8\. Design/aesthetic

Cute, soft, pastel color palette  
Rounded corners, playful typography, friendly micro-animations (e.g., animal bounce on tap)  
Empty states and onboarding screens should also feel warm and approachable  
Technical notes:  
Build using a cross-platform framework if web support is planned later   
Backend with user accounts, friend records, and check-in history stored in a database to support multi-platform login  
Use local notification scheduling (e.g., iOS UserNotifications framework) tied to each friend's stored interval and last-contact timestamp

