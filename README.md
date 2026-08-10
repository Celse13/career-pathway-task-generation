# Career Pathway Task Generation

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

An AI-powered assessment builder that generates practice questions from a prompt. Users describe a topic, pick a difficulty (easy / medium / hard), and choose from eleven question formats — text, paragraph, multiple choice, checkboxes, dropdown, linear scale, date, file upload, range, URL, and coding — then the app generates questions and auto-grades submitted answers. It's built for educators, recruiters, and learners who want to create and evaluate skills assessments quickly.

**Live demo:** https://career-pathway-task-generation.vercel.app

## Screenshot

<!-- TODO: add a screenshot of the question generator -->
![Question generator](./public/screenshot.png)

## Tech stack

| Concern | Tool |
| --- | --- |
| Framework | Next.js (App Router, Route Handlers) |
| Language | TypeScript |
| AI | LLM-backed question generation & auto-grading |
| Styling | Tailwind CSS |
| UI components | shadcn/ui (Radix primitives) |
| Deployment | Vercel |

## Getting started

```bash
# 1. Clone the repo
git clone https://github.com/Celse13/career-pathway-task-generation.git
cd career-pathway-task-generation

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# add your LLM API key

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
