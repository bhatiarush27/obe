import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const SemesterFinalReport = () => {
  const [subjects, setSubjects] = useState([]);
  const [pos, setPOs] = useState([]);
  const [psos, setPSOs] = useState([]);

  const [subjectArticulationDetails, setSubjectArticulationDetails] = useState(
    []
  );

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/subjects");
        setSubjects(response.data);
        const response2 = await axios.get("http://localhost:5001/api/pos");
        setPOs(response2.data);
        const response3 = await axios.get("http://localhost:5001/api/psos");
        setPSOs(response3.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, []);

  useEffect(() => {
    const subjectArticulationDetailsMatrix = subjects?.map((subject, ind) => {
      const poMappingFrequency = Array(pos.length).fill(0);
      const poMappingRelevanceSum = Array(pos.length).fill(0);
      const psoMappingFrequency = Array(pos.length).fill(0);
      const psoMappingRelevanceSum = Array(pos.length).fill(0);
      const articulationMatrix = Array(pos.length + psos.length).fill(0);
      const relevantArticulationMatrix = Array(pos.length + psos.length).fill(
        0
      );

      subject.coPoMapping.forEach((mapping, index) => {
        mapping.forEach((data, ind) => {
          if (data.value) {
            poMappingFrequency[ind]++;
            poMappingRelevanceSum[ind] += data.value;
          }
        });
      });

      subject.coPsoMapping.forEach((mapping, index) => {
        mapping.forEach((data, ind) => {
          if (data.value) {
            psoMappingFrequency[ind]++;
            psoMappingRelevanceSum[ind] += data.value;
          }
        });
      });

      pos.forEach(
        (po, i) =>
          (relevantArticulationMatrix[i] = +(
            poMappingRelevanceSum[i]
              ? poMappingRelevanceSum[i] / poMappingFrequency[i]
              : 0
          ).toFixed(2))
      );
      psos.forEach(
        (pso, i) =>
          (relevantArticulationMatrix[i + pos.length] = +(
            psoMappingRelevanceSum[i]
              ? psoMappingRelevanceSum[i] / psoMappingFrequency[i]
              : 0
          ).toFixed(2))
      );

      pos.forEach(
        (po, i) =>
          (articulationMatrix[i] = +(
            poMappingRelevanceSum[i] / subject.cos.length
          ).toFixed(2))
      );
      psos.forEach(
        (pso, i) =>
          (articulationMatrix[i + pos.length] = +(
            psoMappingRelevanceSum[i] / subject.cos.length
          ).toFixed(2))
      );

      return {
        poMappingFrequency,
        poMappingRelevanceSum,
        articulationMatrix,
        relevantArticulationMatrix,
      };
    });

    setSubjectArticulationDetails(subjectArticulationDetailsMatrix);
  }, [subjects,pos,psos]);

  console.log("array1", subjects, pos, psos);

  console.log("array2", subjectArticulationDetails);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "90%",
          margin: "0 auto",
        }}
      >
        <h5 style={{ textAlign: "center" }}>Course Articulation Matrix</h5>
        <ReactHTMLTableToExcel
          id="semester-articulation-table-xls-button"
          className="download-table-xls-button"
          table="semester-articulation-table"
          filename="semester-articulation-report"
          sheet="semester-articulation-report"
          buttonText="Download Table CSV"
        />
      </div>

      <TableContainer style={{ marginBottom: "50px" }}>
        <Table
          style={{ width: "90%", margin: "0 auto", border: "1px solid black" }}
          id="semester-articulation-table"
        >
          <TableHead>
            <TableRow>
              <TableCell
                style={{ backgroundColor: "pink", textAlign: "center" }}
              >
                Subject Name
              </TableCell>
              <TableCell
                style={{ backgroundColor: "pink", textAlign: "center" }}
              >
                Subject Code
              </TableCell>
              {pos?.map((po, index) => (
                <TableCell
                  style={{ backgroundColor: "pink", textAlign: "center" }}
                >
                  {po.name}
                </TableCell>
              ))}
              {psos?.map((pso, index) => (
                <TableCell
                  style={{ backgroundColor: "pink", textAlign: "center" }}
                >
                  {pso.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {subjectArticulationDetails?.map((articulationDetails, ind) => (
              <TableRow key={"max-marks"}>
                <TableCell style={{ textAlign: "center" }}>
                  {subjects[ind].name}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {subjects[ind].code}
                </TableCell>
                {articulationDetails.articulationMatrix.map((data) => (
                  <TableCell style={{ textAlign: "center" }}>{data}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "90%",
          margin: "0 auto",
        }}
      >
        <h5 style={{ textAlign: "center" }}>
          Course Relevant Articulation Matrix
        </h5>
        <ReactHTMLTableToExcel
          id="semester-relevant-articulation-table-xls-button"
          className="download-table-xls-button"
          table="semester-relevant-articulation-table"
          filename="semester-relevant-articulation-report"
          sheet="semester-relevant-articulation-report"
          buttonText="Download Table CSV"
        />
      </div>

      <TableContainer style={{ marginBottom: "50px" }}>
        <Table
          style={{ width: "90%", margin: "0 auto", border: "1px solid black" }}
          id="semester-relevant-articulation-table"
        >
          <TableHead>
            <TableRow>
              <TableCell
                style={{ backgroundColor: "pink", textAlign: "center" }}
              >
                Subject Name
              </TableCell>
              <TableCell
                style={{ backgroundColor: "pink", textAlign: "center" }}
              >
                Subject Code
              </TableCell>
              {pos?.map((po, index) => (
                <TableCell
                  style={{ backgroundColor: "pink", textAlign: "center" }}
                >
                  {po.name}
                </TableCell>
              ))}
              {psos?.map((pso, index) => (
                <TableCell
                  style={{ backgroundColor: "pink", textAlign: "center" }}
                >
                  {pso.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {subjectArticulationDetails?.map((articulationDetails, ind) => (
              <TableRow key={"max-marks"}>
                <TableCell style={{ textAlign: "center" }}>
                  {subjects[ind].name}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {subjects[ind].code}
                </TableCell>
                {articulationDetails.relevantArticulationMatrix.map((data) => (
                  <TableCell style={{ textAlign: "center" }}>{data}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SemesterFinalReport;
