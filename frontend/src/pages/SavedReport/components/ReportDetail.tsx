import { CSSProperties } from "react";
import { Report } from "../../../types/entities";

interface ReportDetailProps {
  report: Report | null;
}

const ReportDetail = ({ report }: ReportDetailProps) => {
  const createMarkup = (markdownString: string) => {
    return { __html: markdownString };
  };

  const containerStyles: CSSProperties = report
    ? {
        backgroundColor: "#f9f9f9",
        padding: "20px",
        borderRadius: "5px",
        border: "1px solid #ccc",
      }
    : {
        backgroundColor: "#f9f9f9",
        padding: "20px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        minHeight: "85vh",
        textAlign: "center",
        alignContent: "center",
      };

  const contentStyles: CSSProperties = {
    lineHeight: "1.6",
  };

  return (
    <div style={containerStyles}>
      {report ? (
        <div
          style={contentStyles}
          dangerouslySetInnerHTML={createMarkup(report.content)}
        />
      ) : (
        <div style={contentStyles}>No Report Displayed</div>
      )}
    </div>
  );
};

export default ReportDetail;
