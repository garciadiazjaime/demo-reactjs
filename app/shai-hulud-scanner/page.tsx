"use client";

import { useState } from "react";

import { scanForShaiHulud } from "./shai-hulud-scanner";

interface PackageIssue {
    name: string;
    version: string;
    affectedVersions: string;
}

interface ScanReport {
    total: number;
    warning: PackageIssue[];
    infected: PackageIssue[];
}

export default function Page() {
    const [jsonContent, setJsonContent] = useState<any>(null);
    const [fileName, setFileName] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [report, setReport] = useState<ScanReport | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (file.type !== "application/json" || file.name !== "package-lock.json") {
            setError("Please select a valid package-lock.json file");
            setJsonContent(null);
            setFileName("");
            return;
        }

        setError("");
        setFileName(file.name);

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const parsedJson = JSON.parse(content);
                setJsonContent(parsedJson);
                const response = scanForShaiHulud(parsedJson) as ScanReport;
                setReport(response);
            } catch (err) {
                setError("Invalid JSON file format");
                setJsonContent(null);
            }
        };

        reader.onerror = () => {
            setError("Error reading file");
            setJsonContent(null);
        };

        reader.readAsText(file);
    };

    return (
        <div
            style={{
                textAlign: "center",
                maxWidth: "800px",
                margin: "0 auto",
                padding: "20px",
            }}
        >
            <h1>Shai-Hulud Scanner</h1>
            <p>Welcome to the Shai-Hulud Scanner page!</p>

            <div
                style={{
                    marginTop: "30px",
                    padding: "20px",
                    border: "2px dashed #ccc",
                    borderRadius: "10px",
                    backgroundColor: "#f9f9f9",
                }}
            >
                <label
                    htmlFor="json-file"
                    style={{
                        display: "block",
                        marginBottom: "10px",
                        fontWeight: "600",
                        fontSize: "16px",
                    }}
                >
                    Upload JSON File:
                </label>

                <input
                    id="json-file"
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileUpload}
                    style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                        fontSize: "14px",
                        backgroundColor: "white",
                    }}
                />
            </div>

            {error && (
                <div
                    style={{
                        marginTop: "20px",
                        padding: "15px",
                        backgroundColor: "#ffebee",
                        border: "1px solid #f44336",
                        borderRadius: "5px",
                        color: "#d32f2f",
                    }}
                >
                    <strong>Error:</strong> {error}
                </div>
            )}

            {fileName && (
                <div
                    style={{
                        marginTop: "20px",
                        padding: "10px",
                        backgroundColor: "#e8f5e8",
                        border: "1px solid #4caf50",
                        borderRadius: "5px",
                        color: "#2e7d32",
                    }}
                >
                    <strong>File loaded:</strong> {fileName}
                </div>
            )}

            {report && (
                <div
                    style={{
                        marginTop: "30px",
                        padding: "25px",
                        backgroundColor: "#ffffff",
                        border: "1px solid #e0e0e0",
                        borderRadius: "12px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        textAlign: "left",
                    }}
                >
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "20px",
                        paddingBottom: "15px",
                        borderBottom: "2px solid #f0f0f0"
                    }}>
                        <span style={{ fontSize: "24px", marginRight: "10px" }}>🔍</span>
                        <h3 style={{
                            margin: 0,
                            color: "#333",
                            fontSize: "22px",
                            fontWeight: "700"
                        }}>
                            Shai-Hulud Scan Report
                        </h3>
                    </div>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "15px",
                        marginBottom: "25px"
                    }}>
                        <div style={{
                            padding: "15px",
                            backgroundColor: "#f8f9fa",
                            borderRadius: "8px",
                            textAlign: "center",
                            border: "1px solid #dee2e6"
                        }}>
                            <div style={{
                                fontSize: "28px",
                                fontWeight: "bold",
                                color: "#495057",
                                marginBottom: "5px"
                            }}>
                                {report.total}
                            </div>
                            <div style={{
                                fontSize: "14px",
                                color: "#6c757d",
                                fontWeight: "500"
                            }}>
                                Total Packages
                            </div>
                        </div>

                        <div style={{
                            padding: "15px",
                            backgroundColor: report.infected.length > 0 ? "#ffebee" : "#e8f5e8",
                            borderRadius: "8px",
                            textAlign: "center",
                            border: `1px solid ${report.infected.length > 0 ? "#f44336" : "#4caf50"}`
                        }}>
                            <div style={{
                                fontSize: "28px",
                                fontWeight: "bold",
                                color: report.infected.length > 0 ? "#d32f2f" : "#2e7d32",
                                marginBottom: "5px"
                            }}>
                                {report.infected.length}
                            </div>
                            <div style={{
                                fontSize: "14px",
                                color: report.infected.length > 0 ? "#d32f2f" : "#2e7d32",
                                fontWeight: "500"
                            }}>
                                🚨 Infected
                            </div>
                        </div>

                        <div style={{
                            padding: "15px",
                            backgroundColor: report.warning.length > 0 ? "#fff3e0" : "#f8f9fa",
                            borderRadius: "8px",
                            textAlign: "center",
                            border: `1px solid ${report.warning.length > 0 ? "#ff9800" : "#dee2e6"}`
                        }}>
                            <div style={{
                                fontSize: "28px",
                                fontWeight: "bold",
                                color: report.warning.length > 0 ? "#f57c00" : "#6c757d",
                                marginBottom: "5px"
                            }}>
                                {report.warning.length}
                            </div>
                            <div style={{
                                fontSize: "14px",
                                color: report.warning.length > 0 ? "#f57c00" : "#6c757d",
                                fontWeight: "500"
                            }}>
                                ⚠️ Warnings
                            </div>
                        </div>
                    </div>

                    {report.infected.length > 0 && (
                        <div style={{ marginBottom: "25px" }}>
                            <h4 style={{
                                color: "#d32f2f",
                                fontSize: "18px",
                                fontWeight: "600",
                                marginBottom: "15px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px"
                            }}>
                                🚨 Critical Infections Detected
                            </h4>
                            <div style={{
                                display: "grid",
                                gap: "12px"
                            }}>
                                {report.infected.map((pkg, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            padding: "15px",
                                            backgroundColor: "#ffebee",
                                            border: "1px solid #f44336",
                                            borderRadius: "8px",
                                            borderLeft: "4px solid #d32f2f"
                                        }}
                                    >
                                        <div style={{
                                            fontWeight: "600",
                                            color: "#d32f2f",
                                            fontSize: "16px",
                                            marginBottom: "8px"
                                        }}>
                                            📦 {pkg.name}
                                        </div>
                                        <div style={{
                                            display: "grid",
                                            gridTemplateColumns: "auto 1fr",
                                            gap: "10px 15px",
                                            fontSize: "14px"
                                        }}>
                                            <span style={{ fontWeight: "500", color: "#666" }}>Version:</span>
                                            <span style={{ fontFamily: "monospace", color: "#d32f2f" }}>{pkg.version}</span>
                                            <span style={{ fontWeight: "500", color: "#666" }}>Affected:</span>
                                            <span style={{ fontFamily: "monospace", color: "#d32f2f" }}>{pkg.affectedVersions}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {report.warning.length > 0 && (
                        <div>
                            <h4 style={{
                                color: "#f57c00",
                                fontSize: "18px",
                                fontWeight: "600",
                                marginBottom: "15px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px"
                            }}>
                                ⚠️ Package Warnings
                            </h4>
                            <div style={{
                                display: "grid",
                                gap: "12px"
                            }}>
                                {report.warning.map((pkg, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            padding: "15px",
                                            backgroundColor: "#fff3e0",
                                            border: "1px solid #ff9800",
                                            borderRadius: "8px",
                                            borderLeft: "4px solid #f57c00"
                                        }}
                                    >
                                        <div style={{
                                            fontWeight: "600",
                                            color: "#f57c00",
                                            fontSize: "16px",
                                            marginBottom: "8px"
                                        }}>
                                            📦 {pkg.name}
                                        </div>
                                        <div style={{
                                            display: "grid",
                                            gridTemplateColumns: "auto 1fr",
                                            gap: "10px 15px",
                                            fontSize: "14px"
                                        }}>
                                            <span style={{ fontWeight: "500", color: "#666" }}>Version:</span>
                                            <span style={{ fontFamily: "monospace", color: "#f57c00" }}>{pkg.version}</span>
                                            <span style={{ fontWeight: "500", color: "#666" }}>Affected:</span>
                                            <span style={{ fontFamily: "monospace", color: "#f57c00" }}>{pkg.affectedVersions}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {report.infected.length === 0 && report.warning.length === 0 && (
                        <div style={{
                            padding: "20px",
                            backgroundColor: "#e8f5e8",
                            border: "1px solid #4caf50",
                            borderRadius: "8px",
                            textAlign: "center",
                            color: "#2e7d32"
                        }}>
                            <div style={{ fontSize: "48px", marginBottom: "10px" }}>✅</div>
                            <div style={{ fontSize: "18px", fontWeight: "600" }}>
                                All Clear! No Shai-Hulud infections detected.
                            </div>
                        </div>
                    )}
                </div>
            )}

            {jsonContent && (
                <div
                    style={{
                        marginTop: "30px",
                        textAlign: "left",
                    }}
                >
                    <h3>JSON Content:</h3>
                    <pre
                        style={{
                            backgroundColor: "#f5f5f5",
                            border: "1px solid #ddd",
                            borderRadius: "5px",
                            padding: "15px",
                            overflow: "auto",
                            maxHeight: "400px",
                            fontSize: "12px",
                            lineHeight: "1.4",
                        }}
                    >
                        {JSON.stringify(jsonContent, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
