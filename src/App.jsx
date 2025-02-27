import { useState } from "react";
import CVView from "./components/CVView";
import ExportButton from "./components/ExportButton";
import cvData from "./data/cvData";
import "./styles/App.css";

function App() {
    const [activeTheme, setActiveTheme] = useState("professional"); // Default theme

    const themes = [
        { id: "professional", name: "Professional" },
        { id: "modern", name: "Modern" },
        { id: "minimal", name: "Minimal" },
    ];

    return (
        <div className="app-container">
            <div className="app-header">
                <h1>CV Builder</h1>
                <div className="theme-selector">
                    <span>Theme: </span>
                    <select
                        value={activeTheme}
                        onChange={(e) => setActiveTheme(e.target.value)}
                    >
                        {themes.map((theme) => (
                            <option key={theme.id} value={theme.id}>
                                {theme.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="export-buttons">
                    <ExportButton format="pdf" theme={activeTheme} />
                    <ExportButton format="docx" theme={activeTheme} />
                </div>
            </div>

            <div className="cv-container">
                <CVView data={cvData} theme={activeTheme} />
            </div>

            <footer className="app-footer">
                <p>CV Builder for Yassir Hakimi</p>
            </footer>
        </div>
    );
}

export default App;
