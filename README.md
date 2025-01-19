# 🎯 **ART Finder**

ART Finder (**Automated Research and Trigger Finder**) is a cutting-edge tool designed to streamline the research phase of ad creation. By automating data gathering and analysis, ART Finder empowers marketers to craft high-impact, user-centric ads by leveraging actionable insights and trends from various online platforms.

---

## ✨ **Features**

- **📌 User Pain Points Identification**: Analyze data from forums, reviews, and social platforms (e.g., Reddit, Quora, Google Reviews) to uncover common user challenges.  
- **📊 Competitor Analysis**: Evaluate competitor ads to identify high-performing hooks, CTAs, and content strategies.  
- **💬 Sentiment Analysis**: Gain a clear understanding of user sentiment (positive, neutral, negative) and its themes.  
- **📈 Keyword Trends**: Discover trending keywords and track their growth over time to stay ahead in your campaigns.  
- **💡 Recommendations**: Generate actionable suggestions for hooks, CTAs, and content formats tailored to your audience.  
- **📄 Validation and References**: Access direct links to original data sources for transparency and deeper exploration.

---

## 🛠️ **Technologies Used**

- **Frontend**: React, Recharts for data visualization, and Tailwind CSS for UI.  
- **Backend**: Python, Flask/Django, BeautifulSoup for web scraping, and Sentence Transformers for NLP tasks.  
- **Database**: DataStax Astra DB for scalable and efficient storage.  
- **Workflow Automation**: LangFlow for seamless integration and workflow management.  
- **Machine Learning**: Sentiment analysis and trend prediction using advanced ML models.

---

## 🚀 **Setup Instructions**

### **Prerequisites**

- **Frontend**: Node.js and npm (for building and running the UI).  
- **Backend**: Python 3.x (for server-side operations).  
- **Database**: AstraDB account and token (for advanced features).  

---

### **📝 Bare Minimum Demo**

For a **basic working demo** of ART Finder, you only need to pull the ART Finder website and run the frontend locally. Backend and AstraDB setup are **not required** for this version.

Steps for a bare minimum demo:  
1. Follow the **Frontend Setup** instructions below.  
2. Open the app in your browser and explore static functionalities like the UI and basic navigation.  

---

### **Frontend Setup**

1. **📥 Clone the Repository**  
   ```bash
   git clone https://github.com/darshan1137/ARTFinder.git
   cd ARTFinder/ARTFinder
   ```

2. **📦 Install Dependencies**  
   ```bash
   npm install
   ```

3. **▶️ Run the Frontend**  
   ```bash
   npm start
   ```  
   The application will be available at `http://localhost:3000`.

---

### **Backend Setup (Optional for Full Functionality)**

1. **📥 Navigate to the Backend Repository**  
   ```bash
   cd ..
   cd Server/
   ```

2. **🌐 Create a Virtual Environment**  
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **📦 Install Python Dependencies**  
   ```bash
   pip install -r requirements.txt
   ```

4. **🔑 Set Up Environment Variables**  
   Create a `.env` file in the `server` directory with the following content:  
   ```plaintext
   ASTRA_DB_TOKEN=your_astra_db_token
   ASTRA_DB_URL=your_astra_db_url
   API_KEYS=your_external_api_keys
   ```

5. **▶️ Run the Backend Server**  
   ```bash
   python manage.py runserver
   ```  
   The backend server will be available at `http://localhost:8000`.

---

## 🖥️ **Usage**

1. Open the frontend application in your browser.  
2. Enter a topic and brand guidelines in the input fields (e.g., "Fitness Trackers").  
3. Click on "Generate Insights" to fetch data and display actionable recommendations.  

---

## 🤝 **Contributing**

We welcome contributions! Please fork the repository, make improvements, and submit a pull request.  

---

## 📧 **Contact**

For any questions, suggestions, or feedback, contact us at [projects.codinggurus@gmail.com](mailto:projects.codinggurus@gmail.com).  
