import { useLoaderData, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// @ts-ignore
import html2pdf from "html2pdf.js";
import {
  Button,
  CircularProgress,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { GetReport } from "../../static/util/api";
import { DownloadIcon, AttachmentIcon } from "@chakra-ui/icons";
import InfoDialog from "./components/InfoDialog";
import { Report } from "../../types/entities";

interface stockReportData {
  tickerSymbol: string;
}

export async function loader({ params }: any) {
  const tickerSymbol = params.tickerSymbol as string;
  return { tickerSymbol };
}
// const XXX = localstorage.getItem("UserEmail")
// fetch http://localhost:3000/generate?ticker=tickerSymbol&email=XXX
export default function StockReport() {
  const navigate = useNavigate();
  const { tickerSymbol } = useLoaderData() as stockReportData;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchReturnedReport, setSearchReturnedReport] = useState<Report | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [reportHTML, setReportHTML] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    function checkLogin_generateHTML() {
      const email = localStorage.getItem("UserEmail");
      if (!email || email === null) {
        navigate("/Login", { replace: true });
      }
      setUserEmail(email!);
      fetchReport();
    }

    async function fetchReport() {
      if (tickerSymbol) {
        const html = await GetReport(tickerSymbol);
        setReportHTML(html);
        setLoading(false);
      }
    }

    checkLogin_generateHTML();
  }, []);

  function clickHandle() {
    html2pdf()
      .from(reportHTML)
      .set({
        margin: [20, 20, 20, 20], // 20mm margin on each side
        filename: `${dayjs().format(
          "YYYY-MM-DD"
        )}-${tickerSymbol.toLowerCase()}-report.pdf`,
      })
      .save();
  }

  const searchReport = async (email: string, ticker: string) => {
    try {
      const response = await fetch(
        `https://greencandleapi.azurewebsites.net/api/report/search?email=${email}&ticker=${ticker}`
      );
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error("Error searching for report:", error.message);
    }
  };

  const saveReport = async () => {
    setSaving(true);
    // check if the report is already saved
    const report = await searchReport(userEmail, tickerSymbol);
    console.log(report);

    if (report !== null) {
      console.log("Report already exists, trying to update");
      // update the old report with the new content
      fetch(
        `https://greencandleapi.azurewebsites.net/api/report/${report.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: report.id,
            email: userEmail,
            content: reportHTML,
            ticker: tickerSymbol.toUpperCase(),
          }),
        }
      )
        .then((response) => {
          if (response.ok) {
            setMessage("Report updated successfully!");
            onOpen();
          } else {
            setMessage("Failed to update report.");
            onOpen();
          }
        })
        .catch((error) => {
          console.error("Error updating report:", error);
          onOpen();
          setMessage(
            "An error occurred while updating the report. Please try again later."
          );
        }).finally(() => {
          setSaving(false);
        });

    } else {
      console.log("Report doesn't exist, trying to save");
      // this report is new and needs to be saved
      fetch(
        "https://greencandleapi.azurewebsites.net/api/report",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: 0,
            email: userEmail,
            content: reportHTML,
            ticker: tickerSymbol.toUpperCase(),
          }),
        }
      )
        .then((response) => {
          if (response.ok) {
            setMessage("Report saved successfully!");
            onOpen();
          } else {
            setMessage("Failed to save report.");
            onOpen();
          }
        })
        .catch((error) => {
          console.error("Error saving report:", error);
          onOpen();
          setMessage(
            "An error occurred while saving the report. Please try again later."
          );
        }).finally(() => {
          setSaving(false);
        });
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      {loading ? (
        <div style={{ flex: 1, alignContent: "center" }}>
          <CircularProgress isIndeterminate color="green.300" />
        </div>
      ) : (
        <>
          <HStack>
            <Button leftIcon={<DownloadIcon />} onClick={() => clickHandle()}>
              Download PDF
            </Button>
            <Button leftIcon={<AttachmentIcon />} onClick={() => saveReport()}>
              Save Report
            </Button>
          </HStack>
          <div
            style={{
              width: "60%",
              border: "black 1px solid",
              padding: 20,
              borderRadius: 5,
              marginBottom: "40px",
            }}
            dangerouslySetInnerHTML={{ __html: reportHTML }}
          />
        </>
      )}
      <InfoDialog isOpen={isOpen} onClose={onClose} message={message} />
      {saving && ( // Render CircularProgress when saving is true
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
      )}
    </div>
  );
}
