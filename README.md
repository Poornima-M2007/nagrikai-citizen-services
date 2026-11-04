# NagrikAI Citizen Services

# Project: NagrikAI — AI-Powered Citizen Assistance Platform

Build a professional, modern, responsive web application called **NagrikAI**.

## 1. Project vision

NagrikAI is an AI-powered multilingual citizen assistance platform designed to help Indian citizens understand government services, discover government schemes, simplify official documents and access public information.

The application should make complicated government processes easier for ordinary citizens through a simple, accessible and intelligent interface.

This is a real full-stack project, not merely a static UI prototype. Design the architecture with real backend integration in mind.

## 2. Technology requirements

- Frontend: React + TypeScript.
- Styling: Tailwind CSS.
- Icons: Lucide React.
- Backend and database: Supabase.
- Authentication: Supabase Auth.
- File storage: Supabase Storage.
- Backend operations: Secure server-side functions.
- Keep the code modular, reusable and maintainable.

Do not expose API keys or secret credentials in frontend code.

## 3. Design direction

Create a premium government-tech product aesthetic.

Design characteristics:
- Modern, minimal and professional.
- Navy blue, white and teal as primary colours.
- Subtle saffron accents inspired by the Indian national colours.
- Clean typography and generous spacing.
- Soft shadows, rounded cards and subtle animations.
- Consistent iconography.
- Responsive design for desktop, tablets and mobile.
- Excellent accessibility and readable contrast.

Avoid an outdated government portal appearance. It should look like a modern technology product.

## 4. Main navigation

Create a responsive navigation bar with:

- NagrikAI logo and brand name.
- Home.
- Explore Schemes.
- Document Assistant.
- Voice Assistant.
- Government Updates.
- About Us.
- Login / Sign Up.
- Language selector.

Include a mobile-friendly navigation menu.

## 5. Home page

Create an attractive landing page containing:

**Hero section**
- Main heading: "Government Services, Simplified for Every Citizen."
- Supporting text explaining how NagrikAI helps citizens access government information.
- Primary CTA: Explore Government Schemes.
- Secondary CTA: Simplify My Document.
- Attractive visual representing AI-assisted citizen services.

**Quick access section**
Create service cards for:
1. Government Scheme Finder.
2. Document Simplifier.
3. AI Voice Assistant.
4. Government Updates.

**How it works**
Explain the platform in three simple steps:
1. Choose the service you need.
2. Interact with NagrikAI.
3. Receive understandable information and guidance.

**Why NagrikAI**
Show benefits such as multilingual assistance, simple explanations, easy access and verified government information.

Include a footer with useful navigation links, contact information placeholders and a disclaimer.

## 6. Application features and pages

Build the following pages with consistent design.

### A. Government Scheme Finder
- Search for government schemes.
- Filters for state, central government, category and beneficiary type.
- Scheme cards with name, description, eligibility summary and benefits.
- Individual scheme detail pages.
- Eligibility checklist.
- Required documents.
- Official application website link.
- Source and last-verified date.

Never invent government schemes, eligibility requirements or application URLs. Use clearly labelled sample content only during initial UI development. Replace it with verified information before presenting it as real.

### B. AI Document Assistant
- Drag-and-drop file upload.
- Support PDF and image uploads.
- Display uploaded file name, size and upload status.
- Document processing progress.
- Extracted document text.
- Simple-language explanation.
- Important dates and details.
- Eligibility or requirement information where supported by the document.
- Page references wherever possible.
- Ask questions about the uploaded document through a chat interface.

Include proper loading, error, empty and success states. Do not pretend a document has been analysed when it has not been processed.

### C. AI Voice Assistant
- Microphone interaction interface.
- Speech input.
- Text-based conversation.
- Language selection.
- Text-to-speech response controls.
- Clear indication when microphone permission is unavailable.

### D. Government Updates
- Latest government announcements.
- Notifications and important updates.
- Category filters.
- Publication date.
- Official source links.

Do not fabricate announcements.

### E. User Dashboard
- Welcome section.
- Recently uploaded documents.
- Saved schemes.
- Recent conversations.
- Notifications.
- Profile settings.

### F. Authentication
- Sign up.
- Login.
- Logout.
- Password recovery.
- Protected dashboard routes.

Use Supabase Auth when configured.

### G. About Us
Explain the problem NagrikAI solves, its mission, objectives and benefits for citizens.

## 7. Multilingual support

Plan the application for:
- English.
- Kannada.
- Hindi.
- Telugu.
- Tamil.
- Other Indian languages in future.

Provide a language selector in the navigation bar.

The interface should be structured so translations can be added consistently. Do not simply change the selected language label without translating the interface.

## 8. Backend integration requirements

Prepare the project for genuine integration with Supabase.

Plan database entities for:
- User profiles.
- Government schemes.
- Uploaded documents.
- Document analysis results.
- Saved schemes.
- Conversations.
- Government updates.

Use appropriate relationships, access control and Row Level Security.

Users must only be able to access their own private documents and personal information.

Use secure server-side processing for AI operations. Never place AI API secrets in frontend code.

## 9. Important development rules

- Build reusable components.
- Use clean folder organisation.
- Implement actual navigation between pages.
- All buttons should have meaningful actions.
- Forms should have validation.
- Search and filters should work.
- Include loading, empty, success and error states.
- Do not create decorative controls that do nothing.
- Do not claim that backend features work until they are connected and tested.
- Do not use hardcoded fake success messages.
- Do not remove existing functionality when adding new features.

## 10. First development milestone

Start by creating the complete frontend structure and polished UI for all the pages described above.

Prioritise the home page, navigation, dashboard, scheme finder and document assistant.

Use clearly identified sample data only where necessary to demonstrate the interface.

Keep the backend integration points organised so that Supabase can be connected next.

Before finishing, ensure the application builds successfully and that all navigation links and primary interactions work.

The final result should look like a polished, credible Indian citizen-assistance technology platform called NagrikAI.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2313245d-2e47-437a-8b89-7018e337fe03).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
