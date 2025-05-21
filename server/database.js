import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(path.resolve(), './server/data.json');

export function readData() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            fs.writeFileSync(DATA_FILE, JSON.stringify({}));
        }
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading data:', err);
        return [];
    }
}

export function writeData(collection, data) {
    try {

        const currentData = readData();
        const collectionData = currentData[collection] || [];

        collectionData.push(data);
        currentData[collection] = collectionData;

        fs.writeFileSync(DATA_FILE, JSON.stringify(currentData, null, 2));
        return true;
    } catch (err) {
        console.error('Error writing data:', err);
        return false;
    }
}

export function updateData(collection, key, identifier, data) {
    try {

        const currentData = readData();
        const collectionData = currentData[collection] || [];

        const index = collectionData.findIndex(item => item[key] === identifier);

        if (index !== -1) {
            collectionData[index] = { ...collectionData[index], ...data };
        }

        currentData[collection] = collectionData;
        fs.writeFileSync(DATA_FILE, JSON.stringify(currentData, null, 2));
        return true;
    } catch (err) {
        console.error('Error writing data:', err);
        return false;
    }
}