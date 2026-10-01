# AIMDB Web Application — MVP Specification & Implementation Roadmap

## 1. Overview & System Scope
This document outlines the Minimum Viable Product (MVP) specification and implementation plan for the AI & In-Memory Database Club (AIMDB) platform. The primary goal is to establish a unified digital portal to streamline member onboarding, manage membership dues/finances, facilitate event sharing, and maintain public visibility.

---

## 2. Core Feature Specifications

### 2.1 Design System & UI Aesthetics
* **Color Palette**[cite: 5]:
  * Primary Accent / Light Blue: `#669DFF`[cite: 5]
  * Deep Secondary / Dark Blue: `#001F54`[cite: 5]
  * Surface Neutral / Light Neutral: `#F0F8FF`[cite: 5]
  * Corporate Accent / Accent: UTD Comet Orange / Modern Neutral accents
* **Typography & Styling**: Clean, modern sans-serif typography paired with high-contrast UI components and consistent border radii across forms, cards, and modal components.
* **Component Library**: Standardized reusable UI elements (Buttons, Form Inputs, Badges, Modals, Tables, Navigation Bar, Footer).

### 2.2 Authentication & User Accounts
* **Sign Up / Log In**: User authentication via email/password or magic links.
* **Profile Management**: Profile editing interface allowing users to view and update:
  * Full Name
  * Expected Graduation Date
  * Academic Year (Freshman, Sophomore, Junior, Senior, Graduate)
  * Major / Academic Track[cite: 2]

### 2.3 Event Calendar & Subdomain Sharing
* **Calendar View**: Public-facing grid/list view displaying upcoming AIMDB events and details.
* **Shareable Subdomain / Direct Link**:
  * Dedicated event calendar endpoint accessible at `events.aimdb.org` (or `/events`)[cite: 3].
  * Open access (visible to all site visitors without requiring authentication).
  * Direct shareable links for individual event details.

### 2.4 Administrative Dashboard
* **Dues & Financial Management**:
  * Track and mark who has paid semester dues.
  * Filter members by Semester (Fall / Spring) and Year[cite: 2].
  * Financial overview displaying total collected dues vs. itemized list of expenses[cite: 1].
* **Event Management**:
  * Interface to create, update, and publish upcoming events with location, time, description, and link details[cite: 1, 3].
* **Application & Member Management**:
  * Review incoming prospective member applications[cite: 1, 5].
  * Update member status (approving application updates user role to full active member)[cite: 1].

### 2.5 Public & Informational Pages
* **Landing Page**: Modern hero section, overview of AIMDB mission, upcoming highlights, and primary CTAs[cite: 3].
* **About AIMDB**: Detailed background on the club's focus (AI & In-Memory Databases, enterprise analytics)[cite: 1, 3].
* **Contact Page**: Contact form for inquiries and official contact/location information[cite: 3].
* **Officers Page**: Showcase of current executive board members and titles[cite: 1].

### 2.6 Joining Pipeline (Member Application Workflow)
* **Application Submission**: Structured form capturing contact info, academic details, and technical interests[cite: 1, 5].
* **Status Tracking**: User dashboard section indicating current pipeline status:
  * `Draft`
  * `Submitted / Awaiting Review`
  * `Accepted`
  * `Denied`
* **Role Conversion**: Upon administrative approval, user status automatically converts to full active member (`Member` flag enabled)[cite: 1].

---

## 3. Ordered Development Steps

The development workflow is structured sequentially. **Design aesthetics, style guide creation, and base component architecture must be completed first** to ensure visual and functional consistency before developing application logic.

### Phase 1: Design Aesthetics, Style Guide & Common Components (Priority First)
1. **Design System & Style Guide Definition**:
   * Configure global CSS/Tailwind variables using official palette: Light Blue (`#669DFF`), Dark Blue (`#001F54`), Light Neutral (`#F0F8FF`)[cite: 5].
   * Define typography hierarchy, spacing scales, and elevation rules.
2. **Base Component Library Creation**:
   * Build atomic components: Buttons, Inputs, Select Droprdowns, Cards, Badges (Status indicators), Modals, and Loading States.
   * Construct layout structures: Navigation Bar, Footer, Container Grid, and Subdomain Layouts[cite: 3].

### Phase 2: Core Infrastructure & Authentication
3. **Database Schema & Auth Setup**:
   * Provision database schemas for `Users`, `Applications`, `Events`, `Dues`, and `Expenses`[cite: 1].
   * Implement authentication routes (`/login`, `/signup`, session management).
4. **User Profile System**:
   * Build `/profile` route enabling user profile editing (Name, Grad Date, Year, Major)[cite: 2].

### Phase 3: Joining Pipeline & Member Lifecycle
5. **Joining Pipeline Development**:
   * Create application form submission flow (`/apply`).
   * Implement status tracker on the user dashboard displaying real-time states (`Draft` $\rightarrow$ `Submitted / Awaiting Review` $\rightarrow$ `Accepted` / `Denied`)[cite: 1].
6. **Role Upgrade Automation**:
   * Connect approval trigger to convert user profile status to marked full member[cite: 1].

### Phase 4: Shareable Event Calendar System
7. **Public Event Calendar**:
   * Develop event calendar grid and detail modal/page[cite: 3].
   * Route setup for subdomain support (`events.aimdb.org`) or standalone shareable URL access without requiring login[cite: 3].
8. **Event Sharing Infrastructure**:
   * Generate canonical shareable URLs for individual events with metadata tags for link previews.

### Phase 5: Admin Panel & Financial Management
9. **Admin Core & Member Verification**:
   * Build admin user table to review applications and update onboarding status[cite: 1].
10. **Semester Dues & Expense Tracker**:
    * Implement dues payment tracking toggle by member[cite: 1].
    * Filter functions for Fall/Spring semesters and year[cite: 2].
    * Calculate total collected dues against itemized expense records[cite: 1].
11. **Admin Event Creation Tools**:
    * Build CRUD form for creating and editing calendar events[cite: 1].

### Phase 6: Public Content Pages & Final Polish
12. **Static & Information Pages Construction**:
    * Implement **Landing Page** with primary CTA section[cite: 3].
    * Implement **About AIMDB** overview page[cite: 1, 3].
    * Implement **Contact Page** with form integration[cite: 3].
    * Implement **Officers Page** displaying executive leadership[cite: 1].
13. **End-to-End Testing & Deployment**:
    * Verify permissions (Public vs. Applicant vs. Member vs. Admin access).
    * Conduct responsive layout testing across modern browsers and mobile devices.