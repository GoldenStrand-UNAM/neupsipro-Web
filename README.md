# golondrina-WEB
Thanks to the new migration to pnpm to npm, the installation for the dependencies has changed.

---
## Precondition:

Before beginning first run the following commands if you're migrating from npm to pnpm:
- _`npm install -g pnpm`_
- _`pnpm import`_

If you already had a package-lock.json and node_modules folder, erase it either with commands, or manually <b>AFTER</b> running the commands from above.

---
## Install and Configuration:
To begin the installation run the following commands <b>AFTER</b> cloning the repository:
- _`pnpm install`_
- _`pnpm approve-builds`_ (Make sure the files are actual dependencies!)

To run the project:
- _`pnpm start`_

To compile tailwind css:
- _`pnpm dev:css`_

To run tests:
- _`pnpm test`_

To run the ESLint:
- _`pnpm lint`_