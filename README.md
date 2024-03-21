# React Login Page
A minimal React frontend template, with login and registration, catered to the Spring backend template but easily modifiable for other backends.

Project initialized with `npm create vite@latest` with the following settings:
- Framework: React
- Variant: TypeScript + SWC

### Additional Dependencies
- [shadcn/ui](https://ui.shadcn.com/) a popular headless UI library used with [Tailwind](https://tailwindcss.com/docs/guides/vite) for highly customizable components
- React Router Dom (for navigation between pages)
- Axios for making API requests to the backend

### Notes
- instead of importing all the components into the node package at installation, with `shadcn/ui`, you add the components as needed with `npx shadcn-ui@latest add ...`

### Consider ...
- separating the api calls from component logic, create a service for these, e.g. `AuthenticationService`
- security
    - encrypting sensitive data before storing in localStorage or sessionStorage to enhance security
    - ensure that the JWT token has an expiration time, and handle token expiration gracefully
    - be cautious of Cross-Site Scripting (XSS) attacks, avoid storing sensitive data in plain text and properly sanitize any user inputs
    - implement measures to prevent Cross-Site Request Forgery (CSRF) attacks, especially when dealing with tokens

### Improvements
- storing JWT token differently, storing in `localStorage` is [NOT safe](https://stackoverflow.com/questions/48983708/where-to-store-access-token-in-react-js)
- decouple axios network requests into services