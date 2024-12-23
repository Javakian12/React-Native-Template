# React-Native-Template
A template (boilerplate) for a React Native app.

This is currently an OLD version, a newer version will be released soon with loads of more features and quality of life improvements. If you want early access, open up a thread on issues to request it.

This repository is a fully functional app that can be built on IOS, Android, and Web for faster deployment. This repository includes a large amount of features, all designed to help you skyrocket your deployment.

## Server

This repository includes only the front-end components of the template app. While it works when emulating and visiting the pages, certain features such as login and account creation will not work until you run the server. You can, however, visit the different pages in the app (bypass the "Login" page) by changing the default stack in App.js to "MainScreen":

![image](https://github.com/Javakian12/React-Native-Template/assets/89485382/55c408d3-109f-4401-b8b6-5cdc3f8afd6a)


You may notice that the server files are not included in this repository. This is because:

1. This repository is front-end only. The backend is a different repository.

2. This repository took a lot of time to make. We want this repository to be an open-source help to those wishing to create their own React Native App, not be another one of the (many) paid boilerplates you can buy from any website. However, with the small team that developed this, we do not have enough time to maintain and update this repository constantly. So, instead of paying for the code, we desire contributions to the codebase so this template can grow, and help more developers like you and I. To get access to the server repository (it currently is a private repository), open up a pull request and either:
  
   a. Address one of the issues in the open issues tab with a tag of (ToDo) 🚩.
   
   b. Improve the layout/design/looks of the app by incorporating your own CSS skills, improving how the pages look to the human eye |👁️|!
   
   c. Be creative! Add your page/module/feature into the app that not only helps you but others using this repository 🚀! This choice is the more creative option, mainly for those who want to add a new page to the template so it supports more features.

A few rules when submitting a pull request for the template app:
1. Submit it only when complete! Do not submit incomplete code, code that does not work, or code that introduces vulnerabilities/new bugs! This will drastically speed up the time that your pull request is approved, and will help us when approving it 😊.
2. Your pull request has to add value to the app. This could be as little as fixing a current/unknown/compatibility bug, to creating a whole new page for the app. If you want to submit it, please only submit it if it will help others who eventually use this template.
3. Don't spend too much time - Your pull request doesn't have to be so big that it takes hours and hours to complete (unless you want it to be 😊). Don't worry about re-inventing the wheel; if you are having trouble coming up with an idea, use one in the issues tab!
4. Please try to only use React Native and Javascript code. This is a multi-platform compatibility app, which means that using HTML (in your JavaScript) will break its functionality on IOS and Android. Also, using any functions that reference "document" will not work, as it is built with React Native, which means it doesn't support the window object found with normal web apps.
5. If you have any questions/suggestions/need help with a pull request, feel free to reach out!

Upon completion and approval of a pull request, access to the server files will be granted, allowing you to fully customize, integrate, and deploy your app! (With your improvements as well! 😊)

## Pages

There are currently 4 major pages within the app, being:

**Login** - A page where you can create an account, login to that account, or send an email to reset your username/password

**Profile** - A page where you can view notifications, edit your profile, or log out

**Home** - (Incomplete) A landing page for your app

**Admin** - (Incomplete) A admin page where you can invite others to join your app (for exclusive access) or invite entire companies to join (creating a new database for each company)

## Features
This app contains quite a few features, such as:

1. Secret Token Authentication
2. CRUD database operations/calls
3. MongoDB integration
4. Global props that can be passed to every page, with a variety of functions from a snack bar, popup, global variables, etc
5. Mobile/Web separation, meaning you can develop for both platforms at the **same time**
6. NodeJS emailer with expiring code (when choosing the option "forgot password")
7. Password encryption when creating an account
8. Web/Mobile local storage, meaning upon refresh or app close you will not be logged out
9. Jotai global atoms, meaning you can efficiently organize and pass a wide variety of global variables/objects

And much more!

## Example Pages

🚧 Work In Progress 🚧

Login:

![login](https://github.com/Javakian12/React-Native-Template/assets/89485382/994fa716-21f5-42be-a952-59e307c8e83d)


