# 📁 Google Form ile Otomatik Veri Eşleştirme (Veritabanı Görünümlü)

## 🌐 Amaç
Bu proje, Google Forms aracılığıyla toplanan hasta bilgilerinin, hasta protokol numarası ("MP42/25" gibi) ile eşleşitirilerek Google Sheets üzerinde dinamik bir "veri tabanı" oluşturulmasını sağlar. Kodlar Apps Script ile yazılmıştır.
google form oluşturun, tabloya bağlayın (form ayarında), Tabloda "Veri" adında sayfa oluşturun, tablo --> uzantılar --> apps komut dosyasına geçin --> kod.gs içine scripti kaydedin, çalıştırın, gerekli izin isteyince verin. Veri tablosunda gerekli formüller oluşacak. Sizin formül oluşturmanıza gerek kalmayacak. 500 satır 500 benzersiz hasta için yeterli. Her şey tamam ise form üzerinden göndermeye başlayın. Formunuzu 50 soruya kadar sorunsuz uzatabilirsiniz. Hasta girdikçe tablonuza işlenecek. Benzersiz hasta girince yeni satır oluşacak. Eski hasta girerseniz eskisine güncel haliyle işlenit. 
---

## 🔧 Kurulum Aşamaları

### ✏️ 1. Google Form Oluşturun

Formunuzda mutlaka bulunması gereken ilk 3 alan:

| Sıra | Alan                        |        | Ayarlar |
|------|-----------------------------|-----------|---------|
| 1    | Zaman Damgası             | Otomatik  | -       |
| 2    | E-posta Adresi              | Otomatik  | Ayarlardan etkinleştirin |
| 3    | Hasta Protokol Numarası   | Kısa Yanıt | Zorunlu, şu ifade ile: `^[^\s]+$` (Boşluk karakteri içeremez)

+ Diğer alanlar (mutasyonlar, klinik bilgiler, yorum vs.) ihtiyaca göre eklenebilir.

---

### 📄 2. Google Sheet İçeriği

Form oluştuktan sonra otomatik olarak **FormYanıtları** sayfası oluşur. Ayrıca aynı dosyada yeni bir sayfa oluşturun:  
**Sayfa adı: `Veri`**

Bu sayfaya hasta protokol numarasına göre en güncel bilgileri otomatik getireceğiz.

---

### 👨‍💻 3. Apps Script Ekleme

1. Google Sheet üzerinden `Uzantılar > Apps Script` menüsüne gidin.
2. `Kod.gs` dosyasının içeriğini aşağıya yapıştırın:

---

### ✉️ Kod (501–1000 Arası Satırlar)

```javascript
function doldurVeriSayfasi_501_1000() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hedefSayfa = ss.getSheetByName("Veri");

  if (!hedefSayfa) {
    SpreadsheetApp.getUi().alert("Veri sayfası bulunamadı.");
    return;
  }

  const baslikAraligi = hedefSayfa.getRange(1, 2, 1, 56).getValues()[0];

  for (let row = 501; row <= 1000; row++) {
    const mpRef = `A${row}`;

    baslikAraligi.forEach((_, i) => {
      const col = i + 2;
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

    Utilities.sleep(1000);
  }
}
```

> ✅ Not: Aynı mantıkla 0–500 satır arası için fonksiyon `doldurVeriSayfasi_1_500()` olarak adlandırılabilir.

---

## 🔹 Örnek Görsel

![Google Form ekran görüntüsü](screen.png)

---

## 📄 Özet
- Tek form, tek yanıt sayfası.
- C sütunu sabit protokol numarası.
- "Veri" sayfası otomatik doldurulur.
- En güncel veri getirilir.
- Aynı MP kodu birden fazla kez girilirse sonuncusu kullanılır.
- Kod, 500'er satırlık bloklar halinde çalışır.

---

## 🎉 Katkı
Bu proje açıktır ve her türlü katkıya açıktır.

> ✨ Klinik veri toplamı, NGS rapor işlemleri, mutasyon izleme için idealdir.

---

Siz de katkı vermek isterseniz PR açabilir veya önerilerinizi paylaşabilirsiniz.

