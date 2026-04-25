# Land Registry Monorepo

This repository is a monorepo for a blockchain-based land registry system. It is structured to facilitate the development of multiple applications and shared libraries within a single codebase.

## Project Structure

- **apps/**: Contains the applications for the project.
  - **web/**: This directory will hold the code for the web application.
  - **api/**: This directory will hold the code for the API application.

- **contracts/**: This directory is designated for the smart contracts related to the land registry system.

- **packages/**: Contains shared libraries and code that can be utilized across different applications.
  - **shared/**: This directory will contain shared code or libraries.

## Configuration Files

- **pnpm-workspace.yaml**: Defines the workspace configuration for pnpm, specifying the locations of the packages in the monorepo, which includes `apps/*`, `contracts`, and `packages/*`.

- **package.json**: The configuration file for the monorepo, marked as private, and includes scripts for development and building the web and API applications.

- **.gitignore**: Specifies files and directories to be ignored by Git, including `node_modules`, `dist`, `.env`, `artifacts`, `cache`, and `typechain-types`.

- **.env.example**: A template for environment variables, containing keys for `DATABASE_URL`, `JWT_SECRET`, `PRIVATE_KEY`, `SEPOLIA_RPC_URL`, `PINATA_API_KEY`, `PINATA_SECRET_KEY`, `VITE_API_URL`, `VITE_LAND_REGISTRY_ADDRESS`, `VITE_OWNERSHIP_ADDRESS`, and `VITE_VERIFICATION_ADDRESS`, all with empty values.

## Getting Started

To get started with the project, clone the repository and install the dependencies using pnpm. You can run the development servers for the web and API applications using the provided scripts in the root `package.json`.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.