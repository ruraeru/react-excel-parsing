import { useEffect, useState } from "react";
import { read, utils, writeFile } from "xlsx";
import * as XLSX from "xlsx";
import "./App.scss";
import ScreenJson from "./ScreenJson";
import Modal from "./compoentns/modals/Modal";

function App() {
  const [__html, setHTML] = useState("");
  const [json, setJson] = useState(null);

  /* Load sample data once */
  // useEffect(() => {
  //   /* Starting CSV data -- change data here */
  //   //기본 csv 데이터
  //   const csv = `\
  //     This,is,a,Test
  //     வணக்கம்,สวัสดี,你好,가지마
  //     1,2,3,4`;

  //   /* Parse CSV into a workbook object */
  //   //CSV를 workbook 오브젝트로 변환
  //   const wb = XLSX.read(csv, { type: "string" });

  //   /* Get the worksheet (default name "Sheet1") */
  //   //Sheet이름이 Sheet1인 것을 가져옴
  //   const ws = wb.Sheets.Sheet1;

  //   /* Create HTML table */
  //   //HTML table 생성
  //   setHTML(XLSX.utils.sheet_to_html(ws, { id: "tabeller" }));
  // }, []);
  const fileType = ["xlsx", "xls"];

  const handleFile = async (e) => {
    //데이터를 ArrayBuffer로 가져옴
    const file = e.target.files[0];
    const data = await file.arrayBuffer();
    // if (!(fileType.includes(e.target.files[0].split(".")[1]))) {
    //   alert("에러");
    // }

    //data를 불러오고 그 파일을 json, html로 파싱 첫번째 Sheet만
    const wb = XLSX.read(data);
    const ws = wb.Sheets[wb.SheetNames[0]];
    setHTML(XLSX.utils.sheet_to_html(ws, { id: "tabeller" }));

    setJson(XLSX.utils.sheet_to_json(ws, {
      blankrows: "",
      header: "1"
    }));
    // ScreenData(json);
  }

  const ExcelExport = () => {
    //tabeller라는 id를 가진 table을 불러오고 테이블록 만들기
    const table = document.getElementById("tabeller");
    const wb = XLSX.utils.table_to_book(table);

    // const tr = document.createElement("tr");

    // for (let i = 0; i < 10; i++) {
    //   const td = document.createElement("td");
    //   td.append("data");
    //   tr.append(td);
    //   table.append(tr);
    // }

    // console.log(table);
    // console.log(__html);

    //엑셀 파일 내보내기
    /* Export to file (start a download) */
    XLSX.writeFile(wb, "기자재리스트.xlsx");
  }

  const ScreenData = (data) => {
    //데이터를 출력할 table을 불러옴
    const table = document.querySelector(".tableValues");
    console.log(table);
    console.log(data);
    //받아온 json data의 길이만큼 반복함
    for (let i = 0; i < data.length; i++) {
      //data에서    value부분만 꺼냄 
      const mapData = Object.values(data[i]);
      const tr = document.createElement("tr");
      //data에서 value만 가져온 mapData
      mapData.map((item) => {
        const td = document.createElement("td");
        //tr안에 td를 삽입
        tr.append(td);
        //td안에 item을 삽입
        td.append(item);
        //최종적으로 출력을 위해 table에 tr를 넣어줌
        return table.append(tr);
        /*
        <tr>
          <td>
            2022661108
          </td>
          <td>
            소프트웨어콘텐츠과
          </td>
        </tr>
         */
      })
    }
  }

  const [modal, setModal] = useState(true);
  const [input, setInput] = useState(null);
  const modalOpen = () => {
    setModal(true);
  }
  return (
    <div className="Container">
      <div>
        <input type="file" onChange={handleFile} />

        <button onClick={ExcelExport}>
          <b>Export XLSX!</b>
        </button>
      </div>
      <div>
        <button onClick={modalOpen}>modal</button>
        {modal && <Modal setModal={setModal} setInput={setInput} />}
        {input && input.map((item) => (
          { item }
        ))}
      </div>
      <table id="table" style={{ display: json ? "" : "none" }}>
        <>
          <thead>
            <tr>
              {/*json데이터에서 헤더 부분만 가져와 맵으로 출력 */}
              {json && Object.keys(json[0]).map((item, index) => {
                return <th key={index}>{item}</th>
              })}
            </tr>
          </thead>
          <tbody className="tableValues">
            {/* json데이터를 ScreenData함수에 넘겨주고 출력 */}
            {json && ScreenData(json)}
          </tbody>
        </>
      </table>
      {/* Show HTML preview */}
      <div style={{ display: "none" }} dangerouslySetInnerHTML={{ __html }} />
    </div >
  );
}

export default App;
