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
      fetchReport(email!);
    }

    async function fetchReport(userEmail: string) {
      if (tickerSymbol) {
        const html = await GetReport(tickerSymbol, userEmail);
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

  function saveReport() {
    setSaving(true);
    fetch(
      "https://green-candle-h6rf-g42plqly9-jc4githubs-projects.vercel.app/data/addReport",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          mdString: reportHTML,
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
