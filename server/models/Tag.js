const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema(
    {
        value: {
            type: String,
            required: [true, 'Tag value is required'],
            unique: true,
            trim: true,
            lowercase: true,
            minlength: [1, 'Tag must be at least 1 character'],
            maxlength: [50, 'Tag cannot exceed 50 characters'],
        },
    },
    { timestamps: true }
);

const DEFAULT_TAGS = [
  // Languages
  'javascript', 'typescript', 'python', 'java', 'csharp', 'cpp', 'c',
  'rust', 'go', 'kotlin', 'swift', 'ruby', 'php', 'scala', 'haskell',
  'elixir', 'erlang', 'clojure', 'fsharp', 'dart', 'lua', 'perl',
  'r', 'matlab', 'bash', 'powershell', 'assembly', 'cobol', 'fortran',

  // Frontend Frameworks & Libraries
  'react', 'nextjs', 'vue', 'nuxt', 'angular', 'svelte', 'sveltekit',
  'solidjs', 'qwik', 'astro', 'remix', 'gatsby', 'htmx', 'alpinejs',
  'jquery', 'preact', 'lit', 'stencil',

  // Backend Frameworks
  'nodejs', 'express', 'fastify', 'nestjs', 'hapi', 'koa',
  'django', 'flask', 'fastapi', 'tornado', 'starlette',
  'rails', 'sinatra', 'laravel', 'symfony', 'spring', 'springboot',
  'dotnet', 'aspnet', 'gin', 'fiber', 'echo', 'axum', 'actix',
  'phoenix', 'ktor', 'micronaut', 'quarkus',

  // Databases
  'mongodb', 'postgresql', 'mysql', 'sqlite', 'mariadb', 'mssql',
  'redis', 'dynamodb', 'cassandra', 'couchdb', 'neo4j', 'influxdb',
  'elasticsearch', 'supabase', 'firebase', 'planetscale', 'cockroachdb',
  'fauna', 'tigris', 'edgedb', 'convex',

  // CSS & Styling
  'css', 'sass', 'tailwind', 'bootstrap', 'bulma', 'materialui',
  'chakraui', 'mantine', 'shadcn', 'radixui', 'styledcomponents',
  'emotion', 'stitches', 'cssmodules', 'postcss', 'less',

  // DevOps & Cloud
  'docker', 'kubernetes', 'helm', 'terraform', 'ansible', 'puppet',
  'chef', 'vagrant', 'nginx', 'apache', 'caddy', 'traefik',
  'aws', 'gcp', 'azure', 'vercel', 'netlify', 'heroku', 'railway',
  'render', 'digitalocean', 'linode', 'cloudflare', 'fly',

  // CI/CD & Version Control
  'git', 'github', 'gitlab', 'bitbucket', 'githubactions', 'circleci',
  'jenkins', 'travisci', 'argocd', 'flux', 'teamcity',

  // APIs & Protocols
  'rest', 'graphql', 'grpc', 'websockets', 'trpc', 'openapi',
  'swagger', 'oauth', 'jwt', 'webhooks', 'mqtt', 'http', 'tcp',

  // Testing
  'jest', 'vitest', 'mocha', 'chai', 'jasmine', 'cypress', 'playwright',
  'selenium', 'puppeteer', 'testinglibrary', 'storybook', 'msw',
  'pytest', 'unittest', 'rspec', 'junit',

  // Mobile
  'reactnative', 'flutter', 'ios', 'android', 'expo', 'ionic',
  'xamarin', 'maui', 'capacitor', 'cordova',

  // AI & ML
  'machinelearning', 'deeplearning', 'tensorflow', 'pytorch', 'keras',
  'scikitlearn', 'opencv', 'nlp', 'llm', 'openai', 'langchain',
  'huggingface', 'rag', 'computervision', 'reinforcementlearning',

  // Data & Analytics
  'pandas', 'numpy', 'spark', 'hadoop', 'kafka', 'airflow',
  'dbt', 'looker', 'tableau', 'powerbi', 'jupyter', 'databricks',
  'snowflake', 'bigquery', 'redshift',

  // Architecture & Concepts
  'microservices', 'monolith', 'serverless', 'eventdriven', 'ddd',
  'cleanarchitecture', 'cqrs', 'eventsourcing', 'designpatterns',
  'solidprinciples', 'tdd', 'bdd', 'agile', 'scrum', 'kanban',

  // Security
  'cybersecurity', 'appsec', 'devsecops', 'encryption', 'ssl',
  'penetrationtesting', 'owasp', 'zerotrust', 'iam',

  // Tools & Misc
  'vscode', 'neovim', 'vim', 'jetbrains', 'webpack', 'vite', 'esbuild',
  'rollup', 'parcel', 'babel', 'eslint', 'prettier', 'husky',
  'prisma', 'drizzle', 'sequelize', 'typeorm', 'mongoose',
  'redux', 'zustand', 'jotai', 'recoil', 'mobx', 'xstate',
  'react-query', 'swr', 'axios', 'zod', 'yup', 'pnpm', 'bun',
  'linux', 'wsl', 'regex', 'algorithms', 'datastructures', 'systemdesign',
  'webassembly', 'threejs', 'webgl', 'web3', 'blockchain', 'solidity',
];

// Runs once after Mongoose finishes building indexes on this collection
tagSchema.post('init', () => {});

const Tag = mongoose.model('Tag', tagSchema);

Tag.on('index', async (err) => {
    if (err) return;
    try {
        await Tag.insertMany(
            DEFAULT_TAGS.map((value) => ({ value })),
            { ordered: false } // skips duplicates instead of throwing
        );
    } catch (err) {
        // error code 11000 = duplicate key — safe to ignore on subsequent startups
        if (err.code !== 11000 && err?.writeErrors?.some(e => e.code !== 11000)) {
            console.error('Error seeding tags:', err);
        }
    }
});

module.exports = Tag;