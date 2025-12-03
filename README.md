<a id="readme-top"></a>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://platepilot.vercel.app)

PlatePilot is an AI recipe generation application based on the user’s ingredients.



<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With


* [![Next][Next.js]][Next-url]
* [![TypeScript][TypeScript]][TypeScript-url]
* [![Prisma][Prisma]][Prisma-url]
* [![Supabase][Supabase]][Supabase-url]
* [![TailwindCSS][Tailwind]][Tailwind-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running, follow these simple example steps.

### Prerequisites

1. Create a `.env` in the root directory.
2. Create a Supabase account, create a new project, and find the `.env` for Prisma ORM.
3. Create a Resend account and generate an API key.
4. Create a GitHub client id and client secret in your developer settings for OAuth.
5. Create a new project in Google Cloud Console and get your OAuth client id and secret.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/BrandonTDiep/PlatePilot.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

3. Create a prisma schema and add the database URL and direct URL from your Supabase connection for Prisma ORM in `.env`
   ```sh
   npx prisma init
   # Connect to Supabase via connection pooling
   DATABASE_URL=""
    
   # Direct connection to the database. Used for migrations
   DIRECT_URL=""
   ```
   
4. Enter your API keys in the root directory `.env`
   ```js
   DATABASE_URL=""
   DIRECT_URL=""
   AUTH_SECRET="" # Added by `npx auth`. Read more: https://cli.authjs.dev
   GITHUB_CLIENT_ID=""
   GITHUB_CLIENT_SECRET=""
   GOOGLE_CLIENT_ID=""
   GOOGLE_CLIENT_SECRET=""
   RESEND_API_KEY=""
   NEXT_PUBLIC_APP_URL=""
   MODEL=""
   OPENAI_BASE_URL=""
   OPENAI_API_KEY=""
   OPENAI_PROMPT=""
   ```

5. Run the application
   ```sh
   npm run dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[product-screenshot]: public/images/image.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org
[TypeScript]: https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=flat-square
[TypeScript-url]: https://www.typescriptlang.org
[Prisma]: https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white
[Prisma-url]: https://www.prisma.io
[Supabase]: https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white
[Supabase-url]: https://supabase.com
[Tailwind]: https://img.shields.io/badge/Tailwind_CSS-grey?style=for-the-badge&logo=tailwind-css&logoColor=38B2AC
[Tailwind-url]: https://tailwindcss.com
