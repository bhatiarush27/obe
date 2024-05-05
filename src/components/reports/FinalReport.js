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
  const [subjectDetails, setSubjectDetails] = React.useState();

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
          const response8 = await axios.get(
            `http://localhost:5001/api/subjects/${subjectId}`
          );
          setSubjectDetails(response8.data);
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
    !assCompDetails ||
    !subjectDetails
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
        seeDetails.results[0].marks.length +
        2,
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

  attemptedQuestions[attemptedQuestions.length - 2] = ct1Details.results.length;
  attemptedQuestions[attemptedQuestions.length - 1] = ct1Details.results.length;

  // Maximum marks
  const maximumMarks = Array.from(
    {
      length:
        ct1Details.results[0].marks.length +
        ct2Details.results[0].marks.length +
        seeDetails.results[0].marks.length +
        2,
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
        seeDetails.results[0].marks.length +
        2,
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
        seeDetails.results[0].marks.length +
        2,
    },
    () => 0
  );

  questions.forEach((question, index) => {
    coDetails[index] = question.co;
  });
  coDetails[coDetails.length - 2] = "All COs";
  coDetails[coDetails.length - 1] = "All COs";

  // Assessment
  const levels = Array.from(
    {
      length:
        ct1Details.results[0].marks.length +
        ct2Details.results[0].marks.length +
        seeDetails.results[0].marks.length +
        2,
    },
    () => 1
  );

  questions.forEach((question, index) => {
    levels[index] = question.level;
  });

  levels[levels.length - 2] = "K4";
  levels[levels.length - 1] = "K4";

  console.log("arushAll", coDetails, levels, subjectDetails);

  //CO-Questions relevance
  const cos = subjectDetails.cos.map((co) => co.coCode);

  console.log("arush69", cos, coDetails);

  const cieCOQuestionsRelevance = Array(cos.length).fill(1);
  const seeCOQuestionsRelevance = Array(cos.length).fill(0);
  const cieCOWiseAttainment = Array(cos.length).fill(
    (+assessment[assessment.length - 2] + +assessment[assessment.length - 1]) /
      2
  );
  const seeCOWiseAttainment = Array(cos.length).fill(0);

  console.log("arush69", cieCOWiseAttainment, seeCOWiseAttainment);

  coDetails.forEach((coDetail, i) => {
    if (
      i <
      ct1Details.results[0].marks.length + ct2Details.results[0].marks.length
    ) {
      cieCOQuestionsRelevance[+coDetail[2] - 1]++;
      console.log("arush69", assessment[i]);
      cieCOWiseAttainment[+coDetail[2] - 1] += +(
        assessment[i] / targetPerLevel[levels[i]]
      ).toFixed(2);
    } else if (i < coDetails.length - 2) {
      seeCOQuestionsRelevance[+coDetail[2] - 1]++;
      seeCOWiseAttainment[+coDetail[2] - 1] += +(
        assessment[i] / targetPerLevel[levels[i]]
      ).toFixed(2);
    }
  });

  const cieFinalCOWiseAttainment = cieCOWiseAttainment.map(
    (data) => +data.toFixed(2)
  );
  const seeFinalCOWiseAttainment = seeCOWiseAttainment.map(
    (data) => +data.toFixed(2)
  );

  console.log(
    "arush69",
    cos,
    coDetails,
    cieCOQuestionsRelevance,
    seeCOQuestionsRelevance,
    cieCOWiseAttainment,
    seeCOWiseAttainment
  );

  const getAttainmentLevels = (points) => {
    if (points >= 0.9) return 3;
    else if (points >= 0.8) return 2;
    else if (points >= 0.7) return 1;

    return 0;
  };

  return (
    <div>
      <h5 style={{ textAlign: "center" }}>Course Outcome Assessment</h5>
      <TableContainer component={Paper} style={{ marginBottom: "50px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                colSpan={2}
                style={{ backgroundColor: "pink", textAlign: "center" }}
              >
                Subject Final Report
              </TableCell>
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
              <TableCell style={{ textAlign: "center" }}>Sch No.</TableCell>
              <TableCell style={{ textAlign: "center" }}>
                Enrollment number
              </TableCell>
              {[
                ...ct1CompDetails.fields,
                ...ct2CompDetails.fields,
                ...seeCompDetails.fields,
              ].map((question, index) => (
                <TableCell
                  key={index}
                  style={{ textAlign: "center" }}
                >{`Q${question}`}</TableCell>
              ))}
              <TableCell key={"AT"} style={{ textAlign: "center" }}>
                AT
              </TableCell>
              <TableCell key={"TAQ"} style={{ textAlign: "center" }}>
                TAQ
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={"co"}>
              <TableCell style={{ textAlign: "center" }}></TableCell>
              <TableCell style={{ textAlign: "center" }}></TableCell>
              {coDetails.map((data, i) => (
                <TableCell style={{ textAlign: "center" }} key={i}>
                  {data}
                </TableCell>
              ))}
            </TableRow>
            <TableRow key={"max-marks"}>
              <TableCell style={{ textAlign: "center" }}></TableCell>
              <TableCell style={{ textAlign: "center" }}>
                Maximum marks
              </TableCell>
              {maximumMarks.map((data, i) => (
                <TableCell style={{ textAlign: "center" }} key={i}>
                  {data}
                </TableCell>
              ))}
            </TableRow>
            {ct1Details.results.map((result, index) => (
              <TableRow key={index}>
                <TableCell style={{ textAlign: "center" }}>
                  {index + 1}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {result.enrollmentNumber}
                </TableCell>
                {result.marks.map((mark, i) => (
                  <TableCell style={{ textAlign: "center" }} key={i}>
                    {mark.attempted ? mark.obtainedMarks : "-"}
                  </TableCell>
                ))}
                {ct2Details.results[index].marks.map((mark, i) => (
                  <TableCell style={{ textAlign: "center" }} key={i}>
                    {mark.attempted ? mark.obtainedMarks : "-"}
                  </TableCell>
                ))}
                {seeDetails.results[index].marks.map((mark, i) => (
                  <TableCell style={{ textAlign: "center" }} key={i}>
                    {mark.attempted ? mark.obtainedMarks : "-"}
                  </TableCell>
                ))}
                <TableCell style={{ textAlign: "center" }} key={"at"}>
                  {assCompDetails.results[index].atMarks}
                </TableCell>
                <TableCell style={{ textAlign: "center" }} key={"taq"}>
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
                style={{ backgroundColor: "gray", textAlign: "center" }}
              ></TableCell>
            </TableRow>
            <TableRow key={"attempted"}>
              <TableCell colSpan={2}>Students appeared</TableCell>
              {attemptedQuestions.map((data, i) => (
                <TableCell key={i} style={{ textAlign: "center" }}>
                  {data}
                </TableCell>
              ))}
            </TableRow>
            <TableRow key={"average"}>
              <TableCell colSpan={2}>Average marks</TableCell>
              {averageMarks.map((data, i) => (
                <TableCell key={i} style={{ textAlign: "center" }}>
                  {data}
                </TableCell>
              ))}
            </TableRow>
            <TableRow key={"assessment"}>
              <TableCell colSpan={2}>Assessment</TableCell>
              {assessment.map((data, i) => (
                <TableCell key={i} style={{ textAlign: "center" }}>
                  {data}
                </TableCell>
              ))}
            </TableRow>
            <TableRow key={"target"}>
              <TableCell style={{ backgroundColor: "lightgreen" }} colSpan={2}>
                Target
              </TableCell>
              {levels.map((data, i) => (
                <TableCell
                  key={i}
                  style={{ backgroundColor: "lightgreen", textAlign: "center" }}
                >
                  {targetPerLevel[data]}
                </TableCell>
              ))}
            </TableRow>
            <TableRow key={"attainment"}>
              <TableCell colSpan={2}>Attainment</TableCell>
              {assessment.map((data, i) => (
                <TableCell key={i} style={{ textAlign: "center" }}>
                  {(data / targetPerLevel[levels[i]]).toFixed(2)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow key={"level"}>
              <TableCell colSpan={2}>Bloom's level</TableCell>
              {levels.map((data, i) => (
                <TableCell key={i} style={{ textAlign: "center" }}>
                  {data}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <h5 style={{ textAlign: "center" }}>Overall Attainment Matrix</h5>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell colSpan={8} style={{ textAlign: "center" }}>
                Direct
              </TableCell>
              <TableCell colSpan={2} style={{ textAlign: "center" }}>
                Indirect
              </TableCell>
              <TableCell colSpan={3} style={{ textAlign: "center" }}>
                Overall
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell style={{ textAlign: "center" }} colSpan={2}>
                Number of questions relevant to CO
              </TableCell>
              <TableCell style={{ textAlign: "center" }} colSpan={3}>
                Attainment Values
              </TableCell>
              <TableCell style={{ textAlign: "center" }} colSpan={3}>
                Attainment Levels
              </TableCell>
              <TableCell style={{ textAlign: "center" }} rowSpan={2}>
                Course Exit Survey
              </TableCell>
              <TableCell style={{ textAlign: "center" }} rowSpan={2}>
                Attainment Values
              </TableCell>
              <TableCell style={{ textAlign: "center" }} rowSpan={2}>
                CO Attainment
              </TableCell>
              <TableCell style={{ textAlign: "center" }} rowSpan={2}>
                CO Target
              </TableCell>
              <TableCell style={{ textAlign: "center" }} rowSpan={2}>
                Status
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell style={{ textAlign: "center" }}>CIE</TableCell>
              <TableCell style={{ textAlign: "center" }}>SEE</TableCell>
              <TableCell style={{ textAlign: "center" }}>CIE</TableCell>
              <TableCell style={{ textAlign: "center" }}>SEE</TableCell>
              <TableCell style={{ textAlign: "center" }}>Overall</TableCell>
              <TableCell style={{ textAlign: "center" }}>CIE</TableCell>
              <TableCell style={{ textAlign: "center" }}>SEE</TableCell>
              <TableCell style={{ textAlign: "center" }}>Overall</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cos.map((co, i) => (
              <TableRow key={"co"}>
                <TableCell style={{ textAlign: "center" }}>{co}</TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {cieCOQuestionsRelevance[i]}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {seeCOQuestionsRelevance[i]}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {cieFinalCOWiseAttainment[i]}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {seeFinalCOWiseAttainment[i]}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {(
                    cieFinalCOWiseAttainment[i] * 0.33 +
                    seeFinalCOWiseAttainment[i] * 0.67
                  ).toFixed(2)}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {getAttainmentLevels(cieFinalCOWiseAttainment[i])}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {getAttainmentLevels(seeFinalCOWiseAttainment[i])}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {getAttainmentLevels(
                    (
                      cieFinalCOWiseAttainment[i] * 0.33 +
                      seeFinalCOWiseAttainment[i] * 0.67
                    ).toFixed(2)
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default FinalReport;
