function doldurVeriSayfasi_501_1000() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hedefSayfa = ss.getSheetByName("Veri");

  if (!hedefSayfa) {
    SpreadsheetApp.getUi().alert("'Veri' adlı sayfa bulunamadı.");
    return;
  }

  const baslikAraligi = hedefSayfa.getRange(1, 2, 1, 56).getValues()[0]; // B1:BE1 arası başlıklar

  for (let row = 501; row <= 1000; row++) {
    const mpRef = `A${row}`;

    baslikAraligi.forEach((_, i) => {
      const col = i + 2; // B sütunundan başla
      const cell = hedefSayfa.getRange(row, col);
      const baslikHucresi = hedefSayfa.getRange(1, col).getA1Notation();

      const formul = `=IF(${mpRef}="";"";IFERROR(
        INDEX(
          FILTER(
            INDEX('FormYanıtları'!A2:BE; ; MATCH(${baslikHucresi}; 'FormYanıtları'!A1:BE1; 0));
            (TRIM('FormYanıtları'!C2:C) = TRIM(${mpRef})) *
            (INDEX('FormYanıtları'!A2:BE; ; MATCH(${baslikHucresi}; 'FormYanıtları'!A1:BE1; 0)) <> "")
          );
          COUNTA(
            FILTER(
              INDEX('FormYanıtları'!A2:BE; ; MATCH(${baslikHucresi}; 'FormYanıtları'!A1:BE1; 0));
              (TRIM('FormYanıtları'!C2:C) = TRIM(${mpRef})) *
              (INDEX('FormYanıtları'!A2:BE; ; MATCH(${baslikHucresi}; 'FormYanıtları'!A1:BE1; 0)) <> "")
            )
          )
        );
      ""))`;

      cell.setFormula(formul.replace(/\n/g, "").replace(/\s{2,}/g, " "));
    });

    Utilities.sleep(1000); // Her satırdan sonra 1 saniye bekle
  }
}
