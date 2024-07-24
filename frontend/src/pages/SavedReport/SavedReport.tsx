import { useEffect, useState } from "react";
import ReportDetail from "./components/ReportDetail";
import styles from "./SavedReport.module.css";
// @ts-ignore
import html2pdf from "html2pdf.js";
import { Button, CircularProgress } from "@chakra-ui/react";
import { DownloadIcon, DeleteIcon } from "@chakra-ui/icons";
import { Report } from "../../types/entities";

const SavedReport = () => {
  const [userEmail, setUserEmail] = useState<string>("");
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      const email = localStorage.getItem("UserEmail");
      if (email) {
        setUserEmail(email);
        try {
          const response = await fetch(
            `https://greencandleapi.azurewebsites.net/api/report/${email}`
          );
          if (response.ok) {
            const data = await response.json();
            setReports(data);
            if (data.length > 0) {
              setSelectedReport(data[0]);
            }
          } else {
            throw new Error("Failed to fetch reports");
          }
        } catch (error: any) {
          console.error("Error fetching reports:", error.message);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchData();
  }, []);

  const fetchReports = async (email: string) => {
    try {
      const response = await fetch(
        `https://greencandleapi.azurewebsites.net/api/report/${email}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }
      const data = await response.json();
      setReports(data);
      setSelectedReport((selectedReport) => {
        return (
          data[data.indexOf(selectedReport!) + 1] ??
          data[data.indexOf(selectedReport!) - 1] ??
          null
        );
      });
    } catch (error: any) {
      console.error("Error fetching reports:", error.message);
    }
  };

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
  };

  const handleDelete = async (report: Report) => {
    const { email, ticker } = report;
    try {
      const response = await fetch(
        `https://greencandleapi.azurewebsites.net/api/report/${report.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            ticker: ticker,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete report");
      }
      // Refresh the list of reports after deletion
      fetchReports(userEmail);
    } catch (error: any) {
      console.error("Error deleting report:", error.message);
    }
  };

  const handleDownload = () => {
    html2pdf()
      .from(selectedReport?.content)
      .set({
        margin: [20, 20, 20, 20],
        filename: `${selectedReport?.ticker.toLowerCase()}-report.pdf`,
      })
      .save();
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <div  style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999, // Ensure it's on top of everything else
        }}>
          <CircularProgress isIndeterminate color="green.300" />
        </div>
      ) : (
      <div className={styles.flexContainer}>
        <div className={styles.leftPanel}>
          <div className={styles.savedReportsTitle}>Saved Reports</div>
          <ul className={styles.reportList}>
            {reports.map((report, index) => (
              <li
                key={index}
                onClick={() => handleReportClick(report)}
                className={
                  report === selectedReport ? styles.reportInstance : ""
                }
              >
                <div className={styles.reportContainer}>
                  <div className={styles.logoContainer}>
                    <img
                      className={styles.companyLogo}
                      src={`https://logos.stockanalysis.com/${report.ticker.toLowerCase()}.svg`}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = `https://img.shields.io/badge/${report.ticker}-blue`;
                      }}
                      alt={report.ticker}
                    />
                  </div>
                  <div className={styles.infoContainer}>
                    <div className={styles.tickerPrice}>
                      <p>{report.ticker}</p>
                    </div>
                    <div className={styles.buttonsContainer}>
                      <Button
                        leftIcon={<DownloadIcon />}
                        onClick={handleDownload}
                      >
                        Download PDF
                      </Button>
                      <Button
                        colorScheme="red"
                        ml="2"
                        leftIcon={<DeleteIcon />}
                        onClick={() => handleDelete(report)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.rightPanel}>
          {<ReportDetail report={selectedReport} />}
        </div>
      </div>
      )}
    </div>
  );
};

export default SavedReport;
