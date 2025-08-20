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
3. Create a GitHub client id and client secret in your developer settings for OAuth.
4. Create a new project in Google Cloud Console and get your OAuth client id and secret.

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
   DATABASE_URL="postgresql://postgres.bohxmummrzqyfspqhepk:[YOUR-PASSWORD]@aws-0-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
    
   # Direct connection to the database. Used for migrations
   DIRECT_URL="postgresql://postgres.bohxmummrzqyfspqhepk:[YOUR-PASSWORD]@aws-0-us-east-2.pooler.supabase.com:5432/postgres"
   ```
   
4. Enter your API keys in the root directory `.env`
   ```js
   REACT_APP_API_URL = 'http://localhost:4000'
   REACT_APP_SPOTIFY_CLIENT_ID='ENTER YOUR SPOTIFY CLIENT ID'
   ```

5. Run the application
   ```sh
   npm run dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[product-screenshot]: <img width="1905" height="775" alt="image" src="https://github.com/user-attachments/assets/39bacf49-c7b0-45d3-9072-8ed75dc3f293" />
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
