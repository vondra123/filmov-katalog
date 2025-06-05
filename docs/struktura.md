ARCHITEKTURA A SOUBORY

filmov-katalog/
├── api/                # Express routy pro API
│   └── api.js
├── database/           # SQLite databáze a migrace
│   ├── db.js
│   ├── schema.sql
│   └── seed.js
├── public/             # Frontend (index.html, style.css, script.js)
├── server.js           # Vstupní bod backendu
├── package.json
└── README.md

api.js – definice všech backendových endpointů

db.js – připojení k SQLite databázi

schema.sql – SQL pro vytvoření tabulek

seed.js – naplnění žánrů (genres)

index.html – hlavní stránka aplikace

style.css – CSS styl aplikace

script.js – logika pro frontend komunikaci s API