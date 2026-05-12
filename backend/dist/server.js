// @bun
// src/db.ts
import { Database } from "bun:sqlite";
import { mkdirSync } from "fs";
import { dirname, join } from "path";

// ../apps/web/src/data/generated-rss-posts.json
var generated_rss_posts_default = [
  {
    id: "rss-9apsqt",
    slug: "when-dnssec-goes-wrong-how-we-responded-to-the-de-tld-outage-9apsqt",
    title: "When DNSSEC goes wrong: how we responded to the .de TLD outage",
    excerpt: "On May 5, 2026, DENIC published broken DNSSEC signatures for the .de TLD, making millions of domains unreachable. Here's what 1.1.1.1 saw, how serve. A practical take on modern publishing.",
    date: "2026-05-06T17:00:00.000Z",
    readTime: "3 min read",
    status: "published",
    tags: [
      {
        tag: "Security"
      },
      {
        tag: "Ai Infrastructure"
      },
      {
        tag: "Edge Computing"
      },
      {
        tag: "Workers"
      },
      {
        tag: "Cloudflare"
      }
    ],
    contentMarkdown: `## Quick read

On May 5, 2026, DENIC published broken DNSSEC signatures for the .de TLD, making millions of domains unreachable. Here's what 1.1.1.1 saw, how serve stale cushioned the impact, and how we restored.

The useful part of this story is not just the headline. It is how small businesses can turn the signal into a clearer, faster digital workflow. When technology shifts, the teams that benefit most are usually the ones that connect the update to one practical improvement.

## What happened

When DNSSEC goes wrong: how we responded to the .de TLD outage is a reminder that modern websites, AI tools, cloud platforms, and customer expectations now move together. A product announcement can affect content strategy. A browser or platform update can affect performance. A new AI capability can change how teams publish, support customers, or analyze demand.

That makes RSS monitoring valuable for a business website. Instead of waiting for trends to become obvious, you can watch credible sources and turn the best signals into timely, useful content.

## Why it matters

For small businesses, speed matters. A relevant update can become a blog post, an internal checklist, a landing page improvement, or a small automation. The goal is not to chase every news cycle. The goal is to build a system that notices useful changes and turns them into action.

The same principle applies to a CMS. A good publishing workflow should keep source material, editorial notes, metadata, and the public website connected. When that pipeline is working, publishing becomes repeatable instead of chaotic.

## Practical takeaway

Use this update as a prompt to prototype one part of your automation stack. Look for a place where visitors need clearer information, where staff repeat a manual step, or where a small content improvement could answer common customer questions.

A focused response could include:

- Turning a recurring customer question into an evergreen article
- Refreshing an outdated service page with clearer positioning
- Testing one AI-assisted workflow before changing the whole process
- Checking Core Web Vitals and accessibility after any major content change
- Keeping source attribution so readers can verify the original context

## What to watch next

The risk is overreacting. Not every update needs a rebuild, subscription, or strategy change. The better filter is simple: does this improve speed, trust, clarity, cost, or revenue? If the answer is yes, turn it into a small test. If not, save it as background context.

## Bottom line

Automated RSS-to-blog publishing works best when it adds judgment instead of noise. The pipeline should surface relevant stories, create original commentary, preserve attribution, and rebuild the site so readers see fresh content quickly.

---

Source: [Cloudflare Blog \u2014 When DNSSEC goes wrong: how we responded to the .de TLD outage](https://blog.cloudflare.com/de-tld-outage-dnssec/)`
  }
];

// ../apps/web/src/data/how-to-posts.json
var how_to_posts_default = [
  {
    id: "h1",
    slug: "how-to-build-a-small-business-website-that-actually-converts",
    title: "How to Build a Small Business Website That Actually Converts",
    excerpt: "A practical guide to planning, writing, and launching a small business website that brings in calls, bookings, and qualified leads.",
    date: "2026-05-08T09:00:00Z",
    readTime: "7 min read",
    status: "published",
    tags: [
      {
        tag: "Web Design"
      },
      {
        tag: "Small Business"
      },
      {
        tag: "Conversion"
      }
    ],
    contentMarkdown: `## Why most small business websites underperform

A lot of business websites look decent, but they do not help the owner get more calls, bookings, or leads. The issue is usually not the logo or the color palette. It is that the site was built like a brochure instead of a sales tool.

When I work on service-business websites, I start with one simple question: what should the visitor do next? If that answer is not obvious on the page, the site will leak attention and lose conversions.

## Step 1: Start with one clear goal

Before you design anything, define the main conversion goal. For most local businesses, that is one of these:

- book a call
- request a quote
- send a message
- make a purchase
- visit a location

Pick one primary goal for the homepage. You can support secondary actions later, but the main action should drive the structure, copy, and layout.

## Step 2: Lead with a strong hero section

Your hero section should explain three things in a few seconds:

1. what you do
2. who you do it for
3. what the visitor should do next

A strong example looks like this:

**Fast, modern websites for Las Vegas small businesses.**
Get a clean site built to generate more leads, load faster, and rank better locally.

Then add a button with a direct action such as **Book a Call** or **Get a Quote**.

## Step 3: Build trust early

People do not hire a business website. They hire the business behind it. That means your site needs proof.

Add trust signals near the top of the page:

- testimonials
- past projects
- before-and-after results
- business location
- response-time promise
- recognizable tools or partners

Even a simple line like **Usually replies within 24 hours** reduces hesitation.

## Step 4: Make the offer easy to understand

Many small business websites bury the actual offer under vague copy. Instead of trying to sound clever, be specific.

Explain:

- what is included
- how long it takes
- who it is best for
- what result the client can expect

The more clearly you frame the offer, the easier it is for a visitor to decide whether they are in the right place.

## Step 5: Remove friction from contact

If someone wants to reach out, do not make them work for it. Keep your form short. Put contact buttons in the header, hero, and footer. Make sure the site works on mobile, because that is where a huge share of local traffic comes from.

A good contact form usually needs:

- name
- email
- project type
- message

That is enough to start the conversation.

## Common mistakes to avoid

Here are the mistakes I see most often:

- too much text before the call to action
- weak or generic headlines
- slow pages with oversized images
- no proof of quality or trust
- confusing navigation
- too many different offers on one page

## Quick launch checklist

Before publishing, make sure your site:

- has one clear primary action
- loads fast on mobile
- includes trust signals
- uses plain, specific copy
- has a working contact form
- includes local SEO basics such as title tags and service-area mentions

## Final thought

The best small business website is not the one with the most effects. It is the one that makes the next step obvious and easy. If your site can clearly explain the offer, build trust, and guide people to act, it will do its job.`
  },
  {
    id: "h2",
    slug: "how-to-make-your-website-load-faster-without-a-full-redesign",
    title: "How to Make Your Website Load Faster Without a Full Redesign",
    excerpt: "Improve site speed with practical fixes for images, fonts, scripts, and hosting before you commit to a complete rebuild.",
    date: "2026-05-07T09:00:00Z",
    readTime: "6 min read",
    status: "published",
    tags: [
      {
        tag: "Performance"
      },
      {
        tag: "Web Development"
      },
      {
        tag: "Core Web Vitals"
      }
    ],
    contentMarkdown: `## Faster websites usually win more attention

When a website feels slow, visitors leave before the content has a chance to do its job. That is true for portfolios, ecommerce stores, and local service sites. The good news is that you do not always need a full redesign to improve performance.

In many cases, a few focused changes can noticeably reduce load time and improve the user experience.

## Start with the biggest offenders

Most slow websites are dragged down by a familiar set of problems:

- oversized images
- too many third-party scripts
- unnecessary font files
- bloated page builders
- poor hosting or caching

Instead of changing everything at once, fix the parts with the highest impact first.

## Step 1: Compress and resize images

Large images are one of the most common performance problems. Uploading a 4 MB homepage image when the browser only displays it at 1200 pixels is wasted weight.

A better workflow is:

- resize images to their real display size
- export as WebP or AVIF where possible
- lazy-load images below the fold
- use responsive image sizes

This one change can remove seconds from load time.

## Step 2: Reduce font overhead

Custom fonts look great, but too many weights and families can slow down the first render. Try limiting your site to one or two families and only the weights you actually use.

Also ask whether every decorative font is worth the cost. On many business sites, clarity matters more than novelty.

## Step 3: Audit third-party scripts

Chat widgets, trackers, heatmaps, popups, social embeds, and booking tools all add overhead. Some are useful. Some are just baggage.

Review each script and ask:

- does it help conversion or operations?
- can it load later?
- can it be removed completely?

If a script is not earning its place, cut it.

## Step 4: Improve caching and delivery

Hosting and delivery matter. Modern platforms like Cloudflare Pages can reduce latency, cache static assets globally, and simplify deployment.

Even if you do not change your whole stack, you can still improve:

- cache headers
- asset fingerprinting
- CDN usage
- minified CSS and JavaScript

## Step 5: Simplify the layout where needed

Some pages are slow because they are trying to do too much visually. Heavy sliders, stacked animations, video backgrounds, and oversized sections all add cost.

A cleaner layout is often both faster and more effective. A site that gets to the point quickly tends to perform better in both speed tests and conversion tests.

## What to measure

Focus on real user experience, not just vanity scores. Pay attention to:

- Largest Contentful Paint
- Interaction to Next Paint
- Cumulative Layout Shift
- mobile load time on average connections

These numbers tell you more than whether your Lighthouse score moved from 88 to 91.

## Quick wins checklist

- compress images
- remove unused scripts
- cut unused font weights
- lazy-load below-the-fold assets
- enable caching
- reduce visual clutter

## Final thought

Speed optimization does not have to start with a redesign. In many projects, the fastest way to improve the experience is to remove weight, simplify the page, and ship cleaner assets. Start there before rebuilding the entire site.`
  },
  {
    id: "h3",
    slug: "how-to-choose-the-right-cms-for-a-service-business-website",
    title: "How to Choose the Right CMS for a Service Business Website",
    excerpt: "Compare the tradeoffs between simple editors, headless CMS setups, and fully custom builds for a service business website.",
    date: "2026-05-06T09:00:00Z",
    readTime: "7 min read",
    status: "published",
    tags: [
      {
        tag: "CMS"
      },
      {
        tag: "Content Strategy"
      },
      {
        tag: "Small Business"
      }
    ],
    contentMarkdown: `## The right CMS depends on who needs to use it

Choosing a CMS is not just a technical decision. It is an operations decision. The best system is the one your team can actually use without getting stuck, breaking layouts, or depending on a developer for every tiny change.

For most service businesses, the right CMS is the one that matches the real editing workflow.

## Step 1: Identify what the team needs to change

Start by listing the kinds of content that will change regularly:

- blog posts
- testimonials
- services
- project case studies
- team bios
- homepage offers

If the business only updates content once every few months, a very simple setup may be enough. If the team publishes weekly, the editing experience matters much more.

## Step 2: Decide how much flexibility editors need

Some teams need a clean form-based editor. Others need drag-and-drop freedom. Those are not the same thing.

In practice, too much freedom can create inconsistency. That is why structured content often works better for professional sites. Instead of letting editors design every section, give them controlled fields that keep content clean and on-brand.

## Step 3: Compare the main options

Here is a simple way to think about it:

### Basic page builder CMS
Good for fast edits and non-technical teams, but can become slow or messy over time.

### Headless CMS
Great when you want content flexibility and a fast custom frontend. Better for long-term structure, SEO control, and performance.

### Fully custom admin or lightweight content layer
Best when the content model is specific and you want tight control, but it takes more setup.

## Step 4: Think beyond editing

A CMS also affects:

- site speed
- SEO control
- security updates
- hosting workflow
- content governance

A system that is easy to edit but hard to maintain may cost more in the long run.

## Step 5: Test the editing experience before committing

If possible, create a sample workflow before you decide. Add a test blog post. Update a service page. Upload an image. Ask a non-technical user to try it.

That simple exercise often reveals more than a long feature comparison page.

## Signs you are choosing the wrong CMS

Watch for these warning signs:

- every edit requires developer help
- editors are afraid to publish
- the frontend becomes slower with every plugin
- content fields are confusing or too technical
- design consistency breaks after routine updates

## My rule of thumb

For modern service-business sites, I usually prefer a structured setup with a fast frontend and a predictable content model. It gives the client control without sacrificing performance.

That does not mean every site needs a complex headless stack. It means the system should be selected on purpose, not because it was the default.

## Final thought

The best CMS is not the one with the most features. It is the one that keeps publishing simple, content structured, and the site fast. If the team can update the right things confidently, the CMS is doing its job.`
  },
  {
    id: "h4",
    slug: "how-to-write-homepage-copy-that-turns-visitors-into-leads",
    title: "How to Write Homepage Copy That Turns Visitors Into Leads",
    excerpt: "Use clear messaging, trust signals, and strong calls to action to make your homepage easier to understand and easier to convert from.",
    date: "2026-05-05T15:00:00Z",
    readTime: "6 min read",
    status: "published",
    tags: [
      {
        tag: "Copywriting"
      },
      {
        tag: "Conversion"
      },
      {
        tag: "Marketing"
      }
    ],
    contentMarkdown: `## Clear copy beats clever copy

Homepage copy has one main job: help the right visitor understand the offer and take the next step. Too many homepages try to sound impressive instead of useful. The result is vague messaging, weak calls to action, and lower conversion.

Strong copy is simple, specific, and focused on the reader.

## Start with the headline

Your headline should answer what you do and who it is for. If it needs too much explanation, it is probably too vague.

Better homepage headlines usually:

- name the service clearly
- mention the audience or outcome
- avoid generic phrases like innovative solutions

Think clarity first.

## Add a short supporting paragraph

The line under your headline should explain the benefit. Not a life story. Not a manifesto. Just a practical summary of why someone should keep reading.

A good supporting line often explains:

- what the result looks like
- how the process feels
- what makes the offer different

## Use sections that answer real buying questions

Visitors usually want to know a few predictable things:

- what do you offer?
- is this right for me?
- can I trust you?
- what should I do next?

Build sections that answer those questions directly. This usually includes:

- a services section
- proof or portfolio
- testimonials or trust signals
- a process summary
- a call to action

## Write like a person, not a pitch deck

Natural language works better than inflated language. If a sentence sounds like it belongs in a corporate presentation, simplify it.

Compare:

- **We provide innovative digital transformation solutions**
- **We build fast, modern websites that help small businesses get more leads**

The second version is easier to understand and easier to trust.

## Make the call to action specific

Generic buttons like **Learn More** often underperform because they do not set expectations. Stronger calls to action tell the visitor what happens next.

Better examples:

- Book a Discovery Call
- Get a Quote
- Start Your Project
- See Recent Work

## Add proof near points of hesitation

Good homepage copy is not just about persuasion. It is also about reducing doubt. Add proof where someone might hesitate.

Useful proof can include:

- testimonials
- client results
- response time
- project examples
- years of experience

## Quick editing checklist

Review your homepage and ask:

- is the offer clear in the first screen?
- does the copy sound human?
- are the benefits specific?
- is the next step obvious?
- is there proof on the page?

## Final thought

Great homepage copy is not about saying more. It is about removing confusion. When the message is clear, relevant, and grounded in real business value, more visitors turn into leads.`
  },
  {
    id: "h5",
    slug: "how-to-create-a-landing-page-for-a-local-service-offer",
    title: "How to Create a Landing Page for a Local Service Offer",
    excerpt: "Plan a focused landing page for one service, one audience, and one action without turning it into a mini homepage.",
    date: "2026-05-04T09:00:00Z",
    readTime: "6 min read",
    status: "published",
    tags: [
      {
        tag: "Landing Pages"
      },
      {
        tag: "Local SEO"
      },
      {
        tag: "Leads"
      }
    ],
    contentMarkdown: `## A landing page should stay focused

One of the fastest ways to improve conversions is to create a dedicated landing page for a specific service instead of sending every visitor to the homepage. A good landing page speaks to one audience, one offer, and one next step.

That focus is what makes it work.

## Step 1: Define the exact offer

Start with one service, not your whole business. If you are a web designer, the offer might be:

- website redesign for restaurants
- landing pages for local service businesses
- ecommerce setup for small brands

The narrower the page goal, the easier it is to write and optimize.

## Step 2: Match the page to the traffic source

Think about where the visitor is coming from:

- Google search
- social ad
- email campaign
- referral link

The message on the page should feel like a continuation of that click. If the visitor searched for a specific need, the landing page should confirm they are in the right place immediately.

## Step 3: Use a simple structure

A solid local service landing page usually includes:

- a clear headline
- a short supporting statement
- one main call to action
- benefits or outcomes
- proof or examples
- a process section
- FAQs
- final CTA

You do not need a complicated layout. You need a logical one.

## Step 4: Include local context naturally

If local SEO matters, add geographic relevance in a useful way. Mention service areas where appropriate, but do not stuff city names everywhere.

Better local signals include:

- mentioning the city in the title and intro
- including local examples or case studies
- using location-aware FAQ content
- keeping contact details consistent

## Step 5: Reduce decision fatigue

Landing pages perform better when they remove extra options. Avoid large navigation menus, unrelated offers, or too many buttons competing for attention.

If the goal is to get someone to request a quote, let the page support that goal from top to bottom.

## Common mistakes

- using homepage-style navigation and distractions
- making the page too general
- leading with features instead of outcomes
- hiding the contact action too low on the page
- forgetting trust signals

## Final thought

A local service landing page works best when it is tight, specific, and relevant to the click that brought the visitor there. Keep the message focused, build trust quickly, and make the next step easy.`
  },
  {
    id: "h6",
    slug: "how-to-use-cloudflare-pages-to-deploy-a-fast-static-website",
    title: "How to Use Cloudflare Pages to Deploy a Fast Static Website",
    excerpt: "A practical workflow for deploying static websites with Cloudflare Pages, cleaner builds, and simpler global delivery.",
    date: "2026-05-03T09:00:00Z",
    readTime: "7 min read",
    status: "published",
    tags: [
      {
        tag: "Cloudflare"
      },
      {
        tag: "Deployment"
      },
      {
        tag: "Static Sites"
      }
    ],
    contentMarkdown: `## Why I like static deployment for modern business sites

For many business websites, a static frontend is a great fit. It is fast, predictable, secure, and easier to deploy globally. Cloudflare Pages makes that workflow even better because the deployment experience is simple and the edge delivery is strong.

If you want a clean path from build to production, this is one of the setups worth learning.

## Step 1: Build your site locally

Start with a frontend that can generate a production-ready output directory, usually something like \`dist/\`.

Before deploying, always check:

- the production build succeeds
- environment variables are set correctly
- forms and links still work
- SEO basics are present

A deployment platform does not fix a broken build.

## Step 2: Keep the project structure clean

Static site deployments go smoother when the project is organized clearly. Keep source files, public assets, and build output predictable. That makes it easier to debug and easier to hand off later.

In practice, I also keep deployment commands simple so there is less room for drift between local and production workflows.

## Step 3: Connect the project to Cloudflare Pages

You can deploy from Git integration or by pushing a built directory. Both work. The important thing is knowing where your final build output lives and making sure the environment variables match your build needs.

A clean deployment flow usually includes:

- a reproducible build command
- a known output directory
- project-level environment variables
- a custom domain after the first successful deploy

## Step 4: Optimize the static build

A static site can still be slow if the assets are heavy or the structure is messy. Before deploying, optimize:

- images
- font loading
- unnecessary JavaScript
- metadata and sitemap generation
- caching behavior where applicable

Fast hosting helps, but it does not replace good frontend hygiene.

## Step 5: Validate after deploy

After deployment, check the real site, not just the deploy log. I usually verify:

- homepage loads correctly
- internal pages resolve
- forms or API routes still behave as expected
- canonical tags and OG tags exist
- the custom domain returns the new version

## Where Cloudflare Pages fits best

This setup is especially good for:

- portfolio websites
- local business sites
- landing pages
- marketing sites
- content-focused sites with static builds

It is a strong option when performance and deployment simplicity matter.

## Final thought

Cloudflare Pages is not just useful because it is fast. It is useful because it encourages a cleaner deployment workflow. When your site builds predictably and publishes globally with minimal friction, you spend more time improving the product instead of babysitting hosting.`
  },
  {
    id: "h7",
    slug: "how-to-improve-local-seo-for-your-website-and-google-business-profile",
    title: "How to Improve Local SEO for Your Website and Google Business Profile",
    excerpt: "Use your website and Google Business Profile together so local customers can find you, trust you, and contact you faster.",
    date: "2026-05-02T09:00:00Z",
    readTime: "7 min read",
    status: "published",
    tags: [
      {
        tag: "SEO"
      },
      {
        tag: "Local Business"
      },
      {
        tag: "Google Business Profile"
      }
    ],
    contentMarkdown: `## Local SEO works best when your website and profile support each other

A lot of local businesses treat their website and Google Business Profile like separate assets. They are not. They should reinforce the same trust signals, service focus, and location relevance.

When both are aligned, local search visibility usually gets stronger.

## Step 1: Keep business details consistent

Make sure your business name, phone number, service area, and core offer are consistent everywhere. This applies to your website, business profile, contact page, footer, and directory listings.

Inconsistency creates confusion for users and weakens local trust signals.

## Step 2: Build better service pages

Your website needs more than a generic homepage. Create focused service pages that explain:

- what you offer
- who it is for
- where you provide it
- how people can contact you

These pages give search engines and visitors much clearer context.

## Step 3: Improve the Google Business Profile itself

Too many profiles are half-finished. Complete the basics:

- correct categories
- clear service description
- updated hours
- real photos
- recent posts or updates
- active review collection

A strong profile increases click-through and trust even before someone reaches the website.

## Step 4: Add local proof on your site

Local businesses benefit from visible context. That can include:

- city or region references
- local case studies
- neighborhood-specific service pages where appropriate
- testimonials from local clients
- maps or service-area details

The goal is to make the site feel grounded in the place you serve.

## Step 5: Make contact effortless

Local intent is often high intent. People searching locally may be ready to call now. Make sure your site supports that behavior with:

- obvious phone and email links
- short forms
- mobile-friendly contact buttons
- a clear response-time expectation

## What to avoid

- stuffing city names into every sentence
- creating thin duplicate location pages
- neglecting reviews
- using vague service descriptions
- hiding contact info

## Final thought

Better local SEO is usually not about tricks. It is about alignment. When your website, service pages, and Google Business Profile all reinforce the same offer and location signals, you make it easier for the right customers to find and trust you.`
  },
  {
    id: "h8",
    slug: "how-to-turn-an-ai-website-idea-into-a-feature-customers-will-use",
    title: "How to Turn an AI Website Idea Into a Feature Customers Will Use",
    excerpt: "Move past the hype by defining a real user problem, a narrow workflow, and a simple AI feature with measurable value.",
    date: "2026-05-01T09:00:00Z",
    readTime: "6 min read",
    status: "published",
    tags: [
      {
        tag: "AI"
      },
      {
        tag: "Product Strategy"
      },
      {
        tag: "Web Apps"
      }
    ],
    contentMarkdown: `## Start with the problem, not the model

A lot of teams say they want to add AI to their website, but what they really have is a vague idea, not a product feature. That usually leads to demos that look interesting but do not help customers do anything faster or better.

The strongest AI features solve one clear problem inside an existing workflow.

## Step 1: Define the user job

Ask what the visitor is trying to do. Some examples:

- choose the right service
- get a faster answer
- compare options
- summarize complex information
- generate a starting point

If the AI feature does not help with a real job, it is probably unnecessary.

## Step 2: Keep the first version narrow

The best first AI features are small and specific. Instead of building a general assistant for everything, build one tool for one high-friction task.

Examples:

- a style recommendation tool
- a quote-prep assistant
- a content brief generator
- a support FAQ summarizer

Narrow scope is easier to test and easier to improve.

## Step 3: Design the input and output carefully

AI features live or die on framing. The user should know what to enter and what kind of result to expect. Good UX matters as much as model quality.

Useful design questions include:

- what should the user type or select?
- how much context is needed?
- what should the output look like?
- what happens when the result is weak or uncertain?

## Step 4: Add guardrails

AI should not become a trust problem. Add boundaries around the output. Be clear when something is a suggestion, not a guarantee. Avoid pretending the tool is more accurate than it is.

Guardrails can include:

- limited scope
- fixed prompt templates
- review steps
- disclaimers where appropriate
- fallback paths when the output fails

## Step 5: Measure whether it actually helps

Once the feature is live, track behavior that matters. Useful signals might be:

- completion rate
- follow-up conversions
- time saved
- repeat usage
- support reduction

If nobody uses it or it does not improve a real outcome, refine or remove it.

## Final thought

The right AI feature does not need to feel magical. It needs to feel useful. When you connect it to a real customer task, keep the scope tight, and design it with clear expectations, the feature has a much better chance of becoming part of the product instead of a temporary novelty.`
  },
  {
    id: "h9",
    slug: "how-to-build-a-portfolio-website-that-wins-better-clients",
    title: "How to Build a Portfolio Website That Wins Better Clients",
    excerpt: "Position your work, process, and offer so your portfolio attracts stronger-fit projects instead of random low-intent inquiries.",
    date: "2026-04-30T09:00:00Z",
    readTime: "6 min read",
    status: "published",
    tags: [
      {
        tag: "Portfolio"
      },
      {
        tag: "Freelancing"
      },
      {
        tag: "Web Design"
      }
    ],
    contentMarkdown: `## A portfolio should qualify, not just impress

Many portfolio sites focus only on showing visuals. That matters, but it is not enough. A strong portfolio should also help the right client understand what kind of work you do, who you help, and why they should trust you.

In other words, it should attract better-fit inquiries.

## Step 1: Show the type of work you want more of

If your portfolio is full of mixed, unrelated work, potential clients may struggle to place you. Lead with projects that reflect the kind of work you want going forward.

That might mean prioritizing:

- service-business websites
- ecommerce work
- SaaS landing pages
- brand refreshes
- conversion-focused redesigns

## Step 2: Add context, not just screenshots

Good case studies explain the business problem, the approach, and the result. Even a short project summary is better than a gallery with no explanation.

Helpful case study sections include:

- client or project type
- challenge
- solution
- tools used
- result or outcome

## Step 3: Clarify your process

Clients feel more confident when they understand how the work will move. A simple process section helps reduce uncertainty.

It can be as simple as:

1. discovery
2. strategy and scope
3. design and build
4. launch and support

## Step 4: Make the offer easy to understand

Your site should explain whether you offer one-off builds, ongoing support, strategy, or productized packages. If everything is vague, inquiries often stay vague too.

Strong positioning helps the client self-select.

## Step 5: Use calls to action that match buyer intent

A portfolio visitor is often evaluating fit. Give them a clear next step such as:

- Book a Discovery Call
- Start a Project Inquiry
- View More Case Studies

Avoid making them hunt for how to contact you.

## Final thought

The best portfolio website is not the one with the fanciest transitions. It is the one that helps the right client quickly say, this is exactly the kind of person I want to work with. Clear positioning and strong project context do more for that than visual effects alone.`
  },
  {
    id: "h10",
    slug: "how-to-plan-monthly-website-maintenance-without-guesswork",
    title: "How to Plan Monthly Website Maintenance Without Guesswork",
    excerpt: "Create a simple monthly website maintenance routine for content, performance, SEO, forms, and security checks.",
    date: "2026-04-29T09:00:00Z",
    readTime: "5 min read",
    status: "published",
    tags: [
      {
        tag: "Website Maintenance"
      },
      {
        tag: "SEO"
      },
      {
        tag: "Operations"
      }
    ],
    contentMarkdown: `## Maintenance is easier when it becomes a repeatable system

A website should not be treated like a one-time deliverable. Once it is live, it needs regular review. That does not mean constant redesign. It means having a simple monthly routine that keeps the site healthy, accurate, and useful.

The goal is consistency, not complexity.

## What monthly maintenance should cover

A good maintenance checklist usually touches five areas:

- content accuracy
- lead flow or conversions
- performance
- SEO basics
- technical health

You do not need a huge audit every month. You need a reliable habit.

## Step 1: Review core pages for accuracy

Start with the pages that matter most:

- homepage
- service pages
- contact page
- pricing or offer pages
- top blog posts

Check whether anything is outdated, unclear, or inconsistent.

## Step 2: Test the lead path

Make sure the site still does the job it was built to do. Submit the contact form. Click the main CTA buttons. Check email delivery. Review analytics if you have them.

It is easy for small issues to go unnoticed when nobody is actively testing the path.

## Step 3: Check speed and broken experiences

Review the site on mobile and desktop. Look for:

- slow image-heavy sections
- broken layouts
- missing assets
- dead links
- outdated embeds or scripts

A quick manual pass catches problems that dashboards often miss.

## Step 4: Refresh SEO basics

Review titles, descriptions, internal links, and new content opportunities. If the business has recent work, a new offer, or a seasonal push, the site should reflect that.

SEO is not only about ranking. It is also about keeping the site aligned with what the business is actively selling.

## Step 5: Track changes in one place

Keep a simple monthly log of what changed. That can include:

- pages updated
- issues fixed
- performance observations
- content ideas
- next actions

This makes maintenance easier to manage over time and easier to explain to clients or teammates.

## Final thought

Website maintenance becomes manageable when it is operationalized. A short monthly routine keeps small issues from turning into larger problems and helps the website stay useful long after launch.`
  }
];

// src/seed-data.ts
var seedPosts = [
  ...how_to_posts_default,
  ...generated_rss_posts_default,
  {
    id: "f1",
    slug: "building-cms-for-non-developer-team-members-and-users",
    title: "Building CMS for Non-Developer Team Members & Users",
    excerpt: "How I design CMS workflows that let clients, staff, and non-technical users publish content confidently without touching code.",
    date: "2026-05-05",
    readTime: "6 min read",
    status: "published",
    tags: [{ tag: "CMS" }, { tag: "UX" }, { tag: "Clients" }],
    contentMarkdown: `## A CMS Should Feel Like a Tool, Not a Trap

A good CMS is not just a database with an admin panel. It is the workspace a real team uses when the developer is not in the room.

For non-developer team members, the difference between a useful CMS and a confusing one is clarity: obvious fields, plain-language labels, safe defaults, and workflows that match how people already think about their content.

## Start With the User, Not the Schema

Before building collections, I map out who will actually use the system:

- **Owners** who need to update offers, services, and announcements
- **Marketing teams** who publish posts and landing pages
- **Staff members** who upload images or edit simple details
- **Developers** who still need clean APIs and predictable data

The CMS has to serve all of them without making every user think like an engineer.

## Make Fields Self-Explanatory

Non-technical users should not have to guess what a field does. I use labels, descriptions, placeholders, and grouped sections to make the editing experience feel guided.

Instead of exposing raw implementation details, the CMS should speak in business language:

- \u201CPage headline\u201D instead of \u201CheroTitle\u201D
- \u201CShort summary\u201D instead of \u201Cexcerpt\u201D when the client needs plain wording
- \u201CPublish status\u201D instead of ambiguous flags

## Build Guardrails Into the Workflow

A CMS for real users needs guardrails. That means required fields where content would break without them, select fields where consistency matters, and drafts when publishing should be reviewed first.

Good guardrails reduce mistakes without slowing people down.

## Keep the Frontend Bound to the CMS

The frontend should read from the CMS as the source of truth. Static fallback data is useful for development and emergency builds, but live content should come from the editorial system.

That gives the client a simple promise: update the CMS, rebuild or refresh the site, and the content changes are reflected online.

## The Goal Is Confidence

The best CMS experience gives non-developer users confidence. They know where to go, what to edit, what will happen when they publish, and how to recover if something is not ready yet.

That is the difference between handing over a website and handing over a working content system.`
  }
];

// src/db.ts
var dataDir = join(import.meta.dir, "..", "data");
var dbPath = process.env.DATABASE_PATH || join(dataDir, "kurtmorales.db");
mkdirSync(dirname(dbPath), { recursive: true });
var db = new Database(dbPath, { create: true });
db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content_markdown TEXT,
    date TEXT NOT NULL,
    read_time TEXT,
    tags TEXT NOT NULL DEFAULT '[]',
    cover_url TEXT,
    cover_alt TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT,
    tech TEXT,
    description TEXT,
    link TEXT,
    image_url TEXT,
    image_alt TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS templates (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    thumbnail_url TEXT,
    thumbnail_alt TEXT,
    demo_url TEXT,
    source_url TEXT,
    tech TEXT,
    tags TEXT NOT NULL DEFAULT '[]',
    featured INTEGER NOT NULL DEFAULT 0,
    price REAL NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS subscribers (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    status TEXT NOT NULL DEFAULT 'subscribed' CHECK(status IN ('subscribed', 'unsubscribed')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS newsletters (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    preheader TEXT,
    content_markdown TEXT,
    html TEXT,
    text TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'sending', 'sent')),
    sent_at TEXT,
    recipients_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    project TEXT,
    budget TEXT,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
  CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
  CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(date DESC);
  CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON projects(sort_order ASC);
  CREATE INDEX IF NOT EXISTS idx_templates_sort_order ON templates(sort_order ASC);
  CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
  CREATE INDEX IF NOT EXISTS idx_newsletters_status ON newsletters(status);
`);
function parseTags(value) {
  if (!value)
    return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed))
      return [];
    return parsed.map((item) => {
      if (typeof item === "string")
        return { tag: item };
      if (item && typeof item === "object" && "tag" in item && typeof item.tag === "string") {
        return { tag: item.tag };
      }
      return null;
    }).filter((item) => item !== null);
  } catch {
    return [];
  }
}
function toPost(row) {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    excerpt: String(row.excerpt),
    contentMarkdown: row.content_markdown ? String(row.content_markdown) : undefined,
    date: String(row.date),
    readTime: row.read_time ? String(row.read_time) : undefined,
    tags: parseTags(row.tags ? String(row.tags) : "[]"),
    cover: row.cover_url ? { url: String(row.cover_url), alt: row.cover_alt ? String(row.cover_alt) : undefined } : undefined,
    status: String(row.status)
  };
}
function toProject(row) {
  return {
    id: String(row.id),
    title: String(row.title),
    type: row.type ? String(row.type) : undefined,
    tech: row.tech ? String(row.tech) : undefined,
    description: row.description ? String(row.description) : undefined,
    link: row.link ? String(row.link) : undefined,
    image: row.image_url ? { url: String(row.image_url), alt: row.image_alt ? String(row.image_alt) : undefined } : undefined,
    order: row.sort_order ? Number(row.sort_order) : 0
  };
}
function toTemplate(row) {
  return {
    id: String(row.id),
    title: String(row.title),
    description: String(row.description),
    thumbnail: row.thumbnail_url ? { url: String(row.thumbnail_url), alt: row.thumbnail_alt ? String(row.thumbnail_alt) : undefined } : undefined,
    demoUrl: row.demo_url ? String(row.demo_url) : undefined,
    sourceUrl: row.source_url ? String(row.source_url) : undefined,
    tech: row.tech ? String(row.tech) : undefined,
    tags: parseTags(row.tags ? String(row.tags) : "[]"),
    featured: Number(row.featured ?? 0) === 1,
    price: Number(row.price ?? 0),
    order: Number(row.sort_order ?? 0)
  };
}
function toSubscriber(row) {
  return {
    id: String(row.id),
    email: String(row.email),
    name: row.name ? String(row.name) : undefined,
    status: String(row.status)
  };
}
function toNewsletter(row) {
  return {
    id: String(row.id),
    title: String(row.title),
    subject: String(row.subject),
    preheader: row.preheader ? String(row.preheader) : undefined,
    contentMarkdown: row.content_markdown ? String(row.content_markdown) : undefined,
    html: row.html ? String(row.html) : undefined,
    text: row.text ? String(row.text) : undefined,
    status: String(row.status),
    sentAt: row.sent_at ? String(row.sent_at) : undefined,
    recipientsCount: Number(row.recipients_count ?? 0)
  };
}
function getDbPath() {
  return dbPath;
}
function getHealthSummary() {
  const counts = db.query(`
      SELECT
        (SELECT COUNT(*) FROM posts) AS posts,
        (SELECT COUNT(*) FROM projects) AS projects,
        (SELECT COUNT(*) FROM templates) AS templates,
        (SELECT COUNT(*) FROM subscribers) AS subscribers,
        (SELECT COUNT(*) FROM newsletters) AS newsletters,
        (SELECT COUNT(*) FROM contact_messages) AS contactMessages
    `).get();
  return {
    dbPath,
    counts
  };
}
function listPosts(options = {}) {
  let sql = "SELECT * FROM posts";
  const clauses = [];
  const params = [];
  if (options.status) {
    clauses.push("status = ?");
    params.push(options.status);
  }
  if (options.slug) {
    clauses.push("slug = ?");
    params.push(options.slug);
  }
  if (clauses.length > 0) {
    sql += ` WHERE ${clauses.join(" AND ")}`;
  }
  if (options.sort) {
    const sortField = options.sort.startsWith("-") ? options.sort.slice(1) : options.sort;
    const sortDirection = options.sort.startsWith("-") ? "DESC" : "ASC";
    const validFields = ["date", "created_at", "title", "slug"];
    const field = validFields.includes(sortField) ? sortField : "date";
    sql += ` ORDER BY ${field} ${sortDirection}`;
  } else {
    sql += " ORDER BY date DESC";
  }
  sql += " LIMIT ?";
  params.push(options.limit ?? 150);
  return db.prepare(sql).all(...params).map(toPost);
}
function listProjects(limit = 50) {
  return db.prepare("SELECT * FROM projects ORDER BY sort_order ASC, created_at ASC LIMIT ?").all(limit).map(toProject);
}
function listTemplates(limit = 50) {
  return db.prepare("SELECT * FROM templates ORDER BY sort_order ASC, created_at ASC LIMIT ?").all(limit).map(toTemplate);
}
function listSubscribers(limit = 1000) {
  return db.prepare("SELECT * FROM subscribers ORDER BY created_at DESC LIMIT ?").all(limit).map(toSubscriber);
}
function createSubscriber(input) {
  const email = input.email.trim().toLowerCase();
  const name = input.name?.trim() || null;
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO subscribers (id, email, name, status, created_at, updated_at)
    VALUES (?, ?, ?, 'subscribed', ?, ?)
    ON CONFLICT(email) DO UPDATE SET
      name = excluded.name,
      status = 'subscribed',
      updated_at = excluded.updated_at
  `).run(id, email, name, now, now);
  const row = db.prepare("SELECT * FROM subscribers WHERE email = ? LIMIT 1").get(email);
  return toSubscriber(row);
}
function createContactMessage(input) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO contact_messages (id, name, email, project, budget, message, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, input.name.trim(), input.email.trim().toLowerCase(), input.project?.trim() || null, input.budget?.trim() || null, input.message.trim(), now);
  return {
    id,
    createdAt: now
  };
}
function listNewsletters(limit = 50) {
  return db.prepare("SELECT * FROM newsletters ORDER BY created_at DESC LIMIT ?").all(limit).map(toNewsletter);
}
function getNewsletterById(id) {
  const row = db.prepare("SELECT * FROM newsletters WHERE id = ? LIMIT 1").get(id);
  return row ? toNewsletter(row) : null;
}
function updateNewsletter(id, patch) {
  const current = getNewsletterById(id);
  if (!current)
    return null;
  db.prepare(`
    UPDATE newsletters
    SET
      title = ?,
      subject = ?,
      preheader = ?,
      content_markdown = ?,
      html = ?,
      text = ?,
      status = ?,
      sent_at = ?,
      recipients_count = ?,
      updated_at = ?
    WHERE id = ?
  `).run(patch.title ?? current.title, patch.subject ?? current.subject, patch.preheader ?? current.preheader ?? null, patch.contentMarkdown ?? current.contentMarkdown ?? null, patch.html ?? current.html ?? null, patch.text ?? current.text ?? null, patch.status ?? current.status, patch.sentAt ?? current.sentAt ?? null, patch.recipientsCount ?? current.recipientsCount ?? 0, new Date().toISOString(), id);
  return getNewsletterById(id);
}

// src/server.ts
var port = Number(process.env.PORT || 3001);
var allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000,https://kurtmorales.com").split(",").map((value) => value.trim()).filter(Boolean);
var adminSecret = process.env.BACKEND_ADMIN_SECRET || "";
function corsHeaders(request) {
  const origin = request.headers.get("origin");
  const allowOrigin = origin && allowedOrigins.includes(origin) ? origin : "*";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin"
  };
}
function json(request, body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(request),
      ...headers
    }
  });
}
function text(request, body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      ...corsHeaders(request)
    }
  });
}
function parseLimit(value, fallback) {
  if (!value)
    return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : fallback;
}
function isAuthorized(request) {
  if (!adminSecret)
    return false;
  return request.headers.get("authorization") === `Bearer ${adminSecret}`;
}
async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
var server = Bun.serve({
  port,
  async fetch(request) {
    const url = new URL(request.url);
    const { pathname, searchParams } = url;
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }
    try {
      if (pathname === "/") {
        return text(request, `KurtMorales Bun backend running on :${port}
DB: ${getDbPath()}`);
      }
      if ((pathname === "/health" || pathname === "/api/health") && request.method === "GET") {
        return json(request, {
          ok: true,
          service: "kurtmorales-backend",
          ...getHealthSummary()
        });
      }
      if (pathname === "/api/posts" && request.method === "GET") {
        const docs = listPosts({
          status: searchParams.get("where[status][equals]") ?? undefined,
          slug: searchParams.get("where[slug][equals]") ?? undefined,
          limit: parseLimit(searchParams.get("limit"), 150),
          sort: searchParams.get("sort") ?? "-date"
        });
        return json(request, { docs, totalDocs: docs.length, limit: docs.length });
      }
      if (pathname === "/api/projects" && request.method === "GET") {
        const docs = listProjects(parseLimit(searchParams.get("limit"), 50));
        return json(request, { docs, totalDocs: docs.length, limit: docs.length });
      }
      if (pathname === "/api/templates" && request.method === "GET") {
        const docs = listTemplates(parseLimit(searchParams.get("limit"), 50));
        return json(request, { docs, totalDocs: docs.length, limit: docs.length });
      }
      if (pathname === "/api/subscribers" && request.method === "GET") {
        const docs = listSubscribers(parseLimit(searchParams.get("limit"), 1000));
        return json(request, { docs, totalDocs: docs.length, limit: docs.length });
      }
      if (pathname === "/api/subscribers" && request.method === "POST") {
        const body = await readJson(request);
        if (!body?.email || !/^\S+@\S+\.\S+$/.test(body.email)) {
          return json(request, { error: "A valid email is required" }, 400);
        }
        const doc = createSubscriber({ email: body.email, name: body.name });
        return json(request, { doc }, 201);
      }
      if (pathname === "/api/contact" && request.method === "POST") {
        const body = await readJson(request);
        if (!body?.name?.trim()) {
          return json(request, { error: "Name is required" }, 400);
        }
        if (!body?.email || !/^\S+@\S+\.\S+$/.test(body.email)) {
          return json(request, { error: "A valid email is required" }, 400);
        }
        if (!body?.message?.trim()) {
          return json(request, { error: "Message is required" }, 400);
        }
        const doc = createContactMessage({
          name: body.name,
          email: body.email,
          project: body.project,
          budget: body.budget,
          message: body.message
        });
        return json(request, { success: true, doc }, 201);
      }
      if (pathname === "/api/newsletters" && request.method === "GET") {
        const docs = listNewsletters(parseLimit(searchParams.get("limit"), 50));
        return json(request, { docs, totalDocs: docs.length, limit: docs.length });
      }
      const newsletterMatch = pathname.match(/^\/api\/newsletters\/([^/]+)$/);
      if (newsletterMatch) {
        const id = decodeURIComponent(newsletterMatch[1]);
        if (request.method === "GET") {
          const doc = getNewsletterById(id);
          return doc ? json(request, { doc }) : json(request, { error: "Not found" }, 404);
        }
        if (request.method === "PATCH") {
          if (!isAuthorized(request)) {
            return json(request, { error: "Unauthorized" }, 401);
          }
          const body = await readJson(request);
          if (!body) {
            return json(request, { error: "Invalid JSON body" }, 400);
          }
          const status = body.status;
          if (status !== undefined && status !== "draft" && status !== "sending" && status !== "sent") {
            return json(request, { error: "Invalid newsletter status" }, 400);
          }
          const doc = updateNewsletter(id, {
            title: typeof body.title === "string" ? body.title : undefined,
            subject: typeof body.subject === "string" ? body.subject : undefined,
            preheader: typeof body.preheader === "string" ? body.preheader : undefined,
            contentMarkdown: typeof body.contentMarkdown === "string" ? body.contentMarkdown : undefined,
            html: typeof body.html === "string" ? body.html : undefined,
            text: typeof body.text === "string" ? body.text : undefined,
            status: typeof status === "string" ? status : undefined,
            sentAt: typeof body.sentAt === "string" ? body.sentAt : undefined,
            recipientsCount: typeof body.recipientsCount === "number" ? body.recipientsCount : undefined
          });
          return doc ? json(request, { doc }) : json(request, { error: "Not found" }, 404);
        }
      }
      return json(request, { error: "Not found" }, 404);
    } catch (error) {
      console.error("[backend]", error);
      return json(request, { error: "Internal server error", details: String(error) }, 500);
    }
  }
});
console.log(`\uD83D\uDE80 KurtMorales backend listening on http://localhost:${server.port}`);
console.log(`\uD83D\uDDC4\uFE0F  SQLite database: ${getDbPath()}`);
