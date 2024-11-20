// MakeXlsx.js
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';

export const makeXlsx = async (filteredData) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("업무용승용차 운행기록부");

    // 1. 기본정보와 상단 제목 설정
    worksheet.mergeCells('G1', 'L4');
    worksheet.getCell('G1').value = '업무용승용차 운행기록부';
    worksheet.getCell('G1').font = {name:'한양견고딕', size: 18, bold: true};
    worksheet.getCell('G1').alignment = {vertical: 'middle', horizontal: 'center'};

    //과세기간
    worksheet.mergeCells('A1', 'B4');
    worksheet.getCell('A1').value = '과  세 기 간';
    worksheet.getCell('A1').font = {name: '돋움',size: 10, bold: false};
    worksheet.getCell('A1').alignment = {vertical: 'middle', horizontal: 'center'};

    //과세기간 - 시작일
    worksheet.mergeCells('C1', 'F1');
    worksheet.getCell('C1').value = '. . .';
    worksheet.getCell('C1').font = {name: '돋움',size: 10, bold: false};
    worksheet.getCell('C1').alignment = {vertical: 'middle', horizontal: 'center'};

    //과세기간 - ~
    worksheet.mergeCells('C2', 'F3');
    worksheet.getCell('C2').value = '~';
    worksheet.getCell('C2').font = {name: '한컴바탕',size: 10, bold: false};
    worksheet.getCell('C2').alignment = {vertical: 'middle', horizontal: 'center'};

    //과세기간 - 종료일
    worksheet.mergeCells('C4', 'F4');
    worksheet.getCell('C4').value = '. . .';
    worksheet.getCell('C4').font = {name: '돋움',size: 10, bold: false};
    worksheet.getCell('C4').alignment = {vertical: 'middle', horizontal: 'center'};

    //상호명
    worksheet.mergeCells('M1', 'N2');
    worksheet.getCell('M1').value = '상 호 명';
    worksheet.getCell('M1').font = {name: '돋움',size: 10, bold: false};
    worksheet.getCell('M1').alignment = {vertical: 'middle', horizontal: 'center'};
    //상호명 - input
    worksheet.mergeCells('O1', 'P2');
    worksheet.getCell('O1').value = '';
    worksheet.getCell('O1').font = {name: '돋움',size: 10, bold: false};
    worksheet.getCell('O1').alignment = {vertical: 'middle', horizontal: 'center'};

    //사업자등록번호
    worksheet.mergeCells('M3', 'N4');
    worksheet.getCell('M3').value = '사업자등록번호';
    worksheet.getCell('M3').font = {name: '돋움',size: 10, bold: false};
    worksheet.getCell('M3').alignment = {vertical: 'middle', horizontal: 'center'};
    //사업자등록번호 - input
    worksheet.mergeCells('O3', 'P4');
    worksheet.getCell('O3').value = '';
    worksheet.getCell('O3').font = {name: '돋움',size: 10, bold: false};
    worksheet.getCell('O3').alignment = {vertical: 'middle', horizontal: 'center'};

    // 1. 기본정보
    worksheet.mergeCells('A8', 'H8');
    worksheet.getCell('A8').value = '1. 기본정보';
    worksheet.getCell('A8').font = {name:'돋움', size: 11, bold: true};
    worksheet.getCell('A8').alignment = {vertical: 'middle', horizontal: 'left'};
    // 기본정보 - 차종
    worksheet.mergeCells('A9', 'D9');
    worksheet.getCell('A9').value = '①차 종';
    worksheet.getCell('A9').font = {name:'돋움', size: 10, bold: false};
    worksheet.getCell('A9').alignment = {vertical: 'middle', horizontal: 'center'};
    // 기본정보 - 차종 input
    worksheet.mergeCells('A10', 'D10');
    worksheet.getCell('A10').value = '';
    worksheet.getCell('A10').font = {name:'돋움', size: 10, bold: false};
    worksheet.getCell('A10').alignment = {vertical: 'middle', horizontal: 'center'};
    // 기본정보 - 자동차등록번호
    worksheet.mergeCells('E9', 'H9');
    worksheet.getCell('E9').value = '②자동차등록번호';
    worksheet.getCell('E9').font = {name:'돋움', size: 10, bold: false};
    worksheet.getCell('E9').alignment = {vertical: 'middle', horizontal: 'center'};
    // 기본정보 - 자동차등록번호 - input
    worksheet.mergeCells('E10', 'H10');
    worksheet.getCell('E10').value = '';
    worksheet.getCell('E10').font = {name:'돋움', size: 10, bold: false};
    worksheet.getCell('E10').alignment = {vertical: 'middle', horizontal: 'center'};

    // 2. 업무용 사용비율 계산
    worksheet.mergeCells('A12', 'H12');
    worksheet.getCell('A12').value = '2. 업무용 사용비율 계산';
    worksheet.getCell('A12').font = {name:'돋움', size: 11, bold: true};
    worksheet.getCell('A12').alignment = {vertical: 'middle', horizontal: 'left'};

    // 사용일자
    worksheet.mergeCells('A13', 'A15');
    worksheet.getCell('A13').value = '③사용 일자 (요일)';
    worksheet.getCell('A13').font = {name:'돋움', size: 10, bold: false};
    worksheet.getCell('A13').alignment = {vertical: 'middle', horizontal: 'center'};

    // 사용자
    worksheet.mergeCells('B13', 'E13');
    worksheet.getCell('B13').value = '④사용자';
    worksheet.getCell('B13').font = {name:'돋움', size: 10, bold: false};
    worksheet.getCell('B13').alignment = {vertical: 'middle', horizontal: 'center'};

    // 사용자 - 부서
    worksheet.mergeCells('B14', 'C15');
    worksheet.getCell('B14').value = '부서';
    worksheet.getCell('B14').font = {name:'돋움', size: 10, bold: false};
    worksheet.getCell('B14').alignment = {vertical: 'middle', horizontal: 'center'};

    // 사용자 - 성명
    worksheet.mergeCells('D14', 'E15');
    worksheet.getCell('D14').value = '성명';
    worksheet.getCell('D14').font = {name:'돋움', size: 10, bold: false};
    worksheet.getCell('D14').alignment = {vertical: 'middle', horizontal: 'center'};

    // 운행내역
    worksheet.mergeCells('F13', 'P13');
    worksheet.getCell('F13').value = '운행내역';
    worksheet.getCell('F13').font = {name:'돋움', size: 10, bold: false};
    worksheet.getCell('F13').alignment = {vertical: 'middle', horizontal: 'center'};

    // 운행내역 - 주행전
    worksheet.mergeCells('F14', 'G15');
    worksheet.getCell('F14').value = '⑤주행 전\n' + '계기판의 거리(㎞)';
    worksheet.getCell('F14').font = {name:'돋움', size: 10, bold: false};
    worksheet.getCell('F14').alignment = {vertical: 'middle', horizontal: 'center'};

    // 운행내역 - 주행 후
    worksheet.mergeCells('H14', 'I15');
    worksheet.getCell('H14').value = '⑥주행 후\n' + '계기판의 거리(㎞)';
    worksheet.getCell('H14').font = {name:'돋움', size: 10, bold: false};
    worksheet.getCell('H14').alignment = {vertical: 'middle', horizontal: 'center'};

    // 운행내역 - 주행 거리
    worksheet.mergeCells('J14', 'J15');
    worksheet.getCell('J14').value = '⑦주행거리(㎞)';
    worksheet.getCell('J14').font = {name:'돋움', size: 10, bold: false};
    worksheet.getCell('J14').alignment = {vertical: 'middle', horizontal: 'center'};

    // 운행내역 - 업무용 사용거리
    worksheet.mergeCells('K14', 'O14');
    worksheet.getCell('K14').value = '업무용 사용거리(㎞)';
    worksheet.getCell('K14').font = {name:'돋움', size: 10, bold: false};
    worksheet.getCell('K14').alignment = {vertical: 'middle', horizontal: 'center'};

    // 운행내역 - 업무용 사용거리 - 출퇴근
    worksheet.mergeCells('K15', 'M15');
    worksheet.getCell('K15').value = '⑧출․퇴근용(㎞)';
    worksheet.getCell('K15').font = {name:'돋움', size: 10, bold: false};
    worksheet.getCell('K15').alignment = {vertical: 'middle', horizontal: 'center'};

    // 운행내역 - 업무용 사용거리 - 일반 업무
    worksheet.mergeCells('N15', 'O15');
    worksheet.getCell('N15').value = '⑨일반 업무용(㎞)';
    worksheet.getCell('N15').font = {name:'돋움', size: 10, bold: false};
    worksheet.getCell('N15').alignment = {vertical: 'middle', horizontal: 'center'};

    // 운행내역 - 비고
    worksheet.mergeCells('P14', 'P15');
    worksheet.getCell('P14').value = '⑩비 고';
    worksheet.getCell('P14').font = {name:'돋움', size: 10, bold: false};
    worksheet.getCell('P14').alignment = {vertical: 'middle', horizontal: 'center'};

    // 3. 데이터를 표에 맞춰 삽입 - A16 셀부터 동적 추가
    const dataStartRow = 16;
    filteredData.forEach((car, index) => {
        console.log(index);
        const row = dataStartRow + index;
        //console.log(row)
        worksheet.mergeCells(`B${row}`, `C${row}`);
        worksheet.mergeCells(`D${row}`, `E${row}`);
        worksheet.mergeCells(`F${row}`, `G${row}`);
        worksheet.mergeCells(`H${row}`, `I${row}`);
        worksheet.mergeCells(`K${row}`, `M${row}`);
        worksheet.mergeCells(`N${row}`, `O${row}`);

        // row.getCell('A').value = car.date;           // 사용 일자
        // row.getCell('B').value = car.department;     // 부서
        // row.getCell('D').value = car.name;           // 성명
        // row.getCell('F').value = car.distanceBefore; // 주행 전 계기판 거리
        // row.getCell('H').value = car.distanceAfter;  // 주행 후 계기판 거리
        // row.getCell('J').value = car.distanceTraveled; // 주행 거리
        // row.getCell('K').value = car.commuteDistance; // 출퇴근용
        // row.getCell('N').value = car.businessDistance; // 일반 업무용
        // row.getCell('P').value = car.note;             // 비고
    });

    // 데이터 양에 따라 밀려야 할 고정 영역의 시작 줄 위치
    const fixedStartRow = dataStartRow + filteredData.length + 2;  // 데이터 줄 이후 일정 간격 유지

    // 4. 밀려난 위치로 고정 정보 설정
    worksheet.mergeCells(`A${fixedStartRow}`, `E${fixedStartRow + 1}`);
    worksheet.getCell(`A${fixedStartRow}`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "808080" }
    };

    worksheet.mergeCells(`F${fixedStartRow}`, `J${fixedStartRow}`);
    worksheet.getCell(`F${fixedStartRow}`).value = '⑪과세기간 총주행 거리(㎞)';
    worksheet.getCell(`F${fixedStartRow}`).font = { name: '돋움', size: 10, bold: false };
    worksheet.getCell(`F${fixedStartRow}`).alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells(`F${fixedStartRow + 1}`, `J${fixedStartRow + 1}`);
    worksheet.getCell(`F${fixedStartRow + 1}`).value = '';
    worksheet.getCell(`F${fixedStartRow + 1}`).font = { name: '돋움', size: 10, bold: false };
    worksheet.getCell(`F${fixedStartRow + 1}`).alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells(`K${fixedStartRow}`, `O${fixedStartRow}`);
    worksheet.getCell(`K${fixedStartRow}`).value = '⑫과세기간 업무용 사용거리(㎞)';
    worksheet.getCell(`K${fixedStartRow}`).font = { name: '돋움', size: 10, bold: false };
    worksheet.getCell(`K${fixedStartRow}`).alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells(`K${fixedStartRow + 1}`, `O${fixedStartRow + 1}`);
    worksheet.getCell(`K${fixedStartRow + 1}`).value = '';
    worksheet.getCell(`K${fixedStartRow + 1}`).font = { name: '돋움', size: 10, bold: false };
    worksheet.getCell(`K${fixedStartRow + 1}`).alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell(`P${fixedStartRow}`).value = '⑬업무사용비율(⑫/⑪)';
    worksheet.getCell(`P${fixedStartRow}`).font = { name: '돋움', size: 10, bold: false };
    worksheet.getCell(`P${fixedStartRow}`).alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell(`P${fixedStartRow + 1}`).value = '';
    worksheet.getCell(`P${fixedStartRow + 1}`).font = { name: '돋움', size: 10, bold: false };
    worksheet.getCell(`P${fixedStartRow + 1}`).alignment = { vertical: 'middle', horizontal: 'center' };

    // 5. 다운로드
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), '업무용승용차_운행기록부.xlsx');
};
