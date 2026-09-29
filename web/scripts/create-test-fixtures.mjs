// Kun syntetiske data til manuel afprøvning af import. Skriver ikke til appens lagring.
import { mkdir, writeFile } from 'node:fs/promises';
import { questions, dimensions, types } from '../src/data.js';
import { makeRecord, exportRecords } from '../src/engine.js';

const destination = new URL('../../artifacts/', import.meta.url);
await mkdir(destination, { recursive: true });
const records = types.slice(0, 9).map((type, i) => makeRecord(`Test-elev ${i + 1}`, questions.map(q => {
  const dimensionIndex = dimensions.findIndex(d => d.id === q.dimension);
  return q.direction * (dimensionIndex === 4 || type.code[dimensionIndex] === q.dimension[0] ? 2 : -2);
})));
await writeFile(new URL('test-samling.json', destination), exportRecords(records));
await writeFile(new URL('invalid.json', destination), '{"schema":999,"records":[]}');
console.log('Syntetiske testfiler skrevet til artifacts/.');
