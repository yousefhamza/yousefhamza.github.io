---
layout: post
title: "Full Stack Types"
date: 2023-09-12 18:04:29
categories: jekyll update
---

Types are awesome! Whether you're navigating a new codebase or revamping older ones, checking local variables' types can give you a sense of where you are. Not to mention, auto-completion is a nice touch that can help you advance further.

However, in most programming languages, there are certain boundaries you can't cross. A typical example is an API endpoint, which may require you to connect with other systems, most likely, your backend (BE) application. At this frontier, you have to disengage from the codebase entirely to check the company's Slack or, if you're super efficient, you might have a specialized documentation center to refer to.

Imagine a world where you don't have to step out of the codebase - an unbroken chain extending from your React component, through your REST APIs, to your database scheme. Well, guess what? I've found a way using Typescript.

# Full Stack Types

Let's begin with an unfinished surveys application which presently has a form to accept questions. We'll now introduce a description property for these questions.
![App image](/assests/e2e_form/app.png)

Encountered an error as soon as you started entering a new question? Yes! That is the magic of Typescript. Using the "zod" scheme, it generates a valid option for survey fields' names.
![Form Error](/assests/e2e_form/form_error.png "Form Error")

Our next step includes updating the zod scheme to accommodate the new field.
![Scheme after](/assests/e2e_form/scheme_after.png)

While the front-end (FE) application gives us the green signal, we have an unhappy face at the BE application, specifically at the "Adapter". The Adapter carries out the job of converting the FE survey type to the DB survey scheme.
![Adapter before](/assests/e2e_form/adapter_before.png "Adapter before")

Let's go ahead and update the BE survey model along with the adapter.
![Adapter after](/assests/e2e_form/adapter_after.png)

Oops! Our service seems displeased as our model of DB returns doesn't match what the DB actually returns! However, Drizzle comes to our rescue, enabling us to cope with it efficiently.
![Service error](/assests/e2e_form/service_error.png)

We are now onto the DB scheme. Let's edit and add our new field. Drama over, no more errors!
![DB scheme](/assests/e2e_form/db_scheme.png)

You must be thinking that I forgot about creating a migration for the DB change. Absolutely not! Why bother when Drizzle has our back? With some tweaks on the schemes, Drizzle can generate migration from those changes.

Let's make a quick round back to our application, and voila, it's working perfectly fine.
![App working](/assests/e2e_form/app_working.gif)

# How it works

The magic word is "Monorepos". Furthermore, the shared package plays a decisive role. It connects the FE to the BE through a shared code that's written only once but used in both parts of the application.

# Challenges and potential solutions

Impressed by the process?

Important disclosure - I'm new to the JS/TS world, hence, I'd welcome any better solutions or recommendations.

The major challenge I stumbled upon was handling JS modules in Node. I couldn't get ESM to work with my node.js application, even after attempts with type module settings. I resolved this by using commonJS for my shared package and ESM for my React application.

# Final Word

Are you keen on diving deeper? If you'd like to have a template of this project when it's ready, leave your email [HERE](https://forms.gle/T7zpDNpNS1uw2yK86)
