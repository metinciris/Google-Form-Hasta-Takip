# Google-Form-Hasta-Takip
Google Form'dan Google Sheets'e Otomatik Veri Aktarımı (Formül Tabanlı)

Bu sistem, Google Form ile toplanan verileri Google Sheets'e otomatik olarak yansıtır. "Veri" adlı sayfada, hasta protokol numarasına (örneğin MP42/25) göre en güncel veri satırı en güncel hücreler ile görüntülenir.

## Gereksinimler

- Google Form (oluşturulmuş ve "Form Yanıtları" sayfasına bağlı)
- "Form Yanıtları" sayfasında şu sütunlar en az olmalıdır:
  - A: Zaman Damgası (Otomatik)
  - B: E-posta adresi (Güvenlik amaçlı)
  - C: Hasta Protokolü (örnek: MP42/25) ← bu sütun zorunludur!

## 🔐 Protokol Kodu Doğrulama

Google Form'daki "Hasta Protokol Kodu" alanına şu doğrulama uygulanmalıdır:

- **Yanıt doğrulama:** Normal ifade → `^[^\s]+$`
- **Açıklama:** "Boşluk kullanmayın."

## Sayfa Kurulumu

1. Google Sheets içinde yeni bir sayfa oluşturun, adını **Veri** yapın.
2. 1. satıra, "Form Yanıtları" sayfasıyla aynı başlıkları sırasıyla ekleyin.
3. A2:A500 arası satırlara sabit hasta protokol numaralarını (örnek: MP42/25) yazın.

## Script Kullanımı

1. Menüden → "Uzantılar > Apps Script" seçin.
2. Aşağıdaki script'i yapıştırın ve kaydedin.

```javascript
function doldurVeriSayfasi_0_500() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hedefSayfa = ss.getSheetByName("Veri");

  if (!hedefSayfa) {
    SpreadsheetApp.getUi().alert("'Veri' sayfası bulunamadı.");
    return;
  }

  const baslikAraligi = hedefSayfa.getRange(1, 2, 1, 56).getValues()[0]; // B1:BE1 arası başlıklar

  for (let row = 2; row <= 501; row++) {
    const mpRef = `A${row}`;

    baslikAraligi.forEach((_, i) => {
      const col = i + 2;
      const cell = hedefSayfa.getRange(row, col);
      const baslikHucresi = hedefSayfa.getRange(1, col).getA1Notation();

      const formul = `=IF(${mpRef}="";"";IFERROR(INDEX(FILTER(INDEX('Form Yanıtları'!A2:BE; ; MATCH(${baslikHucresi}; 'Form Yanıtları'!A1:BE1; 0)); (TRIM('Form Yanıtları'!C2:C) = TRIM(${mpRef})) * (INDEX('Form Yanıtları'!A2:BE; ; MATCH(${baslikHucresi}; 'Form Yanıtları'!A1:BE1; 0)) <> "")); COUNTA(FILTER(INDEX('Form Yanıtları'!A2:BE; ; MATCH(${baslikHucresi}; 'Form Yanıtları'!A1:BE1; 0)); (TRIM('Form Yanıtları'!C2:C) = TRIM(${mpRef})) * (INDEX('Form Yanıtları'!A2:BE; ; MATCH(${baslikHucresi}; 'Form Yanıtları'!A1:BE1; 0)) <> "")))); ""))`;

      cell.setFormula(formul.replace(/\n/g, "").replace(/\s{2,}/g, " "));
    });

    Utilities.sleep(1000);
  }
}

function doldurVeriSayfasi_501_1000() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hedefSayfa = ss.getSheetByName("Veri");

  if (!hedefSayfa) {
    SpreadsheetApp.getUi().alert("'Veri' sayfası bulunamadı.");
    return;
  }

  const baslikAraligi = hedefSayfa.getRange(1, 2, 1, 56).getValues()[0];

  for (let row = 502; row <= 1000; row++) {
    const mpRef = `A${row}`;

    baslikAraligi.forEach((_, i) => {
      const col = i + 2;
      const cell = hedefSayfa.getRange(row, col);
      const baslikHucresi = hedefSayfa.getRange(1, col).getA1Notation();

      const formul = `=IF(${mpRef}="";"";IFERROR(INDEX(FILTER(INDEX('Form Yanıtları'!A2:BE; ; MATCH(${baslikHucresi}; 'Form Yanıtları'!A1:BE1; 0)); (TRIM('Form Yanıtları'!C2:C) = TRIM(${mpRef})) * (INDEX('Form Yanıtları'!A2:BE; ; MATCH(${baslikHucresi}; 'Form Yanıtları'!A1:BE1; 0)) <> "")); COUNTA(FILTER(INDEX('Form Yanıtları'!A2:BE; ; MATCH(${baslikHucresi}; 'Form Yanıtları'!A1:BE1; 0)); (TRIM('Form Yanıtları'!C2:C) = TRIM(${mpRef})) * (INDEX('Form Yanıtları'!A2:BE; ; MATCH(${baslikHucresi}; 'Form Yanıtları'!A1:BE1; 0)) <> "")))); ""))`;

      cell.setFormula(formul.replace(/\n/g, "").replace(/\s{2,}/g, " "));
    });

    Utilities.sleep(1000);
  }
}
```

## Örnek Görünüm

![screen](screen.png)

---

Bu sistem, Google Form'dan gelen tekrarlayan hasta protokol verilerinde **en güncel yanıtı** getirerek veritabanı işlevi görür. Kodları ve formülü dilediğiniz gibi özelleştirebilirsiniz.

---

Herhangi bir sorunuz olursa katkı yapabilir veya `issue` açabilirsiniz ✨
