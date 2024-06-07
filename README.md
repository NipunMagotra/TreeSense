# Automating Tree Enumeration for Sustainable Forest Land Diversion

## Overview

Traditional methods for counting trees in forests earmarked for development projects are slow, expensive, and inaccurate. This lack of precise data hinders responsible decision-making regarding land usage and environmental impact. Our solution aims to automate tree enumeration using advanced image analytics and satellite imagery, providing a more efficient, cost-effective, and accurate method.

## Objective

Develop an image analytics solution that automates tree enumeration using satellite imagery, aerial photographs, or other visual data sources.

## Key Features

- **Advanced Image Analytics**: Automatically count and identify trees using satellite and aerial imagery.
- **Minimize Ecological Impact**: Provide analytical tools, recommendations, and alerts to mitigate environmental concerns.
- **User-Friendly Interface**: Designed to be intuitive with minimal training required and visually appealing data visualizations.
- **Mapbox API Integration**: Seamless use of user-generated satellite imagery for better context.

### Detailed Features

1. **Tree Count**: Accurately count trees within designated forest areas.
2. **Green Cover Estimator**: Estimate the overall percentage of green cover in the forest.
3. **Optimal Pathing**: Calculate the most efficient route between two points within the forest area.
4. **Tree Species Identifier (potential development)**: Identify the species of trees present in the forest (depending on data resolution and algorithms used).

## Solution Workflow

1. **Data Collection**: Gather satellite imagery or aerial photographs.
2. **Image Processing**: Utilize advanced image analytics to process and analyze visual data.
3. **Tree Enumeration**: Automatically count and identify trees.
4. **Data Visualization**: Present data in a user-friendly interface with visualizations.
5. **Analysis & Recommendations**: Provide ecological impact analysis and recommendations.

## Technology Stack

### Front-End

- **HTML**
- **Tailwind CSS**
- **ReactJs**
- **JavaScript**

### Data Science

- **Roboflow**

### AI

- **YOLO-V8**

### Version Control

- **GitHub**

### APIs

- **Mapbox**

## Installation and Setup

### Prerequisites

- Node.js and npm installed
- Git installed
- Access to Mapbox API

### Steps

1. **Clone the repository**

    ```bash
    git clone https://github.com/your-repo/tree-enumeration.git
    cd tree-enumeration
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables**

    Create a `.env` file in the root directory and add your Mapbox API key.

    ```bash
    REACT_APP_MAPBOX_API_KEY=your_mapbox_api_key
    ```

4. **Run the application**

    ```bash
    npm start
    ```

## Usage

1. **Upload Imagery**: Upload satellite imagery or aerial photographs through the user interface.
2. **Process Imagery**: Initiate the image processing to start tree enumeration.
3. **View Results**: View the processed data, tree count, green cover estimation, and optimal pathing through the dashboard.
4. **Analyze & Act**: Use the provided analytical tools and recommendations to make informed decisions regarding land usage and environmental impact.

## Potential Development

- Integration of a Tree Species Identifier to enhance the ecological analysis by identifying the species of trees present in the forest.

## Contributing

We welcome contributions! Please fork the repository and submit a pull request.



---

This README provides an overview of the project, its features, technology stack, and instructions on how to set up and use the application. By automating tree enumeration, we aim to facilitate responsible and sustainable forest land diversion decisions.
