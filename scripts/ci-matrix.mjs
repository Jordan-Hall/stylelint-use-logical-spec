// Prints the CI test matrix as GitHub Actions outputs:
//   node      every Node.js major that is released and not end-of-life today
//   stylelint the lowest version allowed by peerDependencies, plus the newest of each allowed major
import { readFile } from 'node:fs/promises';

const getJson = async url => {
	const response = await fetch(url);
	if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
	return response.json();
};

const today = new Date().toISOString().slice(0, 10);
const schedule = await getJson('https://raw.githubusercontent.com/nodejs/Release/main/schedule.json');
const node = Object.entries(schedule)
	.filter(([, { start, end }]) => start <= today && today < end)
	.map(([version]) => Number(version.slice(1)));

/** Parses a peer range made only of caret ranges, e.g. `^16.7.0 || ^17.0.0`. */
const parseCaretRange = range => range.split('||').map(part => {
	const match = /^\s*\^(\d+)\.(\d+)\.(\d+)\s*$/.exec(part);
	if (!match) throw new Error(`Unsupported peer range "${part.trim()}"; use ^x.y.z ranges joined by ||`);
	return match.slice(1).map(Number);
});

const toParts = version => version.split('.').map(Number);
const compare = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
const satisfies = (version, ranges) => {
	const parts = toParts(version);
	return ranges.some(min => parts[0] === min[0] && compare(parts, min) >= 0);
};

const { peerDependencies } = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const ranges = parseCaretRange(peerDependencies.stylelint);
const { versions } = await getJson('https://registry.npmjs.org/stylelint');
const allowed = Object.keys(versions)
	.filter(version => /^\d+\.\d+\.\d+$/.test(version) && satisfies(version, ranges))
	.sort((a, b) => compare(toParts(a), toParts(b)));

if (allowed.length === 0) throw new Error(`No stylelint release satisfies ${peerDependencies.stylelint}`);

const newestByMajor = new Map(allowed.map(version => [version.split('.')[0], version]));
const stylelint = [...new Set([allowed[0], ...newestByMajor.values()])];

console.log(`node=${JSON.stringify(node)}`);
console.log(`stylelint=${JSON.stringify(stylelint)}`);
