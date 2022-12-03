import { ROFI_INFO } from ".";

const SEPARATOR = String.fromCharCode(0x1F);

export type Entry = {
    text: string;
    meta?: string[];
    nonselectable?: boolean;
    info?: Info;
} | null;
export type Info = {
    step: Step;
    extra?: any;
}
type Step = "list" | "open" | "create";

export function setPromptText(promptTitle: string) {
    process.stdout.write(`\0prompt\x1f${promptTitle}\n`);
}

export function printEntries(entries: Entry[]) {
    process.stdout.write(entries.map(printEntry).join("\n"));

    process.exit(0);
}

function printEntry(entry: Entry) {
    if(entry == null) return "";
    let value = entry.text + '\0';

    if(entry.info !== undefined) {
        value += `info${SEPARATOR}${JSON.stringify(entry.info)}${SEPARATOR}`;
    }
    if(entry.nonselectable !== undefined) {
        value += `nonselectable${SEPARATOR}${entry.nonselectable}${SEPARATOR}`;
    }
    if(entry.meta !== undefined) {
        value += `meta${SEPARATOR}${entry.meta.join(",")}${SEPARATOR}`;
    }

    return value;
}