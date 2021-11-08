import { format, parseISO, subDays } from "date-fns";

export const Config = {
	'dexname': 'spookyswap',
	'chain_id': '250',
	'chain_name': 'Fantom',
	'chain_explorer': 'https://ftmscan.com/',
	'key': process.env.REACT_APP_CKEY
}


export const dayFormatter = (str) => {
	const date = parseISO(str);
	if (date.getDate() % 7 === 0) {
		return format(date, "dd");
	};
	return "";
}

export const numFormatter = (num, digits=2) => {
	if (num <= 1) {
		return num.toString()
	}
	const suffixes = ['', 'k', 'm', 'B', 'T'];
	const tier = Math.floor(Math.log10(num) / 3);
	const suffix = suffixes[tier];
	const scaled = Math.pow(10, tier*3);
	return (num/scaled).toFixed(digits) + suffix;
}
