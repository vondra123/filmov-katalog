Kroky ke spuštění 

# Klonování repozitáře
git clone https://github.com/uzivatel/filmov-katalog.git
cd filmov-katalog

# Instalace závislostí
npm install

# Vytvoření databáze
npm run migrate
npm run seed

# Spuštění aplikace
npm start

Aplikace bude dostupná na adrese: http://localhost:3000