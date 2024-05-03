import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const FinalReport = () => {
  const [ct1Details, setCT1Details] = React.useState();
  const [ct2Details, setCT2Details] = React.useState();
  const [seeDetails, setSEEDetails] = React.useState();
  const [ct1CompDetails, setCT1CompDetails] = React.useState();
  const [ct2CompDetails, setCT2CompDetails] = React.useState();
  const [seeCompDetails, setSEECompDetails] = React.useState();
  const [assCompDetails, setAssCompDetails] = React.useState();
  const { subjectId } = useParams();

  React.useEffect(() => {
    const fetchComponents = async () => {
      if (subjectId) {
        try {
          const response1 = await axios.get(
            `http://localhost:5001/api/results/ct1-${subjectId}`
          );
          setCT1Details(response1.data);
          const response2 = await axios.get(
            `http://localhost:5001/api/results/ct2-${subjectId}`
          );
          setCT2Details(response2.data);
          const response3 = await axios.get(
            `http://localhost:5001/api/results/see-${subjectId}`
          );
          setSEEDetails(response3.data);
          const response4 = await axios.get(
            `http://localhost:5001/api/components/component/ct1-${subjectId}`
          );
          setCT1CompDetails(response4.data);
          const response5 = await axios.get(
            `http://localhost:5001/api/components/component/ct2-${subjectId}`
          );
          setCT2CompDetails(response5.data);
          const response6 = await axios.get(
            `http://localhost:5001/api/components/component/see-${subjectId}`
          );
          setSEECompDetails(response6.data);
          const response7 = await axios.get(
            `http://localhost:5001/api/assignments/ass-${subjectId}`
          );
          setAssCompDetails(response7.data);
        } catch (error) {
          console.error("Error fetching components:", error);
        }
      }
    };

    fetchComponents();
  }, [subjectId]);

  if (
    !ct1Details ||
    !ct2Details ||
    !seeDetails ||
    !ct1CompDetails ||
    !ct2CompDetails ||
    !seeCompDetails ||
    !assCompDetails
  )
    return <></>;

  const questions = [
    ...ct1CompDetails.questions,
    ...ct2CompDetails.questions,
    ...seeCompDetails.questions,
  ];
  const targetPerLevel = {
    K1: 0.75,
    K2: 0.7,
    K3: 0.65,
    K4: 0.6,
    K5: 0.55,
  };

  // Number of questions attempted.
  const attemptedQuestions = Array.from(
    {
      length:
        ct1Details.results[0].marks.length +
        ct2Details.results[0].marks.length +
        seeDetails.results[0].marks.length + 2,
    },
    () => 0
  );

  ct1Details.results.forEach((result) => {
    result.marks.forEach((mark, index) => {
      attemptedQuestions[index] += mark.attempted ? 1 : 0;
    });
  });
  ct2Details.results.forEach((result) => {
    result.marks.forEach((mark, index) => {
      attemptedQuestions[index + ct1Details.results[0].marks.length] +=
        mark.attempted ? 1 : 0;
    });
  });
  seeDetails.results.forEach((result) => {
    result.marks.forEach((mark, index) => {
      attemptedQuestions[
        index +
          ct1Details.results[0].marks.length +
          ct2Details.results[0].marks.length
      ] += mark.attempted ? 1 : 0;
    });
  });

  attemptedQuestions[attemptedQuestions.length - 2] = ct1Details.results.length
  attemptedQuestions[attemptedQuestions.length - 1] = ct1Details.results.length

  // Maximum marks
  const maximumMarks = Array.from(
    {
      length:
        ct1Details.results[0].marks.length +
        ct2Details.results[0].marks.length +
        seeDetails.results[0].marks.length + 2
    },
    () => 0
  );

  ct1Details.results[0].marks.forEach((mark, index) => {
    maximumMarks[index] = mark.maxMarks;
  });
  ct2Details.results[0].marks.forEach((mark, index) => {
    maximumMarks[index + ct1Details.results[0].marks.length] = mark.maxMarks;
  });
  seeDetails.results[0].marks.forEach((mark, index) => {
    maximumMarks[
      index +
        ct1Details.results[0].marks.length +
        ct2Details.results[0].marks.length
    ] = mark.maxMarks;
  });
  maximumMarks[maximumMarks.length - 2] = 10;
  maximumMarks[maximumMarks.length - 1] = 10;

  // Average marks
  const averageMarks = Array.from(
    {
      length:
        ct1Details.results[0].marks.length +
        ct2Details.results[0].marks.length +
        seeDetails.results[0].marks.length +
        2,
    },
    () => 0
  );

  ct1Details.results.forEach((result) => {
    result.marks.forEach((mark, index) => {
      averageMarks[index] += mark.obtainedMarks;
    });
  });
  ct2Details.results.forEach((result) => {
    result.marks.forEach((mark, index) => {
      averageMarks[index + ct1Details.results[0].marks.length] +=
        mark.obtainedMarks;
    });
  });
  seeDetails.results.forEach((result) => {
    result.marks.forEach((mark, index) => {
      averageMarks[
        index +
          ct1Details.results[0].marks.length +
          ct2Details.results[0].marks.length
      ] += mark.obtainedMarks;
    });
  });

  const assignmentATMarksSum = assCompDetails.results.reduce((total, curr) => {
    return total + curr.atMarks;
  }, 0);
  const assignmentTAQMarksSum = assCompDetails.results.reduce((total, curr) => {
    return total + curr.taqMarks;
  }, 0);
  averageMarks[attemptedQuestions.length - 2] = assignmentATMarksSum;
  averageMarks[attemptedQuestions.length - 1] = assignmentTAQMarksSum;

  attemptedQuestions.forEach((attempted, index) => {
    averageMarks[index] = (averageMarks[index] / attempted).toFixed(2);
  });

  // Assessment
  const assessment = Array.from(
    {
      length:
        ct1Details.results[0].marks.length +
        ct2Details.results[0].marks.length +
        seeDetails.results[0].marks.length + 2,
    },
    () => 0
  );

  maximumMarks.forEach((maxMarks, index) => {
    assessment[index] = (averageMarks[index] / maxMarks).toFixed(2);
  });

  // COs
  const coDetails = Array.from(
    {
      length:
        ct1Details.results[0].marks.length +
        ct2Details.results[0].marks.length +
        seeDetails.results[0].marks.length + 2,
    },
    () => 0
  );

  questions.forEach((question, index) => {
    coDetails[index] = question.co;
  });
  coDetails[coDetails.length - 2] = 'All COs';
  coDetails[coDetails.length - 1] = 'All COs';

  // Assessment
  const levels = Array.from(
    {
      length:
        ct1Details.results[0].marks.length +
        ct2Details.results[0].marks.length +
        seeDetails.results[0].marks.length + 2,
    },
    () => 1
  );

  questions.forEach((question, index) => {
    levels[index] = question.level;
  });

  levels[levels.length - 2] = 'K4';
  levels[levels.length - 1] = 'K4';

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={2} style={{backgroundColor: 'pink'}}>Subject Final Report</TableCell>
              <TableCell
                colSpan={ct1CompDetails.fields.length}
                style={{ backgroundColor: "beige", textAlign: "center" }}
              >
                CT1
              </TableCell>
              <TableCell
                colSpan={ct2CompDetails.fields.length}
                style={{ backgroundColor: "azure", textAlign: "center" }}
              >
                CT2
              </TableCell>

              <TableCell
                colSpan={seeCompDetails.fields.length}
                style={{ backgroundColor: "lightgreen", textAlign: "center" }}
              >
                SEE
              </TableCell>
              <TableCell
                colSpan={2}
                style={{ backgroundColor: "lightblue", textAlign: "center" }}
              >
                ASS
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Sch No.</TableCell>
              <TableCell style={{ textAlign: "center" }}>
                Enrollment number
              </TableCell>
              {[
                ...ct1CompDetails.fields,
                ...ct2CompDetails.fields,
                ...seeCompDetails.fields,
              ].map((question, index) => (
                <TableCell key={index}>{`Q${question}`}</TableCell>
              ))}
              <TableCell key={"AT"}>AT</TableCell>
              <TableCell key={"TAQ"}>TAQ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={"co"}>
              <TableCell></TableCell>
              <TableCell></TableCell>
              {coDetails.map((data, i) => (
                <TableCell key={i}>{data}</TableCell>
              ))}
            </TableRow>
            <TableRow key={"max-marks"}>
              <TableCell></TableCell>
              <TableCell>Maximum marks</TableCell>
              {maximumMarks.map((data, i) => (
                <TableCell key={i}>{data}</TableCell>
              ))}
            </TableRow>
            {ct1Details.results.map((result, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{result.enrollmentNumber}</TableCell>
                {result.marks.map((mark, i) => (
                  <TableCell key={i}>
                    {mark.attempted ? mark.obtainedMarks : "-"}
                  </TableCell>
                ))}
                {ct2Details.results[index].marks.map((mark, i) => (
                  <TableCell key={i}>
                    {mark.attempted ? mark.obtainedMarks : "-"}
                  </TableCell>
                ))}
                {seeDetails.results[index].marks.map((mark, i) => (
                  <TableCell key={i}>
                    {mark.attempted ? mark.obtainedMarks : "-"}
                  </TableCell>
                ))}
                <TableCell key={"at"}>
                  {assCompDetails.results[index].atMarks}
                </TableCell>
                <TableCell key={"taq"}>
                  {assCompDetails.results[index].taqMarks}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell
                colSpan={
                  seeCompDetails.fields.length +
                  ct1CompDetails.fields.length +
                  ct2CompDetails.fields.length +
                  4
                }
                style={{backgroundColor:"gray"}}
              ></TableCell>
            </TableRow>
            <TableRow key={"attempted"}>
              <TableCell colSpan={2}>Students appeared</TableCell>
              {attemptedQuestions.map((data, i) => (
                <TableCell key={i}>{data}</TableCell>
              ))}
            </TableRow>
            <TableRow key={"average"}>
              <TableCell colSpan={2}>Average marks</TableCell>
              {averageMarks.map((data, i) => (
                <TableCell key={i}>{data}</TableCell>
              ))}
            </TableRow>
            <TableRow key={"assessment"}>
              <TableCell colSpan={2}>Assessment</TableCell>
              {assessment.map((data, i) => (
                <TableCell key={i}>{data}</TableCell>
              ))}
            </TableRow>
            <TableRow key={"target"}>
              <TableCell style={{ backgroundColor: "lightgreen" }} colSpan={2}>
                Target
              </TableCell>
              {levels.map((data, i) => (
                <TableCell key={i} style={{ backgroundColor: "lightgreen" }}>
                  {targetPerLevel[data]}
                </TableCell>
              ))}
            </TableRow>
            <TableRow key={"attainment"}>
              <TableCell colSpan={2}>Attainment</TableCell>
              {assessment.map((data, i) => (
                <TableCell key={i}>
                  {(data / targetPerLevel[levels[i]]).toFixed(2)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow key={"level"}>
              <TableCell colSpan={2}>Bloom's level</TableCell>
              {levels.map((data, i) => (
                <TableCell key={i}>{data}</TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default FinalReport;
