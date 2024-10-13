## ControlUp Backend Automation Framework
This project is an automation framework built in Node.js for querying the TripAdvisor API and 
retrieving information about cruises with a focus on the destination "Caribbean". 
The framework fetches cruise data from the API and sorts it by the number of crew members. 
The project includes testing functionality and follows best practices like DRY (Don't Repeat Yourself), 
environment-based configurations, and includes a GitHub Actions CI/CD pipeline.
## Supported Environments

[Production](https://tripadvisor16.p.rapidapi.com) |
[Staging](https://staging.tripadvisor16.p.rapidapi.com) |
[Development](https://development.tripadvisor16.p.rapidapi.com) |
[Test](https://test.tripadvisor16.p.rapidapi.com)

## Setup Instructions
### Local Setup
1. Clone the repository.
```
git clone https://github.com/geiserman/controlup-challenge.git
cd controlup-challenge
```
2. Install dependencies:

```
npm install
```

3. Set up environment configurations:

```
The configuration files for various environments are located in /config. 
You can modify configuration for each environment (production, staging, development, test).
```

## Running Tests
#### Note: Before running the tests, make sure to set the environment variables for the desired environment.
#### Example: NODE_ENV=production
### Running Tests Locally
1. Run tests individually: You can run a specific test file by executing the file directly
2. Run the complete test suite: Execute the npm run test command in the terminal to run the complete test suite. This will trigger the run-test-with-retries.js script, which adds retry logic for any flaky tests.
```
npm run test
```
### Running Tests via GitHub Actions
You can also run the tests via GitHub Actions:

- Go to your project's GitHub page.
- Navigate to the Actions tab.
- Select the manual trigger workflow.
- From the "Run workflow" dropdown, select:
  - Script to be executed (based on the package.json scripts).
  - Node.js version.
  - Branch where the test will be executed.
- The test results will be available as artifacts under the "Manual Trigger" workflow tab once the workflow completes.

``` 
## Technologies Used
- Node.js: Backend runtime.
- Jest: Testing framework.
- Superagent: RESTful client with retry and error handling capabilities.
- GitHub Actions: CI/CD for automating tests.
- YAML: Used for configuration management.
- Custom Packages: Logger, RESTful client, Configuration parser
```

## Project Structure
```
/.github                    # GitHub Actions CI/CD workflow files
/config                     # Contains environment-specific configuration files (YAML)
/src                        # Core business logic and services
/tests                      # Unit and integration tests
/logs                       # Application log files
/reports                    # Test reports xml and html
package.json                # Project metadata and scripts
jest.config.js              # Jest test configuration
run-test-with-retries.js    # Retry mechanism script for tests
```
