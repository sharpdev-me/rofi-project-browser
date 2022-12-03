#!/usr/bin/env node
import * as process from "process";
import * as child from "child_process";
import { Info, printEntries, setPromptText } from "./prompt";
import { createProjectDir, getProjectPath, getProjects, getScriptPath, getTemplates, TEMPLATES_DIR } from "./projects";

export const TERMINAL = "alacritty";

export const ROFI_INFO: Info = JSON.parse(process.env.ROFI_INFO ?? "{\"step\":\"list\"}");

const target = process.argv[2];

if(ROFI_INFO.step == "list") {
    if(target !== undefined) {
        setPromptText("Choose template");
        printEntries(getTemplates(target));
    }
    setPromptText("Choose project");
    printEntries(getProjects());
}

if(ROFI_INFO.step == "open") {
    const openWith = ROFI_INFO.extra.openWith;
    if(openWith == "terminal") {
        doSpawn(TERMINAL, "--working-directory", ROFI_INFO.extra.path);
    } else if(openWith == "code") {
        doSpawn("code", ROFI_INFO.extra.path);
    } else if(openWith == "idea") {
        doSpawn("intellij-idea", ROFI_INFO.extra.path);
    } else {
        doSpawn(openWith.split(" ")[0], openWith.replace("{PATH}", ROFI_INFO.extra.path));
    }
}

if(ROFI_INFO.step == "create") {
    createProjectDir(ROFI_INFO.extra.projectName, ROFI_INFO.extra.template);

    doTemplate();
}

function doSpawn(command: string, ...args: string[]) {
    child.spawn(command, args, {detached:true}).unref();

    process.exit(0);
}

function doTemplate() {
    child.spawn(TERMINAL, ["-e", getScriptPath(ROFI_INFO.extra.template), getProjectPath(ROFI_INFO.extra.projectName)], {
        detached: false,
        cwd: TEMPLATES_DIR
    }).unref();

    process.exit(0);
}