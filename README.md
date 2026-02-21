# Ecommerce Frontend

React frontend for an e-commerce project with product listing, cart, and order management. Integrates with Django REST API backend, uses Cloudinary for media storage, and is ready for deployment on Vercel.

---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**  

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This will copy all the configuration files and dependencies (webpack, Babel, ESLint, etc.) into your project so you can fully control them.

---

## Environment Variables

Create a `.env` file in the frontend root and add your backend and Cloudinary configuration:

```bash
REACT_APP_API_URL=https://your-backend-url
REACT_APP_CLOUDINARY_CLOUD_NAME=dkmz6prj1