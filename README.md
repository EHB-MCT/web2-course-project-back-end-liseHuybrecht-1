[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=21636359)

# Your project name ✨

A short description of your project. Aim for 2-3 lines. \

Website url: [website.be](website.be) (optional)

If you want to add more sections, please do so after the existing ones (avoid burying your sources under a lot of text!).

## Up & running (optional) 🏃‍➡️

This should contain step by step instructions to run your project (delete this section if it's not relevant). \
Also include login credentials or other vital information if needed.

## Sources 🗃️

List **ALL your used sources** here:

- Used a tutorial or example code? Place a link to them here. (youtube, website, github, ...) and **list the files in which they were used**.
- Used ChatGPT? Generate a ChatGPT share link: options (three dots) > share and **list the files in which it was used**. This will not work if you have uploaded images in your prompt. In that case, add screenshots instead.

It's not enough to only list the sources here, also add the sources to the top of the files in which you used them and indicate the specific parts of the code which are not your own (by writing comments and refering to the correct source(s)). \
IF you use a source as the base/start for a file, then first place the source in the file and **COMMIT it IMMEDIATELY, BEFORE** adding your own code or modifying it. \
**ALWAYS** use concise BUT CLEAR commit messages!

Have a look at the example repository: https://github.com/EHB-MCT/example-readme

https://www.w3schools.com/git/git_ignore.asp
https://www.youtube.com/watch?v=JAFhwfyYEb4
https://www.w3schools.com/CSS/css_howto.asp#gsc.tab=0
https://www.c-sharpcorner.com/article/invoke-rest-apis-in-express-js/
https://www.mongodb.com/resources/languages/mongodb-and-npm-tutorial

https://chatgpt.com/

"mongodb+srv://lihuybrecht_db_user:<db_password>@databbasecluedo.qbbbey5.mongodb.net/?appName=databbasecluedo"; how to change password without actually changing it here

You don’t change the password inside the connection string.
Instead, you store the password somewhere else (environment variables or config) and reference it.

Here are the correct and safe ways to do it.

✅ Best practice: Use environment variables

1. Set the password as an environment variable

macOS / Linux (terminal):

export MONGODB_PASSWORD="your_real_password"

Windows (PowerShell):

setx MONGODB_PASSWORD "your_real_password"

2. Use it in your MongoDB connection string

JavaScript / Node.js example:

const password = process.env.MONGODB_PASSWORD;

const uri = `mongodb+srv://lihuybrecht_db_user:${password}@databbasecluedo.qbbbey5.mongodb.net/?appName=databbasecluedo`;

Now your password is not hardcoded and not visible in your code or GitHub.

✅ Using a .env file (very common)

1. Create a .env file (DO NOT commit it)
   MONGODB_PASSWORD=your_real_password

Add this to .gitignore:

.env

2. Load it in your app
   import dotenv from "dotenv";
   dotenv.config();

const uri = `mongodb+srv://lihuybrecht_db_user:${process.env.MONGODB_PASSWORD}@databbasecluedo.qbbbey5.mongodb.net/?appName=databbasecluedo`;

❌ What NOT to do

❌ Don’t put the password directly in the URI

❌ Don’t commit credentials to GitHub

❌ Don’t share full connection strings publicly

🔐 If you actually want to rotate (change) the password

You do that in MongoDB Atlas → Database Access → Edit User, then update the environment variable — not the code.

If you tell me:

what language you’re using (Node, Python, Java, etc.)

and whether this is local or deployed (Vercel, Render, Railway, etc.)

I’ll give you a copy-paste setup tailored exactly to your project.

Lin de Huybrecht
