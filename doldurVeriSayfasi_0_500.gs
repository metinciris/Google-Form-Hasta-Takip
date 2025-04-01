// doldurVeriSayfasi_0_500.gs
function doldurVeriSayfasi_0_500() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hedefSayfa = ss.getSheetByName("Veri");
  if (!hedefSayfa) {
    SpreadsheetApp.getUi().alert("'Veri' adında bir sayfa bulunamadı.");
    return;
  }

  // Başlıkları al
  const baslikAraligi = hedefSayfa.getRange(1, 2, 1, 56).getValues()[0]; // B1:BE1

  // A2:A500 - sabit protokol numaralarını çek
  hedefSayfa.getRange("A2").setFormula("=UNIQUE(FILTER(FormYanıtları!C2:C; FormYanıtları!C2:C<>\"\"))");

  for (let row = 2; row <= 500; row++) {
    const mpRef = `A${row}`;
    baslikAraligi.forEach((_, i) => {
      const col = i + 2;
      const cell = hedefSayfa.getRange(row, col);
      const baslikHucresi = hedefSayfa.getRange(1, col).getA1Notation();

      const formul = `=IF(${mpRef}="";"";IFERROR(INDEX(FILTER(INDEX(FormYanıtları!A2:BE;;MATCH(${baslikHucresi};FormYanıtları!A1:BE1;0));(TRIM(FormYanıtları!C2:C)=TRIM(${mpRef}))*(INDEX(FormYanıtları!A2:BE;;MATCH(${baslikHucresi};FormYanıtları!A1:BE1;0))<>""));COUNTA(FILTER(INDEX(FormYanıtları!A2:BE;;MATCH(${baslikHucresi};FormYanıtları!A1:BE1;0));(TRIM(FormYanıtları!C2:C)=TRIM(${mpRef}))*(INDEX(FormYanıtları!A2:BE;;MATCH(${baslikHucresi};FormYanıtları!A1:BE1;0))<>"")));""))`;

      cell.setFormula(formul.replace(/\n/g, "").replace(/\s{2,}/g, " "));
    });
    Utilities.sleep(1000);
  }
}
