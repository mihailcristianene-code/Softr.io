# Ghid Final: Integrarea Dashboard-ului în Softr cu un Proxy Netlify

Urmează acești pași cu atenție pentru a publica dashboard-ul într-un mod 100% sigur. Procesul este împărțit în două părți mari: configurarea intermediarului (proxy) pe Netlify și apoi configurarea finală în Softr.

---

### **Partea 1: Crearea și Publicarea Intermediarului (Proxy) pe Netlify**

În această parte, vom publica funcția de backend care va vorbi în siguranță cu Airtable în locul tău.

**Pasul 1: Pregătește Fișierele pe Calculatorul Tău**

1.  Pe calculatorul tău, creează un folder nou și numește-l `softr-proxy`.
2.  Descarcă cele 3 fișiere pe care ți le-am pregătit: `netlify.toml`, `airtable-proxy.js`, și `dashboard.html`.
3.  Pune `netlify.toml` și `dashboard.html` direct în interiorul folderului `softr-proxy`.
4.  În folderul `softr-proxy`, creează un alt folder și numește-l `netlify`.
5.  În interiorul folderului `netlify`, creează încă un folder și numește-l `functions`.
6.  Mută fișierul `airtable-proxy.js` în interiorul folderului `softr-proxy/netlify/functions/`.

La final, structura folderului tău trebuie să arate **exact** așa:
```
softr-proxy/
├── dashboard.html
├── netlify.toml
└── netlify/
    └── functions/
        └── airtable-proxy.js
```

**Pasul 2: Publică pe Netlify**

1.  Mergi la [app.netlify.com](https://app.netlify.com/) și creează-ți un cont gratuit (poți folosi contul tău de Google, GitHub, etc.).
2.  În panoul principal (dashboard), mergi la secțiunea **"Sites"**.
3.  **Trage folderul `softr-proxy`** (pe care l-ai creat la pasul 1) direct în fereastra browser-ului, în zona punctată unde scrie "Drag and drop your site folder here".
4.  Netlify va încărca și va publica automat site-ul în câteva secunde.

**Pasul 3: Adaugă Cheia Secretă de la Airtable (în mod sigur)**

1.  După ce site-ul este publicat, Netlify te va duce la panoul de control al noului tău site. Dă click pe **"Site configuration"**.
2.  În meniul din stânga, navighează la `Build & deploy` -> `Environment` -> `Environment variables`.
3.  Apasă butonul **"Edit variables"**.
4.  Adaugă, pe rând, **3 variabile noi**:
    *   **Cheie (Key):** `AIRTABLE_API_KEY` | **Valoare (Value):** Cheia ta secretă de la Airtable (cea care începe cu `pat...`).
    *   **Cheie (Key):** `AIRTABLE_BASE_ID` | **Valoare (Value):** `appGo9JaWcqrc14tE`
    *   **Cheie (Key):** `AIRTABLE_TABLE_NAME` | **Valoare (Value):** `tblxaBuRNFr0btTLW`
5.  Apasă **"Save"**. Acum, cheia ta este stocată în siguranță pe server, nu în cod.

**Pasul 4: Obține Link-ul Public al Intermediarului**

1.  În panoul de control al site-ului tău de pe Netlify, mergi la secțiunea **"Functions"** din meniul de sus.
2.  Vei vedea funcția ta listată, cu numele `airtable-proxy`.
3.  Dă click pe ea. Se va deschide și vei vedea un **"Endpoint"**. Acesta este link-ul tău public. **Copiază acest link!** Va arăta ceva de genul: `https://numele-tau-de-site.netlify.app/.netlify/functions/airtable-proxy`.

---

### **Partea 2: Configurarea Finală în Softr.io**

Acum că intermediarul este gata, trebuie doar să-i spui dashboard-ului tău unde să-l găsească.

**Pasul 5: Adaugă și Configurează Codul în Softr**

1.  Mergi înapoi la editorul tău Softr.
2.  Pe pagina dorită, adaugă un bloc nou de tip **"Custom Code"**.
3.  Deschide editorul de cod pentru acest bloc.
4.  Deschide pe calculatorul tău fișierul `dashboard.html` pe care l-ai descărcat mai devreme. **Copiază tot conținutul acestui fișier.**
5.  **Lipește tot codul** în blocul de "Custom Code" din Softr.
6.  În codul pe care tocmai l-ai lipit, găsește linia de la începutul secțiunii `<script type="text/babel">`:
    ```javascript
    const PROXY_URL = 'YOUR_NETLIFY_FUNCTION_URL_HERE';
    ```
7.  Înlocuiește textul `'YOUR_NETLIFY_FUNCTION_URL_HERE'` cu **link-ul (Endpoint-ul) pe care l-ai copiat** de la Netlify la Pasul 4. Linia finală ar trebui să arate similar cu:
    ```javascript
    const PROXY_URL = 'https://numele-tau-de-site.netlify.app/.netlify/functions/airtable-proxy';
    ```

**Pasul 6: Publică!**

Apasă **"Publish"** pe site-ul tău Softr. Gata! Dashboard-ul ar trebui acum să se încarce și să afișeze datele, folosind o metodă sigură și robustă.