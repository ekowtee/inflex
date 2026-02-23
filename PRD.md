# Inflexions I.T. Services Website Product Specification

## 1. Project Overview

### 1.1 Project Summary
Development of a comprehensive, modern website for Inflexions I.T. Services Ltd. to establish global brand credibility, generate qualified leads, showcase expertise, and position the company for international growth.

### 1.2 Business Objectives
- Establish global brand authority in IT integration services
- Increase qualified lead generation by 35%
- Improve conversion rates from website visitors
- Support recruitment of top technical talent
- Enable content marketing strategy
- Showcase expanded service offerings including Cloud and Cybersecurity

### 1.3 Target Audience
- C-level executives and IT decision-makers
- IT managers seeking integration services
- Potential technology partners
- Prospective employees with technical expertise
- Current clients seeking support and resources

## 2. Technical Specifications

### 2.1 Technology Stack
- **Frontend**:
  - React (UI library)
  - Next.js (React framework with App Router)
  - Tailwind CSS (utility-first styling)
  - TypeScript (type safety)
  
- **Backend**:
  - Next.js API routes
  - Node.js runtime
  
- **Database**:
  - PostgreSQL (primary database)
  - Prisma ORM (database access layer)
  
- **Authentication**:
  - NextAuth.js with JWT

- **Development Tools**:
  - Cursor (code editor)
  - ESLint (code quality)
  - Prettier (code formatting)
  - Git/GitHub (version control)

- **Deployment**:
  - Vercel (hosting and deployment)
  - GitHub Actions (CI/CD)

- **Analytics & Monitoring**:
  - Google Analytics 4
  - Sentry (error tracking)

- **SEO Tools**:
  - next-seo package
  - Structured data implementation

### 2.2 Infrastructure Requirements
- PostgreSQL database instance
- Vercel account for deployment
- GitHub repository
- Domain name and DNS configuration
- SSL certificate (provided by Vercel)

### 2.3 Integration Requirements
- Email marketing platform API (for lead capture)
- Google Analytics
- LinkedIn API (optional, for team profiles)
- CRM system for lead management (future phase)

## 3. Design Specifications (Based on Figma Prototype)

### 3.1 Brand Identity

#### 3.1.1 Corporate Colors
- **Primary Red**: #D0281F (Used for logo, primary CTAs, accent elements)
- **Secondary Gray**: #8F8D8D (Used for "IT" in logo, secondary elements)

**Blue Palette**:
- #E8EFF9 (very light blue)
- #B0CBEC (light blue)
- #77A7E0 (medium blue)
- #3D83D3 (blue)

**Dark Blue Palette**:
- #0047AB (royal blue)
- #00337D (medium dark blue)
- #002050 (dark blue)
- #001638 (very dark blue)
- #000A1B (near black blue)

**Orange/Brown Palette**:
- #FBE5D6 (very light peach)
- #F8CBAD (light peach)
- #F5A065 (light orange)
- #F27B23 (orange)
- #C35A11 (brown-orange)
- #8A3D0A (dark brown)

**Neutral Colors**:
- **Black**: #000000 (Text)
- **White**: #FFFFFF (Background, text on dark elements)
- **Gray Scale**:
  - #F2F2F2 (very light gray)
  - #E6E6E6 (light gray)
  - #D0D0D0 (light medium gray)
  - #A6A6A6 (medium gray)
  - #8C8C8C (medium dark gray)
  - #737373 (dark gray)
  - #595959 (darker gray)
  - #404040 (very dark gray)
  - #262626 (near black gray)

**Status Colors**:
- Red (#D0281F) - Error/Warning states
- Pink/Light Red - Mild warning states
- Green - Success states
- Mint Green - Information states

#### 3.1.2 Typography
- **Primary Font**: Sans-serif (appears to be a clean, modern sans-serif font)
  - Headings: Bold weight for impact
  - Subheadings: Medium weight
  - Body: Regular weight
- **Base size**: 16px (1rem)
- **Scale**: Follows standard typographic hierarchy

#### 3.1.3 Logo
- "INFLEXIONS" in primary red (#D0281F)
- "IT" in secondary gray (#8F8D8D)
- Stylized graphic element resembling a star/person with arms raised
- Combined red and gray elements with 3D/angular effect
- Conveys technology, dynamism, and professionalism

### 3.2 Layout Components

#### 3.2.1 Header
- Fixed position navigation bar
- Logo on left side
- Main navigation links horizontally aligned
- Contact CTA button with red background (#D0281F)
- Dropdown menus for Solutions and Services
- Mobile: Hamburger menu with animated dropdown
- Social media icons in navigation area
- Clean white background

#### 3.2.2 Hero Section
- Full-width design with professional background image
- Left-aligned text content with bold headline
- "Request consultation" CTA button in primary red
- Subtle overlay for text readability
- Strong headline "Architecting Your Future: Resilient IT Solutions for Global Ambition"
- Concise supporting copy

#### 3.2.3 Partners/Clients Strip
- Horizontal scrolling/static display of client logos
- Clean layout with consistent sizing
- Positioned directly below hero section

#### 3.2.4 Content Block Components
- Strategic Partner section with hexagonal graphic element
- Solution cards with distinctive red and white color scheme
- Image-based content blocks with overlay text
- Clean separation between sections
- Two-column and multi-column layouts
- Rounded corners on UI elements

#### 3.2.5 CTA Components
- Red background call-to-action sections
- "Call for a Quote" highlighted sections with contact information
- Red buttons with white text
- Secondary outline buttons when needed

#### 3.2.6 Team/Testimonial Components
- Professional headshots with names and titles
- Clean card-based layout
- Rating indicators (stars)
- Brief quote or expertise description

#### 3.2.7 Section Layouts
- Alternating content/image layouts
- Appropriate vertical padding between major sections
- Max-width container with responsive margins
- Grid-based layouts
- Consistent spacing system

#### 3.2.8 Footer
- Brand-consistent design
- Multi-column layout
- Logo placement
- Social media icons
- Navigation links grouped by category
- Contact information section
- Copyright and legal links

## 4. Site Architecture

### 4.1 Information Architecture

- **Home**
  - Hero section with "Architecting Your Future" headline
  - Partners/clients logo strip
  - "Your Strategic Technology Partner" section with hexagonal graphic
  - Solution categories with cards layout
  - "Visit The Difference, Everyday" section with multi-card layout
  - "Proven Expertise, Trusted In Action" section
  - Technology Partners logo section
  - "Our Client Say" testimonial section
  - "Ready to Transform Your Technology Landscape?" CTA banner

- **About Us**
  - "ABOUT INFLEXIONS-IT" hero section
  - "Engineering the Future of Business" content section
  - Infrastructure/STO hosting section with data center imagery
  - "Call for a Quote" highlighted section
  - "Professional team ready to serve you" team member showcase
  - "Move Your Business Forward" section with supporting content
  - Partner logos section
  - "Recent Case Studies" featured work section
  - Location/map section with contact details

- **Solutions**
  - Hero section with "Integrated IT Solutions to Power Your Business Engines" headline
  - "Technology Solutions" overview section with red content block
  - Solutions grid with four categories:
    - Network Infrastructure
    - Data Security
    - Cloud Services
    - Data-centric Solutions
  - Central "Integrated Solutions To Power Your Business Engine" value proposition
  - Industry-specific solutions section with four categories:
    - Local Transportation
    - Strategic Solutions
    - Logistics
    - Warehouse & Distribution
  - "Proven Expertise, Training Solutions" section
  - Technology Partners logo grid
  - Client testimonial section

- **Services**
  - Hero section with "Flexible I.T Service Models Tailored to your needs" headline
  - Service delivery overview with featured image
  - "Our IT Service Delivery Models" section with supporting text
  - Service categories with alternating layout:
    - Professional Services (01)
    - Managed Services (02)
    - Support Services (03)
  - Each service with numbered icon, description and supporting image
  - "Read More" CTAs for each service category

- **Contact**
  - Hero section with "How can we help you?" headline
  - Red contact form section with:
    - "Get in touch with us" heading
    - Form fields (Name, Phone, Email, Message)
    - Contact method icons (email, phone, location)
  - Partners section with logo display
  - FAQ section with accordion-style questions
  - Secondary CTA with "You Need to Know? Call Now" heading

- **Solutions** (Parent page)
  - Overview grid of all solution categories
  - Client success metrics
  - Partnership logos

- **Solution Detail Pages** (8 total):
  - Hero with solution-specific imagery
  - Key benefits (icon cards)
  - Approach methodology
  - Technology partners
  - Related case studies
  - FAQ accordion
  - Contact CTA

- **Services**
  - Professional Services
  - Managed Services
  - Support Services
  - Cloud Services
  - Cybersecurity Services

- **Case Studies**
  - Filterable card gallery
  - Industry and solution type filters
  - Individual case study detail pages with results metrics

- **Partners**
  - Partner logos in grid layout
  - Partnership tiers
  - Partner program information
  - Become a partner form

- **Resources**
  - Blog with featured post hero
  - Categorized content cards
  - Search functionality
  - Resource library (whitepapers, webinars)

- **Careers**
  - Culture showcase with team photos
  - Benefits cards
  - Current openings
  - Application process steps

- **Contact**
  - Contact form with solution interest dropdown
  - Office locations with map
  - Direct contact cards for departments
  - Support options

### 4.2 Navigation Structure

#### 4.2.1 Main Navigation
- Logo (links to home)
- Home
- About
- Solutions
- Services
- Case Study
- Careers
- Social media icons (Instagram, Facebook, Twitter, LinkedIn)
- Contact us (button with red background)

#### 4.2.2 Footer Navigation
- **Company**
  - About Us
  - Leadership
  - Careers
  - Corporate Responsibility
  - Contact Us
- **Solutions**
  - (All solution pages)
- **Services**
  - (All service pages)
- **Resources**
  - Blog
  - Case Studies
  - Whitepapers
  - Events
- **Legal**
  - Privacy Policy
  - Terms of Service
  - Cookie Policy

### 4.3 User Flows

1. **Lead Generation Flow**
   - Home → Solutions → Solution Detail → Contact/Request Consultation
   
2. **Case Study Exploration Flow**
   - Home → Case Studies → Filter by Industry → Read Case Study → Related Solutions
   
3. **Resource Access Flow**
   - Home → Resources → Blog/Whitepaper → Lead Capture Form → Download/Access
   
4. **Career Application Flow**
   - Home → Careers → Open Position → Application Form

## 5. Database Schema

### 5.1 Core Entities (Prisma Schema)

```prisma
// Team Members
model TeamMember {
  id             String   @id @default(cuid())
  name           String
  title          String
  department     String
  bio            String
  photoUrl       String?
  linkedInUrl    String?
  email          String?
  displayOrder   Int
  isLeadership   Boolean  @default(false)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

// Solutions
model Solution {
  id               String         @id @default(cuid())
  title            String
  slug             String         @unique
  shortDescription String
  fullDescription  String
  iconUrl          String?
  heroImageUrl     String?
  displayOrder     Int
  isActive         Boolean        @default(true)
  metaTitle        String?
  metaDescription  String?
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt
  caseStudies      CaseStudy[]
  components       SolutionComponent[]
  technologies     SolutionTechnology[]
  benefits         SolutionBenefit[]
}

// Solution Benefits
model SolutionBenefit {
  id          String   @id @default(cuid())
  title       String
  description String
  iconUrl     String?
  solutionId  String
  solution    Solution @relation(fields: [solutionId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Solution Components
model SolutionComponent {
  id          String   @id @default(cuid())
  title       String
  description String
  solutionId  String
  solution    Solution @relation(fields: [solutionId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Solution Technologies
model SolutionTechnology {
  id          String   @id @default(cuid())
  name        String
  logoUrl     String?
  solutionId  String
  solution    Solution @relation(fields: [solutionId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Case Studies
model CaseStudy {
  id             String      @id @default(cuid())
  title          String
  slug           String      @unique
  clientName     String
  clientIndustry String
  challenge      String
  solution       String
  outcomes       String
  testimonial    String?
  testimonialBy  String?
  logoUrl        String?
  imageUrl       String?
  isActive       Boolean     @default(true)
  isFeatured     Boolean     @default(false)
  displayOrder   Int
  metaTitle      String?
  metaDescription String?
  solutionId     String
  solution       Solution    @relation(fields: [solutionId], references: [id])
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt
}

// Blog Posts
model BlogPost {
  id               String      @id @default(cuid())
  title            String
  slug             String      @unique
  excerpt          String
  content          String
  authorId         String
  imageUrl         String?
  isPublished      Boolean     @default(false)
  isFeatured       Boolean     @default(false)
  publishedDate    DateTime?
  metaTitle        String?
  metaDescription  String?
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt
  tags             BlogTag[]
}

// Blog Tags
model BlogTag {
  id        String      @id @default(cuid())
  name      String
  slug      String      @unique
  posts     BlogPost[]
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
}

// Partners
model Partner {
  id          String   @id @default(cuid())
  name        String
  description String?
  logoUrl     String
  websiteUrl  String?
  tier        String?
  isActive    Boolean  @default(true)
  displayOrder Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Contact Submissions
model ContactSubmission {
  id            String    @id @default(cuid())
  name          String
  email         String
  company       String?
  phone         String?
  message       String
  solutionInterest String?
  isProcessed   Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

// Job Postings
model JobPosting {
  id             String     @id @default(cuid())
  title          String
  slug           String     @unique
  department     String
  location       String
  employmentType String
  description    String
  requirements   String
  isActive       Boolean    @default(true)
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
  applications   JobApplication[]
}

// Job Applications
model JobApplication {
  id           String     @id @default(cuid())
  name         String
  email        String
  phone        String?
  resumeUrl    String
  coverLetter  String?
  jobPostingId String
  jobPosting   JobPosting @relation(fields: [jobPostingId], references: [id])
  status       String     @default("received")
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
}

// Company Values
model CompanyValue {
  id          String   @id @default(cuid())
  title       String
  description String
  iconUrl     String?
  displayOrder Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Testimonials
model Testimonial {
  id           String   @id @default(cuid())
  quote        String
  author       String
  position     String?
  company      String?
  logoUrl      String?
  photoUrl     String?
  displayOrder Int
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

// FAQ Items
model FaqItem {
  id         String   @id @default(cuid())
  question   String
  answer     String
  category   String?
  solutionId String?
  displayOrder Int
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

// Configuration and Settings
model SiteConfig {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 6. Feature Specifications

## 6. Page Implementation Specifications

### 6.1 Home Page

#### 6.1.1 Hero Section
- Full-width banner with professional image of technology professionals
- Headline: "Architecting Your Future: Resilient IT Solutions for Global Ambition"
- Brief supporting text describing core value proposition
- Red "Request consultation" CTA button
- Responsive design that maintains text readability on all devices

#### 6.1.2 Partners/Clients Strip
- Horizontally aligned logo display of key clients/partners
- Consistent logo sizing and spacing
- Subtle background separation from hero section
- Mobile-responsive design with possible carousel functionality

#### 6.1.3 Strategic Partner Section
- Heading: "Your Strategic Technology Partner, From Foundation To Future"
- Left-aligned content block with brief text
- Right-aligned hexagonal graphic with key service bullets:
  - Robust Infrastructure
  - Cloud Infrastructure
  - Security & Support
- Professional image of IT professional
- Red "Use In Touch With" CTA button

#### 6.1.4 Solutions Showcase
- Heading: "Comprehensive Solutions For Modern Challenges"
- Card-based layout showcasing different solution areas
- Red accent cards with white text
- Clean imagery supporting each solution area
- Consistent card sizing and spacing
- Mobile-responsive grid that reflows appropriately

#### 6.1.5 CTA Banner
- Full-width red background section
- Bold headline: "Ready to Transform Your Technology Landscape?"
- Compelling supporting text
- High-contrast CTA button
- Background with subtle pattern or imagery

### 6.2 About Us Page

#### 6.2.1 Hero Section
- Bold header text "ABOUT INFLEXIONS-IT"
- Professional image of team/technology environment
- Red sidebar element with contact information

#### 6.2.2 Content Sections
- "Engineering the Future of Business" content block with supporting text
- Clean two-column layout alternating text and imagery
- Consistent section spacing and padding

#### 6.2.3 Team Section
- "Professional team ready to serve you" featuring team members
- Three-column layout with consistent styling
- Photos with names and titles
- Rating indicators below each team member

#### 6.2.4 Case Studies Preview
- "Recent Case Studies" three-column grid
- Card-based layout with consistent sizing
- Brief preview of each case study
- Clickable cards linking to full case studies

#### 6.2.5 Location Section
- Map showing Ghana office location
- Contact information overlay
- Visual consistency with overall design

### 6.3 Solutions Page

#### 6.3.1 Hero Section
- Bold headline: "Integrated IT Solutions to Power Your Business Engines"
- Data center/server room background image
- Clean text overlay for readability

#### 6.3.2 Solutions Overview
- "Technology Solutions" heading
- Red content block with introductory text
- Supporting imagery showing both people and technology interfaces
- Clean grid layout for visual interest

#### 6.3.3 Solutions Grid
- Four-quadrant layout for core solutions:
  - Network Infrastructure
  - Data Security
  - Cloud Services
  - Data-centric Solutions
- Each with consistent heading and descriptive text
- Clean separation between categories
- Mobile-responsive design that stacks appropriately

#### 6.3.4 Industry Solutions Section
- Four industry-focused cards with relevant imagery
- Consistent card styling with hover effects
- Brief descriptive text for each industry solution
- Responsive grid layout

#### 6.3.5 Partners Section
- "Our Technology Partners" heading
- Clean grid layout for partner logos
- Consistent sizing and spacing
- Major technology partners prominently displayed

### 6.4 Services Page

#### 6.4.1 Hero Section
- Headline: "Flexible I.T Service Models Tailored to your needs"
- Professional image of person working with technology
- Clean, focused messaging

#### 6.4.2 Service Delivery Overview
- Featured image showing professional with technology
- "Our IT Service Delivery Models" heading
- Supporting text explaining approach
- Logo placement for brand reinforcement
- Red "Learn More" CTA button

#### 6.4.3 Service Categories
- Numbered service categories (01, 02, 03)
- Alternating left/right layout for text and images
- Consistent styling for each service block
- Professional imagery supporting each service type
- "Read More" CTAs in red for each service

### 6.5 Contact Page

#### 6.5.1 Hero Section
- Simple headline: "How can we help you?"
- Clean image showing people working/designing
- Consistent with other page hero sections

#### 6.5.2 Contact Form
- Red background matching brand color
- "Get in touch with us" headline
- Brief supporting text
- Contact method icons (email, phone, location)
- Form fields with appropriate validation:
  - Name
  - Phone Number
  - Email
  - Message
- White "Submit Message" button with hover state

#### 6.5.3 FAQ Section
- "Frequently Asked Questions" heading
- Accordion-style expandable questions
- Clean typography and spacing
- 4-5 key questions with detailed answers
- Mobile-responsive design

#### 6.5.4 Secondary CTA
- Red background section
- "You Need to Know? Call Now" heading
- Prominent display of contact number
- "Contact Us" button
- Supporting professional image

## 7. Component Library

### 7.1 Core UI Components

#### 7.1.1 Buttons
- **Primary Button**: Red background (#D0281F), white text, slightly rounded corners
- **Secondary Button**: White background, red border, red text
- **Tertiary Button**: Text-only with arrow icon
- All buttons include hover state animations

#### 7.1.2 Cards
- Solution cards with title, description on colored backgrounds (red or white)
- Team member cards with professional photo, name, title, and rating indicators
- Case study cards with image, title, and brief description
- Feature cards with icon/image and descriptive text

#### 7.1.3 Navigation Components
- Desktop header with dropdowns
- Mobile navigation with animated hamburger
- Sidebar navigation for interior pages
- Breadcrumb component for deep pages

#### 7.1.4 Form Elements
- Text inputs with floating labels
- Custom select dropdown
- Checkbox and radio custom styling
- Form validation states
- Multi-step form progress indicator

#### 7.1.5 Content Components
- Hero sections (multiple variants)
- Section dividers
- Testimonial slider
- Partner logo carousel
- FAQ accordion

### 7.2 Animation Specifications

- Subtle entrance animations for content sections (fade-up)
- Button hover animations
- Card hover effects
- Navigation transitions
- Form submission success animation
- Page transition effects

## 8. Content Requirements

### 8.1 Content Types
- Marketing copy
- Technical solution descriptions
- Team biographies
- Case study narratives
- Blog articles
- Job descriptions
- Company policies and terms

### 8.2 Content Management
- Content creation guidelines
- SEO optimization process
- Editorial calendar
- Content update workflow

## 9. Integrations

### 9.1 Email Marketing System
- Lead capture form integration
- Segmentation based on solution interest
- Automated follow-up sequences

### 9.2 Analytics Platform
- Google Analytics 4 implementation
- Goal and event tracking setup
- Custom dashboard creation

### 9.3 Future CRM Integration
- Lead data synchronization
- Opportunity tracking
- Contact management

## 10. Timeline and Phasing

### 10.1 Phase 1: Foundation (8 weeks)
- Technology stack setup
- Database schema implementation
- Core page templates development
- Home page and About Us development
- Contact functionality
- Basic SEO implementation

### 10.2 Phase 2: Solutions and Services (6 weeks)
- Solution overview page
- Individual solution detail pages
- Services section development
- Case study functionality
- Team showcase implementation

### 10.3 Phase 3: Content and Resources (4 weeks)
- Blog implementation
- Resource center development
- Career portal creation
- Advanced SEO optimization
- Lead generation system refinement

### 10.4 Phase 4: Optimization and Launch (2 weeks)
- Performance optimization
- Cross-browser testing
- Security auditing
- Analytics implementation
- Training and documentation
- Launch preparation

## 11. Maintenance Plan

### 11.1 Regular Updates
- Security patches and dependency updates
- Content refreshes and additions
- Performance monitoring and optimization
- Analytics review and implementation of insights

### 11.2 Continuous Improvement
- Quarterly UX reviews
- Conversion rate optimization
- Feature expansion based on user feedback
- Technical debt management

## 12. Success Metrics

### 12.1 Performance Metrics
- 90+ Google Lighthouse score
- < 1.5s First Contentful Paint
- < 2.5s Time to Interactive
- < 50 Web Vitals CLS

### 12.2 Business Metrics
- 35% increase in qualified leads
- 25% improvement in organic traffic
- 20% increase in average session duration
- 15% reduction in bounce rate
- 10% increase in conversion rate

## 13. Technical Requirements

### 13.1 Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- iOS Safari (latest 2 versions)
- Android Chrome (latest 2 versions)

### 13.2 Performance Budgets
- Total JavaScript < 350KB minified and gzipped
- First Contentful Paint < 1.5s on 4G connections
- Total page weight < 1.5MB

### 13.3 Security Requirements
- HTTPS only
- Content Security Policy implementation
- Regular dependency auditing
- Data encryption at rest and in transit

## 14. Documentation

### 14.1 Technical Documentation
- System architecture overview
- Database schema documentation
- API documentation
- Deployment process documentation

### 14.2 User Documentation
- Content management guidelines
- User administration guide
- Troubleshooting guide
- Feature update documentation

## 15. Team and Resources

### 15.1 Development Team
- Project Manager
- Frontend Developer (React/Next.js)
- Backend Developer (Node.js/Prisma)
- UI/UX Designer
- Content Strategist
- QA Engineer

### 15.2 Stakeholders
- Managing Director
- Director of Marketing
- Director of Business Solutions
- Technical Services Team

## 16. Implementation Plan for Next.js with Tailwind CSS

### 16.1 Project Setup

```bash
# Create Next.js project with TypeScript and Tailwind CSS
npx create-next-app@latest inflexions-website --typescript --tailwind --app

# Install additional dependencies
cd inflexions-website
npm install prisma @prisma/client next-auth jose uuid zod react-hook-form @headlessui/react
npm install -D @types/uuid

# Initialize Prisma
npx prisma init
```

### 16.2 Directory Structure

```
inflexions-website/
├── app/
│   ├── about/
│   │   └── page.tsx
│   ├── solutions/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── services/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── case-study/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── careers/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   ├── contact/
│   │   └── newsletter/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── StrategicPartner.tsx
│   │   ├── SolutionsShowcase.tsx
│   │   └── CtaBanner.tsx
│   ├── about/
│   ├── solutions/
│   ├── services/
│   └── contact/
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   └── utils.ts
├── public/
│   ├── images/
│   ├── logo.svg
│   └── favicon.ico
├── styles/
│   └── globals.css
├── prisma/
│   └── schema.prisma
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### 16.3 Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#D0281F",
        secondary: "#8F8D8D",
        lightblue: {
          100: "#E8EFF9",
          200: "#B0CBEC",
          300: "#77A7E0",
          400: "#3D83D3",
        },
        darkblue: {
          100: "#0047AB",
          200: "#00337D",
          300: "#002050", 
          400: "#001638",
          500: "#000A1B",
        },
        orange: {
          100: "#FBE5D6",
          200: "#F8CBAD",
          300: "#F5A065",
          400: "#F27B23",
          500: "#C35A11",
          600: "#8A3D0A",
        },
        neutral: {
          50: "#F2F2F2",
          100: "#E6E6E6",
          200: "#D0D0D0",
          300: "#A6A6A6",
          400: "#8C8C8C",
          500: "#737373",
          600: "#595959",
          700: "#404040",
          800: "#262626",
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### 16.4 Prisma Schema Implementation

Create the Prisma schema file as outlined in section 5.1 of this specification.

```bash
# After defining schema
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### 16.5 Core Component Implementation

#### 16.5.1 Header Component

```tsx
// components/common/Header.tsx
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from './Button';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <Image 
            src="/logo.svg" 
            alt="Inflexions IT" 
            width={180} 
            height={40} 
            className="w-auto h-10"
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-neutral-800 hover:text-primary">
            Home
          </Link>
          <Link href="/about" className="text-neutral-800 hover:text-primary">
            About
          </Link>
          <Link href="/solutions" className="text-neutral-800 hover:text-primary">
            Solutions
          </Link>
          <Link href="/services" className="text-neutral-800 hover:text-primary">
            Services
          </Link>
          <Link href="/case-study" className="text-neutral-800 hover:text-primary">
            Case Study
          </Link>
          <Link href="/careers" className="text-neutral-800 hover:text-primary">
            Careers
          </Link>
          
          {/* Social Icons */}
          <div className="flex items-center space-x-3">
            <a href="#" aria-label="Instagram">
              <svg className="w-5 h-5 text-neutral-600 hover:text-primary" />
            </a>
            <a href="#" aria-label="Facebook">
              <svg className="w-5 h-5 text-neutral-600 hover:text-primary" />
            </a>
            <a href="#" aria-label="Twitter">
              <svg className="w-5 h-5 text-neutral-600 hover:text-primary" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg className="w-5 h-5 text-neutral-600 hover:text-primary" />
            </a>
          </div>
          
          <Button href="/contact" variant="primary">
            Contact us
          </Button>
        </nav>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-neutral-800"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" />
        </button>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-md p-4 md:hidden">
            {/* Mobile menu links */}
          </div>
        )}
      </div>
    </header>
  );
}
```

#### 16.5.2 Button Component

```tsx
// components/common/Button.tsx
import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export default function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  className = '',
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors";
  
  const variantStyles = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-white text-primary border border-primary hover:bg-neutral-50",
    outline: "bg-transparent text-primary border border-primary hover:bg-neutral-50",
  };
  
  const sizeStyles = {
    sm: "text-sm px-3 py-1.5 rounded",
    md: "text-base px-4 py-2 rounded",
    lg: "text-lg px-6 py-3 rounded",
  };
  
  const styles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  
  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }
  
  return (
    <button
      type={type}
      className={styles}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

#### 16.5.3 Home Page Hero Component

```tsx
// components/home/Hero.tsx
import Button from '../common/Button';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative w-full h-[600px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="IT professionals collaborating"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <div className="max-w-xl text-white">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Architecting Your Future: Resilient IT Solutions for Global Ambition
          </h1>
          <p className="text-lg mb-8">
            Inflexions I.T. Services partners with businesses to design, implement, and
            manage robust technology infrastructures that drive efficiency, innovation,
            and growth.
          </p>
          <Button href="/contact" variant="primary" size="lg">
            Request consultation
          </Button>
        </div>
      </div>
    </section>
  );
}
```

### 16.6 API Route Implementation

#### 16.6.1 Contact Form Submission

```tsx
// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message is required'),
  solutionInterest: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid submission', details: result.error.flatten() },
        { status: 400 }
      );
    }
    
    // Save to database
    const contact = await prisma.contactSubmission.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        message: body.message,
        solutionInterest: body.solutionInterest || null,
      },
    });
    
    // Here you would typically also send an email notification
    
    return NextResponse.json({ success: true, id: contact.id }, { status: 201 });
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}
```

### 16.7 Page Implementation

#### 16.7.1 Home Page

```tsx
// app/page.tsx
import Hero from '@/components/home/Hero';
import PartnerStrip from '@/components/home/PartnerStrip';
import StrategicPartner from '@/components/home/StrategicPartner';
import SolutionsShowcase from '@/components/home/SolutionsShowcase';
import DifferenceSection from '@/components/home/DifferenceSection';
import ExpertiseSection from '@/components/home/ExpertiseSection';
import TechnologyPartners from '@/components/home/TechnologyPartners';
import Testimonials from '@/components/home/Testimonials';
import CtaBanner from '@/components/home/CtaBanner';

export const metadata = {
  title: 'Inflexions I.T. Services | Architecting Your Future',
  description: 'End-to-end IT integration with global expertise and local understanding',
};

export default async function Home() {
  // For a static page, we could fetch this data at build time
  // For dynamic content, use React Server Components to fetch data
  
  return (
    <main>
      <Hero />
      <PartnerStrip />
      <StrategicPartner />
      <SolutionsShowcase />
      <DifferenceSection />
      <ExpertiseSection />
      <TechnologyPartners />
      <Testimonials />
      <CtaBanner />
    </main>
  );
}
```

### 16.8 Deployment Configuration

```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'], // Add your image domains here
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### 16.9 Vercel Deployment

```json
// vercel.json
{
  "buildCommand": "prisma generate && next build",
  "installCommand": "npm install",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["fra1"],
  "env": {
    "NEXTAUTH_URL": "https://www.inflexions-it.com",
    "NEXTAUTH_SECRET": "@nextauth_secret",
    "DATABASE_URL": "@database_url"
  }
}
```
