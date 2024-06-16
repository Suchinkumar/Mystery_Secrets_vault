# Mystery_Secrets_vault
This project is a web application designed to share anonymous secrets. It serves as a practical example to learn and demonstrate authentication mechanisms in the field of cybersecurity. The application is built with Node.js, Express, MongoDB, and EJS, and it incorporates user authentication with Passport.js.
Here is a description for your project to upload on GitHub:

---

## Features

- **User Authentication**: Register and log in using email and password.
- **OAuth Integration**: Log in with Google using OAuth 2.0.
- **Secret Sharing**: Authenticated users can submit secrets anonymously.
- **Secrets Viewing**: View secrets shared by other users.
- **Session Management**: Secure session handling with cookies.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express**: Web framework for Node.js.
- **MongoDB**: NoSQL database.
- **EJS**: Embedded JavaScript templates.
- **Passport.js**: Authentication middleware for Node.js.
- **OAuth 2.0**: Authentication protocol.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/anonymous-secrets-sharing.git
    cd anonymous-secrets-sharing
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add the following variables:
    ```
    DATABASE_URL=your_mongodb_connection_string
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    PORT=3000
    ```

4. Run the application:
    ```bash
    node app.js
    ```

## Usage

- Navigate to `http://localhost:3000` in your web browser.
- Register a new account or log in with an existing account.
- Optionally, log in with Google.
- Submit your anonymous secrets and view secrets submitted by others.

## File Structure

- `app.js`: Main server file containing application logic.
- `views/`: Directory containing EJS template files.
- `public/`: Directory for static files (CSS, images, etc.).
