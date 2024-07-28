# GreenCandle
[GreenCandle](https://greencandlenet-jc4githubs-projects.vercel.app/) is a software tool designed to minimise manual labor and enhance automation in conducting due diligence research for companies. This platform empowers traders and investors by generating comprehensive due diligence reports for companies listed on the US stock market and more. By leveraging resources such as [stockanalysis.com](https://stockanalysis.com/) and [OpenAI's GPT](https://openai.com/), [GreenCandle](https://greencandlenet-jc4githubs-projects.vercel.app/) delivers detailed insights efficiently and effectively. The web app is accessible via desktop and mobile browsers, providing flexibility for users on the go.

Explore GreenCandle now: [GreenCandle Web App](https://greencandlenet-jc4githubs-projects.vercel.app/)

## App Features
GreenCandle offers a robust set of features and functionalities, including:

- **Intuitive User Interface**: A user-friendly and professional interface that simplifies navigation and usability.
- **Stock Market Analytics**: Access to historical and current price graphs for comprehensive market analysis.
- **Automated Due Diligence Reports**: Generate detailed due diligence reports using GPT 3.5, saving time and ensuring thorough research.
- **User Accounts System**: Secure and personalized user accounts for a tailored experience.
- **Report Management**: Download and save user-specific reports for easy access and reference.

## One Feature I'm Most Proud Of
### Report Generation Stability 
The key functionality that sets GreenCandle apart is its report generation stability. Given the non-deterministic nature of generative AI, where outputs can vary significantly based on input prompts, developing this feature correctly was paramount. Through extensive testing and experimentation with various prompting techniques, I gained a deep understanding of how the model responds to specific inputs.

After fine-tuning a prompt that consistently produced favorable outputs, I tested it across different GPT models to ensure consistency. The results showed negligible differences, allowing us to use the cost-effective GPT-3.5-turbo model without compromising on quality.

Four major iterations were made on the generation function to achieve reliable and stable outputs for any stock input:

1. **HTML Formatting**: Ensured the output was formatted in HTML elements, making it easy to extract and display as DOM elements.
2. **Dynamic Prompt Variables**: Introduced variables into the prompt to replace hard-coded stock information, ensuring each report is relevant to the inputted stock.
3. **Real-Time Data Integration**: Integrated real information from the StockAnalysis API into the prompt, enhancing the output's accuracy and reliability.
4. **Beautification Function**: Developed a beautify function to clean up the generated report and inject styling into the HTML, resulting in a more aesthetically pleasing table format.

These enhancements enabled the language model to reliably generate comprehensive due diligence reports for any stock input and present them beautifully on the frontend.

## Basic Features
### Frontend
- React project using TypeScript
- Chakra UI styling library
- Responsive UI for desktop and mobile web browsers
- React Router for navigation
- Git for version control

### Backend
- Built with C# using .NET 8.0
- Entity Framework Core (EF Core) for data access
- SQL database for data persistence
- CRUD operations
- Git for version control

## Advanced Features
- Unit testing using Xunit for backend API endpoints
- End-to-end testing using Cypress
- GPT-3.5 for report generation
- Backend API deployed on Azure Web App Service
- Frontend deployed on Vercel (too large for free deployment on Azure Static Web Apps)

## Getting Started

### Prerequisites

Ensure you have the following software installed:

- npm (v6.x or later)
- .NET SDK (v8.0)
- SQL Server or any SQL-compatible database

### Installation

#### Clone the Repository

```bash
git clone https://github.com/JC4github/greencandle-dotnet.git
cd greencandle-dotnet
```

#### Frontend

1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```

#### Backend

1. Navigate to the backend directory:
    ```bash
    cd backend
    ```
2. Install dependencies:
    ```bash
    dotnet restore
    ```

### Configuration

#### Frontend
Contact me via email `rye419@aucklanduni.ac.nz` if you need a copy of the .env file.

1. Create a `.env` file in the `frontend` directory and add the necessary environment variables from Firebase:
    ```env
    VITE_APIKEY=
    VITE_AUTHDOMAIN=
    VITE_PROJECTID=
    VITE_STORAGEBUCKET=
    VITE_MESSAGING_SENDERID=
    VITE_APPID=
    VITE_MEASUREMENTID=
    ```

#### Backend

1. Create a `appsettings.json` file in the `backend` directory with the necessary configuration to connect to your SQL database:
    ```json
    {
      "ConnectionStrings": {
        "DefaultConnection": "Server=your_server;Database=your_database;User Id=your_username;Password=your_password;"
      }
    }
    ```

2. Create a `.env` file in the `backend` directory and add the necessary environment variables from OpenAI:
    ```env
    GPT_KEY=
    ```

### Running the Application

#### Frontend

1. Start the frontend development server:
    ```bash
    npm start
    ```

2. Open your browser and navigate to `http://localhost:5173`.

#### Backend

1. Update the database:
    ```bash
    dotnet ef database update
    ```

2. Start the backend server:
    ```bash
    dotnet run
    ```

3. The backend API will be running at `http://localhost:5174`.

### Testing

#### Unit Tests

1. Navigate to the backend directory and run unit tests:
    ```bash
    dotnet test
    ```

#### End-to-End Tests

1. Navigate to the frontend directory and run Cypress tests:
    ```bash
    npm run cy:open
    ```
